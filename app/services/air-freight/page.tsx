export default function AirFreightPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const card =
    "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_14px_40px_rgba(15,23,42,0.06)]";
  const cardAccent =
    "relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-sky-600";
  const inner = "p-6 sm:p-8";

  return (
    <section className="bg-slate-50/40">
      <div className="container py-12">
        <div className="mx-auto max-w-5xl">
          {/* Title */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Air Freight
            </h1>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200/40 to-transparent" />
          </header>

          {/* Hero image (no weird corner boxes) */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={`${base}/images/air.png`}
              alt="Air freight"
              className="h-[220px] sm:h-[340px] w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sky-600/80 via-sky-600/20 to-transparent"
            />
          </div>

          {/* At-a-glance KPIs (moved up; same text as your existing tiles) */}
          <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm text-slate-800">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <b>Transit Time:</b> Typically 1–5 days, depending on route and connections
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <b>Cost Efficiency:</b> Highest cost per kg—best for urgent, time-definite shipments
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <b>Special Requirements:</b> Security screening, export compliance, and IATA DGR for dangerous goods
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <b>Aircraft Types:</b> Freighters and belly-hold cargo on passenger aircraft
            </div>
          </div>

          {/* Sticky section nav (enterprise/logistics pattern) */}
          <div className="sticky top-16 z-10 mt-6">
            <div className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur shadow-sm px-3 py-2">
              <nav className="flex flex-wrap gap-2">
                {[
                  { href: "#what-is-air-freight", label: "What is Air Freight?" },
                  { href: "#how-it-works", label: "How It Works" },
                  { href: "#tracking-visibility", label: "Tracking & Visibility" },
                  { href: "#ideal-shipping-weight-needs", label: "Ideal Shipping Weight & Needs" },
                ].map((x) => (
                  <a
                    key={x.href}
                    href={x.href}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300"
                  >
                    {x.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content cards */}
          <div className="mt-6 space-y-6">
            <div id="what-is-air-freight" className={`${card} ${cardAccent} scroll-mt-28`}>
              <div className={inner}>
                <h2 className="text-xl font-semibold mb-3">What is Air Freight?</h2>
                <p className="text-slate-600 leading-relaxed">
                  Air freight is the fastest way to move cargo internationally—designed for shipments where speed,
                  reliability, and control matter most. It’s ideal for time-critical orders, high-value products,
                  perishables, and production-sensitive inventory. With the right carrier strategy, routing, and
                  documentation, air freight keeps your business moving and your customers on schedule.
                </p>
              </div>
            </div>

            <div id="how-it-works" className={`${card} ${cardAccent} scroll-mt-28`}>
              <div className={inner}>
                <h3 className="font-semibold mb-4">How It Works</h3>

                {/* Stepper-style list (same content, better “workflow” feel) */}
                <ol className="relative pl-6 space-y-4 text-slate-700">
                  <div aria-hidden="true" className="absolute left-2 top-1 bottom-1 w-px bg-slate-200" />

                  {[
                    {
                      title: "Booking & Flight Planning",
                      text:
                        "We help research options so you can secure capacity, select the best route, and align schedules with your delivery deadline.",
                    },
                    {
                      title: "Documentation & Compliance",
                      text:
                        "We support you in preparing the Air Waybill (AWB) and all export documents to meet airline and customs requirements.",
                    },
                    {
                      title: "Security Screening",
                      text:
                        "We help coordinate screening and handling based on aviation regulations to ensure smooth acceptance at the airport.",
                    },
                    { title: "Air Transit", text: "Your cargo moves on the confirmed flight plan with milestone tracking." },
                    {
                      title: "Customs Clearance",
                      text:
                        "We connect you with experts to manage destination customs requirements so freight can be released smoothly.",
                    },
                    {
                      title: "Final Mile Delivery",
                      text:
                        "We help coordinate delivery to the consignee, including time-definite and special handling needs.",
                    },
                  ].map((s, idx) => (
                    <li key={s.title} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[6px] top-1.5 h-4 w-4 rounded-full border border-slate-300 bg-white"
                      />
                      <b>{s.title}</b> — {s.text}
                    </li>
                  ))}
                </ol>

                <p className="text-slate-600 mt-4 leading-relaxed">
                  Everything is coordinated end-to-end—capacity, documents, screening, tracking, clearance, and delivery—so you
                  don’t have to manage the moving parts.
                </p>
              </div>
            </div>

            <div id="tracking-visibility" className={`${card} ${cardAccent} scroll-mt-28`}>
              <div className={inner}>
                <h3 className="font-semibold mb-2">Tracking & Visibility</h3>
                <ul className="mt-3 space-y-2 text-slate-700">
                  {[
                    "Air Waybill (AWB) tracking with real-time milestones",
                    "Airline and IATA tracking portals for flight movement visibility",
                    "Electronic Data Interchange (EDI) updates for status continuity",
                    "Digital proof-of-delivery for end-to-end confirmation",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-2 w-2 rounded-full bg-sky-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-slate-600 mt-4 leading-relaxed">
                  You get clear shipment visibility from pickup to delivery, with proactive updates when timing matters.
                </p>
              </div>
            </div>

            <div id="ideal-shipping-weight-needs" className={`${card} ${cardAccent} scroll-mt-28`}>
              <div className={inner}>
                <h3 className="font-semibold mb-2">Ideal Shipping Weight & Needs</h3>

                <div className="overflow-auto rounded-xl border border-slate-200 mt-4">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr className="border-b border-slate-200">
                        <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-slate-600">ULD Type</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Volume</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Max Weight</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white hover:bg-slate-50">
                        <td className="p-3 align-top">LD3 (AKE Container)</td>
                        <td className="p-3 align-top">~4.3 m³</td>
                        <td className="p-3 align-top">~1,588 kg</td>
                        <td className="p-3 align-top">General cargo on wide-body aircraft</td>
                      </tr>
                      <tr className="bg-white hover:bg-slate-50">
                        <td className="p-3 align-top">LD7 (PAG/PMC)</td>
                        <td className="p-3 align-top">Pallet 88×125 in</td>
                        <td className="p-3 align-top">Up to ~6,800 kg</td>
                        <td className="p-3 align-top">Heavy, oversized, or high-priority freight</td>
                      </tr>
                      <tr className="bg-white hover:bg-slate-50">
                        <td className="p-3 align-top">Cool Containers</td>
                        <td className="p-3 align-top">Varies</td>
                        <td className="p-3 align-top">Varies</td>
                        <td className="p-3 align-top">Pharma and perishables (e.g., 2–8°C)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm relative overflow-hidden">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-sky-600" />
                  <b>Made effortless:</b> One coordinated workflow that covers booking, compliance, screening, tracking,
                  customs, and delivery—so you get speed without the stress.
                </div>
              </div>
            </div>
          </div>

          <div className="h-10" />
        </div>
      </div>
    </section>
  );
}
