// app/training/[slug]/TrainingModuleClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type Question = {
  id: string;
  order_index: number;
  prompt: string;
  options: string[];
  correct_index: number;
};

type TrainingModule = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  duration: string | null;
  video_url: string | null;
  passing_score: number | null;
  questions: Question[];
};

const DEFAULT_PASSING_SCORE = 80;

export default function TrainingModuleClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [module, setModule] = useState<TrainingModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadModule = async () => {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from('training_modules')
        .select(
          `
          id,
          slug,
          title,
          description,
          level,
          duration,
          video_url,
          passing_score,
          questions:training_questions (
            id,
            order_index,
            prompt,
            options,
            correct_index
          )
        `
        )
        .eq('slug', slug)
        .order('order_index', {
          ascending: true,
          referencedTable: 'training_questions',
        })
        .maybeSingle();

      if (error) {
        setLoadError(error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setLoadError('Module not found.');
        setLoading(false);
        return;
      }

      const mod: TrainingModule = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        level: data.level,
        duration: data.duration,
        video_url: data.video_url,
        passing_score: data.passing_score ?? DEFAULT_PASSING_SCORE,
        questions: data.questions ?? [],
      };

      setModule(mod);
      setLoading(false);
    };

    loadModule();
  }, [slug]);

  const onSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!module || submitted) return;

    const questions = module.questions;
    if (!questions.length) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_index) correctCount += 1;
    });

    const pct = Math.round((correctCount / questions.length) * 100);
    const required = module.passing_score ?? DEFAULT_PASSING_SCORE;
    const didPass = pct >= required;

    setScore(pct);
    setPassed(didPass);
    setSubmitted(true);

    if (user) {
      try {
        setSaving(true);
        await supabase.from('training_attempts').insert({
          user_id: user.id,
          module_id: module.id,
          module_slug: module.slug,
          score: pct,
          passed: didPass,
        });
      } catch {
        // ignore saving error
      } finally {
        setSaving(false);
      }
    }
  };

  const allAnswered =
    module &&
    module.questions.length > 0 &&
    module.questions.every(
      (q) =>
        answers[q.id] !== undefined &&
        answers[q.id] !== null
    );

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading module…</p>
      </main>
    );
  }

  if (loadError || !module) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-600">
            {loadError || 'Module not found.'}
          </p>
          <button
            onClick={() => router.push('/training')}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Back to training
          </button>
        </div>
      </main>
    );
  }

  const requiredScore = module.passing_score ?? DEFAULT_PASSING_SCORE;

  return (
    <main className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Module
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {module.title}
            </h1>
            {module.description && (
              <p className="mt-2 text-sm text-slate-600">
                {module.description}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              You must score at least {requiredScore}% to pass.
            </p>
          </div>

          <button
            onClick={() => router.push('/training')}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            ← Back to training
          </button>
        </div>

        {/* Video */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
          <div className="aspect-video w-full">
            {module.video_url ? (
              <video controls className="h-full w-full">
                <source src={module.video_url} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-900 text-sm text-slate-200">
                Training video not configured for this module.
              </div>
            )}
          </div>
        </section>

        {/* Quiz */}
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Knowledge Check
          </h2>

          {module.questions.length === 0 ? (
            <p className="text-sm text-slate-500">
              No questions configured yet for this module.
            </p>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                Choose the best answer for each question. Your final score will
                decide if you pass this module.
              </p>

              <ol className="space-y-5">
                {module.questions.map((q, idx) => {
                  const selected = answers[q.id];
                  return (
                    <li key={q.id} className="space-y-3">
                      <p className="text-sm font-medium text-slate-900">
                        <span className="mr-2 text-slate-500">
                          {idx + 1}.
                        </span>
                        {q.prompt}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, optionIndex) => {
                          const isSelected = selected === optionIndex;
                          const isCorrect = q.correct_index === optionIndex;

                          let borderClasses = 'border-slate-200';
                          let bgClasses = 'bg-white';

                          if (submitted) {
                            if (isCorrect) {
                              borderClasses = 'border-emerald-500';
                              bgClasses = 'bg-emerald-50';
                            } else if (isSelected && !isCorrect) {
                              borderClasses = 'border-red-400';
                              bgClasses = 'bg-red-50';
                            }
                          } else if (isSelected) {
                            borderClasses = 'border-emerald-500';
                            bgClasses = 'bg-emerald-50';
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => onSelect(q.id, optionIndex)}
                              className={[
                                'flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition',
                                bgClasses,
                                borderClasses,
                                !submitted && 'hover:border-emerald-400',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              <span className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border border-slate-300 text-[10px]">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  {submitted && score !== null ? (
                    <>
                      <span className="font-medium text-slate-900">
                        Score: {score}% —{' '}
                        {passed ? (
                          <span className="text-emerald-600">Passed</span>
                        ) : (
                          <span className="text-red-600">Not passed</span>
                        )}
                      </span>
                      {saving && (
                        <span className="ml-2 text-xs text-slate-400">
                          Saving result…
                        </span>
                      )}
                    </>
                  ) : (
                    <>You must answer all questions before submitting.</>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!allAnswered || submitted}
                  onClick={handleSubmit}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submitted ? 'Submitted' : 'Submit answers'}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
