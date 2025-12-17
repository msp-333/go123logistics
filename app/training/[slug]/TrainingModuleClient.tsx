'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  video_url: string;
  sort_order?: number | null;
};

type LessonRow = {
  id: string;
  module_id: string;
  module_slug: string | null;
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

type Props = {
  slug: string;
};

const BUCKET = 'training-videos';
const PASS_PERCENT = 80;

function clampStyle(lines: number) {
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    WebkitLineClamp: lines,
    overflow: 'hidden',
  };
}

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

  const [showQuiz, setShowQuiz] = useState(true);
  const [nextModuleSlug, setNextModuleSlug] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    const run = async () => {
      if (!user || !slug) return;

      setLoading(true);
      setErr(null);

      const { data: mod, error: modErr } = await supabase
        .from('training_modules')
        .select('id, slug, title, description, level, duration, video_url, sort_order')
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
        .eq('module_id', mod.id)
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

      if (lessonList.length) {
        const { data: prog, error: progErr } = await supabase
          .from('training_lesson_progress')
          .select('lesson_id, passed, score, completed_at')
          .eq('user_id', user.id)
          .in('lesson_id', lessonList.map((l) => l.id));

        if (progErr) {
          setErr(progErr.message);
          setLoading(false);
          return;
        }

        const map: Record<string, ProgressRow> = {};
        for (const p of (prog as any[]) ?? []) map[p.lesson_id] = p;
        setProgress(map);
      }

      const { data: allMods } = await supabase
        .from('training_modules')
        .select('slug, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (allMods && Array.isArray(allMods)) {
        const idx = allMods.findIndex((m: any) => m.slug === mod.slug);
        const next = idx >= 0 ? allMods[idx + 1]?.slug ?? null : null;
        setNextModuleSlug(next);
      }

      setLoading(false);
    };

    void run();
  }, [user, slug]);

  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId]
  );

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
  const selectedPassed = !!selectedProgress?.passed;

  useEffect(() => {
    setAnswers({});
    setResult(null);
    setErr(null);
    setShowQuiz(!selectedPassed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLessonId, selectedPassed]);

  useEffect(() => {
    const run = async () => {
      setVideoSrc(null);
      setQuestions([]);

      if (!user || !selectedLesson || isSelectedLocked) return;

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

      const normalized =
        (qs as any[] | null | undefined)?.map((q) => ({
          ...q,
          training_question_choices: [...(q.training_question_choices || [])].sort(
            (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          ),
        })) ?? [];

      setQuestions(normalized as QuestionRow[]);
    };

    void run();
  }, [user, selectedLessonId, isSelectedLocked, moduleRow?.video_url, selectedLesson]);

  const onPickLesson = (lesson: LessonRow) => {
    if (!unlockedLessonIds.has(lesson.id)) return;
    setSelectedLessonId(lesson.id);
  };

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
    setErr(null);
    setShowQuiz(true);
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

    if (passed) setShowQuiz(false);
    setSaving(false);
  };

  if (authLoading || !user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
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
          <p className="text-sm text-slate-500">Loading module...</p>
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

  const moduleCompleted = lessons.length > 0 && lessons.every((l) => progress[l.id]?.passed);

  return (
    <main className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-slate-900 leading-snug">
                {moduleRow.title}
              </h1>
              {moduleRow.description ? (
                <p
                  className="mt-2 text-sm text-slate-600 leading-relaxed break-words"
                  style={clampStyle(3)}
                >
                  {moduleRow.description}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <Pill>{moduleRow.level || 'Beginner'}</Pill>
                <Pill>{moduleRow.duration || 'Self-paced'}</Pill>
              </div>
            </div>

            {moduleCompleted ? (
              <span className="shrink-0 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 whitespace-nowrap">
                Completed
              </span>
            ) : null}
          </div>
        </header>

        {moduleCompleted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-emerald-900">Module completed</p>
            <p className="mt-1 text-sm text-emerald-900/80">
              You have passed all lessons in this module.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {nextModuleSlug ? (
                <button
                  type="button"
                  onClick={() => router.push(`/training/${nextModuleSlug}`)}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Next module
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => router.push(`/training?refresh=${Date.now()}`)}
                className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              >
                Back to dashboard
              </button>
            </div>
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
                      active
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200 hover:bg-slate-50',
                      !unlocked && 'opacity-50 cursor-not-allowed hover:bg-white'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Lesson {l.sort_order}</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-900 leading-snug break-words">
                          {l.title}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 pt-0.5">
                        {done ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> : null}
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
                  This lesson is locked. Pass the previous lesson’s quiz to unlock it.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Lesson {selectedLesson.sort_order}</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900 leading-snug break-words">
                      {selectedLesson.title}
                    </h2>
                    {selectedLesson.content ? (
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed break-words">
                        {selectedLesson.content}
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0">
                    {selectedPassed ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 whitespace-nowrap">
                        Passed {selectedProgress?.score ?? 0}%
                      </span>
                    ) : selectedProgress ? (
                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 whitespace-nowrap">
                        Attempted
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap">
                        Not attempted
                      </span>
                    )}
                  </div>
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
                      <p className="text-sm text-slate-600">No video found for this lesson.</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Test your understanding</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Passing score: <b>{PASS_PERCENT}%</b>.
                      </p>
                    </div>

                    {selectedPassed ? (
                      <button
                        type="button"
                        onClick={resetQuiz}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      >
                        Retake quiz
                      </button>
                    ) : null}
                  </div>

                  {questions.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-500">No questions for this lesson yet.</p>
                  ) : selectedPassed && !showQuiz ? (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm font-semibold text-emerald-900">Lesson passed</p>
                      <p className="mt-1 text-sm text-emerald-900/80">
                        Score: {selectedProgress?.score ?? 0}%
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {nextLesson ? (
                          <button
                            type="button"
                            onClick={() => onPickLesson(nextLesson)}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Continue to next lesson
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => router.push(`/training?refresh=${Date.now()}`)}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Finish and go back to dashboard
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={resetQuiz}
                          className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                        >
                          Review answers
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-5">
                      {questions.map((q) => (
                        <div key={q.id} className="rounded-2xl border border-slate-200 p-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {q.sort_order}. {q.question}
                          </p>

                          <div className="mt-3 space-y-2">
                            {q.training_question_choices.map((c) => {
                              const checked = answers[q.id] === c.id;
                              return (
                                <label
                                  key={c.id}
                                  className={clsx(
                                    'flex items-start gap-3 rounded-xl border px-3 py-2 cursor-pointer transition',
                                    checked
                                      ? 'border-emerald-200 bg-emerald-50'
                                      : 'border-slate-200 hover:bg-slate-50'
                                  )}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    className="mt-1 h-4 w-4"
                                    checked={checked}
                                    onChange={() =>
                                      setAnswers((prev) => ({ ...prev, [q.id]: c.id }))
                                    }
                                  />
                                  <span className="text-sm text-slate-800 leading-relaxed">
                                    {c.choice_text}
                                  </span>
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
                            result.passed
                              ? 'border-emerald-200 bg-emerald-50'
                              : 'border-amber-200 bg-amber-50'
                          )}
                        >
                          <p
                            className={clsx(
                              'text-sm font-semibold',
                              result.passed ? 'text-emerald-900' : 'text-amber-900'
                            )}
                          >
                            Score: {result.score}% • {result.passed ? 'Passed' : 'Not passed'}
                          </p>

                          {!result.passed ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={resetQuiz}
                                className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50"
                              >
                                Try again
                              </button>
                            </div>
                          ) : nextLesson ? (
                            <button
                              type="button"
                              onClick={() => onPickLesson(nextLesson)}
                              className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Continue to next lesson
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => router.push(`/training?refresh=${Date.now()}`)}
                              className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Finish and go back to dashboard
                            </button>
                          )}
                        </div>
                      ) : null}

                      <button
                        type="button"
                        disabled={saving || questions.some((q) => !answers[q.id])}
                        onClick={submitTest}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {saving ? 'Saving...' : 'Submit answers'}
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

function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs whitespace-nowrap',
        className
      )}
    >
      {children}
    </span>
  );
}
