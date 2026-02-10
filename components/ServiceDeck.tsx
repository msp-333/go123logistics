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
        'rounded-2xl border border-slate-200 bg-white',
        'shadow-[0_1px_0_rgba(15,23,42,0.04),0_14px_40px_rgba(15,23,42,0.06)]',
        'flex flex-col overflow-hidden',
        // Important for nested scroll to work inside flex
        'min-h-0',
        heightClass
      )}
    >
      {/* Tabs (normal flow, no sticky) */}
      <div className="border-b border-slate-200 bg-slate-50/70">
        <div
          role="tablist"
          aria-label="Service sections"
          className="deck-tabs flex gap-2 overflow-x-auto p-3 [scrollbar-width:none] [-ms-overflow-style:none]"
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

        <style jsx>{`
          .deck-tabs::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Content
          - mobile: normal (no inner scroll)
          - desktop: inner scroll
      */}
      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="flex-1 min-h-0 p-6 sm:p-7 md:overflow-auto"
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
