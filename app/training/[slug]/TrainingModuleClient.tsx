'use client';

import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type Props = { slug: string };

type ModuleRow = {
  id: string;
  duration: string | null;
  video_url: string | null;
  passing_score: number | null;
  is_active: boolean;
  sort_order: number | null;
};

type LessonRow = {
  id: string;
  module_id: string | null;
  module_slug: string;
  title: string | null;
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
  choices: ChoiceRow[];
};

type ProgressRow = {
  lesson_id: string;
  passed: boolean;
  score: number;
};

const BUCKET = 'training-videos';

export default function TrainingModuleClient({ slug }: Props) {
  const { user, loading: authLoading } = useAuth();

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

  // Load module + lessons + progress
  useEffect(() => {
    const run = async () => {
      if (!user || !slug) return;

      setLoading(true);
      setErr(null);

      // 1) Load lessons for this slug (needs module_id so we can fetch the right module row)
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
      setSelectedLessonId(lessonList[0]?.id ?? null);

      // 2) Load module meta by module_id (from first lesson)
      const moduleId = lessonList[0]?.module_id ?? null;
      if (moduleId) {
        const { data: mod, error: modErr } = await supabase
          .from('training_modules')
          .select('id, duration, video_url, passing_score, is_active, sort_order')
          .eq('id', moduleId)
          .maybeSingle();

        if (modErr) {
          setErr((prev) => prev || modErr.message);
        } else {
          setModuleRow(mod || null);
        }
      } else {
        setModuleRow(null);
      }

      // 3) Load progress for lessons
      if (lessonList.length) {
        const { data: prog, error: progErr } = await supabase
          .from('training_lesson_progress')
          .select('lesson_id, passed, score')
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

  const PASS_PERCENT = moduleRow?.passing_score ?? 80;

  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId]
  );

  // Lesson lock rules
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
            .createSignedUrl(objectKeyOrUrl, 60 * 60 * 24 * 7);

          if (!error && data?.signedUrl) setVideoSrc(data.signedUrl);
          if (error) setErr((prev) => prev || `Video error: ${error.message}`);
        }
      }

      // QUIZ: questions by lesson_id
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
      }>;

      if (qList.length === 0) {
        setQuestions([]);
        return;
      }

      // Choices by question_id
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

    const { error: upErr } = await supabase
      .from('training_lesson_progress')
      .upsert(
        {
          user_id: user.id,
          lesson_id: selectedLesson.id,
          passed,
          score,
          completed_at: passed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
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
      [selectedLesson.id]: { lesson_id: selectedLesson.id, passed, score },
    }));

    setSaving(false);
  };

  if (authLoading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Checking your session…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h1 className="text-xl font-semibold text-slate-900">Training</h1>
          <p className="mt-2 text-sm text-slate-600">Please sign in to access this module.</p>
        </div>
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

  if (err) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-white p-6">
          <p className="text-sm text-red-700">{err}</p>
        </div>
      </main>
    );
  }

  if (!selectedLesson) return null;

  const nextLesson = (() => {
    const idx = lessons.findIndex((l) => l.id === selectedLesson.id);
    return idx >= 0 ? lessons[idx + 1] ?? null : null;
  })();

  return (
    <main className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{slug.replaceAll('-', ' ')}</h1>
          {moduleRow?.duration ? (
            <p className="mt-1 text-sm text-slate-600">Duration: {moduleRow.duration}</p>
          ) : null}
        </header>

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
                        <p className="text-sm font-medium text-slate-900">{l.title || 'Lesson'}</p>
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
                    <h2 className="text-xl font-semibold text-slate-900">{selectedLesson.title || 'Lesson'}</h2>
                    {selectedLesson.content ? (
                      <p className="mt-1 text-sm text-slate-600">{selectedLesson.content}</p>
                    ) : null}
                  </div>

                  {progress[selectedLesson.id]?.passed ? (
                    <Pill className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Passed • {progress[selectedLesson.id].score}%
                    </Pill>
                  ) : (
                    <Pill>Not passed yet</Pill>
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
                    You need <b>{PASS_PERCENT}%</b> to pass and unlock the next lesson.
                  </p>

                  {questions.length === 0 ? (
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

                          {result.passed && nextLesson ? (
                            <button
                              type="button"
                              onClick={() => onPickLesson(nextLesson)}
                              className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                              Continue to next lesson
                            </button>
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
