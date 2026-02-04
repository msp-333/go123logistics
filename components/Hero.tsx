// components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  const heroSrc = "/images/hero.png";

  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full min-h-[420px] md:min-h-[520px]">
        <img
          src={heroSrc}
          alt="Logistics hero"
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />

        {/* Less “heavy” than full black, but still strong contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0
          bg-[radial-gradient(1000px_520px_at_18%_40%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(to_right,rgba(0,0,0,0.82),rgba(0,0,0,0.45),rgba(0,0,0,0.12))]"
        />

        {/* Subtle grain = identity without extra “stuff” */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0">
          <div className="container h-full">
            <div className="flex h-full items-center">
              <div className="max-w-3xl px-4 sm:px-0">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs sm:text-sm text-white/90 backdrop-blur">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
                  End-to-end freight support — fast quotes, clear tracking
                </div>

                {/* Headline (tighter rhythm + nicer line-height) */}
                <h1 className="mt-4 text-[2.15rem] leading-[1.02] sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                  <span className="text-emerald-300">Cut shipping costs</span>{" "}
                  without cutting corners.
                </h1>

                {/* Paragraph */}
                <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed">
                  We plan, book, and move your cargo with transparent rates and proactive updates
                  — so your deliveries stay on schedule.
                </p>

                {/* Buttons (more intentional: shape, border, hover, focus) */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact/"
                    className="group inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-900
                    shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:bg-amber-500 transition
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    Get a Free Quote
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/shipping-guide"
                    className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/10 px-6 py-3 font-semibold text-white
                    backdrop-blur hover:bg-white/15 transition
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    Shipping Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Soft bottom fade so the next section doesn’t “hard cut” */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/30"
        />
      </div>
    </section>
  );
}
