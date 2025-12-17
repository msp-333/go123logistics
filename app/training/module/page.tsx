'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import clsx from 'clsx';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  duration: string | null;
  video_url: string; // your table has this NOT NULL (can be storage key or public url)
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
  completed_at?: string | null;
};

const BUCKET = 'training-videos';
const PASS_PERCENT = 80;

export default function TrainingModulePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const params = useParams<{ slug?: string }>();

  // supports BOTH /training/[slug] AND old ?slug= style
  const slug = (params?.slug as string | undefined) ?? sp.get('slug') ?? '';

  const [moduleRow, setModuleRow] = useState<ModuleRow | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Guard auth
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  // Load module + lessons + progress (✅ progress is now filtered by user_id)
  useEffect(() => {
    const run = async () => {
      if (!user || !slug) return;
      setLoading(true);
      setErr(null);

      const { data: mod, error: modErr } = await supabase
        .from('training_modules')
        .select('id, slug, title, description, level, duration, video_url')
        .eq('slug', slug)
        .single();

      if (modErr || !mod) {
        setErr(modErr?.message || 'Module not found.');
        setLoading(false);
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
        setLoading(false);
        return;
      }

      const lessonList = (les || []) as LessonRow[];
      setLessons(lessonList);
      setSelectedLessonId((prev) => prev ?? lessonList[0]?.id ?? null);

      // ✅ filter by user_id so you only see your own progress
      if (lessonList.length) {
        const { data: prog, error: progErr } = await supabase
          .from('training_lesson_progress')
          .select('lesson_id, passed, score, completed_at')
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

    run();
  }, [user, slug]);

  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId]
  );

  // Lesson lock rules: lesson 1 unlocked; others unlocked if previous lesson PASSED
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

  // Load signed video + questions when lesson changes
  useEffect(() => {
    const run = async () => {
      setVideoSrc(null);
      setQuestions([]);
      setAnswers({});
      setResult(null);

      if (!user || !selectedLesson || isSelectedLocked) return;

      // video: storage key OR public URL
      const objectKeyOrUrl = selectedLesson.video_path || moduleRow?.video_url || null;

      if (objectKeyOrUrl) {
        if (/^https?:\/\//i.test(objectKeyOrUrl)) {
          setVideoSrc(objectKeyOrUrl);
        } else {
          const { data, error } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(objectKeyOrUrl, 60 * 60 * 24 * 7);

          if (!error && data?.signedUrl) setVideoSrc(data.signedUrl);
        }
      }

      const { data: qs, error: qErr } = await supabase
        .from('training_questions')
        .select(
          'id, question, sort_order, training_question_choices(id, choice_text, is_correct, sort_order)'
        )
        .eq('lesson_id', selectedLesson.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (qErr) {
        setErr(qErr.message);
        return;
      }

      const normalized = (qs as any[] | null | undefined)?.map((q) => ({
        ...q,
        training_question_choices: [...(q.training_question_choices || [])].sort(
          (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        ),
      })) ?? [];

      setQuestions(normalized as QuestionRow[]);
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
      const correctChoice = q.training_question_choices.find((c) => c.is_correct);
      if (pickedChoiceId && correctChoice && pickedChoiceId === correctChoice.id) correct++;
    }

    const score = Math.round((correct / total) * 100);
    const passed = score >= PASS_PERCENT;
    setResult({ score, passed });

    // ✅ completed_at set ALWAYS (avoids NOT NULL errors)
    const nowIso = new Date().toISOString();

    const { error: upErr } = await supabase
      .from('training_lesson_progress')
      .upsert(
        {
          user_id: user.id,
          lesson_id: selectedLesson.id,
          passed,
          score,
          completed_at: nowIso,
        },
        { onConflict: 'user_id,lesson_id' }
      );

    if (upErr) {
      setErr(upErr.message);
      setSaving(false);
      return;
    }

    setProgress((prev) => ({
      ...prev,
      [selectedLesson.id]: { lesson_id: selectedLesson.id, passed, score, completed_at: nowIso },
    }));

    setSaving(false);
  };

  if (authLoading || !user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </main>
    );
  }

  if (!slug) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-700">Missing module slug.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-slate-500">Loading module…</p>
        </div>
      </main>
    );
  }

  if (err) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-white p-6">
          <p className="text-sm text-red-700">{err}</p>
        </div>
      </main>
    );
  }

  if (!moduleRow || !selectedLesson) return null;

  const nextLesson = (() => {
    const idx = lessons.findIndex((l) => l.id === selectedLesson.id);
    return idx >= 0 ? lessons[idx + 1] ?? null : null;
  })();

  const moduleCompleted =
    lessons.length > 0 && lessons.every((l) => progress[l.id]?.passed);

  return (
    <main className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{moduleRow.title}</h1>
          {moduleRow.description ? <p className="mt-1 text-sm text-slate-600">{moduleRow.description}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <Pill>{moduleRow.level || 'All levels'}</Pill>
            <Pill>{moduleRow.duration || 'Self-paced'}</Pill>
          </div>
        </header>

        {moduleCompleted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-emerald-800">Module completed ✅</p>
            <p className="mt-1 text-sm text-emerald-800/90">
              Great job — you passed all lessons in this module.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/training?refresh=${Date.now()}`)}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Back to dashboard
            </button>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Lessons</h2>
            <div className="mt-3 space-y-2">
              {lessons.map((l) => {
                const unlocked = unlockedLessonIds.has(l.id);
                const done = progress[l.id]?.passed;
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
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">Lesson {l.sort_order}</p>
                        <p className="text-sm font-medium text-slate-900">{l.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {done ? <StatusDot className="bg-emerald-500" /> : null}
                        {!unlocked ? <span className="text-xs text-slate-500">Locked</span> : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {isSelectedLocked ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-700">
                  This lesson is locked. Pass the previous lesson’s <b>Test your understanding</b> to unlock it.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Lesson {selectedLesson.sort_order}</p>
                    <h2 className="text-xl font-semibold text-slate-900">{selectedLesson.title}</h2>
                    {selectedLesson.content ? (
                      <p className="mt-1 text-sm text-slate-600">{selectedLesson.content}</p>
                    ) : null}
                  </div>

                  {progress[selectedLesson.id]?.passed ? (
                    <Pill className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Passed • {progress[selectedLesson.id].score}%
                    </Pill>
                  ) : progress[selectedLesson.id] ? (
                    <Pill className="border-amber-200 bg-amber-50 text-amber-700">Attempted</Pill>
                  ) : (
                    <Pill>Not attempted</Pill>
                  )}
                </div>

                <div className="mt-5">
                  {videoSrc ? (
                    <video
                      controls
                      playsInline
                      className="w-full rounded-2xl border border-slate-200 bg-black shadow-sm"
                      src={videoSrc}
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-600">No video found for this lesson yet.</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900">Test your understanding</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    You need <b>{PASS_PERCENT}%</b> to pass.
                  </p>

                  {questions.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-500">No questions yet for this lesson.</p>
                  ) : (
                    <div className="mt-5 space-y-5">
                      {questions.map((q) => (
                        <div key={q.id} className="rounded-2xl border border-slate-200 p-4">
                          <p className="text-sm font-medium text-slate-900">
                            {q.sort_order}. {q.question}
                          </p>

                          <div className="mt-3 space-y-2">
                            {q.training_question_choices.map((c) => {
                              const checked = answers[q.id] === c.id;
                              return (
                                <label
                                  key={c.id}
                                  className={clsx(
                                    'flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer transition',
                                    checked
                                      ? 'border-emerald-300 bg-emerald-50'
                                      : 'border-slate-200 hover:bg-slate-50'
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
                          <p className={clsx('text-sm font-medium', result.passed ? 'text-emerald-800' : 'text-amber-800')}>
                            Score: {result.score}% • {result.passed ? 'Passed ✅' : 'Not passed yet'}
                          </p>

                          {!result.passed ? (
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={resetQuiz}
                                className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50"
                              >
                                Try again
                              </button>
                            </div>
                          ) : nextLesson ? (
                            <button
                              type="button"
                              onClick={() => onPickLesson(nextLesson)}
                              className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                              Continue to next lesson
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => router.push(`/training?refresh=${Date.now()}`)}
                              className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                              Finish & go back to dashboard
                            </button>
                          )}
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
