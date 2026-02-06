export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-slate-100 bg-slate-50">
      <div className="container py-10 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          Copyright © {year}{" "}
          <span className="font-medium">
            G<span className="lowercase">o</span>123
            <span className="uppercase">L</span>ogistics
          </span>
        </p>
      </div>
    </footer>
  );
}
