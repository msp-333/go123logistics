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
  "rounded-2xl border border-slate-100 bg-white shadow-soft transition-shadow hover:shadow-md";

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
    <article className="bg-white">
      {/* ---------- HERO (right-aligned content on desktop) ---------- */}
      <section aria-labelledby="about-hero" className={sectionPad}>
        <div className={shell}>
          {/* keep centered on mobile, align to the right on md+ */}
          <div className="max-w-3xl mx-auto md:ml-auto md:mr-0 text-center md:text-right">
            <p className="text-emerald-700 font-semibold tracking-widest uppercase text-[11px]">
              About Us
            </p>

            <h1
              id="about-hero"
              className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight"
            >
              Built after a move went wrong—so yours doesn’t.
            </h1>

            <p className="mt-4 text-slate-700 text-[15px] sm:text-base leading-6 sm:leading-7 max-w-2xl md:ml-auto">
              GO123 Logistics plans, moves, and delivers freight across LTL, FTL, final-mile, and
              international lanes. Our promise is simple: protect what matters and keep you informed
              from quote to proof-of-delivery.
            </p>

            {/* Chips */}
            <ul className="mt-6 flex flex-wrap justify-center md:justify-end gap-2">
              {["Honest pricing", "Proactive updates", "Protected freight"].map((label) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-800 ring-1 ring-emerald-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z" />
                  </svg>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={shell} aria-labelledby="values-title">
          <h2 id="values-title" className={title}>
            Values we live by
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={i} className={`${card} p-6 text-center`}>
                <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
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

                <div className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">
                  {v.t}
                </div>
                <p className="mt-2 text-slate-700 text-[15px] leading-6">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- OUR STORY ---------- */}
      <section className={sectionPad}>
        <div className={shell} aria-labelledby="story-title">
          <div className="relative overflow-hidden rounded-3xl">
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
              className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.92),rgba(255,255,255,0.98))]"
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
              <li key={i} className={`${card} p-6`}>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[13px] font-semibold tabular-nums ring-4 ring-emerald-50"
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
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark shadow-soft">
            <div
              aria-hidden
              className="absolute inset-0
                bg-[radial-gradient(900px_520px_at_18%_20%,rgba(0,200,83,0.30),transparent_60%),linear-gradient(to_right,rgba(0,0,0,0.70),rgba(0,0,0,0.42),rgba(0,0,0,0.22))]"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-green" />

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
                    className="inline-flex items-center justify-center rounded-lg bg-brand-green text-brand-dark px-5 py-2.5 font-semibold hover:opacity-95 shadow-soft"
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
