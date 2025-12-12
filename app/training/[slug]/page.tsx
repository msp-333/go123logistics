// app/training/[slug]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import clsx from 'clsx';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type Lesson = {
  id: string;
  module_slug: string;
  title: string;
  sort_order: number;
  video_path: string | null;
  content: string | null;
};

type Choice = {
  id: string;
  choice_text: string;
  is_correct: boolean;
  sort_order: number;
};

type Question = {
  id: string;
  module_slug: string;
  question: string;
  sort_order: number;
  explanation: string | null;
  choices: Choice[];
};

const BUCKET = 'training-videos'; // <-- change if your bucket name differs
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

export default function TrainingModulePage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const slug = String(params?.slug || '');

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const activeLesson = useMemo(
    () => lessons.find((l) => l.id === activeLessonId) || lessons[0] || null,
    [lessons, activeLessonId]
  );

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // quiz state: questionId -> choiceId
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      setLoading(true);

      const { data: lessonData, error: lessonErr } = await supabase
        .from('training_lessons')
        .select('id, module_slug, title, sort_order, video_path, content')
        .eq('module_slug', slug)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      const { data: qData, error: qErr } = await supabase
        .from('training_questions')
        .select(
          `
          id,
          module_slug,
          question,
          sort_order,
          explanation,
          training_question_choices (
            id,
            choice_text,
            is_correct,
            sort_order
          )
        `
        )
        .eq('module_slug', slug)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (lessonErr) console.error(lessonErr);
      if (qErr) console.error(qErr);

      const mappedQuestions: Question[] =
        (qData || []).map((q: any) => ({
          id: q.id,
          module_slug: q.module_slug,
          question: q.question,
          sort_order: q.sort_order,
          explanation: q.explanation,
          choices: (q.training_question_choices || [])
            .slice()
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        })) || [];

      setLessons((lessonData as Lesson[]) || []);
      setQuestions(mappedQuestions);
      setActiveLessonId(((lessonData as Lesson[])?.[0]?.id as string) || null);

      setLoading(false);
    };

    load();
  }, [slug]);

  // signed URL for active lesson
  useEffect(() => {
    const run = async () => {
      setVideoUrl(null);
      setVideoError(null);

      if (!activeLesson?.video_path) return;

      setVideoLoading(true);
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(activeLesson.video_path, SIGNED_URL_TTL_SECONDS);

      if (error || !data?.signedUrl) {
        setVideoError(error?.message || 'Could not load video.');
        setVideoLoading(false);
        return;
      }

      setVideoUrl(data.signedUrl);
      setVideoLoading(false);
    };

    run();
  }, [activeLesson?.video_path]);

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

  return (
    <main className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Course</p>
            <h1 className="mt-1 text-lg font-semibold text-slate-900">{slug.replaceAll('-', ' ')}</h1>
            <p className="mt-1 text-xs text-slate-500">Select a lesson to start.</p>
          </div>

          <div className="p-2">
            {lessons.length === 0 ? (
              <p className="p-3 text-sm text-slate-500">No lessons found.</p>
            ) : (
              <ul className="space-y-1">
                {lessons.map((l) => {
                  const active = l.id === activeLesson?.id;
                  return (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveLessonId(l.id);
                          setSubmitted(false);
                        }}
                        className={clsx(
                          'w-full text-left rounded-xl px-3 py-2 transition',
                          active
                            ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={clsx(
                              'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                              active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {l.sort_order ?? 0}
                          </span>
                          <span className="text-sm font-medium">{l.title}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Main */}
        <section className="space-y-6">
          {/* Video Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {activeLesson?.title || 'Lesson'}
              </h2>
              {activeLesson?.content ? (
                <p className="mt-1 text-sm text-slate-600">{activeLesson.content}</p>
              ) : null}
            </div>

            <div className="p-4">
              {videoLoading ? (
                <p className="text-sm text-slate-500">Loading video…</p>
              ) : videoError ? (
                <p className="text-sm text-red-600">{videoError}</p>
              ) : videoUrl ? (
                <video
                  key={videoUrl}
                  controls
                  playsInline
                  className="w-full rounded-xl bg-black"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p className="text-sm text-slate-500">No video attached to this lesson.</p>
              )}
            </div>
          </div>

          {/* Quiz */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Quiz</h3>
              <p className="mt-1 text-sm text-slate-600">
                Answer the questions below to complete this module.
              </p>
            </div>

            <div className="p-4 space-y-5">
              {questions.length === 0 ? (
                <p className="text-sm text-slate-500">No quiz questions yet.</p>
              ) : (
                <>
                  {questions.map((q, idx) => {
                    const picked = answers[q.id];
                    const correctChoice = q.choices.find((c) => c.is_correct);
                    const isCorrect = submitted && picked && picked === correctChoice?.id;

                    return (
                      <div key={q.id} className="rounded-xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {idx + 1}. {q.question}
                        </p>

                        <div className="mt-3 grid gap-2">
                          {q.choices.map((c) => {
                            const checked = picked === c.id;

                            const showState =
                              submitted &&
                              (c.is_correct
                                ? 'border-emerald-300 bg-emerald-50'
                                : checked
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200');

                            return (
                              <label
                                key={c.id}
                                className={clsx(
                                  'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition',
                                  submitted ? showState : 'hover:bg-slate-50 border-slate-200'
                                )}
                              >
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  className="mt-1"
                                  disabled={submitted}
                                  checked={checked}
                                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: c.id }))}
                                />
                                <span className="text-sm text-slate-700">{c.choice_text}</span>
                              </label>
                            );
                          })}
                        </div>

                        {submitted ? (
                          <div className="mt-3">
                            <p className={clsx('text-sm font-medium', isCorrect ? 'text-emerald-700' : 'text-red-700')}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </p>
                            {q.explanation ? (
                              <p className="mt-1 text-sm text-slate-600">{q.explanation}</p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({});
                        setSubmitted(false);
                      }}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmitted(true)}
                      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                    >
                      Submit quiz
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
