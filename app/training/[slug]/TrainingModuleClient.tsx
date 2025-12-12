'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type ModuleRow = {
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  duration: string | null;
  passing_score: number | null;
  video_url: string | null; // optional fallback (public URL)
  video_path: string | null; // optional fallback (storage key)
};

type LessonRow = {
  id: string;
  module_slug: string;
  title: string;
  sort_order: number;
  video_path: string | null; // storage object key
  content: string | null;
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

type Props = { slug: string };

const VIDEO_BUCKET = 'training-videos';

function isHttpUrl(s: string) {
  return /^https?:\/\//i.test(s);
}

export default function TrainingModuleClient({ slug }: Props) {
  const { user, loading: authLoading } = useAuth();

  const [module, setModule] = useState<ModuleRow | null>(null);
  const [lesson, setLesson] = useState<LessonRow | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [videoDone, setVideoDone] = useState(false);

  // questionId -> choiceId
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const passingScore = module?.passing_score ?? 80;
  const total = questions.length;

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      setLoading(true);
      setErrMsg(null);

      setSubmitted(false);
      setSelected({});
      setVideoDone(false);

      // 1) module meta
      const { data: mod, error: modErr } = await supabase
        .from('training_modules')
        .select('slug, title, description, level, duration, passing_score, video_url, video_path')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (modErr || !mod) {
        setModule(null);
        setLesson(null);
        setVideoUrl(null);
        setQuestions([]);
        setLoading(false);
        setErrMsg(modErr?.message || 'Module not found / inactive.');
        return;
      }

      setModule(mod);

      // 2) first active lesson (video lives here)
      const { data: les, error: lesErr } = await supabase
        .from('training_lessons')
        .select('id, module_slug, title, sort_order, video_path, content')
        .eq('module_slug', slug)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (lesErr || !les) {
        setLesson(null);
        setVideoUrl(null);
        setQuestions([]);
        setLoading(false);
        setErrMsg(lesErr?.message || 'No active lessons found for this module.');
        return;
      }

      setLesson(les);

      // 3) video URL
      setVideoUrl(null);

      const lessonVideoKey = les.video_path;
      const moduleFallback = mod.video_url || mod.video_path || null;

      if (lessonVideoKey) {
        const { data: signed, error: signErr } = await supabase.storage
          .from(VIDEO_BUCKET)
          .createSignedUrl(lessonVideoKey, 60 * 60); // 1 hour

        if (!signErr && signed?.signedUrl) {
          setVideoUrl(signed.signedUrl);
        } else {
          // fallback
          if (typeof moduleFallback === 'string' && isHttpUrl(moduleFallback)) {
            setVideoUrl(moduleFallback);
          } else if (typeof moduleFallback === 'string' && moduleFallback) {
            const { data: s2, error: e2 } = await supabase.storage
              .from(VIDEO_BUCKET)
              .createSignedUrl(moduleFallback, 60 * 60);
            setVideoUrl(!e2 && s2?.signedUrl ? s2.signedUrl : null);
            if (e2) setErrMsg((prev) => prev || `Video error: ${e2.message}`);
          } else {
            setVideoUrl(null);
          }

          if (signErr) setErrMsg((prev) => prev || `Video error: ${signErr.message}`);
        }
      } else if (typeof moduleFallback === 'string' && isHttpUrl(moduleFallback)) {
        setVideoUrl(moduleFallback);
      } else if (typeof moduleFallback === 'string' && moduleFallback) {
        const { data: signed, error: signErr } = await supabase.storage
          .from(VIDEO_BUCKET)
          .createSignedUrl(moduleFallback, 60 * 60);
        setVideoUrl(!signErr && signed?.signedUrl ? signed.signedUrl : null);
        if (signErr) setErrMsg((prev) => prev || `Video error: ${signErr.message}`);
      }

      // 4) questions by LESSON ID (this matches your table)
      const { data: qs, error: qErr } = await supabase
        .from('training_questions')
        .select('id, lesson_id, question, sort_order')
        .eq('lesson_id', les.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (qErr) {
        setQuestions([]);
        setLoading(false);
        setErrMsg((prev) => prev || `Questions error: ${qErr.message}`);
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
        setLoading(false);
        return;
      }

      // 5) choices by QUESTION IDs (this matches your choices table)
      const questionIds = qList.map((q) => q.id);

      const { data: cs, error: cErr } = await supabase
        .from('training_question_choices')
        .select('id, question_id, choice_text, is_correct, sort_order')
        .in('question_id', questionIds);

      if (cErr) {
        setQuestions(qList.map((q) => ({ ...q, choices: [] })));
        setLoading(false);
        setErrMsg((prev) => prev || `Choices error: ${cErr.message}`);
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
      setLoading(false);
    };

    load();
  }, [slug, user]);

  const score = useMemo(() => {
    if (!submitted || total === 0) return 0;
    let correct = 0;

    for (const q of questions) {
      const pickedChoiceId = selected[q.id];
      const correctChoice = q.choices.find((c) => c.is_correct);
      if (pickedChoiceId && correctChoice && pickedChoiceId === correctChoice.id) correct++;
    }

    return Math.round((correct / total) * 100);
  }, [submitted, total, questions, selected]);

  const passed = submitted ? score >= passingScore : false;

  const resetQuiz = () => {
    setSelected({});
    setSubmitted(false);
  };

  const submitQuiz = async () => {
    if (!user || total === 0) return;

    setSubmitted(true);
    setSaving(true);

    // optional attempt logging (don’t block if RLS rejects)
    const answers = questions.map((q) => ({
      question_id: q.id,
      selected_choice_id: selected[q.id] ?? null,
    }));

    const { error } = await supabase.from('training_attempts').insert({
      module_slug: slug,
      score,
      passed,
      answers,
    });

    if (error) setErrMsg((prev) => prev || `Save attempt error: ${error.message}`);
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
          <p className="mt-2 text-sm text-slate-600">Please sign in to access this course.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading course…</p>
      </main>
    );
  }

  if (!module) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h1 className="text-xl font-semibold text-slate-900">Course not found</h1>
          <p className="mt-2 text-sm text-slate-600">{errMsg || 'This module may be inactive or missing.'}</p>
          <div className="mt-5">
            <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-800" href="/training">
              Back to Training Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const outline = [
    { key: 'video', title: 'Watch lesson', done: videoDone },
    { key: 'quiz', title: 'Quiz & assessment', done: submitted && passed },
  ];

  return (
    <main className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {errMsg ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {errMsg}
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/training" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              ← Back to dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">{module.title}</h1>
            {module.description ? <p className="mt-1 text-sm text-slate-600">{module.description}</p> : null}
            {lesson?.title ? <p className="mt-1 text-xs text-slate-500">Lesson: {lesson.title}</p> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1">{module.level || 'All levels'}</span>
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1">{module.duration || 'Self-paced'}</span>
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1">Passing score: {passingScore}%</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm h-fit">
            <h2 className="text-sm font-semibold text-slate-900">Course outline</h2>
            <div className="mt-3 space-y-2">
              {outline.map((o, i) => (
                <div
                  key={o.key}
                  className={clsx(
                    'flex items-center justify-between rounded-xl border px-3 py-2 text-sm',
                    o.done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
                  )}
                >
                  <span className="text-slate-900">{i + 1}. {o.title}</span>
                  <span className={clsx('text-xs font-semibold', o.done ? 'text-emerald-700' : 'text-slate-400')}>
                    {o.done ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            {submitted ? (
              <div
                className={clsx(
                  'mt-4 rounded-xl border px-3 py-3',
                  passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
                )}
              >
                <p className="text-sm font-semibold text-slate-900">
                  Result: {passed ? 'Passed ✅' : 'Needs retry ⚠️'}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Score: <span className="font-semibold">{score}%</span>
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={resetQuiz}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Retake quiz
                  </button>
                </div>
              </div>
            ) : null}
          </aside>

          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">Lesson video</h2>
                <button
                  onClick={() => setVideoDone(true)}
                  className={clsx(
                    'rounded-md px-3 py-2 text-xs font-semibold',
                    videoDone ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  )}
                >
                  {videoDone ? 'Completed ✓' : 'Mark as watched'}
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-black">
                {videoUrl ? (
                  <video key={videoUrl} controls className="w-full h-auto" preload="metadata">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-200">
                    Video not available yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">Quiz</h2>
                <p className="text-xs text-slate-500">{total ? `${total} questions` : 'No questions yet'}</p>
              </div>

              {!videoDone ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700">Please complete the video lesson first to unlock the quiz.</p>
                </div>
              ) : total === 0 ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700">No quiz questions are available for this lesson yet.</p>
                </div>
              ) : (
                <>
                  <div className="mt-4 space-y-5">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="rounded-xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {idx + 1}. {q.question}
                        </p>

                        <div className="mt-3 grid gap-2">
                          {q.choices.map((c) => {
                            const checked = selected[q.id] === c.id;

                            const correct = submitted && c.is_correct;
                            const wrongPick = submitted && checked && !c.is_correct;

                            return (
                              <label
                                key={c.id}
                                className={clsx(
                                  'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition',
                                  submitted
                                    ? correct
                                      ? 'border-emerald-300 bg-emerald-50'
                                      : wrongPick
                                      ? 'border-amber-300 bg-amber-50'
                                      : 'border-slate-200'
                                    : checked
                                    ? 'border-emerald-300 bg-emerald-50'
                                    : 'border-slate-200 hover:bg-slate-50'
                                )}
                              >
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  className="mt-1"
                                  disabled={submitted}
                                  checked={checked}
                                  onChange={() => setSelected((prev) => ({ ...prev, [q.id]: c.id }))}
                                />
                                <span className="text-sm text-slate-700">{c.choice_text}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={submitQuiz}
                      disabled={submitted || saving}
                      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving…' : submitted ? 'Submitted' : 'Submit quiz'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
