export default function RailFreightPage() {
  return (
    <section className="container py-10 grid md:grid-cols-2 gap-8 items-start">
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/rail.png`}
        alt="Land freight"
        className="rounded-2xl border border-slate-100 shadow-soft"
      />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Land Freight</h1>
        <p className="text-slate-600 -mt-3">
          Reliable, flexible inland transport—combining rail and over-the-road solutions for seamless regional and cross-border deliveries.
        </p>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h2 className="text-xl font-semibold mb-3">What is Land Freight?</h2>
          <p className="text-slate-600">
            Land freight is the movement of cargo across countries and regions using trucks, rail networks, or a combination of both.
            It’s the go-to option for domestic and continental shipping—offering dependable lead times, flexible service levels,
            and scalable capacity for everything from a single pallet to full truckloads and intermodal containers.
          </p>
          <p className="text-slate-600 mt-3">
            To keep shipping simple, everything is coordinated end-to-end: planning, scheduling, documentation, visibility,
            terminal handling (when rail is involved), and final delivery—so you get the best route and service without managing
            multiple carriers or handoffs.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Land Freight Options We Manage</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
            <div className="rounded-lg border p-4">
              <b>Over-the-Road (OTR) Freight</b>
              <p className="text-slate-600 mt-1">
                The most flexible option for door-to-door delivery—ideal for regional and national lanes, time-sensitive
                replenishment, and destinations without rail access.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <b>Rail Freight</b>
              <p className="text-slate-600 mt-1">
                A high-capacity, cost-smart solution for longer inland distances—great for heavier loads, bulk cargo,
                and intermodal lanes where predictability and efficiency matter.
              </p>
            </div>

            <div className="rounded-lg border p-4 sm:col-span-2">
              <b>Intermodal (Rail + Truck)</b>
              <p className="text-slate-600 mt-1">
                The best of both: long-haul rail for efficiency plus trucking for pickup and final-mile delivery—optimized
                for cost, reliability, and network coverage.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">How It Works</h3>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li>
              <b>Route & Service Planning</b> — We match your shipment to the best mode (OTR, rail, or intermodal) based on timeline,
              budget, cargo type, and delivery requirements.
            </li>
            <li>
              <b>Pickup & Origin Handling</b> — We coordinate pickup, loading, and scheduling for smooth dispatch.
            </li>
            <li>
              <b>Documentation & Compliance</b> — We handle the required shipping paperwork and cross-border customs coordination when needed.
            </li>
            <li>
              <b>Line-Haul Transport</b> — Your freight moves across the inland network with tracking and milestone updates.
            </li>
            <li>
              <b>Terminal Handling (If Rail/Intermodal)</b> — We manage terminal transfers, unloading/loading, and release coordination.
            </li>
            <li>
              <b>Final Delivery</b> — We arrange delivery to the final destination, including appointments, dock scheduling, and special handling.
            </li>
          </ol>
          <p className="text-slate-600 mt-3">
            One coordinated workflow covers every handoff—so inland shipping stays simple, predictable, and fully managed.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 p-6 shadow-soft">
          <h3 className="font-semibold mb-2">Service Levels: LTL, FTL, and Rail Options</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">Service Type</th>
                  <th className="text-left p-2">Typical Use</th>
                  <th className="text-left p-2">Best For</th>
                  <th className="text-left p-2">Key Advantage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">
                    <b>LTL</b> (Less-Than-Truckload)
                  </td>
                  <td className="p-2">Smaller shipments sharing trailer space</td>
                  <td className="p-2">1–6 pallets, cartons, partial loads</td>
                  <td className="p-2">Cost-effective for smaller freight</td>
                </tr>

                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">
                    <b>FTL</b> (Full Truckload)
                  </td>
                  <td className="p-2">Dedicated truck for one shipment</td>
                  <td className="p-2">High-volume or time-sensitive moves</td>
                  <td className="p-2">Faster transit and fewer touches</td>
                </tr>

                <tr className="odd:bg-white even:bg-slate-50">
                  <td className="p-2">
                    <b>Rail / Intermodal</b>
                  </td>
                  <td className="p-2">Rail line-haul with optional truck drayage</td>
                  <td className="p-2">Long-distance inland, heavier freight, containers</td>
                  <td className="p-2">Strong value and high capacity</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm text-slate-700">
            <div className="rounded-lg border p-3">
              <b>Transit Time:</b> Typically 1–10+ days depending on distance, mode, and service level
            </div>
            <div className="rounded-lg border p-3">
              <b>Cost Efficiency:</b> LTL for smaller freight, FTL for speed, rail/intermodal for long-haul value
            </div>
            <div className="rounded-lg border p-3">
              <b>Special Requirements:</b> Liftgate, inside delivery, appointments, cross-border paperwork, terminal scheduling
            </div>
            <div className="rounded-lg border p-3">
              <b>Network Coverage:</b> Door-to-door via OTR, extended reach via rail + intermodal terminals
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700">
            <b>Hands-off, end-to-end:</b> We coordinate carriers, scheduling, documentation, tracking, and delivery—across road, rail,
            or intermodal—so land freight runs smoothly without extra work on your side.
          </div>
        </div>
      </div>
    </section>
  );
}
