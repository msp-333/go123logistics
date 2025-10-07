import Link from "next/link";
import { posts } from "@/content/posts";
import { publicPath } from "@/lib/publicPath";

export const metadata = {
  title: "Logbook — GO123 Logistics",
  description: "Guides, tips, and news for smarter, safer shipping.",
};

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const [featured, ...rest] = sorted;

  return (
    <section className="container py-12">
      <header className="max-w-2xl">
        <p className="text-xs tracking-widest text-emerald-700 font-semibold">LOGBOOK</p>
        <h1 className="text-3xl font-extrabold mt-1">Insights for Confident Shipping</h1>
        <p className="mt-2 text-slate-600">
          Practical articles based on real freight scenarios—international, LTL, TL, and more.
        </p>
      </header>

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="mt-8 grid gap-6 md:grid-cols-2 rounded-3xl border border-slate-100 bg-white shadow-soft overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-56 md:h-auto">
            <img
              src={publicPath(featured.image)}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-6 md:p-8">
            <time className="text-xs text-slate-500">
              {new Date(featured.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <h2 className="mt-1 text-xl md:text-2xl font-bold">{featured.title}</h2>
            <p className="mt-3 text-slate-600">{featured.excerpt}</p>
            {featured.tags && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {featured.tags.map((t) => (
                  <li
                    key={t}
                    className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    #{t}
                  </li>
                ))}
              </ul>
            )}
            <span className="mt-5 inline-block font-semibold text-emerald-700">
              Read the article →
            </span>
          </div>
        </Link>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {rest.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-soft hover:shadow-md transition-shadow"
          >
            <div className="relative h-44">
              <img
                src={publicPath(p.image)}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <time className="text-xs text-slate-500">
                {new Date(p.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <h3 className="mt-1 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              {p.tags && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tags.slice(0, 2).map((t) => (
                    <li
                      key={t}
                      className="text-[11px] px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200"
                    >
                      #{t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
