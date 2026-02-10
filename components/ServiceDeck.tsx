'use client';

import * as React from 'react';
import clsx from 'clsx';

type Section = {
  id: string;
  title: string; // one-word: Overview / Options / Process / Services / Tracking / Specs
  content: React.ReactNode;
};

export default function ServiceDeck({
  sections,
  heightClass = 'h-auto md:h-[520px]', // contain on desktop, natural on mobile
}: {
  sections: Section[];
  heightClass?: string;
}) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const active = sections[activeIdx];

  const goPrev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIdx((i) => Math.min(sections.length - 1, i + 1));

  return (
    <div
      className={clsx(
        'rounded-2xl border border-app-border bg-app-surface shadow-soft',
        'flex flex-col overflow-hidden min-h-0',
        heightClass
      )}
    >
      {/* Tabs (centered) */}
      <div className="border-b border-app-border bg-app-muted/60">
        <div
          role="tablist"
          aria-label="Service sections"
          className="flex flex-wrap justify-center gap-2 p-3"
        >
          {sections.map((s, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${s.id}`}
                id={`tab-${s.id}`}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={clsx(
                  'rounded-full px-3 py-1.5 text-sm leading-none whitespace-nowrap',
                  'border transition',
                  'focus:outline-none focus:ring-2 focus:ring-app-border focus:ring-offset-2',
                  isActive
                    ? 'bg-app-text text-white border-app-text'
                    : 'bg-white text-app-mutedText border-app-border hover:border-slate-300'
                )}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content (desktop: inner scroll to keep deck tidy) */}
      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="flex-1 min-h-0 p-6 sm:p-7 md:overflow-auto text-[15px] leading-relaxed text-app-mutedText"
      >
        {active.content}
      </div>

      {/* Footer */}
      <div className="border-t border-app-border bg-app-surface px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIdx === 0}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-app-border focus:ring-offset-2',
            activeIdx === 0
              ? 'border-app-border text-slate-400 cursor-not-allowed'
              : 'border-app-border text-app-mutedText hover:border-slate-300'
          )}
        >
          Prev
        </button>

        <div className="text-xs text-slate-500">
          {activeIdx + 1} / {sections.length}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIdx === sections.length - 1}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-app-border focus:ring-offset-2',
            activeIdx === sections.length - 1
              ? 'border-app-border text-slate-400 cursor-not-allowed'
              : 'border-app-border text-app-mutedText hover:border-slate-300'
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
