// app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — GO123 Logistics",
  description:
    "Logistics done right: clear pricing, proactive updates, and protected freight from quote to proof-of-delivery.",
};

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const shell = "mx-auto max-w-6xl px-4 sm:px-6";
const card = "rounded-2xl border border-slate-100 bg-white shadow-soft";

export default function AboutPage() {
  const steps = [
    { t: "Plan", d: "Confirm scope, service level, constraints, and risks." },
    { t: "Price", d: "Itemized quote—no hidden fees or last-minute upsells." },
    { t: "Protect", d: "Packing guidance, labels, seals, and photo checkpoints." },
    { t: "Move", d: "Pickup, linehaul, and milestones with proactive updates." },
    { t: "Deliver", d: "Appointment, site requirements, and photo-verified handoff." },
    { t: "Support", d: "Post-delivery check and a clear, documented claims path." },
  ];

  const values = [
    { t: "Integrity", d: "Say it clearly. Do it exactly." },
    { t: "Care", d: "Treat every pallet like it’s ours." },
    { t: "Transparency", d: "Clear pricing, clear updates, clear ownership." },
    { t: "Reliability", d: "Processes that withstand real-world variability." },
  ];

  return (
    <article className="py-10 sm:py-12 lg:py-14">
      {/* ---------- HERO (transparent emerald, compact, balanced) ---------- */}
      <section className={shell} aria-labelledby="about-hero">
        <div
          className={[
            "relative overflow-hidden grid md:grid-cols-12 items-center",
            "px-6 py-7 md:px-8 md:py-8 rounded-2xl shadow-soft",
            "bg-gradient-to-r from-emerald-50/70 to-emerald-50/30 backdrop-blur-[2px]",
          ].join(" ")}
        >
          {/* Text — centered on mobile, left on md+ for natural scan */}
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
            <p className="mt-2 text-slate-700 text-[15px] leading-6 max-w-2xl md:max-w-none mx-auto md:mx-0">
              GO123 Logistics plans, moves, and delivers freight across LTL, FTL, final-mile, and
              international lanes. Our promise is simple: protect what matters and keep you informed
              from quote to proof-of-delivery.
            </p>

            {/* Distinction chips — compact, scannable */}
            <ul className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {["Honest pricing", "Proactive updates", "Protected freight"].map((label) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[13px] font-medium text-emerald-800 ring-1 ring-emerald-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z" />
                  </svg>
                  <span className="sr-only">Benefit:</span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-5 py-2.5 font-semibold hover:bg-emerald-700 shadow-soft"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>

          {/* Visual (right) — restrained height for a tidy hero */}
          <div className="md:col-span-5 lg:col-span-5 relative h-40 sm:h-52 md:h-[220px] lg:h-[240px] rounded-xl overflow-hidden mt-5 md:mt-0">
            <Image
              src={`${base}/images/aboutus-1.png`}
              alt="Secure freight loaded inside a trailer"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ---------- OUR STORY (centered heading; readable left body in centered column) ---------- */}
      <section className={shell} aria-labelledby="story-title">
        <h2 id="story-title" className="text-center text-2xl md:text-3xl font-bold text-slate-900">
          Our story
        </h2>
        <div className="mt-3 mx-auto max-w-3xl space-y-4 text-slate-800 text-[16px] leading-7">
          <p>
            In <strong>2010</strong>, our family moved from the <strong>Virgin Islands</strong> back to
            <strong> Lake Tahoe</strong>. We did everything right—palletized, shrink-wrapped, sealed.
            But once the container reached the U.S., the shipment was taken apart and mixed with others.
            A promised two-week delivery dragged into months.
          </p>
          <p>
            Boxes went missing—about <strong>40</strong>—and what did arrive told the story: smashed,
            crammed, poorly handled. At delivery we were pressured for extra payment, or the driver would
            leave with what was left. It was a low point and a clear lesson.
          </p>
          <p>
            That day we decided to build a logistics company that treats people and their freight with{" "}
            <strong>integrity</strong>. GO123 Logistics exists so no one else has to learn the hard way.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* ---------- HOW WE WORK (centered heading; friendly card rhythm) ---------- */}
     <section className={shell} aria-labelledby="work-title">
  <h2 id="work-title" className="text-center text-2xl md:text-3xl font-bold text-slate-900">
    How we work
  </h2>

  <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
    {steps.map((s, i) => (
      <li key={i} className={`${card} p-5 md:p-6`}>
        {/* Title row: badge + title, LEFT aligned */}
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[13px] font-semibold tabular-nums"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <h3 className="text-base md:text-lg font-semibold text-slate-900">{s.t}</h3>
        </div>

        {/* Body copy, LEFT aligned */}
        <p className="mt-2 text-slate-600 text-[15px] leading-6">{s.d}</p>
      </li>
    ))}
  </ol>
</section>

      <SectionDivider />

      {/* ---------- VALUES (centered heading + cards) ---------- */}
      <section className={shell} aria-labelledby="values-title">
        <h2 id="values-title" className="text-center text-2xl md:text-3xl font-bold text-slate-900">
          Values we live by
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={i} className={`${card} p-5 md:p-6 text-center`}>
              <div className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">
                {v.t}
              </div>
              <p className="mt-2 text-slate-700 text-[15px] leading-6">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ---------- CTA (balanced two-column; mobile-friendly center) ---------- */}
      <section className={shell} aria-labelledby="cta-title">
        <div className="rounded-3xl border border-emerald-100 p-6 md:p-8 shadow-soft bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-teal-50">
          <div className="grid md:grid-cols-5 items-center gap-6">
            <div className="md:col-span-3 text-center md:text-left">
              <h3 id="cta-title" className="text-xl md:text-2xl font-semibold text-slate-900">
                Ready to ship with confidence?
              </h3>
              <p className="mt-1 text-slate-700 md:text-base">
                Get a transparent, itemized plan you can trust—tailored to your lanes and timelines.
              </p>
            </div>
            <div className="md:col-span-2 md:justify-self-end text-center md:text-right">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-5 py-2.5 font-semibold hover:bg-emerald-700 shadow-soft"
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

/* ---------- tiny helper for consistent, light dividers ---------- */
function SectionDivider() {
  return (
    <div className="my-9">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <hr className="h-px w-full border-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </div>
  );
}
