export default function AirFreightPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const card =
    "rounded-2xl border border-slate-200/70 bg-white/85 backdrop-blur shadow-sm";
  const cardAccent =
    "relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-slate-900/90";
  const inner = "p-6 sm:p-7";

  return (
    <section className="relative">
      {/* subtle blueprint/grid background (visual only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(15,23,42,0.06),transparent_55%),radial-gradient(700px_circle_at_85%_30%,rgba(2,132,199,0.07),transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]
        [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)]
        [background-size:44px_44px]"
      />

      <div className="container py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header media panel */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <img
              src={`${base}/images/air.png`}
              alt="Air freight"
              className="h-[260px] sm:h-[340px] w-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent"
            />

            {/* subtle “HUD” corner blocks */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-4 h-10 w-10 rounded-lg border border-white/40 bg-white/10 backdrop-blur"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-4 h-10 w-10 rounded-lg border border-white/40 bg-white/10 backdrop-blur"
            />
          </div>

          {/* Optional: quick jump chips using existing headings only (no new text) */}
          <div className="flex flex-wrap gap-2">
            {[
              { href: "#what-is-air-freight", label: "What is Air Freight?" },
              { href: "#how-it-works", label: "How It Works" },
              { href: "#tracking-visibility", label: "Tracking & Visibility" },
              {
                href: "#ideal-shipping-weight-needs",
                label: "Ideal Shipping Weight & Needs",
              },
            ].map((x) => (
              <a
                key={x.href}
                href={x.href}
                className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-sm text-slate-700 hover:bg-white"
              >
                {x.label}
              </a>
            ))}
          </div>

          {/* Section 1 */}
          <div id="what-is-air-freight" className={`${card} ${cardAccent}`}>
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

          {/* Section 2 */}
          <div id="how-it-works" className={`${card} ${cardAccent}`}>
            <div className={inner}>
              <h3 className="font-semibold mb-2">How It Works</h3>

              <ol className="list-decimal pl-5 space-y-2 text-slate-700 leading-relaxed marker:font-semibold marker:text-slate-500">
                <li>
                  <b>Booking & Flight Planning</b> — We help research options so you can secure capacity, select the best route,
                  and align schedules with your delivery deadline.
                </li>
                <li>
                  <b>Documentation & Compliance</b> — We support you in preparing the Air Waybill (AWB) and all export documents
                  to meet airline and customs requirements.
                </li>
                <li>
                  <b>Security Screening</b> — We help coordinate screening and handling based on aviation regulations to ensure
                  smooth acceptance at the airport.
                </li>
                <li>
                  <b>Air Transit</b> — Your cargo moves on the confirmed flight plan with milestone tracking.
                </li>
                <li>
                  <b>Customs Clearance</b> — We connect you with experts to manage destination customs requirements so freight
                  can be released smoothly.
                </li>
                <li>
                  <b>Final Mile Delivery</b> — We help coordinate delivery to the consignee, including time-definite and special
                  handling needs.
                </li>
              </ol>

              <p className="text-slate-600 mt-4 leading-relaxed">
                Everything is coordinated end-to-end—capacity, documents, screening, tracking, clearance, and delivery—so you
                don’t have to manage the moving parts.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div id="tracking-visibility" className={`${card} ${cardAccent}`}>
            <div className={inner}>
              <h3 className="font-semibold mb-2">Tracking & Visibility</h3>

              <ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed marker:text-slate-400">
                <li>Air Waybill (AWB) tracking with real-time milestones</li>
                <li>Airline and IATA tracking portals for flight movement visibility</li>
                <li>Electronic Data Interchange (EDI) updates for status continuity</li>
                <li>Digital proof-of-delivery for end-to-end confirmation</li>
              </ul>

              <p className="text-slate-600 mt-4 leading-relaxed">
                You get clear shipment visibility from pickup to delivery, with proactive updates when timing matters.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div
            id="ideal-shipping-weight-needs"
            className={`${card} ${cardAccent}`}
          >
            <div className={inner}>
              <h3 className="font-semibold mb-2">Ideal Shipping Weight & Needs</h3>

              <div className="overflow-auto rounded-xl border border-slate-200/70">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="border-b border-slate-200/70">
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        ULD Type
                      </th>
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Volume
                      </th>
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Max Weight
                      </th>
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Best For
                      </th>
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

              <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm text-slate-700">
                <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                  <b>Transit Time:</b> Typically 1–5 days, depending on route and connections
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                  <b>Cost Efficiency:</b> Highest cost per kg—best for urgent, time-definite shipments
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                  <b>Special Requirements:</b> Security screening, export compliance, and IATA DGR for dangerous goods
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                  <b>Aircraft Types:</b> Freighters and belly-hold cargo on passenger aircraft
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-sky-600"
                />
                <b>Made effortless:</b> One coordinated workflow that covers booking, compliance, screening, tracking,
                customs, and delivery—so you get speed without the stress.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
