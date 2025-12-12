'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      // If Supabase uses "code" flow, exchange it
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          router.replace('/login');
          return;
        }
      } else {
        // If it uses implicit hash (#access_token=...), supabase-js will detect it
        await supabase.auth.getSession();
      }

      router.replace('/training');
    };

    run();
  }, [router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm text-slate-500">Signing you in…</p>
    </main>
  );
}
