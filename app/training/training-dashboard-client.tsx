'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order_index: number | null;
};

type AttemptRow = {
  module_id: string | null;
  module_slug: string | null;
  score: number | null;
  passed: boolean | null;
  created_at: string;
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
  const base =
    'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap';
  const styles =
    variant === 'passed'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : variant === 'inprogress'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-slate-200 bg-slate-50 text-slate-700';

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

  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      const [modsRes, attsRes] = await Promise.all([
        supabase
          .from('training_modules')
          .select('id,slug,title,description,order_index')
          .order('order_index', { ascending: true }),
        supabase
          .from('training_attempts')
          .select('module_id,module_slug,score,passed,created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(500),
      ]);

      if (cancelled) return;

      if (modsRes.error) {
        setError(modsRes.error.message);
        setModules([]);
        setAttempts([]);
        setLoading(false);
        return;
      }
      if (attsRes.error) {
        setError(attsRes.error.message);
        setModules(modsRes.data ?? []);
        setAttempts([]);
        setLoading(false);
        return;
      }

      setModules(modsRes.data ?? []);
      setAttempts(attsRes.data ?? []);
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const latestBySlug = useMemo(() => {
    const map = new Map<string, AttemptRow>();
    for (const a of attempts) {
      const slug = a.module_slug;
      if (!slug) continue;
      if (!map.has(slug)) map.set(slug, a); // attempts already newest-first
    }
    return map;
  }, [attempts]);

  const completedCount = useMemo(() => {
    return modules.filter((m) => latestBySlug.get(m.slug)?.passed).length;
  }, [modules, latestBySlug]);

  const progressPct = useMemo(() => {
    return modules.length ? Math.round((completedCount / modules.length) * 100) : 0;
  }, [completedCount, modules.length]);

  const remainingCount = Math.max(0, modules.length - completedCount);

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
                Complete modules at your own pace. Your latest score is shown for each module.
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
                <span className="font-medium text-slate-900">{completedCount}</span> / {modules.length} modules completed
              </span>
              <span>{progressPct}%</span>
            </div>

            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-emerald-600 transition-[width] duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
                aria-hidden="true"
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
        ) : modules.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">No modules yet</h2>
            <p className="mt-1 text-sm text-slate-600">Once modules are added, they’ll show up here automatically.</p>
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2">
            {modules.map((m) => {
              const latest = latestBySlug.get(m.slug);
              const passed = !!latest?.passed;
              const score = latest?.score ?? null;

              const statusVariant: 'passed' | 'inprogress' | 'notstarted' = latest
                ? passed
                  ? 'passed'
                  : 'inprogress'
                : 'notstarted';

              const actionLabel = latest ? 'Continue' : 'Start';

              return (
                <div
                  key={m.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-slate-900">{m.title}</h2>
                        <StatusPill variant={statusVariant}>
                          {statusVariant === 'passed'
                            ? 'Passed'
                            : statusVariant === 'inprogress'
                              ? 'In progress'
                              : 'Not started'}
                        </StatusPill>
                      </div>

                      {m.description ? (
                        <p className="mt-2 text-sm text-slate-600">{m.description}</p>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">Open this module to begin.</p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        {score !== null ? <span>Score: {score}%</span> : <span>No score yet</span>}
                        {latest?.created_at ? <span>• Last attempt: {formatShortDate(latest.created_at)}</span> : null}
                      </div>
                    </div>

                    <Link
                      href={`/training/${m.slug}`}
                      className="inline-flex shrink-0 items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
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
