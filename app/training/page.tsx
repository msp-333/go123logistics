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
  level: string | null;
  duration: string | null;
  sort_order: number | null;
  is_active: boolean;
};

type LessonRow = {
  id: string;
  module_id: string | null;
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

function clampStyle(lines: number) {
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    WebkitLineClamp: lines,
    overflow: 'hidden',
  };
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export default function TrainingHomePage() {
  const { user, loading: authLoading } = useAuth();
  const sp = useSearchParams();
  const refresh = sp.get('refresh'); // module page can send you back with ?refresh=...

  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [progress, setProgress] = useState<LessonProgressRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;

    setLoadingData(true);
    setError(null);

    const [modsRes, lessonsRes, progRes] = await Promise.all([
      supabase
        .from('training_modules')
        .select('id,slug,title,description,level,duration,sort_order,is_active')
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
      setProgress([]);
      setLoadingData(false);
      return;
    }
    if (lessonsRes.error) {
      setError(lessonsRes.error.message);
      setModules((modsRes.data ?? []) as ModuleRow[]);
      setLessons([]);
      setProgress([]);
      setLoadingData(false);
      return;
    }
    if (progRes.error) {
      setError(progRes.error.message);
      setModules((modsRes.data ?? []) as ModuleRow[]);
      setLessons((lessonsRes.data ?? []) as LessonRow[]);
      setProgress([]);
      setLoadingData(false);
      return;
    }

    setModules((modsRes.data ?? []) as ModuleRow[]);
    setLessons((lessonsRes.data ?? []) as LessonRow[]);
    setProgress((progRes.data ?? []) as LessonProgressRow[]);
    setLoadingData(false);
  };

  useEffect(() => {
    if (user) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refresh]);

  // refresh when user returns to tab
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

  const progressByLessonId = useMemo(() => {
    const m = new Map<string, LessonProgressRow>();
    for (const p of progress) m.set(p.lesson_id, p);
    return m;
  }, [progress]);

  const lessonsByModuleId = useMemo(() => {
    const map = new Map<string, LessonRow[]>();
    for (const l of lessons) {
      if (!l.module_id) continue;
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

  const lessonsByModuleSlug = useMemo(() => {
    const map = new Map<string, LessonRow[]>();
    for (const l of lessons) {
      if (!l.module_slug) continue;
      const arr = map.get(l.module_slug) ?? [];
      arr.push(l);
      map.set(l.module_slug, arr);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      map.set(k, arr);
    }
    return map;
  }, [lessons]);

  const moduleCards = useMemo(() => {
    return modules.map((m) => {
      // Prefer module_id mapping; fallback to slug mapping if needed
      const byId = lessonsByModuleId.get(m.id) ?? [];
      const bySlug = lessonsByModuleSlug.get(m.slug) ?? [];
      const mLessons = byId.length ? byId : bySlug;

      const attempted = mLessons.some((l) => progressByLessonId.has(l.id));
      const passedCount = mLessons.filter((l) => progressByLessonId.get(l.id)?.passed).length;
      const total = mLessons.length;

      const completed = total > 0 && passedCount === total;
      const inprogress = !completed && attempted;

      let latestDate: string | null = null;
      let latestScore: number | null = null;

      for (const l of mLessons) {
        const p = progressByLessonId.get(l.id);
        if (!p?.completed_at) continue;
        if (!latestDate || new Date(p.completed_at).getTime() > new Date(latestDate).getTime()) {
          latestDate = p.completed_at;
          latestScore = p.score;
        }
      }

      const status = completed ? 'completed' : inprogress ? 'inprogress' : 'notstarted';

      return {
        ...m,
        status,
        lessonsTotal: total,
        lessonsPassed: passedCount,
        latestDate,
        latestScore,
      };
    });
  }, [modules, lessonsByModuleId, lessonsByModuleSlug, progressByLessonId]);

  const completedCount = useMemo(
    () => moduleCards.filter((m) => m.status === 'completed').length,
    [moduleCards]
  );

  const progressPct = useMemo(() => {
    if (!moduleCards.length) return 0;
    return Math.round((completedCount / moduleCards.length) * 100);
  }, [completedCount, moduleCards.length]);

  if (authLoading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Checking your session...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h1 className="text-xl font-semibold text-slate-900">Agent Training Portal</h1>
          <p className="mt-2 text-sm text-slate-600">Please sign in to access GO123 training courses.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Training Dashboard</h1>
          <p className="text-sm text-slate-600">
            Welcome, {user.email}. Track your training progress below.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Progress: <span className="font-semibold text-slate-900">{completedCount}</span> /{' '}
              {moduleCards.length} modules passed
            </p>
            <p className="text-sm font-semibold text-slate-900">{progressPct}%</p>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-emerald-600" style={{ width: `${progressPct}%` }} />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Tip: Passing each module requires completing the quiz successfully.
          </p>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Couldn’t load training data: <span className="font-semibold">{error}</span>
            </div>
          ) : null}
        </section>

        {loadingData ? (
          <p className="text-sm text-slate-500">Loading your dashboard...</p>
        ) : moduleCards.length === 0 ? (
          <p className="text-sm text-slate-500">No training modules are available yet.</p>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {moduleCards.map((m) => {
              const completed = m.status === 'completed';
              const inprogress = m.status === 'inprogress';

              const statusLabel = completed ? 'Completed' : inprogress ? 'In progress' : 'Not started';
              const statusClass = completed
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : inprogress
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : 'border-slate-200 bg-white text-slate-700';

              const buttonLabel = completed ? 'Review' : inprogress ? 'Continue' : 'Start module';

              return (
                <article
                  key={m.slug}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Course
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-slate-900 leading-snug" style={clampStyle(2)}>
                        {m.title}
                      </h2>

                      <p
                        className="mt-2 text-sm text-slate-600 leading-relaxed break-words"
                        style={clampStyle(3)}
                      >
                        {m.description || 'Open this module to begin.'}
                      </p>
                    </div>

                    <span
                      className={clsx(
                        'shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold',
                        statusClass
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                      {m.level || 'Beginner'}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                      {m.duration || 'Self-paced'}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                      Lessons: {m.lessonsPassed}/{m.lessonsTotal || 0} passed
                    </span>
                  </div>

                  {(m.latestScore !== null && m.latestScore !== undefined) || m.latestDate ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {m.latestScore !== null && m.latestScore !== undefined ? (
                        <span>Latest score: {m.latestScore}%</span>
                      ) : null}
                      {m.latestDate ? <span>• Last attempt: {formatShortDate(m.latestDate)}</span> : null}
                    </div>
                  ) : null}

                  <div className="mt-5">
                    <Link
                      href={`/training/${m.slug}`}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      {buttonLabel}
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function clsx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
