"use client";

import React, { useEffect, useMemo, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; // e.g. "/go123logistics"

type Resource = {
  title: string;
  description: string;
  href: string;      // "/resources/....pdf"
  filename: string;  // suggested download name
};

const RESOURCES: Resource[] = [
  {
    title: "Go123 Training Manual Excerpt (2024)",
    description: "Glossary + trucking basics reference for day-to-day quoting and ops.",
    href: "/resources/go123-training-manual-excerpt-2024.pdf",
    filename: "Go123-Training-Manual-Excerpt-2024.pdf",
  },
  {
    title: "Over Dimensional (OD) Training (Oct 2017)",
    description: "OD basics, permits, equipment types, and examples for heavy haul loads.",
    href: "/resources/go123-over-dimensional-training-oct2017.pdf",
    filename: "Go123-Over-Dimensional-Training-Oct2017.pdf",
  },
];

export default function TrainingResourcesPage() {
  const [open, setOpen] = useState<null | Resource>(null);

  // lock scroll + ESC to close
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const openUrl = useMemo(() => {
    if (!open) return "";
    return `${BASE_PATH}${open.href}`;
  }, [open]);

  return (
    <main className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Resources</h1>
          <p className="mt-1 text-sm text-slate-600">
            Quick references and helpful docs for agents.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {RESOURCES.map((r) => (
            <Card key={r.href} title={r.title}>
              <p className="mt-2 text-sm text-slate-600">{r.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(r)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                >
                  View
                </button>

                <a
                  href={`${BASE_PATH}${r.href}`}
                  download={r.filename}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Download
                </a>
              </div>
            </Card>
          ))}
        </section>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${open.title}`}
        >
          {/* Backdrop */}
          <button
            aria-label="Close preview"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(null)}
            type="button"
          />

          {/* Panel */}
          <div className="relative z-10 w-[min(1000px,92vw)] overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {open.title}
                </div>
                <div className="truncate text-xs text-slate-500">
                  PDF preview
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={openUrl}
                  download={open.filename}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>

            {/* PDF viewer */}
            <div className="h-[78vh] bg-slate-100">
              <iframe
                title={open.title}
                src={openUrl}
                className="h-full w-full"
              />
            </div>

            {/* Small fallback hint */}
            <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
              If the preview doesn’t load on your device, use “Download”.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}
