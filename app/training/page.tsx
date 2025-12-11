// app/training/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

type TrainingModule = {
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  duration: string | null;
};

export default function TrainingHomePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      const { data, error } = await supabase
        .from('training_modules')
        .select('slug, title, description, level, duration')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data) {
        setModules(data);
      }
      setLoadingModules(false);
    };

    if (user) {
      loadModules();
    } else {
      setLoadingModules(false);
    }
  }, [user]);

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
          <h1 className="text-xl font-semibold text-slate-900">
            Agent Training Portal
          </h1>
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
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Agent Training
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Welcome, {user.email}. Complete the modules below to stay certified.
            </p>
          </div>

          <button
            onClick={signOut}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Sign out
          </button>
        </header>

        {loadingModules ? (
          <p className="text-sm text-slate-500">Loading modules…</p>
        ) : modules.length === 0 ? (
          <p className="text-sm text-slate-500">
            No training modules are available yet.
          </p>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {modules.map((m) => (
              <article
                key={m.slug}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                    Course
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {m.title}
                  </h2>
                  {m.description && (
                    <p className="mt-2 text-sm text-slate-600">
                      {m.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{m.level || 'All levels'}</span>
                  <span>{m.duration || 'Self-paced'}</span>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/training/${m.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                  >
                    Start module
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
