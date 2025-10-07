// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/content/posts";

/* ---------- Static params & metadata ---------- */
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  const title = post ? `${post.title} — GO123 Logistics` : "Logbook — GO123 Logistics";
  return {
    title,
    description: post?.excerpt,
    openGraph: post
      ? {
          title,
          description: post.excerpt,
          images: [{ url: post.image }],
        }
      : {},
  };
}

/* ---------- Small UI helpers (no extra libs) ---------- */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-emerald-700 font-semibold tracking-widest uppercase text-[11px]">
      {children}
    </p>
  );
}

function MetaRow({
  date,
  minutes,
  tags,
}: {
  date: string;
  minutes: number;
  tags?: string[];
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
      <time>
        {new Date(date).toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </time>
      <span aria-hidden="true">•</span>
      <span>{minutes} min read</span>
      {tags && tags.length > 0 && (
        <>
          <span aria-hidden="true">•</span>
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t}
                className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                #{t}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ArticleBody({ children }: { children: React.ReactNode }) {
  // Balanced reading rhythm; no typography plugin needed
  return (
    <section className="mx-auto max-w-3xl mt-8 text-[16px] md:text-[17px] leading-7 md:leading-8 text-slate-800">
      <div className="[&>p]:mt-5 [&>p:first-child]:mt-0 [&>ul]:mt-5 [&>ol]:mt-5 [&_li]:mt-2">
        {children}
      </div>
    </section>
  );
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  // derived
  const words = post.content.join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  const sorted = [...posts].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx = sorted.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  const related =
    posts
      .filter(
        (p) =>
          p.slug !== post.slug &&
          (p.tags ?? []).some((t) => (post.tags ?? []).includes(t))
      )
      .slice(0, 3) || [];

  return (
    <article className="container py-10">
      {/* Breadcrumbs */}
      <nav className="max-w-3xl mx-auto text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="max-w-3xl mx-auto mt-3">
        <Kicker>Logbook</Kicker>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
          {post.title}
        </h1>
        <MetaRow date={post.date} minutes={minutes} tags={post.tags} />
      </header>

      {/* Cover (use width/height for zero warnings) */}
      <figure className="max-w-3xl mx-auto mt-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
        <Image
          src={post.image}
          alt={post.title}
          width={1600}
          height={900}
          className="w-full h-64 md:h-80 object-cover"
          priority
        />
      </figure>

      {/* Body */}
      <ArticleBody>
        {post.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </ArticleBody>

      {/* Next / Prev — compact, aligned; single expands full width */}
      {(prev || next) && (
        <nav className="mt-10 max-w-3xl mx-auto" aria-label="Post navigation">
          <div className="grid gap-4 sm:grid-cols-2">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 flex items-start gap-3 transition-colors"
              >
                <svg
                  className="h-4 w-4 mt-0.5 text-slate-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" />
                </svg>
                <div>
                  <div className="text-[11px] text-slate-500">Previous</div>
                  <div className="text-[15px] md:text-base leading-snug font-semibold">
                    {prev.title}
                  </div>
                </div>
              </Link>
            )}

            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className={`rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 flex items-start gap-3 transition-colors ${
                  !prev ? "sm:col-span-2" : ""
                }`}
              >
                <div className="ml-auto text-right">
                  <div className="text-[11px] text-slate-500">Next</div>
                  <div className="text-[15px] md:text-base leading-snug font-semibold">
                    {next.title}
                  </div>
                </div>
                <svg
                  className="h-4 w-4 mt-0.5 text-slate-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Related reads — clear separation */}
      {related.length > 0 && (
        <section className="mt-12 max-w-3xl mx-auto pt-8 border-t border-slate-200">
          <h2 className="text-xl font-semibold">Related reads</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-32">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <time className="text-xs text-slate-500">
                    {new Date(r.date).toLocaleDateString()}
                  </time>
                  <h3 className="mt-1 font-semibold text-[15px] leading-snug">
                    {r.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="mt-10 max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="text-emerald-700 font-semibold hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    </article>
  );
}
