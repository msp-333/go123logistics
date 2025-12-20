// app/login/page.tsx
'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers';

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
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

  // ✅ Prevent scrolling while on login page
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

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
    <main className="fixed inset-0 overflow-hidden bg-slate-50 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Agent Login</h1>
        <p className="mt-1 text-sm text-slate-500">Use your assigned credentials to continue.</p>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
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
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#00986D] focus:ring-4 focus:ring-[#00986D]/15"
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#00986D] focus:ring-4 focus:ring-[#00986D]/15"
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00986D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00815D] focus:outline-none focus:ring-4 focus:ring-[#00986D]/20 disabled:cursor-not-allowed disabled:opacity-60"
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
    </main>
  );
}
