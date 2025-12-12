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

export default function TrainingDashboardClient() {
  const { user } = useAuth();

  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: mods } = await supabase
        .from('training_modules')
        .select('id,slug,title,description,order_index')
        .order('order_index', { ascending: true });

      const { data: atts } = await supabase
        .from('training_attempts')
        .select('module_id,module_slug,score,passed,created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      setModules(mods ?? []);
      setAttempts(atts ?? []);
      setLoading(false);
    };

    if (user) void load();
  }, [user]);

  const latestBySlug = useMemo(() => {
    const map = new Map<string, AttemptRow>();
    for (const a of attempts) {
      const slug = a.module_slug;
      if (!slug) continue;
      if (!map.has(slug)) map.set(slug, a);
    }
    return map;
  }, [attempts]);

  const completedCount = useMemo(() => {
    return modules.filter((m) => latestBySlug.get(m.slug)?.passed).length;
  }, [modules, latestBySlug]);

  const progressPct = modules.length ? Math.round((completedCount / modules.length) * 100) : 0;

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading training…</p>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Training Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Progress: <span className="font-medium text-slate-900">{completedCount}</span> / {modules.length} modules
          </p>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-emerald-600" style={{ width: `${progressPct}%` }} />
          </div>

          <p className="mt-2 text-xs text-slate-500">{progressPct}% complete</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {modules.map((m) => {
            const latest = latestBySlug.get(m.slug);
            const passed = !!latest?.passed;
            const score = latest?.score ?? null;

            return (
              <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{m.title}</h2>
                    {m.description && <p className="mt-1 text-sm text-slate-600">{m.description}</p>}
                    <p className="mt-2 text-xs text-slate-500">
                      Status:{' '}
                      {latest ? (
                        passed ? (
                          <span className="text-emerald-600 font-medium">Passed</span>
                        ) : (
                          <span className="text-red-600 font-medium">In progress / Not passed</span>
                        )
                      ) : (
                        <span className="text-slate-500">Not started</span>
                      )}
                      {score !== null ? <span className="ml-2">• Score: {score}%</span> : null}
                    </p>
                  </div>

                  <Link
                    href={`/training/${m.slug}`}
                    className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    {latest ? 'Continue' : 'Start'}
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
