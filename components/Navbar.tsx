'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const LOGO_SRC = '/images/logo.png'; // change if your file uses .svg/.jpg

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const onNavigate = () => setOpen(false);

  // sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close on outside click or Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
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
        {/* Logo only */}
        <Link href="/" aria-label="Home" className="inline-flex items-center">
          <Image
            src={LOGO_SRC}
            alt="Company logo"
            width={420}
            height={120}
            className="h-12 sm:h-14 md:h-[72px] w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            onClick={onNavigate}
            aria-current={isActive('/') ? 'page' : undefined}
            className={clsx('px-1 hover:text-emerald-600', isActive('/') && 'text-emerald-700 font-semibold')}
          >
            Home
          </Link>

          <Link
            href="/about"
            onClick={onNavigate}
            aria-current={isActive('/about') ? 'page' : undefined}
            className={clsx('px-1 hover:text-emerald-600', isActive('/about') && 'text-emerald-700 font-semibold')}
          >
            About Us
          </Link>

          {/* NEW: Blog */}
          <Link
            href="/blog"
            onClick={onNavigate}
            aria-current={isActive('/blog') ? 'page' : undefined}
            className={clsx('px-1 hover:text-emerald-600', isActive('/blog') && 'text-emerald-700 font-semibold')}
          >
            Blog
          </Link>

          {/* Services dropdown — CLICK to open */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={clsx(
                'inline-flex items-center gap-1 px-1 hover:text-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md',
                // Highlight "Services" if any child route is active
                isActive(['/services', '/shipping-guide']) && 'text-emerald-700 font-semibold'
              )}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="services-menu"
            >
              Services
              <svg className={clsx('h-4 w-4 transition-transform', open && 'rotate-180')} viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>

            {/* Keep mounted for smooth UX; toggle visibility */}
            <div
              id="services-menu"
              role="menu"
              className={clsx(
                'absolute right-0 mt-2 w-72 rounded-2xl border border-slate-100 bg-white shadow-soft p-2 origin-top-right transition',
                open ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
              )}
            >
              <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wide text-slate-500">Shipment</div>

              <Link
                href="/shipping-guide"
                onClick={onNavigate}
                aria-current={isActive('/shipping-guide') ? 'page' : undefined}
                role="menuitem"
                className={clsx(
                  'block px-3 py-2 rounded-lg',
                  isActive('/shipping-guide') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
                )}
              >
                Shipping Guide &amp; SCAC Codes
              </Link>

              <div className="px-3 pt-3 pb-1 text-xs uppercase tracking-wide text-slate-500">Freight</div>

              <Link
                href="/services/ocean-freight"
                onClick={onNavigate}
                aria-current={isActive('/services/ocean-freight') ? 'page' : undefined}
                role="menuitem"
                className={clsx(
                  'block px-3 py-2 rounded-lg',
                  isActive('/services/ocean-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
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
                  isActive('/services/air-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
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
                  isActive('/services/rail-freight') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50'
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

        {/* Mobile quick action */}
        <div className="md:hidden">
          <Link
            href="/contact"
            onClick={onNavigate}
            className="inline-flex items-center rounded-full bg-emerald-600 text-white px-4 py-2 shadow-soft hover:bg-emerald-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
