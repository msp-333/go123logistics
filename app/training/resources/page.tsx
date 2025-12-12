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
          <Card title="Carrier & SCAC Reference">
            Add your PDF/link here (e.g. SCAC codes, carrier onboarding checklist).
          </Card>
          <Card title="Rate & Quote Checklist">
            Add your internal checklist for building quotes and verifying accessorials.
          </Card>
          <Card title="Terms & Definitions">
            A glossary of freight terms agents must know.
          </Card>
          <Card title="Support Contacts">
            Who to contact for ops escalation, claims, customs, etc.
          </Card>
        </section>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </div>
  );
}
