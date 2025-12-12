// app/training/[slug]/page.tsx
import TrainingModuleClient from './TrainingModuleClient';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

async function fetchSlugs(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).'
    );
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/training_modules?select=slug&is_active=eq.true`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    }
  );

  if (!res.ok) throw new Error(await res.text());

  const rows = (await res.json()) as Array<{ slug: string | null }>;
  return rows.map((r) => r.slug).filter(Boolean) as string[];
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await fetchSlugs();

  // If this is empty, static export can't generate any /training/* pages.
  // Also avoids a confusing Next error in some cases.
  if (slugs.length === 0) {
    throw new Error(
      'generateStaticParams found 0 training module slugs. Check: (1) training_modules has active rows, (2) RLS allows this build-time read, (3) SUPABASE_SERVICE_ROLE_KEY is set in CI.'
    );
  }

  return slugs.map((slug) => ({ slug }));
}

export default function Page({ params }: { params: Params }) {
  return <TrainingModuleClient slug={params.slug} />;
}
