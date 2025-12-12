'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

function getSiteBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

function getEmailRedirectTo() {
  // Send confirmations to a client route that will finalize session then redirect to /training
  const base = getSiteBasePath();
  return `${window.location.origin}${base}/auth/callback`;
}

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pwHints = useMemo(() => {
    const lenOk = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return { lenOk, hasLetter, hasNumber };
  }, [password]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    if (password !== confirm) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getEmailRedirectTo(),
      },
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    // Email confirmation ON: user created but no session yet
    if (data.user && !data.session) {
      setMessage(
        'Account created. Please check your email to confirm your address. After confirming, you will be redirected to Training.'
      );
      setSubmitting(false);
      return;
    }

    // Email confirmation OFF: session exists immediately
    router.push('/training');
    setSubmitting(false);
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Create Agent Account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Register with your company email to access GO123 Training.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="name@company.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>

            <input
              type={showPw ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-500">
              <Hint ok={pwHints.lenOk} label="8+ chars" />
              <Hint ok={pwHints.hasLetter} label="Letter" />
              <Hint ok={pwHints.hasNumber} label="Number" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm password</label>
            <input
              type={showPw ? 'text' : 'password'}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Hint({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`rounded-full px-2 py-1 text-center ${ok ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  );
}
