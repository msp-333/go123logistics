import { publicPath } from "@/lib/publicPath";
import Image from "next/image";
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/hero.png`}
        alt="Logistics hero"
        width={1600}
        height={900}
        className="w-full h-[420px] object-cover"
      />

      {/* Black gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="container">
        <div className="absolute top-24 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            <span className="text-emerald-300">Cut Shipping Costs</span> – With Expert Logistics Solutions
          </h1>
          <p className="mt-4 text-white/90">
            No hidden fees. No delays. Just reliable service every time.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/shipping-guide#quote"
              className="inline-flex items-center rounded-lg bg-amber-400 px-5 py-3 font-semibold shadow-soft hover:bg-amber-500"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/shipping-guide"
              className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-semibold shadow-soft hover:bg-slate-100"
            >
              Shipping Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
