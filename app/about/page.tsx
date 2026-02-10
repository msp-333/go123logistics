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
      {/* ---------- HERO ---------- */}
      <section className={shell} aria-labelledby="about-hero">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft">
          {/* Dark-to-light header band (ties to your site’s dark identity without changing content) */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,17,15,0.92),rgba(0,17,15,0.70),rgba(0,17,15,0.35))]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            <div className="relative grid gap-8 md:grid-cols-12 items-center px-6 py-9 md:px-10 md:py-12">
              {/* Text */}
              <div className="md:col-span-7 lg:col-span-7 text-center md:text-left">
                <p className="text-white/70 font-semibold tracking-widest uppercase text-[11px]">
                  About Us
                </p>

                <h1
                  id="about-hero"
                  className="mt-2 text-3xl lg:text-[34px] font-semibold text-white leading-tight tracking-tight"
                >
                  Built after a move went wrong—so yours doesn’t.
                </h1>

                <p className="mt-4 text-white/75 text-[15px] leading-6 max-w-2xl md:max-w-none mx-auto md:mx-0">
                  GO123 Logistics plans, moves, and delivers freight across LTL, FTL, final-mile, and
                  international lanes. Our promise is simple: protect what matters and keep you
                  informed from quote to proof-of-delivery.
                </p>

                {/* Chips */}
                <ul className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
                  {["Honest pricing", "Proactive updates", "Protected freight"].map((label) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white/85 ring-1 ring-white/15 backdrop-blur"
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

                {/* CTA row */}
                <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-brand-green text-brand-dark px-5 py-2.5 font-semibold hover:opacity-95 shadow-soft"
                  >
                    Get a Free Quote
                  </Link>
                  <Link
                    href="/shipping-guide"
                    className="inline-flex items-center justify-center rounded-lg bg-white/10 px-5 py-2.5 font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 shadow-soft"
                  >
                    Shipping Guide
                  </Link>
                </div>
              </div>

              {/* Visual (right) */}
              <div className="md:col-span-5 lg:col-span-5">
                <div className="relative h-44 sm:h-56 md:h-[260px] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-soft">
                  <img
                    src="/images/aboutus-1.png"
                    alt="Secure freight loaded inside a trailer"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/15 to-transparent pointer-events-none" />

                  {/* Mini caption pill */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15">
                      <span className="inline-block h-2 w-2 rounded-full bg-brand-green" aria-hidden="true" />
                      Photo-verified handling
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent line to match your site */}
            <div className="h-1.5 bg-brand-green" />
          </div>
        </div>
      </section>

      {/* consistent spacing rhythm (no extra content) */}
      <SectionDivider />

      {/* ---------- OUR STORY ---------- */}
      <section className={shell} aria-labelledby="story-title">
        <div className="max-w-4xl mx-auto">
          <h2 id="story-title" className="text-center text-2xl md:text-3xl font-semibold text-slate-900">
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

          {/* Story highlight */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
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
        <h2 id="work-title" className="text-center text-2xl md:text-3xl font-semibold text-slate-900">
          How we work
        </h2>
        <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">
          A repeatable process that keeps you informed, protects your freight, and prevents surprises.
        </p>

        {/* Connected “route” stepper (same content, stronger logistics identity) */}
        <div className="mt-8 relative">
          <div
            aria-hidden
            className="hidden lg:block absolute left-6 right-6 top-[20px] h-px bg-slate-200/80"
          />
          <div
            aria-hidden
            className="hidden lg:block absolute left-6 right-6 top-[20px] h-px opacity-35
            [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.0)_0,rgba(0,0,0,0.0)_10px,rgba(15,23,42,0.18)_10px,rgba(15,23,42,0.18)_12px)]"
          />

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {steps.map((s, i) => (
              <li
                key={i}
                className={[
                  "group relative overflow-hidden",
                  "rounded-2xl border border-slate-200/70 bg-white shadow-soft",
                  "p-5 md:p-6 transition-all duration-200",
                  "hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,0,0,0.10)]",
                ].join(" ")}
              >
                {/* top accent (identity) */}
                <div className="absolute inset-x-0 top-0 h-1 bg-brand-green/80" />

                <div className="flex items-center gap-3">
                  <span
                    className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 text-[13px] font-semibold tabular-nums ring-4 ring-slate-50 border border-slate-200 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-base md:text-lg font-semibold text-slate-900">{s.t}</h3>
                </div>

                <p className="mt-2 text-slate-600 text-[15px] leading-6">{s.d}</p>

                {/* subtle bottom divider to “engineer” the card */}
                <div className="mt-5 h-px bg-slate-100" />
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-green" />
                  <span>Step-by-step clarity</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SectionDivider />

      {/* ---------- VALUES ---------- */}
      <section className={shell} aria-labelledby="values-title">
        <h2 id="values-title" className="text-center text-2xl md:text-3xl font-semibold text-slate-900">
          Values we live by
        </h2>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 md:p-6 text-center shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,0,0,0.10)]"
            >
              {/* subtle accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-brand-green/70" />

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
        <div className="rounded-3xl border border-slate-200/70 p-6 md:p-8 shadow-soft bg-slate-50">
          <div className="grid md:grid-cols-5 items-center gap-6">
            <div className="md:col-span-3 text-center md:text-left">
              <h3 id="cta-title" className="text-xl md:text-2xl font-semibold text-slate-900">
                Ready to ship with confidence?
              </h3>
              <p className="mt-1 text-slate-700 md:text-base">
                Build a transparent, step-by-step plan you can trust—tailored to your lanes,
                timelines, and budget.
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

      {/* breathing room consistent with the rest of your site */}
      <div className="py-6" />
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
