import TrainingModuleClient from './TrainingModuleClient';

type Params = { slug: string };

async function fetchSlugs(): Promise<string[]> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/training_modules?select=slug&is_active=eq.true`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');

  const res = await fetch(url, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(await res.text());

  const rows = (await res.json()) as Array<{ slug: string }>;
  return rows.map(r => r.slug).filter(Boolean);
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await fetchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function Page({ params }: { params: Params }) {
  return <TrainingModuleClient slug={params.slug} />;
}
