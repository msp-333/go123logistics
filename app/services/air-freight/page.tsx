export default function AirFreightPage() {
  return (
    <section className="container py-10 grid md:grid-cols-2 gap-8 items-start">
      <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/air.png`} alt="Air freight" className="rounded-2xl border border-slate-100 shadow-soft" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h2 className="text-xl font-semibold mb-3">What is Air Freight?</h2>
          <p className="text-slate-600">
            Air freight is the transportation of goods by aircraft. It’s the fastest mode for long‑distance shipping,
            ideal for time‑critical, high‑value, or perishable cargo.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Process</h3>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li><b>Booking</b> — Book with airline or freight forwarder</li>
            <li><b>Documentation</b> — Prepare Air Waybill (AWB) and export docs</li>
            <li><b>Security Screening</b> — Cargo screening per aviation rules</li>
            <li><b>Air Transit</b> — Flight to destination airport</li>
            <li><b>Customs Clearance</b> — Import customs at destination</li>
            <li><b>Final Mile Delivery</b> — Truck delivery to consignee</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Tracking Systems</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Air Waybill (AWB) tracking numbers</li>
            <li>IATA & airline cargo tracking portals</li>
            <li>Electronic Data Interchange (EDI)</li>
            <li>Digital proof‑of‑delivery</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Ideal Shipping Weight & Needs</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">ULD Type</th>
                  <th className="text-left p-2">Volume</th>
                  <th className="text-left p-2">Max Weight</th>
                  <th className="text-left p-2">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">LD3 (AKE Container)</td>
                  <td className="p-2">~4.3 m³</td>
                  <td className="p-2">~1,588 kg</td>
                  <td className="p-2">General cargo on wide‑bodies</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">LD7 (PAG/PMC)</td>
                  <td className="p-2">Pallet 88×125 in</td>
                  <td className="p-2">Up to ~6,800 kg</td>
                  <td className="p-2">Heavy/oversized freight</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">Cool Containers</td>
                  <td className="p-2">Varies</td>
                  <td className="p-2">Varies</td>
                  <td className="p-2">Pharma & perishables (2–8°C)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm text-slate-700">
            <div className="rounded-lg border p-3"><b>Transit Time:</b> 1–5 days, route dependent</div>
            <div className="rounded-lg border p-3"><b>Cost Efficiency:</b> Highest cost per kg; use for urgent shipments</div>
            <div className="rounded-lg border p-3"><b>Special Requirements:</b> Dangerous goods rules (IATA DGR), screening</div>
            <div className="rounded-lg border p-3"><b>Aircraft Types:</b> Freighters & belly‑hold cargo</div>
          </div>
        </div>
      </div>
    </section>
  );
}
