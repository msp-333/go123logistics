'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type Props = { slug: string };

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  duration: string | null;
  passing_score: number | null;
  video_url: string | null; // can be null if you store only lesson video_path
  sort_order: number | null;
  is_active: boolean;
};

type LessonRow = {
  id: string;
  module_id: string | null;
  module_slug: string;
  title: string;
  sort_order: number;
  video_path: string | null;
  content: string | null;
  is_active: boolean;
};

type ChoiceRow = {
  id: string;
  choice_text: string;
  is_correct: boolean;
  sort_order: number;
};

type QuestionRow = {
  id: string;
  question: string;
  sort_order: number;
  training_question_choices: ChoiceRow[];
};

type ProgressRow = {
  lesson_id: string;
  passed: boolean;
  score: number;
};

const BUCKET = 'training-videos';

export default function TrainingModuleClient({ slug }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [moduleRow, setModuleRow] = useState<ModuleRow | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [retakeMode, setRetakeMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  // Load module + lessons + progress
  useEffect(() => {
    const run = async () => {
      if (!user) return;

      setLoading(true);
      setErr(null);

      const { data: mod, error: modErr } = await supabase
        .from('training_modules')
        .select('id,slug,title,description,level,duration,passing_score,video_url,sort_order,is_active')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (modErr || !mod) {
        setErr(modErr?.message || 'Module not found / inactive.');
        setLoading(false);
        return;
      }
      setModuleRow(mod);

      const { data: les, error: lesErr } = await supabase
        .from('training_lessons')
        .select('id,module_id,module_slug,title,sort_order,video_path,content,is_active')
        .eq('module_slug', slug)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (lesErr) {
        setErr(lesErr.message);
        setLoading(false);
        return;
      }

      const lessonList = (les || []) as LessonRow[];
      setLessons(lessonList);
      setSelectedLessonId((prev) => prev || lessonList[0]?.id || null);

      // progress for these lessons (THIS USER ONLY)
      if (lessonList.length) {
        const { data: prog, error: progErr } = await supabase
          .from('training_lesson_progress')
          .select('lesson_id, passed, score')
          .eq('user_id', user.id)
          .in('lesson_id', lessonList.map((l) => l.id));

        if (!progErr && prog) {
          const map: Record<string, ProgressRow> = {};
          for (const p of prog as any[]) map[p.lesson_id] = p;
          setProgress(map);
        }
      }

      setLoading(false);
    };

    void run();
  }, [user, slug]);

  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId]
  );

  const passingScore = moduleRow?.passing_score ?? 80;

  // lesson locks: lesson 1 unlocked; others unlocked if previous lesson PASSED
  const unlockedLessonIds = useMemo(() => {
    const unlocked = new Set<string>();
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      if (i === 0) {
        unlocked.add(lesson.id);
        continue;
      }
      const prev = lessons[i - 1];
      if (progress[prev.id]?.passed) unlocked.add(lesson.id);
    }
    return unlocked;
  }, [lessons, progress]);

  const isSelectedLocked = useMemo(() => {
    if (!selectedLesson) return false;
    return !unlockedLessonIds.has(selectedLesson.id);
  }, [selectedLesson, unlockedLessonIds]);

  const selectedProgress = selectedLesson ? progress[selectedLesson.id] : undefined;
  const alreadyPassed = !!selectedProgress?.passed;

  const moduleAllLessonsPassed = useMemo(() => {
    if (!lessons.length) return false;
    return lessons.every((l) => progress[l.id]?.passed);
  }, [lessons, progress]);

  // Load signed video + questions when lesson changes
  useEffect(() => {
    const run = async () => {
      setVideoSrc(null);
      setQuestions([]);
      setAnswers({});
      setResult(null);
      setRetakeMode(false);
      setErr(null);

      if (!user || !selectedLesson || isSelectedLocked) return;

      // VIDEO: prefer lesson.video_path; fallback to module.video_url (could be a storage key or an https url)
      const keyOrUrl = selectedLesson.video_path || moduleRow?.video_url || null;
      if (keyOrUrl) {
        if (/^https?:\/\//i.test(keyOrUrl)) {
          setVideoSrc(keyOrUrl);
        } else {
          const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(keyOrUrl, 60 * 60 * 24 * 7);
          if (!error && data?.signedUrl) setVideoSrc(data.signedUrl);
        }
      }

      // QUESTIONS + CHOICES (relationship works in your schema now)
      const { data: qs, error: qErr } = await supabase
        .from('training_questions')
        .select('id, question, sort_order, training_question_choices(id, choice_text, is_correct, sort_order)')
        .eq('lesson_id', selectedLesson.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (qErr) {
        setErr(`Questions error: ${qErr.message}`);
        return;
      }

      const normalized = (qs || []).map((q: any) => ({
        ...q,
        training_question_choices: [...(q.training_question_choices || [])].sort(
          (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        ),
      }));

      setQuestions(normalized as QuestionRow[]);
    };

    void run();
  }, [user, selectedLessonId, isSelectedLocked, moduleRow?.video_url]);

  const onPickLesson = (lesson: LessonRow) => {
    if (!unlockedLessonIds.has(lesson.id)) return;
    setSelectedLessonId(lesson.id);
  };

  const statusLabel = useMemo(() => {
    if (!selectedLesson) return '';
    const p = progress[selectedLesson.id];
    if (!p) return 'Not attempted yet';
    if (p.passed) return `Passed • ${p.score}%`;
    return `Needs retry • ${p.score}%`;
  }, [progress, selectedLesson]);

  const submitTest = async () => {
    if (!user || !selectedLesson) return;

    setSaving(true);
    setErr(null);

    const total = questions.length;
    if (!total) {
      setSaving(false);
      return;
    }

    let correct = 0;
    for (const q of questions) {
      const pickedChoiceId = answers[q.id];
      const correctChoice = q.training_question_choices.find((c) => c.is_correct);
      if (pickedChoiceId && correctChoice && pickedChoiceId === correctChoice.id) correct++;
    }

    const score = Math.round((correct / total) * 100);
    const passed = score >= passingScore;
    setResult({ score, passed });

    // Save progress (upsert). IMPORTANT: completed_at is NOT NULL in your DB, so always set it.
    const { error: upErr } = await supabase
      .from('training_lesson_progress')
      .upsert(
        {
          user_id: user.id,
          lesson_id: selectedLesson.id,
          passed,
          score,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      );

    if (upErr) {
      setErr(upErr.message);
      setSaving(false);
      return;
    }

    // Update local state so UI changes immediately
    setProgress((prev) => ({
      ...prev,
      [selectedLesson.id]: { lesson_id: selectedLesson.id, passed, score },
    }));

    // If this completes the whole module, write an attempt row so the DASHBOARD reflects it
    // (Dashboard reads training_attempts)
    const nextProgress = {
      ...progress,
      [selectedLesson.id]: { lesson_id: selectedLesson.id, passed, score },
    };

    const allPassedNow = lessons.length > 0 && lessons.every((l) => nextProgress[l.id]?.passed);
    if (allPassedNow && moduleRow) {
      const scores = lessons
        .map((l) => nextProgress[l.id]?.score)
        .filter((v): v is number => typeof v === 'number');

      const moduleScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : score;

      const { error: attErr } = await supabase.from('training_attempts').insert({
        user_id: user.id,
        module_id: moduleRow.id,
        module_slug: moduleRow.slug,
        score: moduleScore,
        passed: true,
      });

      if (attErr) {
        // This is usually RLS policy missing on training_attempts insert
        setErr(`Saved lesson, but dashboard attempt insert failed: ${attErr.message}`);
      }
    }

    setSaving(false);
  };

  const nextLesson = useMemo(() => {
    if (!selectedLesson) return null;
    const idx = lessons.findIndex((l) => l.id === selectedLesson.id);
    return idx >= 0 ? lessons[idx + 1] ?? null : null;
  }, [lessons, selectedLesson]);

  if (authLoading || !user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-500">Loading module…</p>
        </div>
      </main>
    );
  }

  if (err && !moduleRow) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-white p-6">
          <p className="text-sm text-red-700">{err}</p>
        </div>
      </main>
    );
  }

  if (!moduleRow || !selectedLesson) return null;

  return (
    <main className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        {err ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {err}
          </div>
        ) : null}

        {/* Header (less blocky) */}
        <header className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">Training Module</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{moduleRow.title}</h1>
              {moduleRow.description ? (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{moduleRow.description}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <Pill>{moduleRow.level || 'All levels'}</Pill>
                <Pill>{moduleRow.duration || 'Self-paced'}</Pill>
                <Pill>Passing: {passingScore}%</Pill>
              </div>
            </div>

            {moduleAllLessonsPassed ? (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Module completed ✅
              </span>
            ) : null}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Lessons sidebar */}
          <aside className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Lessons</h2>
              <span className="text-xs text-slate-500">{lessons.length}</span>
            </div>

            <div className="mt-3 space-y-2">
              {lessons.map((l) => {
                const unlocked = unlockedLessonIds.has(l.id);
                const p = progress[l.id];
                const active = l.id === selectedLessonId;

                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onPickLesson(l)}
                    disabled={!unlocked}
                    className={clsx(
                      'w-full text-left rounded-2xl border px-3 py-3 transition',
                      active ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200/70 hover:bg-slate-50',
                      !unlocked && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-500">Lesson {l.sort_order}</p>
                        <p className="truncate text-sm font-medium text-slate-900">{l.title}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {p?.passed ? <StatusDot className="bg-emerald-500" /> : p ? <StatusDot className="bg-amber-500" /> : null}
                        {!unlocked ? <span className="text-[11px] text-slate-500">Locked</span> : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main */}
          <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
            {isSelectedLocked ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-700">
                  This lesson is locked. Pass the previous lesson quiz to unlock it.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Lesson {selectedLesson.sort_order}</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{selectedLesson.title}</h2>
                    {selectedLesson.content ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{selectedLesson.content}</p>
                    ) : null}
                  </div>

                  <Pill
                    className={clsx(
                      alreadyPassed
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : selectedProgress
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : 'border-slate-200 bg-white text-slate-700'
                    )}
                  >
                    {statusLabel}
                  </Pill>
                </div>

                {/* Video */}
                <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200/70 bg-black">
                  {videoSrc ? (
                    <video controls playsInline className="w-full" src={videoSrc} />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-slate-900">
                      <p className="text-sm text-slate-200">Video not available yet.</p>
                    </div>
                  )}
                </div>

                {/* Quiz */}
                <div className="mt-7 border-t border-slate-200/60 pt-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Test your understanding</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        You need <b>{passingScore}%</b> to pass.
                      </p>
                    </div>

                    {alreadyPassed && !retakeMode ? (
                      <button
                        type="button"
                        onClick={() => setRetakeMode(true)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Retake quiz
                      </button>
                    ) : null}
                  </div>

                  {alreadyPassed && !retakeMode ? (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm text-emerald-800">
                        You already passed this lesson. You can continue, or retake the quiz to improve your score.
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {nextLesson ? (
                          <button
                            type="button"
                            onClick={() => onPickLesson(nextLesson)}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Continue to next lesson
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => router.push('/training')}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Back to dashboard
                          </button>
                        )}
                      </div>
                    </div>
                  ) : questions.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-500">No questions yet for this lesson.</p>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {questions.map((q) => (
                        <div key={q.id} className="rounded-3xl border border-slate-200/70 bg-white p-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {q.sort_order}. {q.question}
                          </p>

                          <div className="mt-3 space-y-2">
                            {q.training_question_choices.map((c) => {
                              const checked = answers[q.id] === c.id;
                              const showCorrect = result && c.is_correct;
                              const showWrongPick = result && checked && !c.is_correct;

                              return (
                                <label
                                  key={c.id}
                                  className={clsx(
                                    'flex items-start gap-3 rounded-2xl border px-3 py-2 cursor-pointer transition',
                                    result
                                      ? showCorrect
                                        ? 'border-emerald-200 bg-emerald-50'
                                        : showWrongPick
                                          ? 'border-amber-200 bg-amber-50'
                                          : 'border-slate-200/70'
                                      : checked
                                        ? 'border-emerald-200 bg-emerald-50'
                                        : 'border-slate-200/70 hover:bg-slate-50'
                                  )}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    className="mt-1"
                                    checked={checked}
                                    disabled={!!result}
                                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: c.id }))}
                                  />
                                  <span className="text-sm text-slate-800">{c.choice_text}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {result ? (
                        <div
                          className={clsx(
                            'rounded-3xl border p-4',
                            result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
                          )}
                        >
                          <p className={clsx('text-sm font-semibold', result.passed ? 'text-emerald-800' : 'text-amber-800')}>
                            Score: {result.score}% • {result.passed ? 'Passed ✅' : 'Try again'}
                          </p>

                          {!result.passed ? (
                            <p className="mt-1 text-sm text-amber-800/90">
                              Watch the video again and retake the quiz.
                            </p>
                          ) : nextLesson ? (
                            <button
                              type="button"
                              onClick={() => onPickLesson(nextLesson)}
                              className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Continue to next lesson
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => router.push('/training')}
                              className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Finish module & go to dashboard
                            </button>
                          )}
                        </div>
                      ) : null}

                      <button
                        type="button"
                        disabled={saving || questions.some((q) => !answers[q.id])}
                        onClick={submitTest}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {saving ? 'Saving…' : 'Submit answers'}
                      </button>

                      {alreadyPassed && retakeMode ? (
                        <button
                          type="button"
                          onClick={() => {
                            setRetakeMode(false);
                            setAnswers({});
                            setResult(null);
                          }}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Cancel retake
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium',
        className
      )}
    >
      {children}
    </span>
  );
}

function StatusDot({ className }: { className?: string }) {
  return <span className={clsx('h-2.5 w-2.5 rounded-full', className)} />;
}
