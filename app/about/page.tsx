import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — GO123 Logistics',
  description:
    'Logistics done right: clear pricing, proactive updates, and protected freight from quote to proof-of-delivery.',
};

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const shell = 'mx-auto max-w-6xl px-4 sm:px-6'; // centered container
const card = 'rounded-2xl border border-slate-100 bg-white shadow-soft';

export default function AboutPage() {
  const steps = [
    { t: 'Plan', d: 'Confirm scope, service level, constraints, and risks.' },
    { t: 'Price', d: 'Itemized quote—no hidden fees or last-minute upsells.' },
    { t: 'Protect', d: 'Packing guidance, labels, seals, and photo checkpoints.' },
    { t: 'Move', d: 'Pickup, linehaul, and milestones with proactive updates.' },
    { t: 'Deliver', d: 'Appointment, site requirements, and photo-verified handoff.' },
    { t: 'Support', d: 'Post-delivery check and a clear, documented claims path.' },
  ];

  const values = [
    { t: 'Integrity', d: 'Say it clearly. Do it exactly.' },
    { t: 'Care', d: 'Treat every pallet like it’s ours.' },
    { t: 'Transparency', d: 'Clear pricing, clear updates, clear ownership.' },
    { t: 'Reliability', d: 'Processes that withstand real-world variability.' },
  ];

  return (
    <article className="py-14 sm:py-16 lg:py-20">
      {/* HERO (centered) */}
      <section
        className={`${shell} relative overflow-hidden rounded-3xl border border-slate-100 shadow-soft min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex items-center`}
      >
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={`${base}/images/about-1.png`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/25 to-transparent" />
        </div>

        <div className="relative w-full text-center">
          <p className="text-emerald-700 font-medium tracking-wide uppercase text-xs">
            About Us
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mx-auto max-w-4xl">
            Built after a move went wrong—so yours doesn’t.
          </h1>
          <p className="mt-4 text-slate-700 mx-auto max-w-3xl md:text-lg">
            GO123 Logistics plans, moves, and delivers freight across LTL, FTL, final-mile, and
            international lanes. Our promise is simple: protect what matters and keep you informed
            from quote to proof-of-delivery.
          </p>

          {/* Single CTA */}
          <div className="mt-7 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 shadow-soft"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* OUR STORY — bigger */}
      <section className={`${shell} mt-14 lg:mt-16 text-center`}>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">Our story</h2>
        <div className="mt-6 prose prose-slate prose-xl mx-auto max-w-4xl">
          <p>
            In <strong>2010</strong>, our family moved from the <strong>Virgin Islands</strong> back to
            <strong> Lake Tahoe</strong>. We did everything right—palletized, shrink-wrapped, sealed. But once
            the container reached the U.S., the shipment was taken apart and mixed with others. A promised
            two-week delivery dragged into months.
          </p>
          <p>
            Boxes went missing—about <strong>forty</strong>—and what did arrive told the story: smashed,
            crammed, poorly handled. At delivery we were pressured for extra payment, or the driver would
            leave with what was left. It was a low point and a clear lesson.
          </p>
          <p>
            That day we decided to build a logistics company that treats people and their freight with
            <strong> integrity</strong>. GO123 Logistics exists so no one else has to learn the hard way.
          </p>
        </div>
      </section>

      {/* HOW WE WORK — smaller, colored heading */}
      <section className={`${shell} mt-14 lg:mt-16`}>
        <h2 className="text-center text-lg md:text-xl font-semibold tracking-wide text-emerald-700">
          How we work
        </h2>
        <ol className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {steps.map((s, i) => (
            <li key={i} className={`${card} p-6 text-center flex flex-col items-center`}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white text-base font-semibold leading-none tabular-nums">
                {i + 1}
              </span>
              <p className="mt-3 text-lg font-semibold">{s.t}</p>
              <p className="mt-1 text-slate-600 md:text-base">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* VALUES — smaller, colored heading */}
      <section className={`${shell} mt-14 lg:mt-16`}>
        <h2 className="text-center text-lg md:text-xl font-semibold tracking-wide text-emerald-700">
          Values we live by
        </h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={i} className={`${card} p-6 text-center`}>
              <div className="text-sm uppercase tracking-wide text-emerald-700">{v.t}</div>
              <p className="mt-1 text-slate-700 md:text-base">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — single button */}
      <section className={`${shell} mt-14 lg:mt-16`}>
        <div className="rounded-3xl border border-emerald-100 p-7 md:p-9 shadow-soft bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-teal-50 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">Ready to ship with confidence?</h3>
          <p className="mt-2 text-slate-700 mx-auto max-w-3xl md:text-lg">
            Get a transparent, itemized plan you can trust.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 shadow-soft"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
