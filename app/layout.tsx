// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import NavbarSwitcher from "@/components/NavbarSwitcher";
import Footer from "@/components/Footer";
import { Inter, IBM_Plex_Sans } from "next/font/google";

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
});

const headingFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "GO123 Logistics — Freight, Trucking & Shipping",
  description:
    "Streamline your freight shipping with our comprehensive logistics network. Reliable service by land, air, and sea.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
        <Providers>
          <NavbarSwitcher />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
