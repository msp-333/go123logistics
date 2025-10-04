export default function OceanFreightPage() {
  return (
    <section className="container py-10 grid md:grid-cols-2 gap-8 items-start">
      <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/ocean.png`} alt="Ocean freight" className="rounded-2xl border border-slate-100 shadow-soft" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h2 className="text-xl font-semibold mb-3">What is Ocean Freight?</h2>
          <p className="text-slate-600">Ocean freight is the transportation of goods by sea using container ships. It’s ideal for international shipping of large quantities and is the most cost‑effective method for moving substantial cargo over long distances.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Process</h3>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li><b>Booking</b> — Book with shipping line or freight forwarder</li>
            <li><b>Loading & Documentation</b> — Container loading and shipping docs</li>
            <li><b>Export Clearance</b> — Customs at origin port</li>
            <li><b>Ocean Transit</b> — Sea transportation to destination port</li>
            <li><b>Import Clearance</b> — Customs at destination</li>
            <li><b>Final Delivery</b> — Transportation to final destination</li>
          </ol>
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
                  <td className="p-2">Dense, heavy cargo</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">40ft Container</td>
                  <td className="p-2">67 cubic meters</td>
                  <td className="p-2">30,480kg</td>
                  <td className="p-2">Voluminous cargo</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">Reefer Container</td>
                  <td className="p-2">Varies</td>
                  <td className="p-2">Varies</td>
                  <td className="p-2">Temperature‑controlled goods</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm text-slate-700">
            <div className="rounded-lg border p-3"><b>Transit Time:</b> Typically weeks, depending on route</div>
            <div className="rounded-lg border p-3"><b>Cost Efficiency:</b> Most cost‑effective for large shipments over long distances</div>
            <div className="rounded-lg border p-3"><b>Special Requirements:</b> Proper packaging for sea conditions, container sealing</div>
            <div className="rounded-lg border p-3"><b>Vessel Types:</b> Container ships, bulk carriers, tankers, and specialized vessels</div>
          </div>
        </div>
      </div>
    </section>
  );
}
