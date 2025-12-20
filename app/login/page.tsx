// app/login/page.tsx
'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace('/training');
  }, [loading, user, router]);

  const canSubmit = useMemo(() => {
    return !loading && !submitting && email.trim().length > 0 && password.length > 0;
  }, [loading, submitting, email, password]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      // Make the most common message a bit friendlier
      const msg =
        error.message.toLowerCase().includes('invalid login credentials')
          ? 'Incorrect email or password. Please try again.'
          : error.message;

      setError(msg);
      setSubmitting(false);
      return;
    }

    router.replace('/training');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
          {/* Left: Info panel */}
          <section className="rounded-2xl border border-slate-200 bg-white/70 p-7 shadow-sm backdrop-blur">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Secure Training Portal
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              GO123 Agent Training
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sign in to access training modules, quizzes, and resources. If you’re a customer
              looking for help, use Contact Us instead.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-500" />
                <p>Structured modules with video lessons and knowledge checks</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-500" />
                <p>Track progress and re-take quizzes to improve your score</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-500" />
                <p>Quick resource downloads for day-to-day agent work</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Contact Us
              </Link>
              <div className="text-xs text-slate-500 sm:ml-auto sm:self-center">
                Trouble signing in? Contact your admin.
              </div>
            </div>
          </section>

          {/* Right: Login form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Agent Login</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Use your assigned credentials to continue.
                </p>
              </div>
              <div className="hidden rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 md:block">
                /training
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M11 7h2v6h-2V7zm0 8h2v2h-2v-2zm1-13C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z"
                      />
                    </svg>
                  </div>
                  <div className="leading-6">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@go123.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute inset-y-0 right-2 my-auto inline-flex h-9 items-center justify-center rounded-lg px-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Spinner />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                By continuing, you agree to follow company training guidelines.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
