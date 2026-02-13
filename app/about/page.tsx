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
      {/* ---------- HERO (DARK) ---------- */}
      <section aria-labelledby="about-hero" className="relative overflow-hidden bg-brand-dark">
        {/* Soft glow + gradient */}
        <div
          aria-hidden
          className="absolute inset-0
            bg-[radial-gradient(900px_520px_at_18%_20%,rgba(0,200,83,0.28),transparent_60%),linear-gradient(to_right,rgba(0,0,0,0.78),rgba(0,0,0,0.46),rgba(0,0,0,0.24))]"
        />
        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] mix-blend-screen"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className={shell}>
          <div className="relative py-12 sm:py-14 lg:py-16">
            <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left">
              <p className="text-brand-green font-semibold tracking-widest uppercase text-[11px]">
                About Us
              </p>

              <h1
                id="about-hero"
                className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight"
              >
                Built after a move went wrong—so yours doesn’t.
              </h1>

              <p className="mt-4 text-white/80 text-[15px] sm:text-base leading-6 sm:leading-7 max-w-2xl">
                GO123 Logistics plans, moves, and delivers freight across LTL, FTL, final-mile, and
                international lanes. Our promise is simple: protect what matters and keep you
                informed from quote to proof-of-delivery.
              </p>

              {/* Chips */}
              <ul className="mt-5 flex flex-wrap justify-center md:justify-start gap-2">
                {["Honest pricing", "Proactive updates", "Protected freight"].map((label) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white ring-1 ring-white/15 backdrop-blur"
                  >
                    <svg className="h-4 w-4 text-brand-green" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                  className="inline-flex items-center justify-center rounded-lg bg-brand-green text-brand-dark px-6 py-3 font-semibold shadow-soft hover:opacity-95"
                >
                  Get a Free Quote
                </Link>
                <Link
                  href="/shipping-guide"
                  className="inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 shadow-soft backdrop-blur"
                >
                  Shipping Guide
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Clean divider + green accent */}
        <div className="h-px bg-white/10" />
        <div className="h-1.5 bg-brand-green" />
      </section>

      {/* ---------- VALUES (MOVED UP) ---------- */}
      <section className={shell} aria-labelledby="values-title">
        <div className="py-10 sm:py-12 lg:py-14">
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
        </div>
      </section>

      <SectionDivider />

      {/* ---------- OUR STORY (MOVED AFTER VALUES) ---------- */}
      <section className="relative overflow-hidden">
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
          className="absolute inset-0
            bg-[linear-gradient(to_bottom,rgba(255,255,255,0.70),rgba(255,255,255,0.92),rgba(255,255,255,0.98))]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,.20) 1px, transparent 1px),linear-gradient(90deg, rgba(15,23,42,.20) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative py-10 sm:py-12 lg:py-14">
          <section className={shell} aria-labelledby="story-title">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-3xl border border-white/60 bg-white/85 backdrop-blur shadow-soft p-6 sm:p-8">
                <h2
                  id="story-title"
                  className="text-center text-2xl md:text-3xl font-bold text-slate-900"
                >
                  Our story
                </h2>

                <div className="mt-5 space-y-4 text-slate-800 text-[16px] leading-7">
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

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Stat label="Founded on" value="Integrity" />
                    <Stat label="Focus" value="Protected freight" />
                    <Stat label="Promise" value="Proactive updates" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white"
        />
      </section>

      <SectionDivider />

      {/* ---------- HOW WE WORK (MOVED AFTER STORY) ---------- */}
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

      {/* ---------- CTA (NO STRIPES) ---------- */}
      <section className={shell} aria-labelledby="cta-title">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-brand-dark shadow-soft">
          {/* Background glow + gradient */}
          <div
            aria-hidden
            className="absolute inset-0 z-0
              bg-[radial-gradient(800px_460px_at_18%_20%,rgba(0,200,83,0.32),transparent_60%),linear-gradient(to_right,rgba(0,0,0,0.70),rgba(0,0,0,0.42),rgba(0,0,0,0.22))]"
          />

          {/* Subtle bottom fade (no repeating stripes) */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-0 h-24
              bg-gradient-to-t from-black/35 via-black/10 to-transparent"
          />

          <div className="relative z-10 p-6 md:p-8">
            <div className="grid md:grid-cols-5 items-center gap-6">
              <div className="md:col-span-3 text-center md:text-left">
                <h3 id="cta-title" className="text-xl md:text-2xl font-semibold text-white">
                  Ready to ship with confidence?
                </h3>
                <p className="mt-1 text-white/75 md:text-base">
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

          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-green" />
        </div>
      </section>

      <div className="h-10" />
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
