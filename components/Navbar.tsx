'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/app/providers';

const LOGO_SRC = '/images/logo.png';

type NavbarProps = {
  /** static = normal flow (scrolls away). over-hero = sits on hero but still scrolls away (absolute). */
  placement?: 'static' | 'over-hero';
};

const publicPath = (p: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const path = p.startsWith('/') ? p : `/${p}`;
  return `${base}${path}`;
};

export default function Navbar({ placement = 'static' }: NavbarProps) {
  const { user, loading: authLoading, signOut } = useAuth();

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  const rawPath = usePathname() || '/';
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pathname =
    base && rawPath.startsWith(base) ? rawPath.slice(base.length) || '/' : rawPath;

  const isActive = (paths: string | string[]) => {
    const list = Array.isArray(paths) ? paths : [paths];
    return list.some((p) =>
      p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(`${p}/`)
    );
  };

  const closeAllMenus = () => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!desktopMenuRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeAllMenus();
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // White “inverted” glass feel (lets hero show through, keeps logo readable)
  const headerBg =
    "bg-[radial-gradient(800px_240px_at_12%_20%,rgba(16,185,129,0.14),transparent_60%),linear-gradient(to_right,rgba(255,255,255,0.86),rgba(255,255,255,0.72),rgba(255,255,255,0.38))]";

  const desktopLinkClass = (active: boolean) =>
    clsx(
      'relative rounded-md px-2 py-1 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
      // a touch bigger
      'text-[15px] md:text-[16px]',
      active ? 'text-slate-900' : 'text-slate-700 hover:text-slate-900'
    );

  const menuItemClass = (active: boolean) =>
    clsx(
      'flex items-center justify-between rounded-xl px-3 py-2 transition-colors',
      active
        ? 'bg-emerald-50 text-emerald-700 font-semibold'
        : 'hover:bg-slate-50 text-slate-700'
    );

  return (
    <header
      className={clsx(
        // NOT floating: no sticky, no fixed
        placement === 'over-hero' ? 'absolute inset-x-0 top-0 z-40' : 'relative z-40',
        'backdrop-blur-md border-b border-white/45',
        headerBg,
        'overflow-visible'
      )}
    >
      {/* thinner bar, but logo can “bleed” larger without increasing header height */}
      <div className="container h-[64px] md:h-[70px] flex items-center justify-between">
        {/* Logo (big) without making navbar tall */}
        <Link
          href="/"
          aria-label="Home"
          onClick={closeAllMenus}
          className="relative h-[44px] w-[200px] md:w-[240px] overflow-visible"
        >
          <img
            src={publicPath(LOGO_SRC)}
            alt="Company logo"
            width={560}
            height={180}
            className="
              absolute left-0 top-1/2 -translate-y-1/2
              h-[72px] sm:h-[78px] md:h-[88px] w-auto object-contain
              drop-shadow-[0_10px_25px_rgba(0,0,0,0.10)]
            "
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            onClick={closeAllMenus}
            aria-current={isActive('/') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/'))}
          >
            Home
            {isActive('/') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full bg-emerald-600" />
            ) : null}
          </Link>

          <Link
            href="/about"
            onClick={closeAllMenus}
            aria-current={isActive('/about') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/about'))}
          >
            About Us
            {isActive('/about') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full bg-emerald-600" />
            ) : null}
          </Link>

          <Link
            href="/blog"
            onClick={closeAllMenus}
            aria-current={isActive('/blog') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/blog'))}
          >
            Blog
            {isActive('/blog') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full bg-emerald-600" />
            ) : null}
          </Link>

          {/* Services dropdown */}
          <div ref={desktopMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              className={clsx(desktopLinkClass(isActive(['/services', '/shipping-guide'])), 'inline-flex items-center gap-2')}
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
            >
              Services
              <svg
                className={clsx('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>

            <div
              id="services-menu"
              role="menu"
              className={clsx(
                'absolute right-0 mt-3 w-[360px] rounded-2xl border border-slate-200/70 bg-white/96 backdrop-blur shadow-soft p-2 origin-top-right transition',
                servicesOpen ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
              )}
            >
              <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wide text-slate-500">
                Shipment
              </div>

              <Link
                href="/shipping-guide"
                onClick={closeAllMenus}
                aria-current={isActive('/shipping-guide') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/shipping-guide'))}
              >
                <span>Shipping Guide &amp; SCAC Codes</span>
                <span className="text-xs text-slate-400">Docs</span>
              </Link>

              <div className="px-3 pt-3 pb-1 text-xs uppercase tracking-wide text-slate-500">
                Freight Services
              </div>

              <Link
                href="/services/land-freight"
                onClick={closeAllMenus}
                aria-current={isActive('/services/land-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/land-freight'))}
              >
                <span>By Land</span>
                <span className="text-xs text-slate-400">Road + Rail</span>
              </Link>

              <Link
                href="/services/air-freight"
                onClick={closeAllMenus}
                aria-current={isActive('/services/air-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/air-freight'))}
              >
                <span>By Air</span>
                <span className="text-xs text-slate-400">Express</span>
              </Link>

              <Link
                href="/services/ocean-freight"
                onClick={closeAllMenus}
                aria-current={isActive('/services/ocean-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/ocean-freight'))}
              >
                <span>By Sea</span>
                <span className="text-xs text-slate-400">FCL / LCL</span>
              </Link>
            </div>
          </div>

          {/* Right-side CTAs (slightly bigger, more “industrial” feel) */}
          <div className="ml-2 flex items-center gap-2">
            <Link
              href="/contact"
              onClick={closeAllMenus}
              className="inline-flex items-center rounded-xl px-5 py-2.5 text-[15px] font-extrabold text-white
                bg-emerald-600 hover:bg-emerald-700 transition
                shadow-[0_12px_30px_rgba(16,185,129,0.18)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Contact Us
            </Link>

            {!authLoading && !user ? (
              <Link
                href="/login"
                onClick={closeAllMenus}
                className="inline-flex items-center rounded-xl px-5 py-2.5 text-[15px] font-extrabold
                  border border-slate-300 text-slate-800 bg-white/70 hover:bg-white transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Login
              </Link>
            ) : null}

            {!authLoading && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/training"
                  onClick={closeAllMenus}
                  className={clsx(
                    'inline-flex items-center rounded-xl px-5 py-2.5 text-[15px] font-extrabold border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                    isActive('/training')
                      ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                      : 'border-slate-300 text-slate-800 bg-white/70 hover:bg-white'
                  )}
                >
                  Training
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    closeAllMenus();
                  }}
                  className="inline-flex items-center rounded-xl px-5 py-2.5 text-[15px] font-extrabold
                    border border-slate-300 text-slate-800 bg-white/70 hover:bg-white transition
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 hover:bg-white/60
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={clsx(
          'md:hidden transition-[max-height,opacity] duration-200 overflow-hidden border-t border-white/45',
          headerBg,
          mobileOpen ? 'max-h-[720px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container py-3">
          <ul className="flex flex-col gap-1">
            <li>
              <Link href="/" onClick={closeAllMenus} className="block rounded-xl px-3 py-2 text-slate-800 hover:bg-white/60 font-semibold">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={closeAllMenus} className="block rounded-xl px-3 py-2 text-slate-800 hover:bg-white/60 font-semibold">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/blog" onClick={closeAllMenus} className="block rounded-xl px-3 py-2 text-slate-800 hover:bg-white/60 font-semibold">
                Blog
              </Link>
            </li>

            <li className="mt-1">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                aria-expanded={mobileServicesOpen}
                className="w-full inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-white/60 text-slate-800 font-semibold transition"
              >
                <span>Services</span>
                <svg className={clsx('h-4 w-4 transition-transform', mobileServicesOpen && 'rotate-180')} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </button>

              <div className={clsx('pl-3 ml-3 mt-1 space-y-1 overflow-hidden border-l border-white/50 transition-[max-height,opacity]', mobileServicesOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0')}>
                <Link href="/shipping-guide" onClick={closeAllMenus} className="block rounded-xl px-3 py-2 hover:bg-white/60 text-slate-800 font-semibold">
                  Shipping Guide &amp; SCAC Codes
                </Link>
                <Link href="/services/land-freight" onClick={closeAllMenus} className="block rounded-xl px-3 py-2 hover:bg-white/60 text-slate-800 font-semibold">
                  By Land
                </Link>
                <Link href="/services/air-freight" onClick={closeAllMenus} className="block rounded-xl px-3 py-2 hover:bg-white/60 text-slate-800 font-semibold">
                  By Air
                </Link>
                <Link href="/services/ocean-freight" onClick={closeAllMenus} className="block rounded-xl px-3 py-2 hover:bg-white/60 text-slate-800 font-semibold">
                  By Sea
                </Link>
              </div>
            </li>

            <li className="pt-2">
              <Link href="/contact" onClick={closeAllMenus} className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 text-white px-4 py-2.5 font-extrabold hover:bg-emerald-700 transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
