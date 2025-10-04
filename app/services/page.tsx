import Link from 'next/link';

export default function ServicesIndex() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li><Link href="/services/ocean-freight" className="text-emerald-700 underline">Ocean Freight</Link></li>
        <li><Link href="/services/air-freight" className="text-emerald-700 underline">Air Freight</Link></li>
        <li><Link href="/services/rail-freight" className="text-emerald-700 underline">Rail Freight</Link></li>
      </ul>
    </section>
  );
}
