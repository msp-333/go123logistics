'use client';

import Link from 'next/link';
import { publicPath } from '@/lib/publicPath';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/app/providers';

// Use publicPath so it works at /go123logistics on GH Pages
const LOGO_SRC = publicPath('/images/logo.png');

type NavItem = {
  href: string;
  label: string;
  active: string | string[];
};

export default function Navbar() {
  const { user, loading: authLoading, signOut } = useAuth();

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
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close desktop dropdown on outside click / Esc
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!desktopMenuRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAllMenus();
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  const mainNav: NavItem[] = [
    { href: '/', label: 'Home', active: '/' },
    { href: '/about', label: 'About', active: '/about' },
    { href: '/blog', label: 'Blog', active: '/blog' },
  ];

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 border-b transition-shadow',
        'bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70',
        scrolled ? 'shadow-sm border-slate-200/70' : 'border-slate-200/40'
      )}
    >
      <div className="container min-h-[72px] flex items-center justify-between gap-4 py-3">
        {/* Logo */}
        <Link href="/" aria-label="Home" className="inline-flex items-center gap-3">
          <img
            src={LOGO_SRC}
            alt="GO123 Logistics"
            width={420}
            height={120}
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive(item.active) ? 'page' : undefined}
              className={clsx(
                'relative rounded-full px-4 py-2 text-sm font-medium transition',
                'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60',
                isActive(item.active) && 'text-emerald-800 bg-emerald-50'
              )}
            >
              {item.label}
              {isActive(item.active) ? (
                <span className="absolute inset-x-4 -bottom-[2px] h-[2px] rounded-full bg-emerald-600" />
              ) : null}
            </Link>
          ))}

          {/* Services dropdown — click */}
          <div ref={desktopMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              className={clsx(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                isActive(['/services', '/shipping-guide']) && 'text-emerald-800 bg-emerald-50'
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
                aria-hidden="true"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>

            <div
              id="services-menu"
              role="menu"
              className={clsx(
                'absolute right-0 mt-3 w-[340px] rounded-2xl border bg-white shadow-xl',
                'border-slate-200/70 overflow-hidden origin-top-right transition',
                servicesOpen
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'pointer-events-none opacity-0 scale-95 -translate-y-1'
              )}
            >
              <div className="px-4 py-3 border-b border-slate-200/60">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Services
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Explore shipping help and freight options.
                </p>
              </div>

              <div className="p-2">
                <SectionLabel>Shipment</SectionLabel>

                <MenuLink
                  href="/shipping-guide"
                  active={isActive('/shipping-guide')}
                  onClick={onNavigate}
                  title="Shipping Guide & SCAC Codes"
                  subtitle="Quick references for documentation and carriers."
                />

                <div className="my-2 h-px bg-slate-200/60" />

                <SectionLabel>Freight</SectionLabel>

                <MenuLink
                  href="/services/ocean-freight"
                  active={isActive('/services/ocean-freight')}
                  onClick={onNavigate}
                  title="Ocean Freight"
                  subtitle="FCL/LCL international coverage."
                />

                <MenuLink
                  href="/services/air-freight"
                  active={isActive('/services/air-freight')}
                  onClick={onNavigate}
                  title="Air Freight"
                  subtitle="Faster options for urgent shipments."
                />

                <MenuLink
                  href="/services/rail-freight"
                  active={isActive('/services/rail-freight')}
                  onClick={onNavigate}
                  title="Rail Freight"
                  subtitle="Cost-effective inland movement."
                />
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="w-2" />

          {/* Primary CTA */}
          <Link
            href="/contact"
            onClick={onNavigate}
            aria-current={isActive('/contact') ? 'page' : undefined}
            className={clsx(
              'inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition shadow-sm',
              isActive('/contact')
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            )}
          >
            Contact Us
          </Link>

          {/* Auth area */}
          {!authLoading && !user ? (
            <Link
              href="/login"
              onClick={onNavigate}
              className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
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
                  'inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition border shadow-sm',
                  isActive('/training')
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                )}
              >
                Training
              </Link>

              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          ) : null}
        </nav>

        {/* Mobile: hamburger button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2.5 border border-slate-200 hover:bg-slate-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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

      {/* Mobile overlay */}
      <div
        className={clsx(
          'md:hidden fixed inset-0 z-40 transition',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={clsx(
            'absolute inset-0 bg-black/30 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />
      </div>

      {/* Mobile drawer */}
      <div
        className={clsx(
          'md:hidden fixed top-0 right-0 z-50 h-full w-[86%] max-w-sm bg-white shadow-2xl border-l border-slate-200 transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="GO123 Logistics" className="h-9 w-auto object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-2 hover:bg-slate-50 border border-slate-200"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-3 py-4">
          <div className="space-y-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive(item.active) ? 'page' : undefined}
                className={clsx(
                  'block rounded-xl px-4 py-3 text-sm font-semibold transition',
                  isActive(item.active)
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Services disclosure */}
            <button
              type="button"
              onClick={() => setMobileServicesOpen((v) => !v)}
              aria-expanded={mobileServicesOpen}
              className={clsx(
                'w-full inline-flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition',
                isActive(['/services', '/shipping-guide'])
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span>Services</span>
              <svg
                className={clsx('h-4 w-4 transition-transform', mobileServicesOpen && 'rotate-180')}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>

            <div
              className={clsx(
                'overflow-hidden transition-[max-height,opacity] ml-3 border-l border-slate-200 pl-3',
                mobileServicesOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <MobileSubLink
                href="/shipping-guide"
                onClick={onNavigate}
                active={isActive('/shipping-guide')}
              >
                Shipping Guide & SCAC Codes
              </MobileSubLink>
              <MobileSubLink
                href="/services/ocean-freight"
                onClick={onNavigate}
                active={isActive('/services/ocean-freight')}
              >
                Ocean Freight
              </MobileSubLink>
              <MobileSubLink
                href="/services/air-freight"
                onClick={onNavigate}
                active={isActive('/services/air-freight')}
              >
                Air Freight
              </MobileSubLink>
              <MobileSubLink
                href="/services/rail-freight"
                onClick={onNavigate}
                active={isActive('/services/rail-freight')}
              >
                Rail Freight
              </MobileSubLink>
            </div>

            <div className="pt-3">
              <Link
                href="/contact"
                onClick={onNavigate}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 text-white px-4 py-3 text-sm font-semibold shadow-sm hover:bg-emerald-700 transition"
              >
                Contact Us
              </Link>
            </div>

            {!authLoading && !user ? (
              <div className="pt-2">
                <Link
                  href="/login"
                  onClick={onNavigate}
                  className="inline-flex w-full items-center justify-center rounded-full border border-emerald-600 text-emerald-700 px-4 py-3 text-sm font-semibold hover:bg-emerald-50 transition"
                >
                  Login
                </Link>
              </div>
            ) : null}

            {!authLoading && user ? (
              <div className="pt-2 space-y-2">
                <Link
                  href="/training"
                  onClick={onNavigate}
                  className={clsx(
                    'inline-flex w-full items-center justify-center rounded-full border px-4 py-3 text-sm font-semibold transition',
                    isActive('/training')
                      ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
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
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 text-slate-700 px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </div>
  );
}

function MenuLink({
  href,
  title,
  subtitle,
  active,
  onClick,
}: {
  href: string;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'block rounded-xl px-3 py-3 transition',
        active ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50'
      )}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-0.5 text-xs text-slate-600">{subtitle}</div>
    </Link>
  );
}

function MobileSubLink({
  href,
  children,
  active,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        'block rounded-lg px-3 py-2 text-sm transition',
        active ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
      )}
    >
      {children}
    </Link>
  );
}
