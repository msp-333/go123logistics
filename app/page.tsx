// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";

/* ---------- Data ---------- */
const steps = [
  {
    title: "Submit Your Request",
    desc:
      "Tell us what you need delivered, where it's going, and when it's needed. Use our online form or contact our team directly.",
  },
  {
    title: "Get a Quote & Confirm",
    desc:
      "We'll provide a fast, transparent quote. Once confirmed, we'll schedule your shipment right away.",
  },
  { title: "Track Your Shipment", desc: "Stay updated from pickup to delivery." },
  {
    title: "Receive On-Time Delivery",
    desc:
      "Your package arrives safely, securely, and right on schedule — every time.",
  },
];

const posts = [
  {
    title: "LTL vs FTL: What’s Right for Your Shipment?",
    image: "/images/blog-1.png",
    href: "/blog/ltl-vs-ftl",
    date: "2025-01-12",
    excerpt:
      "Understand costs, timelines, and handling so you can choose with confidence.",
  },
  {
    title: "SCAC Codes: A Quick Guide for Shippers",
    image: "/images/blog-2.png",
    href: "/blog/scac-codes-guide",
    date: "2025-01-05",
    excerpt:
      "What SCAC codes are, why they matter, and how to look them up fast.",
  },
  {
    title: "How to Prevent Damage in Long-Haul Freight",
    image: "/images/blog-3.png",
    href: "/blog/prevent-freight-damage",
    date: "2024-12-18",
    excerpt:
      "Packing tips, pallet strategy, and chain-of-custody practices that work.",
  },
];

/* ---------- Page ---------- */
export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />

      {/* How it works */}
      <Strip>
        <section
          id="steps"
          className="container py-16 scroll-mt-24"
          aria-labelledby="steps-title"
        >
          <Kicker>How it works</Kicker>
          <Title id="steps-title">Seamless Shipping in 4 Easy Steps</Title>

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <article
                key={i}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="mx-auto mb-3 grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                  {i + 1}
                </div>
                <h3 className="text-center font-semibold">{s.title}</h3>
                <p className="mt-2 text-center text-sm text-slate-600">
                  {s.desc}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white shadow-soft hover:bg-emerald-700"
            >
              Get a Free Quote
            </Link>
          </div>
        </section>
      </Strip>

      {/* Value prop */}
      <section id="solutions" className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-slate-50" />
        <div className="container relative grid items-center gap-10 py-16 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
            <img
              src="/images/logistic-dashboard.png"
              alt="Operations dashboard"
              width={1200}
              height={700}
              className="h-auto w-full object-cover"
              decoding="async"
              loading="lazy"
            />
          </div>

          <div>
            <Kicker>Why choose us</Kicker>
            <Title align="left">Logistics, minus the guesswork</Title>

            <ul className="mt-4 grid gap-3 text-slate-700">
              <li>Transparent timelines and proactive updates.</li>
              <li>No-surprise pricing with clear documentation.</li>
              <li>End-to-end chain-of-custody, from pickup to delivery.</li>
            </ul>

            <Link
              href="/contact/"
              className="mt-6 inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white shadow-soft hover:bg-emerald-700"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <Strip>
        <section
          id="blog"
          className="container py-16"
          aria-labelledby="blog-title"
        >
          <div className="flex items-end justify-between">
            <div>
              <Kicker>Insights</Kicker>
              <Title id="blog-title" align="left">
                From the Logbook
              </Title>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              View all posts →
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-shadow duration-200 hover:shadow-md"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>

                <div className="p-5">
                  <div className="text-xs text-slate-500">
                    {new Date(p.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="mt-1 font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
                  <span className="mt-3 inline-block font-medium text-emerald-700">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Strip>

      {/* Final CTA */}
      <section id="cta" className="container my-16">
        <div className="relative grid items-center overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft md:grid-cols-2">
          <div className="p-6 md:p-10">
            <Title align="left">
              Ready to elevate your transportation and logistics operations?
            </Title>
            <Link
              href="/contact/"
              className="mt-5 inline-flex items-center rounded-md bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-soft hover:bg-emerald-700"
            >
              Get a Free Quote
            </Link>
          </div>

          <div className="relative h-44 md:h-full">
            <Image
              src="/images/cta-truck.png"
              alt="Truck"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-600" />
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}

/* ---------- Small UI helpers ---------- */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-emerald-700 font-medium tracking-wide uppercase text-xs">
      {children}
    </p>
  );
}

function Title({
  children,
  align = "center",
  id,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <h2
      id={id}
      className={[
        "mt-1 text-2xl font-bold",
        align === "center" ? "text-center" : "",
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

function Strip({
  children,
  alt = false,
}: {
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <div className={alt ? "bg-emerald-50/40" : "bg-white"}>
      <div className="border-y border-slate-100">{children}</div>
    </div>
  );
}
