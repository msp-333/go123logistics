// app/training/[slug]/page.tsx
import TrainingModuleClient from './TrainingModuleClient';

type Params = { slug: string };

// Choose ONE source of truth for slugs:
// Option A (recommended if you have training_modules table): training_modules.slug
async function fetchSlugs(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL and/or Supabase key env vars.');
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/training_modules?select=slug&is_active=eq.true`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) throw new Error(await res.text());

  const rows = (await res.json()) as Array<{ slug: string | null }>;
  return rows.map(r => r.slug).filter(Boolean) as string[];
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await fetchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function Page({ params }: { params: Params }) {
  return <TrainingModuleClient slug={params.slug} />;
}
