// components/Hero.tsx
import { publicPath } from '@/lib/publicPath';
import Link from 'next/link';

export default function Hero() {
  const heroSrc = publicPath('/images/hero.png');

  return (
    <section className="relative overflow-hidden">
      {/* Image layer */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[520px]">
        <img
          src={heroSrc}
          alt="Logistics hero"
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          // small perf wins for mobile
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />
        {/* Non-blocking overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="container">
        <div
          className="
            absolute inset-x-0 top-16 sm:top-20 md:top-24
            px-4 sm:px-0
            max-w-3xl
          "
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            <span className="text-emerald-300">Cut Shipping Costs</span> – With Expert
            Logistics Solutions
          </h1>

          <p className="mt-3 sm:mt-4 text-white/90 max-w-2xl">
            No hidden fees. No delays. Just reliable service every time.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
            <Link
              href="/shipping-guide#quote"
              className="inline-flex items-center rounded-lg bg-amber-400 px-5 py-3 font-semibold shadow-soft hover:bg-amber-500"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/shipping-guide"
              className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-semibold shadow-soft hover:bg-slate-100"
            >
              Shipping Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
