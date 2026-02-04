// components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  const heroSrc = "/images/hero.png";

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="relative w-full min-h-[460px] md:min-h-[560px]">
        <img
          src={heroSrc}
          alt="Logistics hero"
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />

        {/* Brand overlay (less generic than plain black gradient) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0
          bg-[radial-gradient(1200px_600px_at_20%_40%,rgba(16,185,129,0.22),transparent_60%),radial-gradient(900px_500px_at_70%_60%,rgba(251,191,36,0.16),transparent_55%),linear-gradient(to_right,rgba(0,0,0,0.86),rgba(0,0,0,0.42),rgba(0,0,0,0.18))]"
        />

        {/* Subtle grain for identity (keeps it from feeling “AI-polished”) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Signature “route lines” motif (brandable, logistics-coded) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[42%] max-w-[520px]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
          <svg
            className="absolute left-6 top-1/2 -translate-y-1/2 opacity-60"
            width="260"
            height="320"
            viewBox="0 0 260 320"
            fill="none"
          >
            <path
              d="M34 20C34 60 86 70 86 110C86 150 34 160 34 200C34 240 102 250 102 290"
              stroke="rgba(16,185,129,0.55)"
              strokeWidth="2"
              strokeDasharray="5 7"
              strokeLinecap="round"
            />
            <path
              d="M118 10C118 52 170 66 170 112C170 160 118 176 118 216C118 256 190 268 190 312"
              stroke="rgba(251,191,36,0.45)"
              strokeWidth="2"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <circle cx="34" cy="20" r="4" fill="rgba(16,185,129,0.9)" />
            <circle cx="102" cy="290" r="4" fill="rgba(16,185,129,0.9)" />
            <circle cx="118" cy="10" r="4" fill="rgba(251,191,36,0.9)" />
            <circle cx="190" cy="312" r="4" fill="rgba(251,191,36,0.9)" />
          </svg>
        </div>

        {/* Content */}
        <div className="absolute inset-0">
          <div className="container h-full">
            <div className="flex h-full items-center">
              <div className="max-w-3xl px-4 sm:px-0">
                {/* Small badge / preheader */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs sm:text-sm text-white/90 backdrop-blur">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
                  End-to-end freight support — fast quotes, clear tracking
                </div>

                <h1 className="mt-4 text-[2.15rem] leading-[1.05] sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                  <span className="text-emerald-300">Cut shipping costs</span>
                  <span className="text-white/95"> without cutting corners.</span>
                </h1>

                <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl">
                  We plan, book, and move your cargo with transparent rates and proactive updates —
                  so your deliveries stay on schedule.
                </p>

                {/* CTA row */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact/"
                    className="group inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                    hover:bg-amber-500 transition"
                  >
                    Get a Free Quote
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/shipping-guide"
                    className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/10 px-6 py-3 font-semibold text-white
                    backdrop-blur hover:bg-white/15 transition"
                  >
                    Shipping Guide
                  </Link>

                  {/* Micro reassurance */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                    Replies within 24 hours
                  </div>
                </div>

                {/* Credibility strip */}
                <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                  {[
                    { k: "Land • Ocean • Air", v: "Freight Options" },
                    { k: "Transparent pricing", v: "No surprise fees" },
                    { k: "Proactive updates", v: "Fewer delays" },
                  ].map((item) => (
                    <div
                      key={item.k}
                      className="rounded-2xl border border-white/12 bg-black/25 px-4 py-3 backdrop-blur-sm"
                    >
                      <div className="text-sm sm:text-base font-semibold text-white">
                        {item.k}
                      </div>
                      <div className="mt-0.5 text-xs sm:text-sm text-white/70">
                        {item.v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom hint line */}
                <div className="mt-6 text-xs text-white/60">
                  Customs • Documentation • Warehousing • Door-to-door coordination
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Soft bottom fade into next section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/35"
        />
      </div>
    </section>
  );
}
