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
  title: string | null;
  description: string | null;
  level: string | null;
  duration: string | null;
  passing_score: number | null;
  video_url: string | null; // can be a public URL OR a storage object key
  is_active: boolean;
  sort_order: number | null;
};

type LessonRow = {
  id: string;
  module_id: string | null;
  module_slug: string;
  title: string | null;
  sort_order: number;
  video_path: string | null; // storage object key
  content: string | null;
  is_active: boolean;
};

type QuestionRow = {
  id: string;
  lesson_id: string;
  question: string;
  sort_order: number | null;
};

type ChoiceRow = {
  id: string;
  question_id: string;
  choice_text: string;
  is_correct: boolean;
  sort_order: number | null;
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

  // quiz (robust)
  const [questions, setQuestions] = useState<Array<QuestionRow & { choices: ChoiceRow[] }>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> choiceId
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const PASS_PERCENT = moduleRow?.passing_score ?? 80;

  // Guard auth
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  // Load module + lessons + progress
  useEffect(() => {
    const run = async () => {
      if (!user) return;

      setLoading(true);
      setErr(null);

      // Module (by slug)
      const { data: mod, error: modErr } = await supabase
        .from('training_modules')
        .select('id, slug, title, description, level, duration, passing_score, video_url, is_active, sort_order')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (modErr || !mod) {
        setModuleRow(null);
        setLessons([]);
        setSelectedLessonId(null);
        setProgress({});
        setLoading(false);
        setErr(modErr?.message || 'Module not found / inactive.');
        return;
      }

      setModuleRow(mod);

      // Lessons (by module_slug)
      const { data: les, error: lesErr } = await supabase
        .from('training_lessons')
        .select('id, module_id, module_slug, title, sort_order, video_path, content, is_active')
        .eq('module_slug', slug)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (lesErr) {
        setLessons([]);
        setSelectedLessonId(null);
        setLoading(false);
        setErr(lesErr.message);
        return;
      }

      const lessonList = (les || []) as LessonRow[];
      setLessons(lessonList);
      setSelectedLessonId((prev) => prev ?? lessonList[0]?.id ?? null);

      // Progress for these lessons (filter by user_id to satisfy RLS)
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
        } else {
          setProgress({});
        }
      } else {
        setProgress({});
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

  // Badge text (fixes “Not passed yet” / “Not attempted yet”)
  const lessonStatusBadge = useMemo(() => {
    if (!selectedLesson) return null;
    const p = progress[selectedLesson.id];

    if (!p) {
      return {
        label: 'Not attempted yet',
        className: 'bg-slate-900/[0.04] text-slate-700 ring-slate-900/[0.06]',
      };
    }

    if (p.passed) {
      return {
        label: `Passed • ${p.score}%`,
        className: 'bg-emerald-600/10 text-emerald-800 ring-emerald-600/15',
      };
    }

    return {
      label: `Attempted • ${p.score}% (Retry)`,
      className: 'bg-amber-500/10 text-amber-900 ring-amber-500/20',
    };
  }, [selectedLesson, progress]);

  // Load signed video + quiz when lesson changes
  useEffect(() => {
    const run = async () => {
      setVideoSrc(null);
      setQuestions([]);
      setAnswers({});
      setResult(null);
      setErr(null);

      if (!user || !selectedLesson || isSelectedLocked) return;

      // VIDEO: prefer lesson.video_path, fallback to module.video_url
      const objectKeyOrUrl = selectedLesson.video_path || moduleRow?.video_url || null;

      if (objectKeyOrUrl) {
        if (/^https?:\/\//i.test(objectKeyOrUrl)) {
          setVideoSrc(objectKeyOrUrl);
        } else {
          const { data, error } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(objectKeyOrUrl, 60 * 60 * 24 * 7); // 7 days

          if (!error && data?.signedUrl) setVideoSrc(data.signedUrl);
          if (error) setErr((prev) => prev || `Video error: ${error.message}`);
        }
      }

      // QUIZ (robust): fetch questions, then fetch choices separately (no relationship dependency)
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

      const qList = (qs || []) as QuestionRow[];
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

      setQuestions(
        qList.map((q) => ({
          ...q,
          choices: (byQ[q.id] || []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        }))
      );
    };

    run();
  }, [user, selectedLessonId, isSelectedLocked, moduleRow?.video_url, selectedLesson?.id]);

  const onPickLesson = (lesson: LessonRow) => {
    if (!unlockedLessonIds.has(lesson.id)) return;
    setSelectedLessonId(lesson.id);
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
    const passed = score >= PASS_PERCENT;
    setResult({ score, passed });

    // Save progress (upsert)
    const payload: any = {
      user_id: user.id,
      lesson_id: selectedLesson.id,
      passed,
      score,
      updated_at: new Date().toISOString(),
    };

    // If your table requires completed_at NOT NULL, always set it.
    // If it allows null, this still works.
    payload.completed_at = passed ? new Date().toISOString() : new Date().toISOString();

    const { error: upErr } = await supabase
      .from('training_lesson_progress')
      .upsert(payload, { onConflict: 'user_id,lesson_id' });

    if (upErr) {
      setErr(upErr.message);
      setSaving(false);
      return;
    }

    setProgress((prev) => ({
      ...prev,
      [selectedLesson.id]: { lesson_id: selectedLesson.id, passed, score },
    }));

    setSaving(false);
  };

  const nextLesson = useMemo(() => {
    if (!selectedLesson) return null;
    const idx = lessons.findIndex((l) => l.id === selectedLesson.id);
    return idx >= 0 ? lessons[idx + 1] ?? null : null;
  }, [lessons, selectedLesson]);

  const moduleTitle = moduleRow?.title || slug.replaceAll('-', ' ');
  const moduleDesc = moduleRow?.description || '';
  const moduleDuration = moduleRow?.duration || null;

  if (authLoading || !user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-slate-50 to-white px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-500">Loading module…</p>
        </div>
      </main>
    );
  }

  if (err || !moduleRow || !selectedLesson) {
    return (
      <main className="bg-gradient-to-b from-slate-50 to-white px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white/80 backdrop-blur ring-1 ring-slate-200/60 p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Course not available</h1>
          <p className="mt-2 text-sm text-slate-600">{err || 'This module may be missing or inactive.'}</p>
          <button
            type="button"
            onClick={() => router.push('/training')}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Back to Training Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="rounded-3xl bg-white/80 backdrop-blur ring-1 ring-slate-200/60 p-7 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                {moduleTitle}
              </h1>
              {moduleDesc ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">{moduleDesc}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <Pill>{moduleRow.level || 'All levels'}</Pill>
                <Pill>{moduleDuration || 'Self-paced'}</Pill>
                <Pill>Pass: {PASS_PERCENT}%</Pill>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/training')}
              className="shrink-0 rounded-full bg-slate-900/[0.04] px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-900/[0.06] hover:bg-slate-900/[0.06]"
            >
              Back to dashboard
            </button>
          </div>
        </header>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Sidebar lessons */}
          <aside className="rounded-3xl bg-white/80 backdrop-blur ring-1 ring-slate-200/60 p-4 shadow-sm h-fit">
            <h2 className="text-sm font-semibold text-slate-900 px-2">Lessons</h2>

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
                      'w-full text-left rounded-2xl px-4 py-3 transition',
                      'ring-1 ring-slate-200/70 hover:bg-slate-900/[0.02]',
                      active && 'bg-emerald-600/10 ring-emerald-600/20',
                      !unlocked && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Lesson {l.sort_order}</p>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {l.title || `Lesson ${l.sort_order}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {done ? <StatusDot className="bg-emerald-500" /> : <StatusDot className="bg-slate-300" />}
                        {!unlocked ? <span className="text-xs text-slate-500">Locked</span> : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            {/* Lesson header */}
            <div className="rounded-3xl bg-white/80 backdrop-blur ring-1 ring-slate-200/60 p-6 sm:p-7 shadow-sm">
              {isSelectedLocked ? (
                <div className="rounded-2xl bg-slate-900/[0.03] ring-1 ring-slate-900/[0.06] p-4">
                  <p className="text-sm text-slate-700">
                    This lesson is locked. Pass the previous lesson quiz to unlock it.
                  </p>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Lesson {selectedLesson.sort_order}</p>
                    <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                      {selectedLesson.title || `Lesson ${selectedLesson.sort_order}`}
                    </h2>
                    {selectedLesson.content ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">{selectedLesson.content}</p>
                    ) : null}
                  </div>

                  {lessonStatusBadge ? (
                    <Pill className={clsx(lessonStatusBadge.className, 'whitespace-nowrap shrink-0')}>
                      {lessonStatusBadge.label}
                    </Pill>
                  ) : null}
                </div>
              )}
            </div>

            {/* Video */}
            <div className="rounded-3xl bg-white/80 backdrop-blur ring-1 ring-slate-200/60 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Lesson video</h3>

              <div className="mt-4 overflow-hidden rounded-3xl ring-1 ring-slate-200/70 bg-black">
                {videoSrc && !isSelectedLocked ? (
                  <video
                    controls
                    playsInline
                    className="w-full h-auto"
                    src={videoSrc}
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-200">
                    Video not available yet.
                  </div>
                )}
              </div>
            </div>

            {/* Quiz */}
            <div className="rounded-3xl bg-white/80 backdrop-blur ring-1 ring-slate-200/60 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">Test your understanding</h3>
                <Pill>Need {PASS_PERCENT}%</Pill>
              </div>

              {isSelectedLocked ? (
                <p className="mt-4 text-sm text-slate-600">
                  Pass the previous lesson quiz to unlock this lesson.
                </p>
              ) : questions.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No questions yet for this lesson.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  {questions.map((q, i) => (
                    <div key={q.id} className="rounded-3xl ring-1 ring-slate-200/70 p-5">
                      <p className="text-sm font-medium text-slate-900">
                        {(q.sort_order ?? i + 1)}. {q.question}
                      </p>

                      <div className="mt-4 space-y-2">
                        {q.choices.map((c) => {
                          const checked = answers[q.id] === c.id;
                          return (
                            <label
                              key={c.id}
                              className={clsx(
                                'flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer transition',
                                'ring-1 ring-slate-200/70 hover:bg-slate-900/[0.02]',
                                checked && 'bg-emerald-600/10 ring-emerald-600/20'
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
                        'rounded-3xl p-5 ring-1',
                        result.passed
                          ? 'bg-emerald-600/10 text-emerald-900 ring-emerald-600/20'
                          : 'bg-amber-500/10 text-amber-900 ring-amber-500/20'
                      )}
                    >
                      <p className="text-sm font-semibold">
                        Score: {result.score}% • {result.passed ? 'Passed ✅' : 'Not passed yet'}
                      </p>

                      {!result.passed ? (
                        <p className="mt-1 text-sm opacity-90">
                          Watch the video again, then retake the quiz.
                        </p>
                      ) : nextLesson ? (
                        <button
                          type="button"
                          onClick={() => onPickLesson(nextLesson)}
                          className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                          Continue to next lesson
                        </button>
                      ) : (
                        <div className="mt-4">
                          <p className="text-sm opacity-90">Great job — you finished this module.</p>
                          <button
                            type="button"
                            onClick={() => router.push('/training')}
                            className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                          >
                            Back to dashboard
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="button"
                      disabled={saving || questions.some((q) => !answers[q.id])}
                      onClick={submitTest}
                      className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {saving ? 'Saving…' : 'Submit answers'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({});
                        setResult(null);
                      }}
                      className="inline-flex w-full items-center justify-center rounded-full bg-slate-900/[0.04] px-5 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-900/[0.06] hover:bg-slate-900/[0.06]"
                    >
                      Reset
                    </button>
                  </div>

                  {err ? (
                    <p className="text-sm text-red-600">{err}</p>
                  ) : null}
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
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        'bg-slate-900/[0.04] text-slate-700 ring-1 ring-slate-900/[0.06]',
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
