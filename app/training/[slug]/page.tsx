import TrainingModuleClient from './TrainingModuleClient';

export const dynamicParams = false;

// ✅ STATIC EXPORT NOTE (GitHub Pages):
// Add every new module slug here so Next can pre-generate the page.
export function generateStaticParams() {
  return [{ slug: 'fundamentals' }];
}

export default function TrainingModulePage({ params }: { params: { slug: string } }) {
  return <TrainingModuleClient slug={params.slug} />;
}
