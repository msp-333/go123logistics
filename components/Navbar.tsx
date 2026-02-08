'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/app/providers';

const LOGO_SRC = '/images/logo.png';

type NavbarProps = {
  /** Optional override. If omitted: Home route uses "overlay", other routes use "solid". */
  variant?: 'overlay' | 'solid';
};

const publicPath = (p: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const path = p.startsWith('/') ? p : `/${p}`;
  return `${base}${path}`;
};

export default function Navbar({ variant }: NavbarProps) {
  const { user, loading: authLoading, signOut } = useAuth();

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  const rawPath = usePathname() || '/';
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pathname =
    base && rawPath.startsWith(base) ? rawPath.slice(base.length) || '/' : rawPath;

  const resolvedVariant: 'overlay' | 'solid' = useMemo(() => {
    if (variant) return variant;
    return pathname === '/' ? 'overlay' : 'solid';
  }, [variant, pathname]);

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

  const onNavigate = () => closeAllMenus();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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

  const desktopLinkClass = (active: boolean) => {
    if (resolvedVariant === 'overlay') {
      return clsx(
        'relative text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70',
        active ? 'text-white' : 'text-white/85 hover:text-white'
      );
    }
    return clsx(
      'rounded-full px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
      active
        ? 'bg-emerald-50 text-emerald-700 font-semibold'
        : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
    );
  };

  const menuItemClass = (active: boolean) => {
    if (resolvedVariant === 'overlay') {
      return clsx(
        'flex items-center justify-between px-3 py-2 rounded-xl transition-colors',
        active ? 'bg-white/10 text-white font-medium' : 'hover:bg-white/10 text-white/90'
      );
    }
    return clsx(
      'flex items-center justify-between px-3 py-2 rounded-xl transition-colors',
      active ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
    );
  };

  const headerClass =
    resolvedVariant === 'overlay'
      ? clsx(
          'fixed top-0 inset-x-0 z-50 transition-all',
          scrolled
            ? 'bg-black/35 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
        )
      : clsx(
          'sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-100 transition-shadow',
          scrolled && 'shadow-soft'
        );

  return (
    <header className={headerClass}>
      <div className="container py-4 md:py-5 min-h-[64px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Home"
          className={clsx(
            'inline-flex items-center',
            resolvedVariant === 'overlay' && 'rounded-xl border border-white/10 bg-white/5 px-2 py-1 backdrop-blur'
          )}
          onClick={onNavigate}
        >
          <img
            src={publicPath(LOGO_SRC)}
            alt="Company logo"
            width={420}
            height={120}
            className="h-10 sm:h-11 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className={clsx('hidden md:flex items-center', resolvedVariant === 'overlay' ? 'gap-8' : 'gap-2')}>
          <Link
            href="/"
            onClick={onNavigate}
            aria-current={isActive('/') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/'))}
          >
            Home
            {resolvedVariant === 'overlay' && isActive('/') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-emerald-300" />
            ) : null}
          </Link>

          <Link
            href="/about"
            onClick={onNavigate}
            aria-current={isActive('/about') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/about'))}
          >
            About Us
            {resolvedVariant === 'overlay' && isActive('/about') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-emerald-300" />
            ) : null}
          </Link>

          <Link
            href="/blog"
            onClick={onNavigate}
            aria-current={isActive('/blog') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/blog'))}
          >
            Blog
            {resolvedVariant === 'overlay' && isActive('/blog') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-emerald-300" />
            ) : null}
          </Link>

          {/* Services dropdown */}
          <div ref={desktopMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              className={clsx(
                desktopLinkClass(isActive(['/services', '/shipping-guide'])),
                resolvedVariant === 'solid' && 'inline-flex items-center gap-1',
                resolvedVariant === 'overlay' && 'inline-flex items-center gap-2'
              )}
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
                'absolute right-0 mt-3 rounded-2xl p-2 origin-top-right transition',
                resolvedVariant === 'overlay'
                  ? 'w-[320px] border border-white/10 bg-black/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]'
                  : 'w-[340px] border border-slate-100 bg-white shadow-soft',
                servicesOpen ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
              )}
            >
              <div className={clsx('px-3 pt-2 pb-1 text-xs uppercase tracking-wide', resolvedVariant === 'overlay' ? 'text-white/55' : 'text-slate-500')}>
                Shipment
              </div>

              <Link
                href="/shipping-guide"
                onClick={onNavigate}
                aria-current={isActive('/shipping-guide') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/shipping-guide'))}
              >
                <span>Shipping Guide &amp; SCAC Codes</span>
                <span className={clsx('text-xs', resolvedVariant === 'overlay' ? 'text-white/55' : 'text-slate-400')}>
                  Docs
                </span>
              </Link>

              <div className={clsx('px-3 pt-3 pb-1 text-xs uppercase tracking-wide', resolvedVariant === 'overlay' ? 'text-white/55' : 'text-slate-500')}>
                Freight Services
              </div>

              <Link
                href="/services/land-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/land-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/land-freight'))}
              >
                <span>By Land</span>
                <span className={clsx('text-xs', resolvedVariant === 'overlay' ? 'text-white/55' : 'text-slate-400')}>
                  Road + Rail
                </span>
              </Link>

              <Link
                href="/services/air-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/air-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/air-freight'))}
              >
                <span>By Air</span>
                <span className={clsx('text-xs', resolvedVariant === 'overlay' ? 'text-white/55' : 'text-slate-400')}>
                  Express
                </span>
              </Link>

              <Link
                href="/services/ocean-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/ocean-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/ocean-freight'))}
              >
                <span>By Sea</span>
                <span className={clsx('text-xs', resolvedVariant === 'overlay' ? 'text-white/55' : 'text-slate-400')}>
                  FCL / LCL
                </span>
              </Link>
            </div>
          </div>

          {/* Right-side CTAs */}
          <div className={clsx('ml-2 flex items-center', resolvedVariant === 'overlay' ? 'gap-3' : 'gap-2')}>
            <Link
              href="/contact"
              onClick={onNavigate}
              className={clsx(
                'inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2',
                resolvedVariant === 'overlay'
                  ? 'bg-emerald-400 text-white hover:bg-emerald-300 focus-visible:ring-emerald-200/70 shadow-[0_12px_35px_rgba(16,185,129,0.25)]'
                  : clsx(
                      'shadow-soft focus-visible:ring-emerald-500',
                      isActive('/contact') ? 'bg-emerald-700 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    )
              )}
            >
              Contact Us
            </Link>

            {/* On overlay, keep auth actions minimal (icon-like). On solid, keep your existing pills. */}
            {!authLoading && !user ? (
              resolvedVariant === 'overlay' ? (
                <Link
                  href="/login"
                  onClick={onNavigate}
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Login"
                  title="Login"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 3H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 12h10m0 0-3-3m3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={onNavigate}
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border border-emerald-600 text-emerald-700 hover:bg-emerald-50 shadow-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  Login
                </Link>
              )
            ) : null}

            {!authLoading && user ? (
              resolvedVariant === 'overlay' ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/training"
                    onClick={onNavigate}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label="Training"
                    title="Training"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 19V6a2 2 0 0 1 2-2h9l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 4v5h6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      onNavigate();
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16 17l5-5-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
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
                    onClick={() => {
                      signOut();
                      onNavigate();
                    }}
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Logout
                  </button>
                </div>
              )
            ) : null}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={clsx(
            'md:hidden inline-flex items-center justify-center rounded-xl p-2 transition-colors focus:outline-none focus-visible:ring-2',
            resolvedVariant === 'overlay'
              ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-white/60'
              : 'hover:bg-slate-50 focus-visible:ring-emerald-500'
          )}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg className={clsx('h-6 w-6', resolvedVariant === 'overlay' ? 'text-white' : 'text-slate-700')} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className={clsx('h-6 w-6', resolvedVariant === 'overlay' ? 'text-white' : 'text-slate-700')} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={clsx(
          'md:hidden transition-[max-height,opacity] duration-200 overflow-hidden border-t',
          resolvedVariant === 'overlay'
            ? 'bg-black/65 backdrop-blur-xl border-white/10'
            : 'bg-white border-slate-100',
          mobileOpen ? 'max-h-[720px] opacity-100' : 'max-h-0 opacity-0'
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
                  resolvedVariant === 'overlay'
                    ? isActive('/') ? 'bg-white/10 text-white font-semibold' : 'text-white/90 hover:bg-white/10'
                    : isActive('/') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
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
                  resolvedVariant === 'overlay'
                    ? isActive('/about') ? 'bg-white/10 text-white font-semibold' : 'text-white/90 hover:bg-white/10'
                    : isActive('/about') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
                )}
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                href="/blog"
                onClick={onNavigate}
                aria-current={isActive('/blog') ? 'page' : undefined}
                className={clsx(
                  'block rounded-xl px-3 py-2 transition-colors',
                  resolvedVariant === 'overlay'
                    ? isActive('/blog') ? 'bg-white/10 text-white font-semibold' : 'text-white/90 hover:bg-white/10'
                    : isActive('/blog') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
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
                  'w-full inline-flex items-center justify-between rounded-xl px-3 py-2 transition-colors',
                  resolvedVariant === 'overlay'
                    ? 'text-white/90 hover:bg-white/10'
                    : 'hover:bg-slate-50',
                  isActive(['/services', '/shipping-guide']) &&
                    (resolvedVariant === 'overlay' ? 'text-white font-semibold' : 'text-emerald-700 font-semibold')
                )}
              >
                <span>Services</span>
                <svg
                  className={clsx('h-4 w-4 transition-transform', mobileServicesOpen && 'rotate-180')}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </button>

              <div
                className={clsx(
                  'pl-3 ml-3 mt-1 space-y-1 transition-[max-height,opacity] overflow-hidden border-l',
                  resolvedVariant === 'overlay' ? 'border-white/10' : 'border-slate-100',
                  mobileServicesOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <Link
                  href="/shipping-guide"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-xl px-3 py-2 transition-colors',
                    resolvedVariant === 'overlay'
                      ? isActive('/shipping-guide') ? 'bg-white/10 text-white font-medium' : 'text-white/90 hover:bg-white/10'
                      : isActive('/shipping-guide') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                  )}
                >
                  Shipping Guide &amp; SCAC Codes
                </Link>

                <Link
                  href="/services/land-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-xl px-3 py-2 transition-colors',
                    resolvedVariant === 'overlay'
                      ? isActive('/services/land-freight') ? 'bg-white/10 text-white font-medium' : 'text-white/90 hover:bg-white/10'
                      : isActive('/services/land-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                  )}
                >
                  By Land
                </Link>

                <Link
                  href="/services/air-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-xl px-3 py-2 transition-colors',
                    resolvedVariant === 'overlay'
                      ? isActive('/services/air-freight') ? 'bg-white/10 text-white font-medium' : 'text-white/90 hover:bg-white/10'
                      : isActive('/services/air-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                  )}
                >
                  By Air
                </Link>

                <Link
                  href="/services/ocean-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-xl px-3 py-2 transition-colors',
                    resolvedVariant === 'overlay'
                      ? isActive('/services/ocean-freight') ? 'bg-white/10 text-white font-medium' : 'text-white/90 hover:bg-white/10'
                      : isActive('/services/ocean-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                  )}
                >
                  By Sea
                </Link>
              </div>
            </li>

            {!authLoading && !user ? (
              <li className="pt-2">
                <Link
                  href="/login"
                  onClick={onNavigate}
                  className={clsx(
                    'inline-flex w-full items-center justify-center rounded-full px-4 py-2 shadow-soft transition-colors',
                    resolvedVariant === 'overlay'
                      ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                      : 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                  )}
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
                      'inline-flex w-full items-center justify-center rounded-full px-4 py-2 shadow-soft transition-colors',
                      resolvedVariant === 'overlay'
                        ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                        : clsx(
                            'border border-slate-300 text-slate-700 hover:bg-slate-50',
                            isActive('/training') && 'border-emerald-600 text-emerald-700'
                          )
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
                    className={clsx(
                      'inline-flex w-full items-center justify-center rounded-full px-4 py-2 shadow-soft transition-colors',
                      resolvedVariant === 'overlay'
                        ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    )}
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
                className={clsx(
                  'inline-flex w-full items-center justify-center rounded-full px-4 py-2 font-semibold transition-colors',
                  resolvedVariant === 'overlay'
                    ? 'bg-emerald-400 text-white hover:bg-emerald-300'
                    : 'bg-emerald-600 text-white shadow-soft hover:bg-emerald-700'
                )}
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
