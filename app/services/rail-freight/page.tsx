export default function RailFreightPage() {
  return (
    <section className="container py-10 grid md:grid-cols-2 gap-8 items-start">
      <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/rail.png`} alt="Rail freight" className="rounded-2xl border border-slate-100 shadow-soft" />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Rail Freight</h1>
        <p className="text-slate-600 -mt-3">Efficient continental transport for medium to heavy shipments</p>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h2 className="text-xl font-semibold mb-3">What is Rail Freight?</h2>
          <p className="text-slate-600">
            Rail freight is the transportation of goods via train networks. It offers a strong balance between cost and speed for continental shipping,
            and is particularly efficient for moving heavy or bulk cargo over land.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Process</h3>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li><b>Booking</b> — Book with rail operator or freight forwarder</li>
            <li><b>Loading</b> — Load cargo onto railcars</li>
            <li><b>Documentation</b> — Shipping documents & customs (for cross‑border)</li>
            <li><b>Rail Transit</b> — Transport to destination terminal</li>
            <li><b>Unloading</b> — At destination terminal</li>
            <li><b>Final Delivery</b> — Truck to final destination</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Tracking Systems</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Rail car tracking numbers</li>
            <li>RFID tracking systems</li>
            <li>Rail operator portals</li>
            <li>Intermodal tracking platforms</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Ideal Shipping Weight & Needs</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">Service Type</th>
                  <th className="text-left p-2">Weight Range</th>
                  <th className="text-left p-2">Transit Time</th>
                  <th className="text-left p-2">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">Intermodal Container</td>
                  <td className="p-2">20–30 tons</td>
                  <td className="p-2">3–7 days</td>
                  <td className="p-2">Containerized cargo</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">Boxcar</td>
                  <td className="p-2">50–100 tons</td>
                  <td className="p-2">5–10 days</td>
                  <td className="p-2">Palletized goods</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">Bulk Cargo</td>
                  <td className="p-2">80–100+ tons</td>
                  <td className="p-2">5–14 days</td>
                  <td className="p-2">Coal, grain, minerals</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm text-slate-700">
            <div className="rounded-lg border p-3"><b>Transit Time:</b> Typically days to a week, depending on distance</div>
            <div className="rounded-lg border p-3"><b>Cost Efficiency:</b> More cost‑effective than trucking for long distances</div>
            <div className="rounded-lg border p-3"><b>Special Requirements:</b> Access to rail terminals, suitable for continental transport</div>
            <div className="rounded-lg border p-3"><b>Environmental Impact:</b> Lower carbon emissions versus road transport for equivalent cargo</div>
          </div>
        </div>
      </div>
    </section>
  );
}
