export default function OceanFreightPage() {
  return (
    <section className="container py-10 grid md:grid-cols-2 gap-8 items-start">
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/ocean.png`}
        alt="Ocean freight"
        className="rounded-2xl border border-slate-100 shadow-soft"
      />

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h2 className="text-xl font-semibold mb-3">What is Ocean Freight?</h2>
          <p className="text-slate-600">
            Ocean freight is the most efficient way to move large shipments internationally—using
            secure, standardized containers on reliable ocean carriers. It delivers the best value
            for high-volume cargo over long distances, with flexible options for everything from
            heavy, dense loads to temperature-controlled goods. With the right routing, carrier
            selection, and documentation, ocean freight keeps your supply chain predictable and
            cost-smart.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">How It Works</h3>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li>
              <b>Booking & Planning</b> — We select the best sailing, carrier, and container option
              for your cargo, schedule, and budget.
            </li>
            <li>
              <b>Pickup, Loading & Documentation</b> — We coordinate container loading and handle
              all required shipping documents for a smooth handoff.
            </li>
            <li>
              <b>Export Clearance</b> — We manage origin customs requirements to avoid delays and
              ensure compliant departure.
            </li>
            <li>
              <b>Ocean Transit</b> — Your shipment moves on the confirmed route with tracking and
              milestone visibility.
            </li>
            <li>
              <b>Import Clearance</b> — We coordinate destination customs and release so your cargo
              clears quickly and correctly.
            </li>
            <li>
              <b>Final Delivery</b> — We arrange delivery to the final destination, including any
              last-mile requirements.
            </li>
          </ol>
          <p className="text-slate-600 mt-3">
            From booking to final delivery, everything is coordinated end-to-end—so you’re not
            chasing carriers, paperwork, or handoffs.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Ideal Shipping Weight & Needs</h3>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">Container Type</th>
                  <th className="text-left p-2">Volume</th>
                  <th className="text-left p-2">Max Weight</th>
                  <th className="text-left p-2">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">20ft Container</td>
                  <td className="p-2">33 cubic meters</td>
                  <td className="p-2">24,000kg</td>
                  <td className="p-2">Dense, heavy cargo (machinery, raw materials)</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">40ft Container</td>
                  <td className="p-2">67 cubic meters</td>
                  <td className="p-2">30,480kg</td>
                  <td className="p-2">High-volume shipments (consumer goods, retail stock)</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">Reefer Container</td>
                  <td className="p-2">Varies</td>
                  <td className="p-2">Varies</td>
                  <td className="p-2">Temperature-controlled goods (food, pharma)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm text-slate-700">
            <div className="rounded-lg border p-3">
              <b>Transit Time:</b> Typically weeks, based on route and port schedules
            </div>
            <div className="rounded-lg border p-3">
              <b>Cost Efficiency:</b> Best value for large shipments over long distances
            </div>
            <div className="rounded-lg border p-3">
              <b>Special Requirements:</b> Ocean-ready packaging, proper labeling, container sealing
            </div>
            <div className="rounded-lg border p-3">
              <b>Vessel Types:</b> Container ships, bulk carriers, tankers, and specialized vessels
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700">
            <b>Built for simplicity:</b> One coordinated process, one clear plan, and full shipment
            oversight—so you don’t have to manage multiple vendors, documents, or checkpoints.
          </div>
        </div>
      </div>
    </section>
  );
}
