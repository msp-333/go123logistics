export default function AirFreightPage() {
  return (
    <section className="container py-10 grid md:grid-cols-2 gap-8 items-start">
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/air.png`}
        alt="Air freight"
        className="rounded-2xl border border-slate-100 shadow-soft"
      />

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h2 className="text-xl font-semibold mb-3">What is Air Freight?</h2>
          <p className="text-slate-600">
            Air freight is the fastest way to move cargo internationally—designed for shipments where speed,
            reliability, and control matter most. It’s ideal for time-critical orders, high-value products,
            perishables, and production-sensitive inventory. With the right carrier strategy, routing, and
            documentation, air freight keeps your business moving and your customers on schedule.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">How It Works</h3>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li>
              <b>Booking & Flight Planning</b> — We secure capacity, select the best route, and align schedules
              to your delivery deadline.
            </li>
            <li>
              <b>Documentation & Compliance</b> — We prepare the Air Waybill (AWB) and all export documents to
              meet airline and customs requirements.
            </li>
            <li>
              <b>Security Screening</b> — We coordinate screening and handling based on aviation regulations
              to ensure smooth acceptance at the airport.
            </li>
            <li>
              <b>Air Transit</b> — Your cargo moves on the confirmed flight plan with milestone tracking.
            </li>
            <li>
              <b>Customs Clearance</b> — We manage import customs coordination so freight releases quickly and
              correctly.
            </li>
            <li>
              <b>Final Mile Delivery</b> — We arrange delivery to the consignee, including time-definite and
              special handling needs.
            </li>
          </ol>
          <p className="text-slate-600 mt-3">
            Everything is coordinated end-to-end—capacity, documents, screening, tracking, clearance, and delivery—so
            you don’t have to manage the moving parts.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Tracking & Visibility</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Air Waybill (AWB) tracking with real-time milestones</li>
            <li>Airline and IATA tracking portals for flight movement visibility</li>
            <li>Electronic Data Interchange (EDI) updates for status continuity</li>
            <li>Digital proof-of-delivery for end-to-end confirmation</li>
          </ul>
          <p className="text-slate-600 mt-3">
            You get clear shipment visibility from pickup to delivery, with proactive updates when timing matters.
          </p>
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
                  <td className="p-2">General cargo on wide-body aircraft</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">LD7 (PAG/PMC)</td>
                  <td className="p-2">Pallet 88×125 in</td>
                  <td className="p-2">Up to ~6,800 kg</td>
                  <td className="p-2">Heavy, oversized, or high-priority freight</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">Cool Containers</td>
                  <td className="p-2">Varies</td>
                  <td className="p-2">Varies</td>
                  <td className="p-2">Pharma and perishables (e.g., 2–8°C)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm text-slate-700">
            <div className="rounded-lg border p-3">
              <b>Transit Time:</b> Typically 1–5 days, depending on route and connections
            </div>
            <div className="rounded-lg border p-3">
              <b>Cost Efficiency:</b> Highest cost per kg—best for urgent, time-definite shipments
            </div>
            <div className="rounded-lg border p-3">
              <b>Special Requirements:</b> Security screening, export compliance, and IATA DGR for dangerous goods
            </div>
            <div className="rounded-lg border p-3">
              <b>Aircraft Types:</b> Freighters and belly-hold cargo on passenger aircraft
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700">
            <b>Made effortless:</b> One coordinated workflow that covers booking, compliance, screening, tracking,
            customs, and delivery—so you get speed without the stress.
          </div>
        </div>
      </div>
    </section>
  );
}
