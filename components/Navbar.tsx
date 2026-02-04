'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/app/providers';

const LOGO_SRC = '/images/logo.png';

export default function Navbar() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  const rawPath = usePathname() || '/';
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pathname = base && rawPath.startsWith(base) ? rawPath.slice(base.length) || '/' : rawPath;

  const isActive = (paths: string | string[]) => {
    const list = Array.isArray(paths) ? paths : [paths];
    return list.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(`${p}/`)));
  };

  const closeAllMenus = () => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };
  const onNavigate = () => closeAllMenus();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const desktopLinkClass = (active: boolean) =>
    clsx(
      'rounded-full px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
      active ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
    );

  const menuItemClass = (active: boolean) =>
    clsx(
      'flex items-center justify-between px-3 py-2 rounded-xl transition-colors',
      active ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
    );

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-100 transition-shadow',
        scrolled && 'shadow-soft'
      )}
    >
      <div className="container py-4 md:py-5 min-h-[64px] flex items-center justify-between">
        <Link href="/" aria-label="Home" className="inline-flex items-center">
          <img
            src={LOGO_SRC}
            alt="Company logo"
            width={420}
            height={120}
            className="h-12 sm:h-14 md:h-[72px] w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" onClick={onNavigate} aria-current={isActive('/') ? 'page' : undefined} className={desktopLinkClass(isActive('/'))}>
            Home
          </Link>

          <Link href="/about" onClick={onNavigate} aria-current={isActive('/about') ? 'page' : undefined} className={desktopLinkClass(isActive('/about'))}>
            About
          </Link>

          <Link href="/blog" onClick={onNavigate} aria-current={isActive('/blog') ? 'page' : undefined} className={desktopLinkClass(isActive('/blog'))}>
            Blog
          </Link>

          {/* Services dropdown */}
          <div ref={desktopMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              className={clsx(
                desktopLinkClass(isActive(['/services', '/shipping-guide'])),
                'inline-flex items-center gap-1'
              )}
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
            >
              Services
              <svg className={clsx('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>

            <div
              id="services-menu"
              role="menu"
              className={clsx(
                'absolute right-0 mt-2 w-[340px] rounded-2xl border border-slate-100 bg-white shadow-soft p-2 origin-top-right transition',
                servicesOpen ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
              )}
            >
              <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wide text-slate-500">Shipment</div>

              <Link
                href="/shipping-guide"
                onClick={onNavigate}
                aria-current={isActive('/shipping-guide') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/shipping-guide'))}
              >
                <span>Shipping Guide &amp; SCAC Codes</span>
                <span className="text-xs text-slate-400">Docs</span>
              </Link>

              <div className="px-3 pt-3 pb-1 text-xs uppercase tracking-wide text-slate-500">Freight Services</div>

              {/* REQUIRED ORDER: Land -> Ocean -> Air */}
              <Link
                href="/services/land-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/land-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/land-freight'))}
              >
                <span>Land Freight</span>
                <span className="text-xs text-slate-400">Road + Rail</span>
              </Link>

              <Link
                href="/services/ocean-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/ocean-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/ocean-freight'))}
              >
                <span>Ocean Freight</span>
                <span className="text-xs text-slate-400">FCL / LCL</span>
              </Link>

              <Link
                href="/services/air-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/air-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/air-freight'))}
              >
                <span>Air Freight</span>
                <span className="text-xs text-slate-400">Express</span>
              </Link>

              <div className="mt-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                End-to-end coordination across carriers, documentation, tracking, and delivery—so shipping stays effortless.
              </div>
            </div>
          </div>

          {/* Right-side CTAs */}
          <div className="ml-2 flex items-center gap-2">
            <Link
              href="/contact"
              onClick={onNavigate}
              className={clsx(
                'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                isActive('/contact') ? 'bg-emerald-700 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
              )}
            >
              Contact Us
            </Link>

            {!authLoading && !user ? (
              <Link
                href="/login"
                onClick={onNavigate}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border border-emerald-600 text-emerald-700 hover:bg-emerald-50 shadow-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Login
              </Link>
            ) : null}

            {!authLoading && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/training"
                  onClick={onNavigate}
                  className={clsx(
                    'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                    isActive('/training') && 'border-emerald-600 text-emerald-700'
                  )}
                >
                  Training
                </Link>

                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
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

      {/* Mobile drawer */}
      <div
        className={clsx(
          'md:hidden transition-[max-height,opacity] duration-200 overflow-hidden bg-white border-t border-slate-100',
          mobileOpen ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container py-3">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/"
                onClick={onNavigate}
                aria-current={isActive('/') ? 'page' : undefined}
                className={clsx(
                  'block rounded-xl px-3 py-2 transition-colors',
                  isActive('/') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
                )}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                onClick={onNavigate}
                aria-current={isActive('/about') ? 'page' : undefined}
                className={clsx(
                  'block rounded-xl px-3 py-2 transition-colors',
                  isActive('/about') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
                )}
              >
                About
              </Link>
            </li>

            <li>
              <Link
                href="/blog"
                onClick={onNavigate}
                aria-current={isActive('/blog') ? 'page' : undefined}
                className={clsx(
                  'block rounded-xl px-3 py-2 transition-colors',
                  isActive('/blog') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
                )}
              >
                Blog
              </Link>
            </li>

            <li className="mt-1">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                aria-expanded={mobileServicesOpen}
                className={clsx(
                  'w-full inline-flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors',
                  isActive(['/services', '/shipping-guide']) && 'text-emerald-700 font-semibold'
                )}
              >
                <span>Services</span>
                <svg className={clsx('h-4 w-4 transition-transform', mobileServicesOpen && 'rotate-180')} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </button>

              <div
                className={clsx(
                  'pl-3 border-l border-slate-100 ml-3 mt-1 space-y-1 transition-[max-height,opacity] overflow-hidden',
                  mobileServicesOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <Link
                  href="/shipping-guide"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-xl px-3 py-2 transition-colors',
                    isActive('/shipping-guide') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                  )}
                >
                  Shipping Guide &amp; SCAC Codes
                </Link>

                {/* REQUIRED ORDER: Land -> Ocean -> Air */}
                <Link
                  href="/services/land-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-xl px-3 py-2 transition-colors',
                    isActive('/services/land-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                  )}
                >
                  Land Freight
                </Link>

                <Link
                  href="/services/ocean-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-xl px-3 py-2 transition-colors',
                    isActive('/services/ocean-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                  )}
                >
                  Ocean Freight
                </Link>

                <Link
                  href="/services/air-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-xl px-3 py-2 transition-colors',
                    isActive('/services/air-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                  )}
                >
                  Air Freight
                </Link>
              </div>
            </li>

            {!authLoading && !user ? (
              <li className="pt-2">
                <Link
                  href="/login"
                  onClick={onNavigate}
                  className="inline-flex w-full items-center justify-center rounded-full border border-emerald-600 text-emerald-700 px-4 py-2 shadow-soft hover:bg-emerald-50 transition-colors"
                >
                  Login
                </Link>
              </li>
            ) : null}

            {!authLoading && user ? (
              <>
                <li className="pt-2">
                  <Link
                    href="/training"
                    onClick={onNavigate}
                    className={clsx(
                      'inline-flex w-full items-center justify-center rounded-full border border-slate-300 text-slate-700 px-4 py-2 shadow-soft hover:bg-slate-50 transition-colors',
                      isActive('/training') && 'border-emerald-600 text-emerald-700'
                    )}
                  >
                    Training
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      onNavigate();
                    }}
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 text-slate-700 px-4 py-2 shadow-soft hover:bg-slate-50 transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : null}

            <li className="pt-2">
              <Link
                href="/contact"
                onClick={onNavigate}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 text-white px-4 py-2 shadow-soft hover:bg-emerald-700 transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
