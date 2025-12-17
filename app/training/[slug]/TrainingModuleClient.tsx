'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
  video_url: string | null;
  sort_order: number | null;
};

type LessonRow = {
  id: string;
  module_id: string;
  module_slug: string;
  title: string;
  sort_order: number;
  video_path: string | null;
  content: string | null;
  is_active: boolean;
};

type ChoiceRow = {
  id: string;
  question_id: string;
  choice_text: string;
  is_correct: boolean;
  sort_order: number | null;
};

type QuestionRow = {
  id: string;
  lesson_id: string;
  question: string;
  sort_order: number | null;
  is_active: boolean;
  choices: ChoiceRow[];
};

type ProgressRow = {
  lesson_id: string;
  passed: boolean;
  score: number;
};

const BUCKET = 'training-videos';
const DEFAULT_PASS_PERCENT = 80;

export default function TrainingModuleClient({ slug }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [moduleRow, setModuleRow] = useState<ModuleRow | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // Quiz state
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> choiceId
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const PASS_PERCENT = moduleRow?.video_url !== undefined ? (moduleRow?.duration !== undefined ? (moduleRow as any)?.passing_score ?? DEFAULT_PASS_PERCENT : DEFAULT_PASS_PERCENT) : DEFAULT_PASS_PERCENT;
  // If your training_modules DOES have passing_score, PASS_PERCENT will still work.
  // If not, it falls back to DEFAULT_PASS_PERCENT.

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  // Load module + lessons + progress
  useEffect(() => {
    const run = async () => {
      if (!user) return;

      setPageLoading(true);
      setErr(null);

      const { data: mod, error: modErr } = await supabase
        .from('training_modules')
        .select('id, slug, title, description, level, duration, video_url, sort_order')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (modErr || !mod) {
        setErr(modErr?.message || 'Module not found / inactive.');
        setPageLoading(false);
        return;
      }
      setModuleRow(mod);

      const { data: les, error: lesErr } = await supabase
        .from('training_lessons')
        .select('id, module_id, module_slug, title, sort_order, video_path, content, is_active')
        .eq('module_slug', slug)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (lesErr) {
        setErr(lesErr.message);
        setPageLoading(false);
        return;
      }

      const lessonList = (les || []) as LessonRow[];
      setLessons(lessonList);
      setSelectedLessonId(lessonList[0]?.id ?? null);

      // Progress for these lessons (if your RLS allows select)
      if (lessonList.length) {
        const { data: prog, error: progErr } = await supabase
          .from('training_lesson_progress')
          .select('lesson_id, passed, score')
          .in('lesson_id', lessonList.map((l) => l.id));

        if (!progErr && prog) {
          const map: Record<string, ProgressRow> = {};
          for (const p of prog as any[]) {
            map[p.lesson_id] = { lesson_id: p.lesson_id, passed: !!p.passed, score: Number(p.score ?? 0) };
          }
          setProgress(map);
        }
      }

      setPageLoading(false);
    };

    run();
  }, [user, slug]);

  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId]
  );

  // Unlock rules: lesson 1 unlocked; others unlocked if previous lesson PASSED
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

  const passedCount = useMemo(() => {
    return lessons.reduce((acc, l) => acc + (progress[l.id]?.passed ? 1 : 0), 0);
  }, [lessons, progress]);

  const moduleCompleted = useMemo(() => {
    return lessons.length > 0 && lessons.every((l) => progress[l.id]?.passed);
  }, [lessons, progress]);

  const currentProgress = progress[selectedLessonId || ''];

  const lessonStatusBadge = useMemo(() => {
    if (!selectedLessonId) return null;
    const p = progress[selectedLessonId];
    if (!p) {
      return { label: 'Not attempted yet', className: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
    if (p.passed) {
      return { label: `Passed • ${p.score}%`, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    return { label: `Attempted • ${p.score}% (Retry)`, className: 'bg-amber-50 text-amber-800 border-amber-200' };
  }, [progress, selectedLessonId]);

  const isLastLesson = useMemo(() => {
    if (!selectedLesson) return false;
    return lessons.length > 0 && lessons[lessons.length - 1]?.id === selectedLesson.id;
  }, [lessons, selectedLesson]);

  // Load signed video + quiz when lesson changes
  useEffect(() => {
    const run = async () => {
      setVideoSrc(null);
      setQuestions([]);
      setAnswers({});
      setResult(null);
      setErr(null);

      if (!user || !selectedLesson || isSelectedLocked) return;

      // VIDEO: prefer lesson.video_path; fallback to module.video_url if it exists
      const objectKeyOrUrl = selectedLesson.video_path || moduleRow?.video_url || null;

      if (objectKeyOrUrl) {
        if (/^https?:\/\//i.test(objectKeyOrUrl)) {
          setVideoSrc(objectKeyOrUrl);
        } else {
          const { data, error } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(objectKeyOrUrl, 60 * 60 * 24 * 7);

          if (!error && data?.signedUrl) setVideoSrc(data.signedUrl);
          if (error) setErr((prev) => prev || `Video error: ${error.message}`);
        }
      }

      // QUIZ: fetch questions then fetch choices (does NOT require PostgREST relationship config)
      const { data: qs, error: qErr } = await supabase
        .from('training_questions')
        .select('id, lesson_id, question, sort_order, is_active')
        .eq('lesson_id', selectedLesson.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (qErr) {
        setErr((prev) => prev || `Questions error: ${qErr.message}`);
        return;
      }

      const qList = (qs || []) as Array<{
        id: string;
        lesson_id: string;
        question: string;
        sort_order: number | null;
        is_active: boolean;
      }>;

      if (qList.length === 0) {
        setQuestions([]);
        return;
      }

      const qIds = qList.map((q) => q.id);

      const { data: cs, error: cErr } = await supabase
        .from('training_question_choices')
        .select('id, question_id, choice_text, is_correct, sort_order')
        .in('question_id', qIds);

      if (cErr) {
        setErr((prev) => prev || `Choices error: ${cErr.message}`);
        setQuestions(qList.map((q) => ({ ...q, choices: [] })));
        return;
      }

      const choices = (cs || []) as ChoiceRow[];
      const byQ: Record<string, ChoiceRow[]> = {};
      for (const c of choices) (byQ[c.question_id] ||= []).push(c);

      const merged: QuestionRow[] = qList.map((q) => ({
        ...q,
        choices: (byQ[q.id] || []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      }));

      setQuestions(merged);
    };

    run();
  }, [user, selectedLessonId, isSelectedLocked, moduleRow?.video_url]);

  const onPickLesson = (lesson: LessonRow) => {
    if (!unlockedLessonIds.has(lesson.id)) return;
    setSelectedLessonId(lesson.id);
  };

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
    setErr(null);
  };

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
      const correctChoice = q.choices.find((c) => c.is_correct);
      if (pickedChoiceId && correctChoice && pickedChoiceId === correctChoice.id) correct++;
    }

    const score = Math.round((correct / total) * 100);
    const passed = score >= DEFAULT_PASS_PERCENT; // if you do have passing_score later, we can use it here
    setResult({ score, passed });

    // IMPORTANT: your DB complained completed_at cannot be null,
    // so we ALWAYS send a timestamp.
    const completedAt = new Date().toISOString();

    const { error: upErr } = await supabase
      .from('training_lesson_progress')
      .upsert(
        {
          user_id: user.id,
          lesson_id: selectedLesson.id,
          passed,
          score,
          completed_at: completedAt,
        },
        { onConflict: 'user_id,lesson_id' }
      );

    if (upErr) {
      setErr(upErr.message);
      setSaving(false);
      return;
    }

    // Update local progress immediately
    setProgress((prev) => ({
      ...prev,
      [selectedLesson.id]: { lesson_id: selectedLesson.id, passed, score },
    }));

    setSaving(false);

    // If they just passed the LAST lesson, go to success page
    if (passed && isLastLesson) {
      router.push(`/training/success?slug=${encodeURIComponent(slug)}`);
    }
  };

  // ---------- UI guards ----------
  if (authLoading || !user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </main>
    );
  }

  if (pageLoading) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-500">Loading module…</p>
        </div>
      </main>
    );
  }

  if (err || !moduleRow || !selectedLesson) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6">
          <p className="text-sm text-red-700">{err || 'Module not found.'}</p>
          <div className="mt-4">
            <Link href="/training" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              ← Back to Training Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Link href="/training" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                ← Back to dashboard
              </Link>

              <h1 className="mt-2 text-2xl font-semibold text-slate-900">{moduleRow.title}</h1>

              {moduleRow.description ? (
                <p className="mt-1 text-sm text-slate-600">{moduleRow.description}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <Pill>{moduleRow.level || 'All levels'}</Pill>
                <Pill>{moduleRow.duration || 'Self-paced'}</Pill>
                <Pill className="bg-slate-50 text-slate-700 border-slate-200">
                  Progress: {passedCount}/{lessons.length}
                </Pill>
                {moduleCompleted ? (
                  <Pill className="bg-emerald-50 text-emerald-700 border-emerald-200">Module completed ✅</Pill>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Sidebar (sticky on desktop) */}
          <aside className="lg:sticky lg:top-6 h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Lessons</h2>
              <span className="text-xs text-slate-500">{lessons.length} total</span>
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
                      'w-full text-left rounded-xl border px-3 py-3 transition',
                      active ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50',
                      !unlocked && 'opacity-50 cursor-not-allowed hover:bg-white'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Lesson {l.sort_order}</p>
                        <p className="text-sm font-medium text-slate-900 truncate">{l.title}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {p?.passed ? <StatusDot className="bg-emerald-500" /> : null}
                        {!unlocked ? <span className="text-xs text-slate-500">Locked</span> : null}
                      </div>
                    </div>

                    {p ? (
                      <p className="mt-2 text-xs text-slate-600">
                        {p.passed ? `Passed • ${p.score}%` : `Attempted • ${p.score}%`}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">Not attempted</p>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main */}
          <section className="space-y-6">
            {/* Lesson header */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Lesson {selectedLesson.sort_order}</p>
                  <h2 className="text-xl font-semibold text-slate-900">{selectedLesson.title}</h2>
                  {selectedLesson.content ? (
                    <p className="mt-1 text-sm text-slate-600">{selectedLesson.content}</p>
                  ) : null}
                </div>

                {lessonStatusBadge ? (
                  <Pill className={lessonStatusBadge.className}>{lessonStatusBadge.label}</Pill>
                ) : null}
              </div>

              {isSelectedLocked ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700">
                    This lesson is locked. Pass the previous lesson quiz to unlock it.
                  </p>
                </div>
              ) : null}
            </div>

            {/* Video */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Lesson video</h3>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-black">
                {videoSrc ? (
                  <video controls playsInline className="w-full h-auto" src={videoSrc} />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-200">
                    Video not available yet.
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-500">Tip: Watch the full lesson before starting the quiz.</p>
            </div>

            {/* Quiz */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Test your understanding</h3>
                  <p className="text-sm text-slate-600">
                    You need <b>{DEFAULT_PASS_PERCENT}%</b> to pass.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {isSelectedLocked ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700">Pass the previous lesson to unlock this quiz.</p>
                </div>
              ) : questions.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No questions yet for this lesson.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  {questions.map((q, i) => (
                    <div key={q.id} className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-900">
                        {(q.sort_order ?? i + 1)}. {q.question}
                      </p>

                      <div className="mt-3 space-y-2">
                        {q.choices.map((c) => {
                          const checked = answers[q.id] === c.id;
                          return (
                            <label
                              key={c.id}
                              className={clsx(
                                'flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer transition',
                                checked ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                              )}
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                className="h-4 w-4"
                                checked={checked}
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
                        'rounded-2xl border p-4',
                        result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
                      )}
                    >
                      <p className={clsx('text-sm font-semibold', result.passed ? 'text-emerald-800' : 'text-amber-800')}>
                        Score: {result.score}% • {result.passed ? 'Passed ✅' : 'Not passed yet'}
                      </p>
                      {!result.passed ? (
                        <p className="mt-1 text-sm text-amber-800/90">
                          Please rewatch the video and try again. You can reset and resubmit.
                        </p>
                      ) : isLastLesson ? (
                        <p className="mt-1 text-sm text-emerald-800/90">
                          Great job — you completed this module. Redirecting to success…
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    disabled={saving || questions.some((q) => !answers[q.id])}
                    onClick={submitTest}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Submit answers'}
                  </button>

                  {err ? <p className="text-sm text-red-600">{err}</p> : null}
                </div>
              )}
            </div>
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
        'inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs',
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
