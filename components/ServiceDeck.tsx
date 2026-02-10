'use client';

import * as React from 'react';
import clsx from 'clsx';

type Section = {
  id: string;
  title: string; // Overview / Options / Process / Services / Tracking
  content: React.ReactNode;
};

export default function ServiceDeck({
  sections,
  heightClass = 'h-auto md:h-[520px]',
}: {
  sections: Section[];
  heightClass?: string;
}) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  // Prevent “empty panel” if sections change during dev / hot reload
  React.useEffect(() => {
    if (activeIdx >= sections.length) setActiveIdx(0);
  }, [sections.length, activeIdx]);

  const active = sections[activeIdx];

  const goPrev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIdx((i) => Math.min(sections.length - 1, i + 1));

  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-200 bg-white shadow-soft',
        'flex flex-col overflow-hidden min-h-0',
        heightClass
      )}
    >
      {/* Tabs (centered + wrap) */}
      <div className="border-b border-slate-200 bg-slate-50/70">
        <div role="tablist" aria-label="Service sections" className="flex flex-wrap justify-center gap-2 p-3">
          {sections.map((s, idx) => {
            const isActive = idx === activeIdx;
            const label = (s.title ?? '').trim() || 'Tab'; // avoids blank pill

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
                  'focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2',
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 p-6 sm:p-7 md:overflow-auto text-[15px] leading-relaxed text-slate-700">
        {!active ? (
          <div className="text-sm text-slate-500">
            No content found for this section. (Make sure every section has title + content.)
          </div>
        ) : (
          <div role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`}>
            {active.content}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIdx === 0}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2',
            activeIdx === 0
              ? 'border-slate-200 text-slate-400 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:border-slate-300'
          )}
        >
          Prev
        </button>

        <div className="text-xs text-slate-500">
          {Math.min(activeIdx + 1, sections.length)} / {sections.length}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIdx === sections.length - 1}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2',
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
