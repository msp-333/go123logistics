// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — GO123 Logistics",
  description:
    "Logistics done right: clear pricing, proactive updates, and protected freight from quote to proof-of-delivery.",
};

const shell = "mx-auto max-w-6xl px-4 sm:px-6";
const card =
  "rounded-2xl border border-slate-100 bg-white shadow-soft transition-shadow hover:shadow-md";

export default function AboutPage() {
  const steps = [
    { t: "Plan", d: "Determine needs or clarify needs and confirm scope, service level, constraints, and guarantees." },
    { t: "Price", d: "Comparative pricing across multiple carries so you can make the best informed decision." },
    { t: "Protect", d: "Tracking enabled with confirmations at every step—so you can rest easy knowing your freight is in good hands." },
    { t: "Move", d: "From origin to destination, we manage the move end-to-end and keep you updated throughout—so you don’t have to." },
    { t: "Deliver", d: "Scheduled appointments, site-requirement coordination, and signed delivery confirmation, have you rest assured your freight arrived exactly as intended." },
    { t: "Support", d: "On call followup and claims support when needed." },
  ];

  const values = [
    { t: "Integrity", d: "Say it clearly. Do it exactly." },
    { t: "Care", d: "We treat every shipment as if it were our own." },
    { t: "Transparency", d: "Clear pricing, clear updates, clear communication." },
    { t: "Reliability", d: "Our agents serve as your trusted partner—bringing reliability to your logistics needs." },
  ];

  return (
    <article className="py-10 sm:py-12 lg:py-14 bg-white">
      {/* ---------- HERO ---------- */}
      <section className={shell} aria-labelledby="about-hero">
        <div
          className={[
            "relative overflow-hidden",
            "rounded-3xl border border-emerald-100 shadow-soft",
            "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
          ].join(" ")}
        >
          {/* Subtle texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.18), transparent 45%), radial-gradient(circle at 80% 30%, rgba(20,184,166,0.12), transparent 50%)",
            }}
          />

          <div className="relative grid gap-6 md:grid-cols-12 items-center px-6 py-7 md:px-8 md:py-10">
            {/* Text */}
            <div className="md:col-span-7 lg:col-span-7 text-center md:text-left">
              <p className="text-emerald-700 font-semibold tracking-widest uppercase text-[11px]">
                About Us
              </p>

              <h1
                id="about-hero"
                className="mt-1 text-3xl lg:text-[34px] font-extrabold text-slate-900 leading-tight tracking-tight"
              >
                Built after a move went wrong—so yours doesn’t.
              </h1>

              <p className="mt-3 text-slate-700 text-[15px] leading-6 max-w-2xl md:max-w-none mx-auto md:mx-0">
                GO123 Logistics plans, moves, and delivers freight across LTL, FTL, final-mile, and
                international lanes. Our promise is simple: protect what matters and keep you informed
                from quote to proof-of-delivery.
              </p>

              {/* Chips */}
              <ul className="mt-5 flex flex-wrap justify-center md:justify-start gap-2">
                {["Honest pricing", "Proactive updates", "Protected freight"].map((label) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[13px] font-medium text-emerald-800 ring-1 ring-emerald-100"
                  >
                    <svg
                      className="h-4 w-4"
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

              {/* CTA row */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-5 py-2.5 font-semibold hover:bg-emerald-700 shadow-soft"
                >
                  Get a Free Quote
                </Link>
                <Link
                  href="/shipping-guide"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-soft"
                >
                  Shipping Guide
                </Link>
              </div>
            </div>

            {/* Visual (right) */}
            <div className="md:col-span-5 lg:col-span-5">
              <div className="relative h-44 sm:h-56 md:h-[240px] rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-soft">
                <img
                  src="/images/aboutus-1.png"
                  alt="Secure freight loaded inside a trailer"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-black/10 to-transparent pointer-events-none" />

                {/* Mini caption pill */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-slate-900 ring-1 ring-white/60">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    Photo-verified handling
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ---------- OUR STORY ---------- */}
      <section className={shell} aria-labelledby="story-title">
        <div className="max-w-4xl mx-auto">
          <h2
            id="story-title"
            className="text-center text-2xl md:text-3xl font-bold text-slate-900"
          >
            Our story
          </h2>

          <div className="mt-5 space-y-4 text-slate-800 text-[16px] leading-7">
            <p>
              In <strong>2010</strong>, our family moved from the <strong>Caribbean Islands</strong> back
              to the <strong>United States</strong>. We did everything right—palletized, shrink-wrapped,
              sealed. But once the container reached the U.S., the shipment was taken apart and mixed
              with others. A promised two-week delivery dragged into months.
            </p>
            <p>
              Boxes went missing—about <strong>40</strong>—and what did arrive told the story: smashed,
              crammed, poorly handled. At delivery we were pressured for extra payment, or the driver
              would leave with what was left. It was a low point and a clear lesson.
            </p>
            <p>
              That day we decided to build a logistics company that treats people and their freight
              with <strong>integrity</strong>. GO123 Logistics exists so no one else has to learn the
              hard way.
            </p>
          </div>

          {/* Story highlight */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Founded on" value="Integrity" />
              <Stat label="Focus" value="Protected freight" />
              <Stat label="Promise" value="Proactive updates" />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ---------- HOW WE WORK ---------- */}
      <section className={shell} aria-labelledby="work-title">
        <h2 id="work-title" className="text-center text-2xl md:text-3xl font-bold text-slate-900">
          How we work
        </h2>
        <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">
          A repeatable process that keeps you informed, protects your freight, and prevents surprises.
        </p>

        <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {steps.map((s, i) => (
            <li key={i} className={`${card} p-5 md:p-6`}>
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
      </section>

      <SectionDivider />

      {/* ---------- VALUES ---------- */}
      <section className={shell} aria-labelledby="values-title">
        <h2 id="values-title" className="text-center text-2xl md:text-3xl font-bold text-slate-900">
          Values we live by
        </h2>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={i} className={`${card} p-5 md:p-6 text-center`}>
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
      </section>

      <SectionDivider />

      {/* ---------- CTA ---------- */}
      <section className={shell} aria-labelledby="cta-title">
        <div className="rounded-3xl border border-emerald-100 p-6 md:p-8 shadow-soft bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-teal-50">
          <div className="grid md:grid-cols-5 items-center gap-6">
            <div className="md:col-span-3 text-center md:text-left">
              <h3 id="cta-title" className="text-xl md:text-2xl font-semibold text-slate-900">
                Ready to ship with confidence?
              </h3>
              <p className="mt-1 text-slate-700 md:text-base">
                Build a transparent, step-by-step plan you can trust—tailored to your lanes, timelines, and budget.
              </p>
            </div>

            <div className="md:col-span-2 md:justify-self-end text-center md:text-right">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-5 py-2.5 font-semibold hover:bg-emerald-700 shadow-soft"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

/* ---------- small components ---------- */
function SectionDivider() {
  return (
    <div className="my-9">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <hr className="h-px w-full border-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{label}</div>
      <div className="mt-1 text-lg font-bold text-slate-900">{value}</div>
    </div>
  );
}
