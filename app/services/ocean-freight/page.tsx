import ServiceDeck from '@/components/ServiceDeck';

export default function OceanFreightPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-soft">
          <img
            src={`${base}/images/ocean.png`}
            alt="Ocean freight"
            className="h-[220px] sm:h-[280px] w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ocean Freight</h1>
          <p className="text-[15px] leading-relaxed text-app-mutedText">
            Cost-efficient global shipping for high-volume cargo using secure containerized ocean transport—built for predictable planning and long-haul value.
          </p>
        </header>

        <ServiceDeck
          sections={[
            {
              id: 'what',
              title: 'Overview',
              content: (
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-app-text">What is Ocean Freight?</h2>
                  <p className="text-app-mutedText">
                    Ocean freight is the most efficient way to move large shipments internationally—using
                    secure, standardized containers on reliable ocean carriers. It delivers the best value
                    for high-volume cargo over long distances, with flexible options for everything from
                    heavy, dense loads to temperature-controlled goods. With the right routing, carrier
                    selection, and documentation, ocean freight keeps your supply chain predictable and
                    cost-smart.
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
                      <b>Booking & Planning</b> — We research the best sailing carrier and container option for your cargo schedule and budget.
                    </li>
                    <li>
                      <b>Pickup, Loading & Documentation</b> — We help coordinate pickup, loading, and documentation.
                    </li>
                    <li>
                      <b>Export Clearance</b> — We connect you with experts to manage origin customs requirements to avoid delays and ensure compliant departure.
                    </li>
                    <li>
                      <b>Ocean Transit</b> — Your shipment moves on the confirmed route with tracking and milestone visibility.
                    </li>
                    <li>
                      <b>Import Clearance</b> — We connect you with experts to manage destination customs requirements.
                    </li>
                    <li>
                      <b>Final Delivery</b> — We help coordinate delivery to the final destination, including last-mile requirements.
                    </li>
                  </ol>
                  <p className="mt-3 text-app-mutedText">
                    From booking to final delivery, everything is coordinated end-to-end so you’re not chasing carriers or paperwork.
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
                    <table className="w-full text-sm min-w-[680px]">
                      <thead className="bg-app-muted">
                        <tr>
                          <th className="text-left p-3">Container Type</th>
                          <th className="text-left p-3">Volume</th>
                          <th className="text-left p-3">Max Weight</th>
                          <th className="text-left p-3">Best For</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3">20ft Container</td>
                          <td className="p-3">33 cubic meters</td>
                          <td className="p-3">24,000kg</td>
                          <td className="p-3">Dense, heavy cargo (machinery, raw materials)</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3">40ft Container</td>
                          <td className="p-3">67 cubic meters</td>
                          <td className="p-3">30,480kg</td>
                          <td className="p-3">High-volume shipments (consumer goods, retail stock)</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3">Reefer Container</td>
                          <td className="p-3">Varies</td>
                          <td className="p-3">Varies</td>
                          <td className="p-3">Temperature-controlled goods (food, pharma)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-4 text-[15px] text-app-mutedText">
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Transit Time:</b> Typically weeks, based on route and port schedules
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Cost Efficiency:</b> Best value for large shipments over long distances
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Special Requirements:</b> Ocean-ready packaging, proper labeling, container sealing
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Vessel Types:</b> Container ships, bulk carriers, tankers, and specialized vessels
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-app-muted border border-app-border p-4 text-[15px] text-slate-700">
                    <b>Built for simplicity:</b> One coordinated process, one clear plan, and full shipment oversight—so you don’t have to manage multiple vendors, documents, or checkpoints.
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
