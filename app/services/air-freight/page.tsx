import ServiceDeck from '@/components/ServiceDeck';

export default function AirFreightPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-soft">
          <img
            src={`${base}/images/air.png`}
            alt="Air freight"
            className="h-[220px] sm:h-[280px] w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Air Freight</h1>
          <p className="text-[15px] leading-relaxed text-app-mutedText">
            Fast, time-definite international shipping for urgent, high-value, and production-sensitive cargo—with clear milestone visibility from pickup to delivery.
          </p>
        </header>

        <ServiceDeck
          sections={[
            {
              id: 'what',
              title: 'Overview',
              content: (
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-app-text">What is Air Freight?</h2>
                  <p className="text-app-mutedText">
                    Air freight is the fastest way to move cargo internationally—designed for shipments where speed,
                    reliability, and control matter most. It’s ideal for time-critical orders, high-value products,
                    perishables, and production-sensitive inventory. With the right carrier strategy, routing, and
                    documentation, air freight keeps your business moving and your customers on schedule.
                  </p>
                </div>
              ),
            },
            {
              id: 'how',
              title: 'Process',
              content: (
                <div>
                  <h3 className="text-app-text font-semibold mb-3">How It Works</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-app-mutedText">
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
                  <p className="mt-3 text-app-mutedText">
                    Everything is coordinated end-to-end—capacity, documents, screening, tracking, clearance, and delivery—so you don’t have to manage the moving parts.
                  </p>
                </div>
              ),
            },
            {
              id: 'tracking',
              title: 'Tracking',
              content: (
                <div>
                  <h3 className="text-app-text font-semibold mb-3">Tracking & Visibility</h3>
                  <ul className="list-disc pl-5 space-y-2 text-app-mutedText">
                    <li>Air Waybill (AWB) tracking with real-time milestones</li>
                    <li>Airline and IATA tracking portals for flight movement visibility</li>
                    <li>Electronic Data Interchange (EDI) updates for status continuity</li>
                    <li>Digital proof-of-delivery for end-to-end confirmation</li>
                  </ul>
                  <p className="mt-3 text-app-mutedText">
                    You get clear shipment visibility from pickup to delivery, with proactive updates when timing matters.
                  </p>
                </div>
              ),
            },
            {
              id: 'services',
              title: 'Services',
              content: (
                <div>
                  <h3 className="text-app-text font-semibold mb-3">Ideal Shipping Weight & Needs</h3>

                  <div className="overflow-auto rounded-xl border border-app-border bg-white">
                    <table className="w-full text-sm min-w-[640px]">
                      <thead className="bg-app-muted">
                        <tr>
                          <th className="text-left p-3">ULD Type</th>
                          <th className="text-left p-3">Volume</th>
                          <th className="text-left p-3">Max Weight</th>
                          <th className="text-left p-3">Best For</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3">LD3 (AKE Container)</td>
                          <td className="p-3">~4.3 m³</td>
                          <td className="p-3">~1,588 kg</td>
                          <td className="p-3">General cargo on wide-body aircraft</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3">LD7 (PAG/PMC)</td>
                          <td className="p-3">Pallet 88×125 in</td>
                          <td className="p-3">Up to ~6,800 kg</td>
                          <td className="p-3">Heavy, oversized, or high-priority freight</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3">Cool Containers</td>
                          <td className="p-3">Varies</td>
                          <td className="p-3">Varies</td>
                          <td className="p-3">Pharma and perishables (e.g., 2–8°C)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-4 text-[15px] text-app-mutedText">
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Transit Time:</b> Typically 1–5 days, depending on route and connections
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Cost Efficiency:</b> Highest cost per kg—best for urgent, time-definite shipments
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Special Requirements:</b> Security screening, export compliance, and IATA DGR for dangerous goods
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Aircraft Types:</b> Freighters and belly-hold cargo on passenger aircraft
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-app-muted border border-app-border p-4 text-[15px] text-slate-700">
                    <b>Made effortless:</b> One coordinated workflow that covers booking, compliance, screening, tracking, customs, and delivery—so you get speed without the stress.
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}
