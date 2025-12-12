import React from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; // e.g. "/go123logistics" on GitHub Pages

type Resource = {
  title: string;
  description: string;
  href: string;      // must start with "/resources/..."
  filename: string;  // download name
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
              <div className="space-y-3">
                <p className="text-sm text-slate-600">{r.description}</p>

                <a
                  href={`${BASE_PATH}${r.href}`}
                  download={r.filename}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Download PDF
                </a>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}
