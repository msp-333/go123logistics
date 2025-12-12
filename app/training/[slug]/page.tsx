// app/training/[slug]/page.tsx
import TrainingModuleClient from './TrainingModuleClient';

export const dynamicParams = false;

// MUST be named exactly: generateStaticParams
export function generateStaticParams() {
  return [
    { slug: 'fundamentals' },
    // add more slugs here (must match your DB)
  ];
}

export default function Page({ params }: { params: { slug: string } }) {
  return <TrainingModuleClient slug={params.slug} />;
}
