'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';
import clsx from 'clsx';

type ModuleOpt = { slug: string; title: string; sort_order: number | null };

type AdminRow = {
  user_id: string;
  email: string | null;
  module_id: string;
  module_slug: string;
  module_title: string;
  module_sort_order: number | null;
  started_at: string | null;
  completed_at: string | null;
  time_spent_seconds: number;
  lessons_total: number;
  lessons_passed: number;
  last_lesson_completed_at: string | null;
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

function fmtMins(seconds: number) {
  const mins = seconds / 60;
  return `${mins.toFixed(1)} min`;
}

export default function AdminTrainingProgressPage() {
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [modules, setModules] = useState<ModuleOpt[]>([]);
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [query, setQuery] = useState('');
  const [moduleSlug, setModuleSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;

    setLoading(true);
    setErr(null);

    const adminRes = await supabase.rpc('is_admin');
    if (adminRes.error) {
      setErr(adminRes.error.message);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const ok = !!adminRes.data;
    setIsAdmin(ok);

    if (!ok) {
      setRows([]);
      setLoading(false);
      return;
    }

    const [modsRes, progRes] = await Promise.all([
      supabase
        .from('training_modules')
        .select('slug,title,sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase.rpc('admin_training_progress', {
        p_query: query.trim() ? query.trim() : null,
        p_module_slug: moduleSlug ? moduleSlug : null,
        p_limit: 800,
        p_offset: 0,
      }),
    ]);

    if (modsRes.error) {
      setErr(modsRes.error.message);
      setLoading(false);
      return;
    }
    setModules((modsRes.data ?? []) as ModuleOpt[]);

    if (progRes.error) {
      setErr(progRes.error.message);
      setLoading(false);
      return;
    }

    setRows((progRes.data ?? []) as AdminRow[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  // reload when filters change (debounced-ish)
  useEffect(() => {
    if (!user || isAdmin !== true) return;
    const t = setTimeout(() => void load(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, moduleSlug]);

  const grouped = useMemo(() => {
    const m = new Map<string, { email: string | null; items: AdminRow[] }>();
    for (const r of rows) {
      const k = r.user_id;
      const cur = m.get(k) ?? { email: r.email, items: [] };
      cur.email = cur.email ?? r.email;
      cur.items.push(r);
      m.set(k, cur);
    }
    // sort each user’s items by module sort order
    for (const v of m.values()) {
      v.items.sort((a, b) => (a.module_sort_order ?? 0) - (b.module_sort_order ?? 0));
    }
    return Array.from(m.entries()).map(([user_id, v]) => ({ user_id, ...v }));
  }, [rows]);

  if (authLoading) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl text-sm text-slate-600">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-700">Please sign in.</p>
          <div className="mt-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Go to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Admin • Training Progress</h1>
              <p className="mt-1 text-sm text-slate-600">
                View time spent and completion dates per user and module.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/training"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Back to Training
              </Link>
            </div>
          </div>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Search user</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="email or user id"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Filter module</label>
              <select
                value={moduleSlug}
                onChange={(e) => setModuleSlug(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">All modules</option>
                {modules.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading admin report...
          </div>
        ) : isAdmin === false ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-700">
              You’re signed in, but you are <b>not</b> an admin.
            </p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-700">No results.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map((g) => {
              const completedModules = g.items.filter(
                (r) => r.lessons_total > 0 && r.lessons_passed === r.lessons_total
              ).length;

              const totalSeconds = g.items.reduce((acc, r) => acc + (r.time_spent_seconds || 0), 0);

              return (
                <section key={g.user_id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 break-words">
                        {g.email || g.user_id}
                      </p>
                      <p className="text-xs text-slate-500 break-words">{g.user_id}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                        Modules completed: <b>{completedModules}</b>
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                        Total time: <b>{fmtMins(totalSeconds)}</b>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="text-xs text-slate-500">
                          <th className="py-2 pr-4">Module</th>
                          <th className="py-2 pr-4">Lessons</th>
                          <th className="py-2 pr-4">Time</th>
                          <th className="py-2 pr-4">Started</th>
                          <th className="py-2 pr-4">Completed</th>
                          <th className="py-2 pr-0">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.items.map((r) => {
                          const done = r.lessons_total > 0 && r.lessons_passed === r.lessons_total;
                          const inProgress =
                            !done && (r.lessons_passed > 0 || r.time_spent_seconds > 0 || !!r.started_at);

                          const status = done ? 'Completed' : inProgress ? 'In progress' : 'Not started';

                          return (
                            <tr key={r.module_id} className="border-t border-slate-100">
                              <td className="py-2 pr-4">
                                <div className="font-medium text-slate-900">{r.module_title}</div>
                                <div className="text-xs text-slate-500">{r.module_slug}</div>
                              </td>
                              <td className="py-2 pr-4 text-slate-700">
                                {r.lessons_passed}/{r.lessons_total}
                              </td>
                              <td className="py-2 pr-4 text-slate-700">{fmtMins(r.time_spent_seconds || 0)}</td>
                              <td className="py-2 pr-4 text-slate-700">{fmtDate(r.started_at)}</td>
                              <td className="py-2 pr-4 text-slate-700">{fmtDate(r.completed_at)}</td>
                              <td className="py-2 pr-0">
                                <span
                                  className={clsx(
                                    'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
                                    done
                                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                      : inProgress
                                        ? 'border-amber-200 bg-amber-50 text-amber-800'
                                        : 'border-slate-200 bg-white text-slate-700'
                                  )}
                                >
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
