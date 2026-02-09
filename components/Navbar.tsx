'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/app/providers';

const LOGO_SRC = '/images/logo.png';

type NavbarProps = {
  /** "static" = normal flow (does NOT stick). "over-hero" = sits on hero but still scrolls away. */
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
  const onNavigate = () => closeAllMenus();

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

  // Clean, elegant surface. Over-hero uses translucent white + blur for readability.
  const headerSurface =
    placement === 'over-hero'
      ? 'bg-white/70 backdrop-blur-xl border-b border-white/25 shadow-[0_8px_28px_rgba(0,0,0,0.10)]'
      : 'bg-white border-b border-slate-200/70';

  const desktopLinkClass = (active: boolean) =>
    clsx(
      'relative px-2.5 py-1.5 text-[15px] lg:text-base font-medium transition-colors rounded-md',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green',
      active ? 'text-slate-900' : 'text-slate-700 hover:text-slate-900'
    );

  const menuItemClass = (active: boolean) =>
    clsx(
      'flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-sm',
      active
        ? 'bg-brand-light text-slate-900 font-medium'
        : 'hover:bg-slate-50 text-slate-700'
    );

  return (
    <header
      className={clsx(
        placement === 'over-hero' ? 'absolute top-0 inset-x-0 z-50' : 'relative z-40',
        headerSurface
      )}
    >
      {/* Fixed height navbar so it NEVER grows.
          Logo is sized to be large inside this fixed height. */}
      <div className="container h-20 md:h-[88px] flex items-center justify-between">
        {/* Logo: bigger, but header stays fixed height */}
        <Link
          href="/"
          aria-label="Home"
          className="inline-flex items-center shrink-0"
          onClick={onNavigate}
        >
          <img
            src={publicPath(LOGO_SRC)}
            alt="Company logo"
            width={560}
            height={180}
            className="h-16 sm:h-[72px] md:h-[82px] w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            onClick={onNavigate}
            aria-current={isActive('/') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/'))}
          >
            Home
            {isActive('/') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full bg-brand-green" />
            ) : null}
          </Link>

          <Link
            href="/about"
            onClick={onNavigate}
            aria-current={isActive('/about') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/about'))}
          >
            About Us
            {isActive('/about') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full bg-brand-green" />
            ) : null}
          </Link>

          <Link
            href="/blog"
            onClick={onNavigate}
            aria-current={isActive('/blog') ? 'page' : undefined}
            className={desktopLinkClass(isActive('/blog'))}
          >
            Blog
            {isActive('/blog') ? (
              <span className="absolute -bottom-2 left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full bg-brand-green" />
            ) : null}
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
                'absolute right-0 mt-3 w-[340px] rounded-2xl border border-slate-200/70 bg-white shadow-soft p-2 origin-top-right transition',
                servicesOpen ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
              )}
            >
              <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wide text-slate-500">
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
                <span className="text-xs text-slate-400">Docs</span>
              </Link>

              <div className="px-3 pt-3 pb-1 text-xs uppercase tracking-wide text-slate-500">
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
                <span className="text-xs text-slate-400">Road + Rail</span>
              </Link>

              <Link
                href="/services/air-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/air-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/air-freight'))}
              >
                <span>By Air</span>
                <span className="text-xs text-slate-400">Express</span>
              </Link>

              <Link
                href="/services/ocean-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/ocean-freight') ? 'page' : undefined}
                role="menuitem"
                className={menuItemClass(isActive('/services/ocean-freight'))}
              >
                <span>By Sea</span>
                <span className="text-xs text-slate-400">FCL / LCL</span>
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="ml-2 flex items-center gap-2">
            <Link
              href="/contact"
              onClick={onNavigate}
              className={clsx(
                'inline-flex items-center rounded-lg px-4 py-2.5 text-[15px] lg:text-base font-semibold transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green',
                'bg-brand-green text-brand-dark hover:opacity-95'
              )}
            >
              Contact Us
            </Link>

            {!authLoading && !user ? (
              <Link
                href="/login"
                onClick={onNavigate}
                className="inline-flex items-center rounded-lg px-4 py-2.5 text-[15px] lg:text-base font-semibold border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
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
                    'inline-flex items-center rounded-lg px-4 py-2.5 text-[15px] lg:text-base font-semibold border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green',
                    isActive('/training') && 'border-brand-green text-slate-900'
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
                  className="inline-flex items-center rounded-lg px-4 py-2.5 text-[15px] lg:text-base font-semibold border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
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
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 hover:bg-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green transition-colors"
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
          'md:hidden transition-[max-height,opacity] duration-200 overflow-hidden border-t',
          placement === 'over-hero' ? 'border-white/25 bg-white/75 backdrop-blur-xl' : 'border-slate-200/70 bg-white',
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
                  'block rounded-xl px-3 py-2.5 transition-colors text-[15px] font-medium',
                  isActive('/') ? 'bg-brand-light text-slate-900' : 'hover:bg-slate-50 text-slate-800'
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
                  'block rounded-xl px-3 py-2.5 transition-colors text-[15px] font-medium',
                  isActive('/about') ? 'bg-brand-light text-slate-900' : 'hover:bg-slate-50 text-slate-800'
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
                  'block rounded-xl px-3 py-2.5 transition-colors text-[15px] font-medium',
                  isActive('/blog') ? 'bg-brand-light text-slate-900' : 'hover:bg-slate-50 text-slate-800'
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
                  'w-full inline-flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors text-[15px] font-medium',
                  'hover:bg-slate-50 text-slate-800',
                  isActive(['/services', '/shipping-guide']) && 'text-slate-900'
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
                  'pl-3 border-l border-slate-200 ml-3 mt-1 space-y-1 transition-[max-height,opacity] overflow-hidden',
                  mobileServicesOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <Link href="/shipping-guide" onClick={onNavigate} className="block rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors text-slate-800">
                  Shipping Guide &amp; SCAC Codes
                </Link>
                <Link href="/services/land-freight" onClick={onNavigate} className="block rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors text-slate-800">
                  By Land
                </Link>
                <Link href="/services/air-freight" onClick={onNavigate} className="block rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors text-slate-800">
                  By Air
                </Link>
                <Link href="/services/ocean-freight" onClick={onNavigate} className="block rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors text-slate-800">
                  By Sea
                </Link>
              </div>
            </li>

            <li className="pt-2">
              <Link
                href="/contact"
                onClick={onNavigate}
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand-green text-brand-dark px-4 py-2.5 font-semibold hover:opacity-95 transition-colors"
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
