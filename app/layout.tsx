// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import Providers from './providers';

// Use your switcher if you created it; otherwise swap to Navbar
import NavbarSwitcher from '@/components/NavbarSwitcher';
// import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'GO123 Logistics — Freight, Trucking & Shipping',
  description:
    'Streamline your freight shipping with our comprehensive logistics network. Reliable service by land, air, and sea.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <Providers>
          {/* ✅ This wrapper is the real flex layout */}
          <div className="min-h-screen flex flex-col">
            <NavbarSwitcher />
            {/* <Navbar /> */}

            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
