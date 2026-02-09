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
      "We’ll do the research and bring you the best options with a transparent quote. Once confirmed, we’ll schedule your shipment to meet your timing.",
  },
  { title: "Track Your Shipment", desc: "Stay updated from pickup to delivery." },
  {
    title: "Receive On-Time Delivery",
    desc:
      "Your shipment arrives as intended, and we follow up to make sure everything was done as expected.",
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

const publicPath = (p: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}`;
};

/* ---------- Page ---------- */
export default function HomePage() {
  return (
    <div className="bg-white text-slate-900 antialiased">
      <Hero />

      {/* How it works (dark, cohesive with hero) */}
      <section
        id="steps"
        className="relative scroll-mt-24 overflow-hidden"
        aria-labelledby="steps-title"
      >
        {/* Base */}
        <div className="absolute inset-0 bg-brand-dark" />

        {/* Controlled overlays (no glow) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,17,15,0.92),rgba(0,17,15,0.70),rgba(0,17,15,0.35))]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent"
        />

        <div className="relative border-y border-white/10">
          <div className="container py-20">
            <Kicker dark>How it works</Kicker>
            <Title id="steps-title" dark>
              Seamless Shipping in 4 Easy Steps
            </Title>

            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {steps.map((s, i) => (
                <article
                  key={i}
                  className="
                    rounded-2xl border border-white/12 bg-white/6
                    p-7 shadow-[0_12px_34px_rgba(0,0,0,0.35)]
                    transition-all duration-200
                    hover:-translate-y-1 hover:bg-white/8
                  "
                >
                  <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white font-semibold">
                    {i + 1}
                  </div>
                  <h3 className="text-center font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-center text-sm text-white/75 leading-relaxed">
                    {s.desc}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/contact"
                className="
                  inline-flex items-center rounded-md
                  bg-brand-green px-9 py-3.5 text-sm font-semibold text-brand-dark
                  shadow-[0_10px_28px_rgba(0,0,0,0.25)]
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:opacity-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green
                  focus-visible:ring-offset-2 focus-visible:ring-offset-black/40
                "
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value prop (light, crisp) */}
      <section id="solutions" className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,200,83,0.06),rgba(255,255,255,0.0),rgba(255,255,255,0.0))]"
        />
        <div className="container relative grid items-center gap-12 py-20 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-soft overflow-hidden">
            <img
              src={publicPath("/images/logistic-dashboard.png")}
              alt="Operations dashboard"
              width={1200}
              height={700}
              className="h-auto w-full object-cover"
              decoding="async"
              loading="lazy"
            />
            <div className="h-1.5 bg-brand-green" />
          </div>

          <div>
            <Kicker>Why choose us</Kicker>
            <Title align="left">Logistics, minus the guesswork</Title>

            <ul className="mt-6 grid gap-4 text-slate-700 leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-green" />
                <span>Transparent timelines and proactive updates.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-green" />
                <span>
                  No surprise pricing with clear expectations to meet your specific needs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-green" />
                <span>End-to-end chain-of-custody, from pickup to delivery.</span>
              </li>
            </ul>

            <Link
              href="/contact/"
              className="
                mt-8 inline-flex items-center rounded-md
                bg-brand-dark px-7 py-3.5 text-sm font-semibold text-white
                shadow-soft transition-all duration-200
                hover:-translate-y-0.5 hover:opacity-95
                focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green
              "
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <Strip alt>
        <section
          id="blog"
          className="container py-20"
          aria-labelledby="blog-title"
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <Kicker>Insights</Kicker>
              <Title id="blog-title" align="left">
                From the Logbook
              </Title>
            </div>

            <Link
              href="/blog"
              className="text-sm font-semibold text-brand-dark hover:underline underline-offset-4"
            >
              View all posts →
            </Link>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="
                  group overflow-hidden rounded-2xl border border-slate-200/80 bg-white
                  shadow-soft transition-all duration-200
                  hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,0.10)]
                "
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    priority={false}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                  />
                </div>

                <div className="p-6">
                  <div className="text-xs text-slate-500">
                    {new Date(p.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="mt-1 text-[17px] font-semibold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {p.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center font-semibold text-brand-dark">
                    Read more{" "}
                    <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>

                <div className="h-1.5 bg-brand-green" />
              </Link>
            ))}
          </div>
        </section>
      </Strip>

      {/* Final CTA */}
      <section id="cta" className="container my-20">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,200,83,0.08),transparent,transparent)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-slate-200/70"
          />

          <div className="relative grid items-center md:grid-cols-2">
            <div className="p-8 md:p-12">
              <Title align="left">
                Ready to elevate your transportation and logistics operations?
              </Title>

              <Link
                href="/contact/"
                className="
                  mt-7 inline-flex items-center rounded-md
                  bg-brand-green px-7 py-3.5 text-sm font-semibold text-brand-dark
                  shadow-[0_10px_28px_rgba(0,0,0,0.10)]
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:opacity-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green
                "
              >
                Get a Free Quote
              </Link>
            </div>

            <div className="relative h-48 md:h-full">
              <Image
                src="/images/cta-truck.png"
                alt="Truck"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-green" />
          </div>
        </div>
      </section>

      <div className="h-12" />
    </div>
  );
}

/* ---------- Small UI helpers ---------- */
function Kicker({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={cls(
        "text-xs font-semibold tracking-wider uppercase",
        dark ? "text-white/70" : "text-brand-dark/70"
      )}
    >
      {children}
    </p>
  );
}

function Title({
  children,
  align = "center",
  id,
  dark = false,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  id?: string;
  dark?: boolean;
}) {
  return (
    <h2
      id={id}
      className={cls(
        "mt-3 font-semibold tracking-tight leading-tight",
        "text-2xl sm:text-3xl",
        align === "center" ? "text-center" : "text-left",
        dark ? "text-white" : "text-slate-900"
      )}
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
    <div className={alt ? "bg-brand-light" : "bg-white"}>
      <div className={alt ? "border-y border-slate-200/70" : "border-y border-slate-100"}>
        {children}
      </div>
    </div>
  );
}

function cls(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
