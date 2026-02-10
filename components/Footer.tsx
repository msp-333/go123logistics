// components/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      {/* accent line to match CTA */}
      <div className="h-1.5 bg-brand-green" />

      <div className="container py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-white/70">
            Copyright © {year}{" "}
            <span className="font-semibold text-white">
              G<span className="lowercase">o</span>123
              <span className="uppercase">L</span>ogistics
            </span>
          </p>

          {/* optional right-side links (remove if you don’t want) */}
          <div className="flex items-center gap-5 text-white/70">
            <a className="hover:text-white transition" href="/shipping-guide">
              Shipping Guide
            </a>
            <a className="hover:text-white transition" href="/contact">
              Get a Quote
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
