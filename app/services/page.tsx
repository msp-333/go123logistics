import Link from 'next/link';

export default function ServicesIndex() {
  return (
    <section className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Services</h1>

        <ul className="list-disc pl-6 space-y-2 text-[15px] text-app-mutedText">
          <li>
            <Link href="/services/ocean-freight" className="underline">
              Ocean Freight
            </Link>
          </li>
          <li>
            <Link href="/services/air-freight" className="underline">
              Air Freight
            </Link>
          </li>
          <li>
            <Link href="/services/rail-freight" className="underline">
              Rail Freight
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
