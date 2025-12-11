'use client';

import Link from 'next/link';
import { publicPath } from '@/lib/publicPath';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Use publicPath so it works at /go123logistics on GH Pages
const LOGO_SRC = publicPath('/images/logo.png');

export default function Navbar() {
  // Desktop “Services” dropdown
  const [servicesOpen, setServicesOpen] = useState(false);
  // Mobile main drawer + mobile Services disclosure
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  // --- Active path (handles GitHub Pages basePath) ---
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

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close desktop dropdown on outside click / Esc
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

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-100 transition-shadow',
        scrolled && 'shadow-soft'
      )}
    >
      <div className="container py-4 md:py-5 min-h-[64px] flex items-center justify-between">
        {/* Logo */}
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
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            onClick={onNavigate}
            aria-current={isActive('/') ? 'page' : undefined}
            className={clsx(
              'px-1 hover:text-emerald-600',
              isActive('/') && 'text-emerald-700 font-semibold'
            )}
          >
            Home
          </Link>

          <Link
            href="/about"
            onClick={onNavigate}
            aria-current={isActive('/about') ? 'page' : undefined}
            className={clsx(
              'px-1 hover:text-emerald-600',
              isActive('/about') && 'text-emerald-700 font-semibold'
            )}
          >
            About Us
          </Link>

          <Link
            href="/blog"
            onClick={onNavigate}
            aria-current={isActive('/blog') ? 'page' : undefined}
            className={clsx(
              'px-1 hover:text-emerald-600',
              isActive('/blog') && 'text-emerald-700 font-semibold'
            )}
          >
            Blog
          </Link>

          {/* NEW: Agent Training link (desktop) */}
          <Link
            href="/training"
            onClick={onNavigate}
            aria-current={isActive('/training') ? 'page' : undefined}
            className={clsx(
              'px-1 hover:text-emerald-600',
              isActive('/training') && 'text-emerald-700 font-semibold'
            )}
          >
            Agent Training
          </Link>

          {/* Services dropdown — CLICK to open (desktop) */}
          <div ref={desktopMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              className={clsx(
                'inline-flex items-center gap-1 px-1 hover:text-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md',
                isActive(['/services', '/shipping-guide']) &&
                  'text-emerald-700 font-semibold'
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

            {/* Keep mounted for smooth UX; toggle visibility */}
            <div
              id="services-menu"
              role="menu"
              className={clsx(
                'absolute right-0 mt-2 w-72 rounded-2xl border border-slate-100 bg-white shadow-soft p-2 origin-top-right transition',
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
                className={clsx(
                  'block px-3 py-2 rounded-lg',
                  isActive('/shipping-guide')
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'hover:bg-slate-50'
                )}
              >
                Shipping Guide &amp; SCAC Codes
              </Link>

              <div className="px-3 pt-3 pb-1 text-xs uppercase tracking-wide text-slate-500">
                Freight
              </div>

              <Link
                href="/services/ocean-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/ocean-freight') ? 'page' : undefined}
                role="menuitem"
                className={clsx(
                  'block px-3 py-2 rounded-lg',
                  isActive('/services/ocean-freight')
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'hover:bg-slate-50'
                )}
              >
                Ocean Freight
              </Link>

              <Link
                href="/services/air-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/air-freight') ? 'page' : undefined}
                role="menuitem"
                className={clsx(
                  'block px-3 py-2 rounded-lg',
                  isActive('/services/air-freight')
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'hover:bg-slate-50'
                )}
              >
                Air Freight
              </Link>

              <Link
                href="/services/rail-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/rail-freight') ? 'page' : undefined}
                role="menuitem"
                className={clsx(
                  'block px-3 py-2 rounded-lg',
                  isActive('/services/rail-freight')
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'hover:bg-slate-50'
                )}
              >
                Rail Freight
              </Link>
            </div>
          </div>

          <Link
            href="/contact"
            onClick={onNavigate}
            aria-current={isActive('/contact') ? 'page' : undefined}
            className={clsx(
              'ml-2 inline-flex items-center rounded-full px-4 py-2 shadow-soft',
              isActive('/contact')
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            )}
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile: hamburger button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            // X icon
            <svg className="h-6 w-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
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
          mobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
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
                  'block rounded-lg px-3 py-2',
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
                  'block rounded-lg px-3 py-2',
                  isActive('/about') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
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
                  'block rounded-lg px-3 py-2',
                  isActive('/blog') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-50'
                )}
              >
                Blog
              </Link>
            </li>

            {/* NEW: Agent Training link (mobile) */}
            <li>
              <Link
                href="/training"
                onClick={onNavigate}
                aria-current={isActive('/training') ? 'page' : undefined}
                className={clsx(
                  'block rounded-lg px-3 py-2',
                  isActive('/training')
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'hover:bg-slate-50'
                )}
              >
                Agent Training
              </Link>
            </li>

            {/* Mobile Services disclosure */}
            <li className="mt-1">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                aria-expanded={mobileServicesOpen}
                className={clsx(
                  'w-full inline-flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50',
                  isActive(['/services', '/shipping-guide']) && 'text-emerald-700 font-semibold'
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
                  'pl-3 border-l border-slate-100 ml-3 mt-1 space-y-1 transition-[max-height,opacity] overflow-hidden',
                  mobileServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <Link
                  href="/shipping-guide"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-md px-3 py-2',
                    isActive('/shipping-guide')
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'hover:bg-slate-50'
                  )}
                >
                  Shipping Guide &amp; SCAC Codes
                </Link>
                <Link
                  href="/services/ocean-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-md px-3 py-2',
                    isActive('/services/ocean-freight')
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'hover:bg-slate-50'
                  )}
                >
                  Ocean Freight
                </Link>
                <Link
                  href="/services/air-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-md px-3 py-2',
                    isActive('/services/air-freight')
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'hover:bg-slate-50'
                  )}
                >
                  Air Freight
                </Link>
                <Link
                  href="/services/rail-freight"
                  onClick={onNavigate}
                  className={clsx(
                    'block rounded-md px-3 py-2',
                    isActive('/services/rail-freight')
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'hover:bg-slate-50'
                  )}
                >
                  Rail Freight
                </Link>
              </div>
            </li>

            <li className="pt-2">
              <Link
                href="/contact"
                onClick={onNavigate}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 text-white px-4 py-2 shadow-soft hover:bg-emerald-700"
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
