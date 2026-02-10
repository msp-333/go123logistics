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

const formatDate = (iso: string) => {
  // Avoid timezone-shifting when only a date is provided
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* ---------- Page ---------- */
export default function HomePage() {
  return (
    <div className="bg-white text-slate-900 antialiased">
      <Hero />

      {/* How it works (light, distinct) */}
      <Strip tone="tint">
        <section
          id="steps"
          className="relative scroll-mt-24 overflow-hidden"
          aria-labelledby="steps-title"
        >
          {/* subtle pattern + gentle top fade */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,23,42,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(15,23,42,.18) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/90 to-transparent"
          />

          <div className="container relative py-16 md:py-18">
            <Kicker>How it works</Kicker>
            <Title id="steps-title">Seamless Shipping in 4 Easy Steps</Title>

            {/* Connected stepper */}
            <div className="mt-12 relative">
              {/* route line behind nodes (desktop) */}
              <div
                aria-hidden
                className="hidden md:block absolute left-8 right-8 top-[34px] h-px bg-slate-200/90"
              />
              {/* dotted overlay */}
              <div
                aria-hidden
                className="hidden md:block absolute left-8 right-8 top-[34px] h-px opacity-40
                [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.0)_0,rgba(0,0,0,0.0)_10px,rgba(15,23,42,0.15)_10px,rgba(15,23,42,0.15)_12px)]"
              />

              <div className="grid gap-6 md:grid-cols-4">
                {steps.map((s, i) => (
                  <article
                    key={s.title}
                    className="
                      group relative rounded-2xl border border-slate-200/80 bg-white
                      p-6 shadow-soft
                      transition-all duration-200
                      hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,0.10)]
                    "
                  >
                    {/* top accent */}
                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-brand-green/80" />

                    <div className="relative">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            relative z-10 grid h-11 w-11 place-items-center rounded-full
                            bg-white text-brand-dark font-semibold
                            border border-slate-200
                            shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                            transition-transform duration-200
                            group-hover:scale-[1.03]
                          "
                        >
                          {i + 1}
                        </div>

                        <span className="text-xs font-semibold tracking-wide text-slate-500">
                          STEP {i + 1}
                        </span>
                      </div>

                      <h3 className="mt-4 text-[15px] font-semibold text-slate-900 leading-snug">
                        {s.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {s.desc}
                      </p>

                      <div className="mt-5 h-px bg-slate-100" />

                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-dark/60">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-green" />
                        <span>Clear, guided process</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/contact"
                className="
                  inline-flex items-center rounded-md
                  bg-brand-green px-9 py-3.5 text-sm font-semibold text-brand-dark
                  shadow-[0_10px_28px_rgba(0,0,0,0.10)]
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:opacity-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green
                  focus-visible:ring-offset-2 focus-visible:ring-offset-white
                "
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </section>
      </Strip>

      {/* Value prop */}
      <Strip tone="white">
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
                href="/contact"
                className="
                  mt-8 inline-flex items-center rounded-md
                  bg-brand-dark px-7 py-3.5 text-sm font-semibold text-white
                  shadow-soft transition-all duration-200
                  hover:-translate-y-0.5 hover:opacity-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green
                  focus-visible:ring-offset-2 focus-visible:ring-offset-white
                "
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </section>
      </Strip>

      {/* Blog */}
      <Strip tone="tint">
        <section id="blog" className="container py-20" aria-labelledby="blog-title">
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
                    src={publicPath(p.image)}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    priority={false}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                  />
                </div>

                <div className="p-6">
                  <div className="text-xs text-slate-500">{formatDate(p.date)}</div>
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

      {/* Final CTA (dark) */}
      <Strip tone="dark">
        <section id="cta" className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(700px 420px at 18% 20%, rgba(0,200,83,0.35), transparent 55%)",
            }}
          />

          <div className="container relative py-20">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,200,83,0.14),transparent,transparent)]"
              />
              <div className="relative grid items-center md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <Kicker dark>Next step</Kicker>
                  <Title align="left" dark>
                    Ready to elevate your transportation and logistics operations?
                  </Title>

                  <p className="mt-4 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
                    Get a fast quote, clear timelines, and proactive updates—handled end-to-end by our team.
                  </p>

                  <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
                    <Link
                      href="/contact"
                      className="
                        inline-flex items-center justify-center rounded-md
                        bg-brand-green px-7 py-3.5 text-sm font-semibold text-brand-dark
                        shadow-[0_10px_28px_rgba(0,0,0,0.25)]
                        transition-all duration-200
                        hover:-translate-y-0.5 hover:opacity-95
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green
                        focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark
                      "
                    >
                      Get a Free Quote
                    </Link>

                    <Link
                      href="/shipping-guide"
                      className="text-sm font-semibold text-white/75 hover:text-white underline underline-offset-4"
                    >
                      Shipping Guide →
                    </Link>
                  </div>
                </div>

                <div className="relative h-56 md:h-full">
                  <Image
                    src={publicPath("/images/cta-truck.png")}
                    alt="Truck"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-green" />
              </div>
            </div>
          </div>
        </section>
      </Strip>
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
  tone = "white",
}: {
  children: React.ReactNode;
  tone?: "white" | "tint" | "dark";
}) {
  const bg =
    tone === "dark"
      ? "bg-brand-dark text-white"
      : tone === "tint"
      ? "bg-brand-light"
      : "bg-white";

  const border =
    tone === "dark" ? "border-y border-white/10" : "border-y border-slate-200/70";

  return (
    <div className={bg}>
      <div className={border}>{children}</div>
    </div>
  );
}

function cls(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
