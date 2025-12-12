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
  passing_score: number | null;   // e.g. 80
  video_path: string | null;      // path inside bucket (recommended)
  video_url: string | null;       // optional (public URL)
};

type QuestionRow = {
  id: string;
  module_slug: string;
  prompt: string;
  choices: string[];
  correct_index: number;
  explanation: string | null;
  sort_order: number;
};

type Props = { slug: string };

const VIDEO_BUCKET = 'training-videos';

export default function TrainingModuleClient({ slug }: Props) {
  const { user, loading: authLoading } = useAuth();

  const [module, setModule] = useState<ModuleRow | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [videoDone, setVideoDone] = useState(false);

  // quiz state
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const passingScore = module?.passing_score ?? 80;

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      setLoading(true);

      const { data: mod, error: modErr } = await supabase
        .from('training_modules')
        .select('slug, title, description, level, duration, passing_score, video_path, video_url')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (modErr || !mod) {
        setModule(null);
        setQuestions([]);
        setVideoUrl(null);
        setLoading(false);
        return;
      }

      setModule(mod);

      // video URL resolution (prefer storage signed URL if video_path provided)
      if (mod.video_url) {
        setVideoUrl(mod.video_url);
      } else if (mod.video_path) {
        const { data: signed, error: signErr } = await supabase
          .storage
          .from(VIDEO_BUCKET)
          .createSignedUrl(mod.video_path, 60 * 60); // 1 hour

        setVideoUrl(!signErr && signed?.signedUrl ? signed.signedUrl : null);
      } else {
        setVideoUrl(null);
      }

      const { data: qs, error: qErr } = await supabase
        .from('training_questions')
        .select('id, module_slug, prompt, choices, correct_index, explanation, sort_order')
        .eq('module_slug', slug)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      setQuestions(!qErr && qs ? qs : []);
      setLoading(false);
    };

    load();
  }, [slug, user]);

  const total = questions.length;

  const score = useMemo(() => {
    if (!submitted || total === 0) return 0;
    let correct = 0;
    for (const q of questions) {
      const pick = selected[q.id];
      if (pick === q.correct_index) correct++;
    }
    return Math.round((correct / total) * 100);
  }, [submitted, questions, selected, total]);

  const passed = submitted ? score >= passingScore : false;

  const current = questions[idx];

  const onPick = (qId: string, choiceIndex: number) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qId]: choiceIndex }));
  };

  const canGoNext = submitted || (current && selected[current.id] !== undefined);

  const submitQuiz = async () => {
    if (!user || total === 0) return;
    setSubmitted(true);

    // Save attempt
    setSaving(true);
    const answers = questions.map((q) => ({
      question_id: q.id,
      selected_index: selected[q.id] ?? null,
      correct_index: q.correct_index,
      is_correct: (selected[q.id] ?? -1) === q.correct_index,
    }));

    const { error } = await supabase.from('training_attempts').insert({
      module_slug: slug,
      score,
      passed: score >= passingScore,
      answers,
    });

    // ignore insert errors for UI (RLS or table mismatch), but keep user informed if needed
    if (error) {
      // You can surface this if you want:
      // console.error(error);
    }

    setSaving(false);
  };

  const resetQuiz = () => {
    setIdx(0);
    setSelected({});
    setSubmitted(false);
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
          <p className="mt-2 text-sm text-slate-600">This module may be inactive or missing.</p>
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
        {/* Top bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/training" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              ← Back to dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">{module.title}</h1>
            {module.description ? (
              <p className="mt-1 text-sm text-slate-600">{module.description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1">
              {module.level || 'All levels'}
            </span>
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1">
              {module.duration || 'Self-paced'}
            </span>
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1">
              Passing score: {passingScore}%
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar outline */}
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
                  <span className="text-slate-900">
                    {i + 1}. {o.title}
                  </span>
                  <span className={clsx('text-xs font-semibold', o.done ? 'text-emerald-700' : 'text-slate-400')}>
                    {o.done ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            {submitted ? (
              <div className={clsx('mt-4 rounded-xl border px-3 py-3', passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50')}>
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

          {/* Main content */}
          <section className="space-y-6">
            {/* Video lesson */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">Lesson video</h2>
                <button
                  onClick={() => setVideoDone(true)}
                  className={clsx(
                    'rounded-md px-3 py-2 text-xs font-semibold',
                    videoDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  )}
                >
                  {videoDone ? 'Completed ✓' : 'Mark as watched'}
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-black">
                {videoUrl ? (
                  <video
                    key={videoUrl}
                    controls
                    className="w-full h-auto"
                    preload="metadata"
                  >
                    <source src={videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-200">
                    Video not available yet.
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Tip: Watch the full lesson before starting the quiz.
              </p>
            </div>

            {/* Quiz */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">Quiz</h2>
                <p className="text-xs text-slate-500">
                  {total ? `${Math.min(idx + 1, total)}/${total}` : 'No questions yet'}
                </p>
              </div>

              {!videoDone ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700">
                    Please complete the video lesson first to unlock the quiz.
                  </p>
                </div>
              ) : total === 0 ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700">No quiz questions are available for this module yet.</p>
                </div>
              ) : (
                <>
                  {/* question card */}
                  <div className="mt-4 rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-900">{current.prompt}</p>

                    <div className="mt-3 space-y-2">
                      {current.choices.map((c, i) => {
                        const pick = selected[current.id];
                        const isPicked = pick === i;
                        const isCorrect = i === current.correct_index;

                        const showResult = submitted;
                        const style = showResult
                          ? isCorrect
                            ? 'border-emerald-300 bg-emerald-50'
                            : isPicked
                              ? 'border-amber-300 bg-amber-50'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          : isPicked
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50';

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onPick(current.id, i)}
                            className={clsx(
                              'w-full text-left rounded-lg border px-3 py-2 text-sm transition',
                              style
                            )}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && current.explanation ? (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                        <span className="font-semibold">Explanation:</span> {current.explanation}
                      </div>
                    ) : null}
                  </div>

                  {/* nav buttons */}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setIdx((v) => Math.max(0, v - 1))}
                      disabled={idx === 0}
                      className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {idx < total - 1 ? (
                      <button
                        type="button"
                        onClick={() => setIdx((v) => Math.min(total - 1, v + 1))}
                        disabled={!canGoNext}
                        className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submitQuiz}
                        disabled={submitted || saving}
                        className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving…' : submitted ? 'Submitted' : 'Submit quiz'}
                      </button>
                    )}
                  </div>

                  {/* final result */}
                  {submitted ? (
                    <div className={clsx('mt-4 rounded-xl border px-4 py-3', passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50')}>
                      <p className="text-sm font-semibold text-slate-900">
                        {passed ? 'You passed! ✅' : 'Not passed yet. Try again. ⚠️'}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        Score: <span className="font-semibold">{score}%</span> (Passing: {passingScore}%)
                      </p>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Link
                          href="/training"
                          className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Back to dashboard
                        </Link>

                        <button
                          type="button"
                          onClick={resetQuiz}
                          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Retake quiz
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
