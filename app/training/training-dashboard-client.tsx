'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number | null;
  is_active: boolean;
};

type LessonRow = {
  id: string;
  module_id: string;
  module_slug: string | null;
  sort_order: number | null;
  is_active: boolean;
};

type LessonProgressRow = {
  lesson_id: string;
  passed: boolean;
  score: number;
  completed_at: string;
};

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
}

function StatusPill({
  variant,
  children,
}: {
  variant: 'passed' | 'inprogress' | 'notstarted';
  children: React.ReactNode;
}) {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium';

  const styles =
    variant === 'passed'
      ? 'border-slate-200 bg-slate-100 text-slate-800'
      : variant === 'inprogress'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-slate-200 bg-white text-slate-700';

  return <span className={`${base} ${styles}`}>{children}</span>;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-6 w-28 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-md bg-slate-200" />
      </div>
    </div>
  );
}

export default function TrainingDashboardClient() {
  const { user } = useAuth();
  const sp = useSearchParams();
  const refresh = sp.get('refresh');

  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const [modsRes, lessonsRes, progRes] = await Promise.all([
      supabase
        .from('training_modules')
        .select('id,slug,title,description,sort_order,is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('training_lessons')
        .select('id,module_id,module_slug,sort_order,is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('training_lesson_progress')
        .select('lesson_id,passed,score,completed_at')
        .eq('user_id', user.id)
        .limit(5000),
    ]);

    if (modsRes.error) {
      setError(modsRes.error.message);
      setModules([]);
      setLessons([]);
      setLessonProgress([]);
      setLoading(false);
      return;
    }
    if (lessonsRes.error) {
      setError(lessonsRes.error.message);
      setModules((modsRes.data ?? []) as ModuleRow[]);
      setLessons([]);
      setLessonProgress([]);
      setLoading(false);
      return;
    }
    if (progRes.error) {
      setError(progRes.error.message);
      setModules((modsRes.data ?? []) as ModuleRow[]);
      setLessons((lessonsRes.data ?? []) as LessonRow[]);
      setLessonProgress([]);
      setLoading(false);
      return;
    }

    setModules((modsRes.data ?? []) as ModuleRow[]);
    setLessons((lessonsRes.data ?? []) as LessonRow[]);
    setLessonProgress((progRes.data ?? []) as LessonProgressRow[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refresh]);

  useEffect(() => {
    if (!user) return;

    const onFocus = () => void load();
    const onVis = () => {
      if (document.visibilityState === 'visible') void load();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const lessonsByModuleId = useMemo(() => {
    const map = new Map<string, LessonRow[]>();
    for (const l of lessons) {
      const arr = map.get(l.module_id) ?? [];
      arr.push(l);
      map.set(l.module_id, arr);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      map.set(k, arr);
    }
    return map;
  }, [lessons]);

  const progByLessonId = useMemo(() => {
    const m = new Map<string, LessonProgressRow>();
    for (const p of lessonProgress) m.set(p.lesson_id, p);
    return m;
  }, [lessonProgress]);

  const moduleCards = useMemo(() => {
    return modules.map((m) => {
      const mLessons = lessonsByModuleId.get(m.id) ?? [];

      const attempted = mLessons.some((l) => progByLessonId.has(l.id));
      const passedCount = mLessons.filter((l) => progByLessonId.get(l.id)?.passed).length;

      const completed = mLessons.length > 0 && passedCount === mLessons.length;
      const inprogress = !completed && attempted;

      const statusVariant: 'passed' | 'inprogress' | 'notstarted' = completed
        ? 'passed'
        : inprogress
          ? 'inprogress'
          : 'notstarted';

      let latestDate: string | null = null;
      let latestScore: number | null = null;

      for (const l of mLessons) {
        const p = progByLessonId.get(l.id);
        if (!p) continue;
        if (!latestDate || new Date(p.completed_at).getTime() > new Date(latestDate).getTime()) {
          latestDate = p.completed_at;
          latestScore = p.score;
        }
      }

      return {
        ...m,
        statusVariant,
        completed,
        lessonsTotal: mLessons.length,
        lessonsPassed: passedCount,
        latestDate,
        latestScore,
      };
    });
  }, [modules, lessonsByModuleId, progByLessonId]);

  const completedCount = useMemo(() => moduleCards.filter((m) => m.completed).length, [moduleCards]);
  const progressPct = useMemo(
    () => (moduleCards.length ? Math.round((completedCount / moduleCards.length) * 100) : 0),
    [completedCount, moduleCards.length]
  );
  const remainingCount = Math.max(0, moduleCards.length - completedCount);

  if (!user) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Training</h1>
            <p className="mt-1 text-sm text-slate-600">Please sign in to view your training dashboard.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-slate-900">Agent Training</h1>
              <p className="mt-1 text-sm text-slate-600">
                Complete modules at your own pace. Progress updates after each lesson quiz.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-600">Completed</p>
                <p className="text-sm font-semibold text-slate-900">{completedCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-600">Remaining</p>
                <p className="text-sm font-semibold text-slate-900">{remainingCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-600">Progress</p>
                <p className="text-sm font-semibold text-slate-900">{progressPct}%</p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                <span className="font-medium text-slate-900">{completedCount}</span> / {moduleCards.length} modules completed
              </span>
              <span>{progressPct}%</span>
            </div>

            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-slate-900 transition-[width] duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Couldn’t load training data: <span className="font-medium">{error}</span>
            </div>
          ) : null}
        </header>

        {loading ? (
          <section className="grid gap-4 sm:grid-cols-2" aria-live="polite">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </section>
        ) : moduleCards.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">No modules yet</h2>
            <p className="mt-1 text-sm text-slate-600">Once modules are added, they’ll show up here.</p>
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2">
            {moduleCards.map((m) => {
              const label =
                m.statusVariant === 'passed'
                  ? 'Completed'
                  : m.statusVariant === 'inprogress'
                    ? 'In progress'
                    : 'Not started';

              const actionLabel = m.statusVariant === 'notstarted' ? 'Start module' : 'Continue';

              return (
                <div
                  key={m.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="min-w-0 text-base font-semibold text-slate-900">
                          {m.title}
                        </h2>
                        <StatusPill variant={m.statusVariant}>{label}</StatusPill>
                      </div>

                      {m.description ? (
                        <p className="mt-2 text-sm text-slate-600">{m.description}</p>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">Open this module to begin.</p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>
                          Lessons: {m.lessonsPassed}/{m.lessonsTotal || 0} passed
                        </span>
                        {m.latestScore !== null ? <span>• Latest score: {m.latestScore}%</span> : null}
                        {m.latestDate ? <span>• Last attempt: {formatShortDate(m.latestDate)}</span> : null}
                      </div>
                    </div>

                    <Link
                      href={`/training/${m.slug}`}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      {actionLabel}
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
