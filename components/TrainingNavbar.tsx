'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { publicPath } from '@/lib/publicPath';
import { useAuth } from '@/app/providers';

const LOGO_SRC = publicPath('/images/logo.png');

export default function TrainingNavbar() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Active path (handles GitHub Pages basePath)
  const rawPath = usePathname() || '/';
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pathname =
    base && rawPath.startsWith(base) ? rawPath.slice(base.length) || '/' : rawPath;

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const close = () => setMobileOpen(false);

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="container py-4 min-h-[64px] flex items-center justify-between">
        {/* Training logo -> dashboard */}
        <Link href="/training" aria-label="Training Dashboard" className="inline-flex items-center">
          <img
            src={LOGO_SRC}
            alt="GO123 Logistics"
            width={240}
            height={80}
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-3">
          <Link
            href="/training"
            className={clsx(
              'px-3 py-2 rounded-full text-sm hover:bg-slate-50',
              isActive('/training') && 'bg-emerald-50 text-emerald-700 font-semibold'
            )}
          >
            Dashboard
          </Link>

          <Link
            href="/training/resources"
            className={clsx(
              'px-3 py-2 rounded-full text-sm hover:bg-slate-50',
              isActive('/training/resources') && 'bg-emerald-50 text-emerald-700 font-semibold'
            )}
          >
            Resources
          </Link>

          <div className="ml-2 flex items-center gap-2">
            {!authLoading && !user ? (
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 shadow-soft"
              >
                Login
              </Link>
            ) : null}

            {!authLoading && user ? (
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-soft"
              >
                Logout
              </button>
            ) : null}
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          'md:hidden transition-[max-height,opacity] duration-200 overflow-hidden bg-white border-t border-slate-100',
          mobileOpen ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container py-3">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/training"
                onClick={close}
                className={clsx(
                  'block rounded-lg px-3 py-2',
                  isActive('/training') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
                )}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                href="/training/resources"
                onClick={close}
                className={clsx(
                  'block rounded-lg px-3 py-2',
                  isActive('/training/resources') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
                )}
              >
                Resources
              </Link>
            </li>

            {!authLoading && !user ? (
              <li className="pt-2">
                <Link
                  href="/login"
                  onClick={close}
                  className="inline-flex w-full items-center justify-center rounded-full border border-emerald-600 text-emerald-700 px-4 py-2 shadow-soft hover:bg-emerald-50"
                >
                  Login
                </Link>
              </li>
            ) : null}

            {!authLoading && user ? (
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    close();
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 text-slate-700 px-4 py-2 shadow-soft hover:bg-slate-50"
                >
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </header>
  );
}
