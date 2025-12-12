// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import NavbarSwitcher from '@/components/NavbarSwitcher';

export const metadata: Metadata = {
  title: 'GO123 Logistics — Freight, Trucking & Shipping',
  description:
    'Streamline your freight shipping with our comprehensive logistics network. Reliable service by land, air, and sea.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <Providers>
          <NavbarSwitcher />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
