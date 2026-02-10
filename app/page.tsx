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

      {/* Services at a glance (left aligned copy + 3 simple dark cards w/ icons) */}
      <Strip tone="white">
        <section
          id="services"
          className="container py-20"
          aria-labelledby="services-title"
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left copy */}
            <div className="lg:col-span-4">
              <Kicker>Freight services</Kicker>
              <Title id="services-title" align="left">
                Services at a Glance
              </Title>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                Choose the mode that matches your timeline, budget, and handling
                needs—with clear expectations from quote to delivery.
              </p>
            </div>

            {/* Right: dark container */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl bg-brand-dark text-white shadow-soft overflow-hidden">
                <div className="grid md:grid-cols-3 divide-y divide-white/10 md:divide-y-0 md:divide-x">
                  {/* Land */}
                  <Link
                    href="/services/land-freight"
                    className="
                      group p-7 md:p-8 transition-colors
                      hover:bg-white/5 focus:outline-none
                      focus-visible:ring-2 focus-visible:ring-brand-green
                      focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark
                    "
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="
                          grid h-11 w-11 shrink-0 place-items-center rounded-2xl
                          bg-white/10 text-white transition-colors
                          group-hover:bg-white/15
                        "
                        aria-hidden="true"
                      >
                        <IconTruck />
                      </span>

                      <div>
                        <h3 className="text-[15px] font-semibold leading-snug">
                          Land Freight
                        </h3>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed">
                          Best for regional &amp; cross-border moves (LTL/FTL, road + rail).
                        </p>

                        <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-green">
                          Learn more
                          <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Air */}
                  <Link
                    href="/services/air-freight"
                    className="
                      group p-7 md:p-8 transition-colors
                      hover:bg-white/5 focus:outline-none
                      focus-visible:ring-2 focus-visible:ring-brand-green
                      focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark
                    "
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="
                          grid h-11 w-11 shrink-0 place-items-center rounded-2xl
                          bg-white/10 text-white transition-colors
                          group-hover:bg-white/15
                        "
                        aria-hidden="true"
                      >
                        <IconPlane />
                      </span>

                      <div>
                        <h3 className="text-[15px] font-semibold leading-snug">
                          Air Freight
                        </h3>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed">
                          Best for time-critical, high-value, or perishable shipments.
                        </p>

                        <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-green">
                          Learn more
                          <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Ocean */}
                  <Link
                    href="/services/ocean-freight"
                    className="
                      group p-7 md:p-8 transition-colors
                      hover:bg-white/5 focus:outline-none
                      focus-visible:ring-2 focus-visible:ring-brand-green
                      focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark
                    "
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="
                          grid h-11 w-11 shrink-0 place-items-center rounded-2xl
                          bg-white/10 text-white transition-colors
                          group-hover:bg-white/15
                        "
                        aria-hidden="true"
                      >
                        <IconShip />
                      </span>

                      <div>
                        <h3 className="text-[15px] font-semibold leading-snug">
                          Ocean Freight
                        </h3>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed">
                          Best for international FCL/LCL when cost efficiency matters.
                        </p>

                        <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-green">
                          Learn more
                          <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Strip>

      {/* How it works (simple + consistent spacing) */}
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

          <div className="container relative py-20">
            <Kicker>How it works</Kicker>
            <Title id="steps-title">Seamless Shipping in 4 Easy Steps</Title>

            {/* Cards: equal height on desktop + consistent internal margins */}
            <div className="mt-12 grid gap-6 md:grid-cols-4 auto-rows-fr">
              {steps.map((s, i) => (
                <article
                  key={s.title}
                  className="
                    relative h-full rounded-2xl border border-slate-200/80 bg-white
                    p-6 md:p-7 shadow-soft
                    transition-all duration-200
                    hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,0.10)]
                  "
                >
                  {/* top accent */}
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-brand-green/80" />

                  <div className="flex items-start gap-3">
                    <div
                      className="
                        mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full
                        border border-slate-200 bg-white text-brand-dark font-semibold
                      "
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>

                    <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">
                      {s.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </article>
              ))}
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
          {/* subtle dark texture */}
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
                    Elevate your transportation and logistics operations
                  </Title>

                  <p className="mt-4 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
                    Get a fast quote, clear timelines, and proactive updates, handled end-to-end by our team.
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

/* ---------- Icons (Services) ---------- */
function IconTruck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7h11v10H3V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 10h4l3 3v4h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconPlane() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 16l20-6-20-6 4 6-4 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 10h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconShip() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 12h16l-2 7H6l-2-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 21c1.2 0 1.8-.6 2.6-1.2.8-.6 1.4-1 2.4-1s1.6.4 2.4 1c.8.6 1.4 1.2 2.6 1.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
