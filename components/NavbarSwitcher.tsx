'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrainingNavbar from '@/components/TrainingNavbar';

export default function NavbarSwitcher() {
  const rawPath = usePathname() || '/';
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pathname = base && rawPath.startsWith(base) ? rawPath.slice(base.length) || '/' : rawPath;

  const isTraining = pathname === '/training' || pathname.startsWith('/training/');

  return (
    <>
      {isTraining ? <TrainingNavbar /> : <Navbar />}
      {!isTraining ? <Footer /> : null}
    </>
  );
}
