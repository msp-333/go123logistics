// app/training/[slug]/page.tsx
import TrainingModuleClient from './TrainingModuleClient';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

async function fetchSlugs(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY).'
    );
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/training_lessons?select=module_slug&is_active=eq.true`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: 'force-cache',
    }
  );

  if (!res.ok) throw new Error(await res.text());

  const rows = (await res.json()) as Array<{ module_slug: string | null }>;
  return Array.from(new Set(rows.map((r) => r.module_slug).filter(Boolean) as string[]));
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await fetchSlugs();
  if (slugs.length === 0) {
    throw new Error(
      'generateStaticParams found 0 module slugs. Ensure training_lessons has is_active=true rows.'
    );
  }
  return slugs.map((slug) => ({ slug }));
}

export default function Page({ params }: { params: Params }) {
  return <TrainingModuleClient slug={params.slug} />;
}
