// components/Hero.tsx
import Link from "next/link";

const publicPath = (p: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}`;
};

export default function Hero() {
  const heroSrc = "/images/hero.png";

  return (
    <section className="relative overflow-hidden bg-brand-dark">
      <div className="relative w-full min-h-[520px] md:min-h-[620px]">
        {/* Background image */}
        <img
          src={publicPath(heroSrc)}
          alt="Logistics hero"
          className="absolute inset-0 h-full w-full object-cover contrast-105 saturate-90"
          sizes="100vw"
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />

        {/* Elegant overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0
          bg-[linear-gradient(to_right,rgba(0,17,15,0.92),rgba(0,17,15,0.70),rgba(0,17,15,0.35))]"
        />

        {/* Subtle structure grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Hero content (centered) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="container w-full py-12 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-xs sm:text-sm text-white/85">
                <span className="inline-block h-2 w-2 rounded-full bg-brand-green" />
                End-to-end freight support — fast quotes, clear tracking
              </div>

              {/* Headline */}
              <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
                <span className="block">Cut Shipping Costs</span>
                <span className="block">Without Cutting Corners</span>
              </h1>

              {/* Paragraph */}
              <p className="mt-4 mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-white/75 leading-relaxed">
                We plan, book, and move your cargo with transparent rates and proactive updates
                <br className="hidden sm:block" />
                so your deliveries stay on schedule.
              </p>

              {/* CTA */}
              <div className="mt-7 flex flex-col items-center gap-3">
                <Link
                  href="/contact"
                  className="
                    inline-flex items-center justify-center rounded-md
                    bg-brand-green px-8 py-3.5 text-sm font-semibold text-brand-dark
                    shadow-[0_10px_28px_rgba(0,0,0,0.25)]
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:opacity-95
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green
                    focus-visible:ring-offset-2 focus-visible:ring-offset-black/40
                  "
                >
                  Get a Free Quote
                </Link>

                <Link
                  href="/shipping-guide"
                  className="text-sm text-white/70 hover:text-white underline underline-offset-4 transition"
                >
                  Shipping Guide
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade (reduced) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/30"
        />
      </div>
    </section>
  );
}
