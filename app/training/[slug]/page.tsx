// app/training/[slug]/page.tsx
import TrainingModuleClient from './TrainingModuleClient';

export const dynamicParams = false;

// Tell Next which slugs to pre-generate for static export.
// Add more slugs to this array when you add more modules.
export function generateStaticParams() {
  return [
    { slug: 'fundamentals' },
    // { slug: 'another-module' },
  ];
}

export default function TrainingModulePage({
  params,
}: {
  params: { slug: string };
}) {
  return <TrainingModuleClient slug={params.slug} />;
}
