// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — GO123 Logistics",
  description:
    "Logistics done right: clear pricing, proactive updates, and protected freight from quote to proof-of-delivery.",
};

const shell = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";
const sectionPad = "py-12 sm:py-16";
const title =
  "text-center text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight";
const lead =
  "mt-3 text-center text-slate-600 max-w-2xl mx-auto text-[15px] sm:text-base leading-6 sm:leading-7";
const card =
  "group rounded-2xl border border-slate-100/80 bg-white/85 backdrop-blur shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md";

const publicPath = (p: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}`;
};

export default function AboutPage() {
  const steps = [
    {
      t: "Plan",
      d: "Determine needs or clarify needs and confirm scope, service level, constraints, and guarantees.",
    },
    {
      t: "Price",
      d: "Comparative pricing across multiple carriers so you can make the best informed decision.",
    },
    {
      t: "Protect",
      d: "Tracking enabled with confirmations at every step—so you can rest easy knowing your freight is moving as it should be.",
    },
    {
      t: "Move",
      d: "From origin to destination, we manage the move end-to-end and keep you updated throughout—so you don’t have to.",
    },
    {
      t: "Deliver",
      d: "Scheduled appointments, site-requirement coordination, and signed delivery confirmation, have you rest assured your freight arrived exactly as intended.",
    },
    { t: "Support", d: "On call followup and claims support when needed." },
  ];

  const values = [
    { t: "Integrity", d: "Say it clearly. Do it as communicated." },
    { t: "Care", d: "We treat every shipment as if it were our own." },
    { t: "Transparency", d: "Clear pricing, clear updates, clear communication." },
    {
      t: "Reliability",
      d: "Our agents serve as your trusted partner—bringing reliability to your logistics needs.",
    },
  ];

  return (
    <article className="relative bg-[radial-gradient(900px_520px_at_50%_-8%,rgba(0,200,83,0.10),transparent_60%),linear-gradient(to_bottom,#f8fafc,white)]">
      {/* ---------- HERO (left-aligned now) ---------- */}
      <section
        aria-labelledby="about-hero"
        className="relative overflow-hidden py-8 sm:py-10"
      >
        {/* Decorative background (subtle, using brand.green) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-56 w-[34rem] -translate-x-1/2 rounded-full bg-brand-green/10 blur-3xl" />
          <div className="absolute -bottom-40 right-[-7rem] h-64 w-64 rounded-full bg-brand-green/5 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
        </div>

        <div className={shell}>
          {/* left aligned on all breakpoints */}
          <div className="max-w-2xl text-left">
            <p className="inline-flex items-center justify-start gap-2 text-brand-green font-semibold tracking-widest uppercase text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden />
              About Us
            </p>

            <h1
              id="about-hero"
              className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight"
            >
              <span className="relative">
                <span
                  aria-hidden
                  className="absolute -inset-x-2 -inset-y-1 -z-10 rounded-2xl bg-brand-light/70"
                />
                Built after a move went wrong—so yours doesn’t.
              </span>
            </h1>

            <p className="mt-3 text-slate-700 text-[15px] sm:text-base leading-6 sm:leading-7 max-w-xl">
              GO123 Logistics plans, moves, and delivers freight across LTL, FTL, final-mile, and
              international lanes. Our promise is simple: protect what matters and keep you informed
              from quote to proof-of-delivery.
            </p>

            {/* Chips (left aligned) */}
            <ul className="mt-5 flex flex-wrap justify-start gap-2">
              {["Honest pricing", "Proactive updates", "Protected freight"].map((label) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-light/80 px-3 py-1.5 text-[13px] font-medium text-brand-dark ring-1 ring-brand-green/15 shadow-sm transition hover:bg-brand-light focus-within:ring-2 focus-within:ring-brand-green/30"
                >
                  <svg
                    className="h-4 w-4 text-brand-green"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z" />
                  </svg>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className={`${sectionPad} pt-8 sm:pt-10`}>
        <div className={shell}>
          <div className="rounded-3xl border border-slate-100/80 bg-white/70 backdrop-blur shadow-soft p-6 sm:p-10">
            <h2 id="values-title" className={title}>
              Values we live by
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, i) => (
                <div key={i} className={`${card} p-6 text-center`}>
                  <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-brand-light text-brand-green ring-1 ring-brand-green/15 transition group-hover:scale-[1.02]">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>

                  <div className="text-xs uppercase tracking-wide text-brand-green font-semibold">
                    {v.t}
                  </div>
                  <p className="mt-2 text-slate-700 text-[15px] leading-6">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- OUR STORY ---------- */}
      <section className={sectionPad}>
        <div className={shell} aria-labelledby="story-title">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-slate-200/70 shadow-soft">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${publicPath("/images/aboutus-1.png")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(255,255,255,0.90),rgba(255,255,255,0.98))]"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-green/70 via-brand-green/30 to-transparent"
            />

            <div className="relative p-6 sm:p-10">
              <div className="max-w-4xl mx-auto">
                <h2 id="story-title" className={title}>
                  Our story
                </h2>

                <div className="mt-6 space-y-4 text-slate-800 text-[16px] leading-7">
                  <p>
                    In <strong>2010</strong>, our family moved from the <strong>Caribbean</strong> to the{" "}
                    <strong>United States</strong>. We prepared everything the right way—fully palletized,
                    shrink-wrapped, and sealed properly—so the container left the origin site correctly.
                  </p>

                  <p>
                    But when it arrived in the U.S., the shipping company dismantled the container and
                    mixed our goods with other customers’ freight for their benefit. What was promised as a{" "}
                    <strong>two-week delivery</strong> stretched into months.
                  </p>

                  <p>
                    In the end, about <strong>40 boxes</strong> were missing. Other people’s belongings
                    showed up instead, and the boxes we did receive were smashed, crammed, and broken. Then
                    the driver attempted to extort extra payment at delivery. It turned into a standoff—but
                    our family stood their ground.
                  </p>

                  <p>
                    The lesson was clear: integrity isn’t optional. From that moment on, it became
                    non-negotiable.
                  </p>

                  <p>
                    GO123 Logistics was built around integrity—treating people and their freight the right
                    way. No one else should have to learn the hard way. <strong>Welcome home!</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HOW WE WORK ---------- */}
      <section className={`${sectionPad} bg-white`}>
        <div className={shell} aria-labelledby="work-title">
          <h2 id="work-title" className={title}>
            How we work
          </h2>
          <p className={lead}>
            A repeatable process that keeps you informed, protects your freight, and prevents surprises.
          </p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {steps.map((s, i) => (
              <li key={i} className={`${card} relative overflow-hidden p-6`}>
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-green/80 via-brand-green/35 to-transparent"
                />
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green text-white text-[13px] font-semibold tabular-nums ring-4 ring-brand-light transition group-hover:scale-[1.03]"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-base md:text-lg font-semibold text-slate-900">{s.t}</h3>
                </div>
                <p className="mt-2 text-slate-600 text-[15px] leading-6">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className={`${sectionPad} pb-16`}>
        <div className={shell} aria-labelledby="cta-title">
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark shadow-soft ring-1 ring-white/10">
            <div
              aria-hidden
              className="absolute inset-0
                bg-[radial-gradient(900px_520px_at_18%_20%,rgba(0,200,83,0.30),transparent_60%),linear-gradient(to_right,rgba(0,0,0,0.70),rgba(0,0,0,0.42),rgba(0,0,0,0.22))]"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-green" />
            <div aria-hidden className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-green/15 blur-3xl" />

            <div className="relative p-6 sm:p-10">
              <div className="grid md:grid-cols-5 items-center gap-6">
                <div className="md:col-span-3 text-center md:text-left">
                  <h3 id="cta-title" className="text-xl md:text-2xl font-semibold text-white">
                    Ready to ship with confidence?
                  </h3>
                  <p className="mt-2 text-white/75 md:text-base">
                    Build a transparent, step-by-step plan you can trust—tailored to your lanes,
                    timelines, and budget.
                  </p>
                </div>

                <div className="md:col-span-2 md:justify-self-end text-center md:text-right">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-brand-green text-brand-dark px-5 py-2.5 font-semibold hover:opacity-95 shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                  >
                    Get a Free Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
