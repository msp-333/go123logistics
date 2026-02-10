// components/ServiceDeck.tsx
'use client';

import * as React from 'react';
import clsx from 'clsx';

type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function ServiceDeck({
  sections,
  heightClass = 'h-auto md:h-[560px]',
  stickyOffsetClass = 'md:top-24',
}: {
  sections: Section[];
  /** Mobile should be auto height; desktop can be fixed to match the image */
  heightClass?: string;
  /** If you use a sticky nav, adjust this to match your navbar height */
  stickyOffsetClass?: string;
}) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const active = sections[activeIdx];

  const goPrev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIdx((i) => Math.min(sections.length - 1, i + 1));

  // Helps screen readers announce tab changes
  const tablistId = React.useId();

  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-200 bg-white',
        'shadow-[0_1px_0_rgba(15,23,42,0.04),0_14px_40px_rgba(15,23,42,0.06)]',
        'flex flex-col overflow-hidden',
        heightClass
      )}
    >
      {/* Tabs (scrollable on mobile). Sticky on desktop if you want it inside the panel. */}
      <div
        className={clsx(
          'border-b border-slate-200 bg-slate-50/70',
          // Optional: keep tabs visible while content scrolls on desktop
          'md:sticky',
          stickyOffsetClass,
          'z-10'
        )}
      >
        <div
          role="tablist"
          aria-label="Service sections"
          aria-labelledby={tablistId}
          className="flex gap-2 overflow-x-auto p-3 [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          <span id={tablistId} className="sr-only">
            Service sections
          </span>

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
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition',
                  'border focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2',
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                )}
              >
                {s.title}
              </button>
            );
          })}
        </div>

        {/* Hide scrollbar (WebKit) */}
        <style jsx>{`
          div[role='tablist']::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Content panel
          - Mobile: natural page scroll (no inner scroll)
          - Desktop: inner scroll to keep the whole deck same height as the image
      */}
      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="flex-1 p-6 sm:p-7 md:overflow-auto"
      >
        {active.content}
      </div>

      {/* Footer controls */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIdx === 0}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2',
            activeIdx === 0
              ? 'border-slate-200 text-slate-400 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:border-slate-300'
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
            'focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2',
            activeIdx === sections.length - 1
              ? 'border-slate-200 text-slate-400 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:border-slate-300'
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
