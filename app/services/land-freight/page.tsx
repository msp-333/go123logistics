import ServiceDeck from '@/components/ServiceDeck';

export default function RailFreightPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Banner image */}
        <div className="relative overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-soft">
          <img
            src={`${base}/images/rail.png`}
            alt="Land freight"
            className="h-[220px] sm:h-[280px] w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* Title + intro */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">By Land</h1>
          <p className="text-[15px] leading-relaxed text-app-mutedText">
            Reliable, flexible inland transport—combining rail and over-the-road solutions for seamless regional and cross-border deliveries.
          </p>
        </header>

        <ServiceDeck
          sections={[
            {
              id: 'what',
              title: 'Overview',
              content: (
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-app-text">What is Land Freight?</h2>
                  <p>
                    Land freight is the movement of cargo across countries and regions using trucks, rail networks, or a combination of both.
                    It’s the go-to option for domestic and continental shipping—offering dependable lead times, flexible service levels,
                    and scalable capacity for everything from a single pallet to full truckloads and intermodal containers.
                  </p>
                  <p className="mt-3">
                    To keep shipping simple, we help coordinate the full workflow end-to-end: planning, scheduling, documentation, visibility,
                    terminal handling (when rail is involved), and final delivery—so you can get the best route and service without managing
                    multiple carriers or handoffs.
                  </p>
                </div>
              ),
            },
            {
              id: 'options',
              title: 'Options',
              content: (
                <div>
                  <h3 className="text-app-text font-semibold mb-3">Land Freight Options We Support</h3>

                  <div className="grid sm:grid-cols-2 gap-3 text-[15px]">
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b className="text-app-text">Over-the-Road (OTR) Freight</b>
                      <p className="mt-1">
                        The most flexible option for door-to-door delivery—ideal for regional and national lanes, time-sensitive
                        replenishment, and destinations without rail access.
                      </p>
                    </div>

                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b className="text-app-text">Rail Freight</b>
                      <p className="mt-1">
                        A high-capacity, cost-smart solution for longer inland distances—great for heavier loads, bulk cargo,
                        and intermodal lanes where predictability and efficiency matter.
                      </p>
                    </div>

                    <div className="rounded-xl border border-app-border p-4 bg-white sm:col-span-2">
                      <b className="text-app-text">Intermodal (Rail + Truck)</b>
                      <p className="mt-1">
                        The best of both: long-haul rail for efficiency plus trucking for pickup and final-mile delivery—optimized
                        for cost, reliability, and network coverage.
                      </p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'how',
              title: 'Process',
              content: (
                <div>
                  <h3 className="text-app-text font-semibold mb-3">How It Works</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <b>Route & Service Planning</b> — We research the best mode (OTR, rail, or intermodal) based on timeline,
                      budget, cargo type, and delivery requirements.
                    </li>
                    <li>
                      <b>Pickup & Origin Handling</b> — We automate pickup loading and scheduling for a smooth dispatch.
                    </li>
                    <li>
                      <b>Documentation & Compliance</b> — We support you with the required shipping paperwork and connect you with experts for cross-border requirements when needed.
                    </li>
                    <li>
                      <b>Line-Haul Transport</b> — Your freight moves across the inland network with tracking and milestone updates.
                    </li>
                    <li>
                      <b>Terminal Handling (If Rail/Intermodal)</b> — We help coordinate terminal transfers, unloading/loading, and release timing as needed.
                    </li>
                    <li>
                      <b>Final Delivery</b> — We help coordinate delivery to the final destination, including appointments, dock scheduling, and special handling.
                    </li>
                  </ol>
                  <p className="mt-3">
                    One coordinated workflow supports every handoff—so inland shipping stays simple, predictable, and clear.
                  </p>
                </div>
              ),
            },
            {
              id: 'services',
              title: 'Services',
              content: (
                <div>
                  <h3 className="text-app-text font-semibold mb-3">Service Levels: LTL, FTL, and Rail Options</h3>

                  <div className="overflow-auto rounded-xl border border-app-border bg-white">
                    <table className="w-full text-sm min-w-[680px]">
                      <thead className="bg-app-muted">
                        <tr>
                          <th className="text-left p-3">Service Type</th>
                          <th className="text-left p-3">Typical Use</th>
                          <th className="text-left p-3">Best For</th>
                          <th className="text-left p-3">Key Advantage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3"><b>LTL</b> (Less-Than-Truckload)</td>
                          <td className="p-3">Smaller shipments sharing trailer space</td>
                          <td className="p-3">1–6 pallets, cartons, partial loads</td>
                          <td className="p-3">Cost-effective for smaller freight</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3"><b>FTL</b> (Full Truckload)</td>
                          <td className="p-3">Dedicated truck for one shipment</td>
                          <td className="p-3">High-volume or time-sensitive moves</td>
                          <td className="p-3">Faster transit and fewer touches</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-app-muted/40">
                          <td className="p-3"><b>Rail / Intermodal</b></td>
                          <td className="p-3">Rail line-haul with optional truck drayage</td>
                          <td className="p-3">Long-distance inland, heavier freight, containers</td>
                          <td className="p-3">Strong value and high capacity</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-4 text-[15px]">
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Transit Time:</b> Typically 1–10+ days depending on distance, mode, and service level
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Cost Efficiency:</b> LTL for smaller freight, FTL for speed, rail/intermodal for long-haul value
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Special Requirements:</b> Liftgate, inside delivery, appointments, cross-border paperwork, terminal scheduling
                    </div>
                    <div className="rounded-xl border border-app-border p-4 bg-white">
                      <b>Network Coverage:</b> Door-to-door via OTR, extended reach via rail + intermodal terminals
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-app-muted border border-app-border p-4 text-[15px] text-slate-700">
                    <b>Hands-off, end-to-end:</b> We help coordinate carriers, scheduling, documentation, tracking, and delivery—across road, rail,
                    or intermodal—so land freight runs smoothly without extra work on your side.
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
