'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type TrainingModule = {
  id?: string;
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  duration: string | null;
};

type TrainingAttempt = {
  module_slug: string | null;
  score: number | null;          // store 0-100 if you have it
  passed: boolean | null;
  created_at: string;
};

export default function TrainingHomePage() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [attempts, setAttempts] = useState<TrainingAttempt[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      setLoadingData(true);

      const [modsRes, attemptsRes] = await Promise.all([
        supabase
          .from('training_modules')
          .select('slug, title, description, level, duration')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),

        supabase
          .from('training_attempts')
          .select('module_slug, score, passed, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (!modsRes.error && modsRes.data) setModules(modsRes.data);
      if (!attemptsRes.error && attemptsRes.data) setAttempts(attemptsRes.data);

      setLoadingData(false);
    };

    if (user) void load();
  }, [user]);

  const latestBySlug = useMemo(() => {
    const map = new Map<string, TrainingAttempt>();
    for (const a of attempts) {
      const slug = a.module_slug;
      if (!slug) continue;
      if (!map.has(slug)) map.set(slug, a); // attempts are sorted newest-first
    }
    return map;
  }, [attempts]);

  const completedCount = useMemo(() => {
    return modules.filter((m) => latestBySlug.get(m.slug)?.passed).length;
  }, [modules, latestBySlug]);

  const progressPct = useMemo(() => {
    if (!modules.length) return 0;
    return Math.round((completedCount / modules.length) * 100);
  }, [completedCount, modules.length]);

  if (authLoading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Checking your session…</p>
      </main>
    );
  }

  // ✅ Public users see ONLY the login prompt (no modules visible)
  if (!user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h1 className="text-xl font-semibold text-slate-900">Agent Training Portal</h1>
          <p className="mt-2 text-sm text-slate-600">
            Please sign in to access GO123 training courses.
          </p>
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

  return (
    <main className="bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Training Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Welcome, {user.email}. Track your training progress below.
            </p>
          </div>

          <button
            onClick={signOut}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Sign out
          </button>
        </header>

        {/* Progress card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Progress:{' '}
              <span className="font-semibold text-slate-900">{completedCount}</span> / {modules.length} modules passed
            </p>
            <p className="text-sm font-medium text-slate-900">{progressPct}%</p>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-emerald-600" style={{ width: `${progressPct}%` }} />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Tip: Passing each module requires completing the quiz successfully.
          </p>
        </section>

        {/* Modules */}
        {loadingData ? (
          <p className="text-sm text-slate-500">Loading your dashboard…</p>
        ) : modules.length === 0 ? (
          <p className="text-sm text-slate-500">No training modules are available yet.</p>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {modules.map((m) => {
              const latest = latestBySlug.get(m.slug);
              const passed = !!latest?.passed;
              const attempted = !!latest;
              const score = latest?.score ?? null;

              let statusLabel = 'Not started';
              let statusClass = 'bg-slate-100 text-slate-700';
              let buttonLabel = 'Start module';

              if (attempted && !passed) {
                statusLabel = 'Needs retry';
                statusClass = 'bg-amber-100 text-amber-800';
                buttonLabel = 'Continue / Retry';
              }

              if (passed) {
                statusLabel = 'Passed';
                statusClass = 'bg-emerald-100 text-emerald-800';
                buttonLabel = 'Review';
              }

              return (
                <article
                  key={m.slug}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Course</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">{m.title}</h2>
                      {m.description && <p className="mt-2 text-sm text-slate-600">{m.description}</p>}
                    </div>

                    <span className={clsx('shrink-0 rounded-full px-3 py-1 text-xs font-medium', statusClass)}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {m.level || 'All levels'}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {m.duration || 'Self-paced'}
                    </span>
                    {score !== null ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1">Last score: {score}%</span>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/training/${m.slug}`}
                      className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
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

// small local helper
function clsx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
