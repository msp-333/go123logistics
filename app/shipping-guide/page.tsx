'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchScac, Scac } from '@/lib/scac';
import { useMemo, useState } from 'react';

const glossary = [
  { term: 'BOL (Bill of Lading)', def: 'A legal document that serves as a receipt of goods, contract of carriage, and document of title.' },
  { term: 'POD (Proof of Delivery)', def: 'A document confirming that a shipment has been successfully delivered to the intended recipient.' },
  { term: 'Accessorials', def: 'Additional services beyond standard pickup and delivery, such as liftgate service or inside delivery.' },
  { term: 'NMFC Codes', def: 'National Motor Freight Classification codes used to categorize freight for shipping purposes.' },
  { term: 'Freight Class', def: 'A standardized classification system used to categorize freight based on density, stowability, handling, and liability.' },
  { term: 'FOB (Free On Board)', def: 'A term indicating when liability and ownership of goods transfers from seller to buyer.' },
];

type Mode = 'all' | 'carrier' | 'code';

export default function ShippingGuidePage() {
  const { data = [], isPending } = useQuery({ queryKey: ['scac'], queryFn: fetchScac });
  const [mode, setMode] = useState<Mode>('all');
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter((row) => {
      const byCarrier = row.carrier.toLowerCase().includes(needle);
      const byCode = row.code.toLowerCase().includes(needle);
      if (mode === 'carrier') return byCarrier;
      if (mode === 'code') return byCode;
      return byCarrier || byCode;
    });
  }, [data, q, mode]);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Shipping Guide: Everything to Know About Freight, Trucking, and Shipping</h1>
      <p className="mt-2 text-slate-600">Freight Fundamentals & SCAC Codes—Simplified.</p>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="rounded-2xl border border-slate-100 p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">1) Shipping Basics</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li><b>What is Freight Shipping?</b> Transporting goods by land, sea, or air.</li>
              <li><b>LTL vs FTL:</b> LTL shares a trailer with other shipments; FTL occupies the entire trailer for faster transit and minimal handling.</li>
              <li><b>Trucking vs Other Modes:</b> Trucking for short-to-medium distances; Rail for long distances/large volumes; Air is fastest; Ocean is best for large quantities.</li>
            </ul>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
              {glossary.map((g, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-3">
                  <div className="font-medium">{g.term}</div>
                  <div className="text-sm text-slate-600 mt-1">{g.def}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">2) Types of Freight Services</h2>
            <details className="rounded-lg border p-3">
              <summary className="cursor-pointer font-medium">LTL (Less‑than‑Truckload)</summary>
              <p className="mt-2 text-slate-600">Ideal for smaller loads that don’t require a full trailer.</p>
            </details>
            <details className="rounded-lg border p-3 mt-2">
              <summary className="cursor-pointer font-medium">FTL (Full Truckload)</summary>
              <p className="mt-2 text-slate-600">Best when your shipment fills an entire trailer—faster and with less handling.</p>
            </details>
            <details className="rounded-lg border p-3 mt-2">
              <summary className="cursor-pointer font-medium">Intermodal & Multimodal</summary>
              <p className="mt-2 text-slate-600">Combines modes like rail + truck for cost-efficiency.</p>
            </details>
            <details className="rounded-lg border p-3 mt-2">
              <summary className="cursor-pointer font-medium">Expedited & Same‑Day</summary>
              <p className="mt-2 text-slate-600">Time‑critical deliveries with priority handling.</p>
            </details>
            <details className="rounded-lg border p-3 mt-2">
              <summary className="cursor-pointer font-medium">Refrigerated (Reefer)</summary>
              <p className="mt-2 text-slate-600">Temperature‑controlled shipping for perishables.</p>
            </details>
            <details className="rounded-lg border p-3 mt-2">
              <summary className="cursor-pointer font-medium">Hazmat & Oversized</summary>
              <p className="mt-2 text-slate-600">Special handling, permits, and equipment for complex loads.</p>
            </details>
          </section>
        </div>

        <aside className="space-y-6">
          <section id="quote" className="rounded-2xl border border-slate-100 p-6 shadow-soft">
            <h3 className="font-semibold">Request a Quote</h3>
            <p className="text-sm text-slate-600 mt-1">Tell us about your shipment and we’ll respond quickly with a transparent price.</p>
            <a href="/contact" className="mt-3 inline-flex items-center rounded-lg bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700">Get a Free Quote</a>
          </section>

          <section className="rounded-2xl border border-slate-100 p-6 shadow-soft">
            <h3 className="font-semibold mb-3">SCAC Code Search</h3>
            <div className="flex gap-2 mb-2">
              <input value={q} onChange={e => setQ(e.target.value)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter carrier name or code" />
              <button className="rounded-lg border px-3 py-2" onClick={() => setQ('')}>Clear</button>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <label className="flex items-center gap-1">
                <input type="radio" checked={mode==='all'} onChange={() => setMode('all')} /> All
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" checked={mode==='carrier'} onChange={() => setMode('carrier')} /> Carrier Name
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" checked={mode==='code'} onChange={() => setMode('code')} /> SCAC Code
              </label>
            </div>

            <div className="mt-3 max-h-80 overflow-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50">
                  <tr>
                    <th className="text-left p-2 border-b">Carrier Name</th>
                    <th className="text-left p-2 border-b">SCAC Code</th>
                  </tr>
                </thead>
                <tbody>
                  {isPending ? (
                    <tr><td className="p-2" colSpan={2}>Loading…</td></tr>
                  ) : results.length === 0 ? (
                    <tr><td className="p-2" colSpan={2}>No results</td></tr>
                  ) : results.map((r, i) => (
                    <tr key={i} className="odd:bg-white even:bg-slate-50">
                      <td className="p-2 border-b">{r.carrier}</td>
                      <td className="p-2 border-b font-mono">{r.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Tip: Codes ending with “U” typically identify container carriers. Codes ending with “X” identify privately owned rail cars.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
