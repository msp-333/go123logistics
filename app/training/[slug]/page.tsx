import TrainingModuleClient from './TrainingModuleClient';

type Params = { slug: string };

async function fetchModuleSlugs(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE keys in env.');
  }

  // Pull distinct module slugs from lessons
  const url =
    `${supabaseUrl}/rest/v1/training_lessons` +
    `?select=module_slug&is_active=eq.true`;

  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch training slugs: ${res.status} ${await res.text()}`);
  }

  const rows = (await res.json()) as Array<{ module_slug: string | null }>;
  const unique = Array.from(new Set(rows.map(r => r.module_slug).filter(Boolean))) as string[];
  return unique;
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await fetchModuleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function Page({ params }: { params: Params }) {
  return <TrainingModuleClient slug={params.slug} />;
}
