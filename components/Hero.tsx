// components/Hero.tsx
import Link from "next/link";
import Navbar from "./Navbar";

const publicPath = (p: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}`;
};

export default function Hero() {
  const heroSrc = "/images/hero.png";

  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full min-h-[560px] md:min-h-[680px]">
        {/* Background image */}
        <img
          src={publicPath(heroSrc)}
          alt="Logistics hero"
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />

        {/* Dark overlay for readability (keep hero strong) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0
          bg-[radial-gradient(1000px_520px_at_18%_40%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(to_right,rgba(0,0,0,0.72),rgba(0,0,0,0.42),rgba(0,0,0,0.12))]"
        />

        {/* Subtle grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10">
          <div className="container">
            {/* top padding leaves room for navbar height */}
            <div className="pt-28 md:pt-32 pb-16 md:pb-20">
              <div className="mx-auto max-w-4xl text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-white/10 px-3 py-1 text-xs sm:text-sm text-white/90 backdrop-blur">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
                  End-to-end freight support — fast quotes, clear tracking
                </div>

                {/* Headline */}
                <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05] drop-shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
                  <span className="block">Cut Shipping Costs</span>
                  <span className="block">Without Cutting Corners</span>
                </h1>

                {/* Paragraph */}
                <p className="mt-5 mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
                  We plan, book, and move your cargo with transparent rates and proactive updates
                  <br className="hidden sm:block" />
                  so your deliveries stay on schedule.
                </p>

                {/* CTA */}
                <div className="mt-10 flex flex-col items-center gap-3">
                  <Link
                    href="/contact/"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-8 py-3 text-sm font-semibold text-white
                    shadow-[0_18px_55px_rgba(16,185,129,0.22)] hover:bg-emerald-300 transition
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    Get a Free Quote
                  </Link>

                  <Link
                    href="/shipping-guide"
                    className="text-sm text-white/75 hover:text-white underline underline-offset-4 transition"
                  >
                    Shipping Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Soft bottom fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/30"
        />
      </div>
    </section>
  );
}
