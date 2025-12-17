'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TrainingModuleLegacyPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const slug = sp.get('slug') ?? '';

  useEffect(() => {
    if (!slug) {
      router.replace('/training');
      return;
    }
    router.replace(`/training/${slug}`);
  }, [router, slug]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
      <p className="text-sm text-slate-500">Redirecting...</p>
    </main>
  );
}
