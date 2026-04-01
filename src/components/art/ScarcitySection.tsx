import React from 'react';

export function ScarcitySection() {
  return (
    <section
      className="py-32 px-6 md:px-12 bg-surface text-center overflow-hidden relative"
      aria-label="One of one scarcity statement"
    >
      {/* Watermark text */}
      <div
        className="absolute -left-8 top-1/2 -translate-y-1/2 font-headline italic opacity-[0.04] select-none pointer-events-none text-primary whitespace-nowrap"
        style={{ fontSize: 'clamp(6rem, 18vw, 16rem)' }}
        aria-hidden="true"
      >
        ONE OF ONE
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Label */}
        <span className="font-label text-primary/60 uppercase tracking-[0.4em] text-[10px]">
          The Sovereign Principle
        </span>

        {/* Headline */}
        <h2
          className="font-headline italic text-primary leading-tight"
          style={{ fontSize: 'clamp(3rem, 9vw, 6rem)' }}
        >
          One of One
        </h2>

        {/* Divider */}
        <div className="w-16 h-px bg-primary/30" />

        {/* Body */}
        <p className="font-body text-xl md:text-2xl text-on-surface-variant leading-relaxed max-w-2xl">
          Each artwork in this collection is created once and{' '}
          <span className="text-on-surface font-semibold italic">
            never recreated
          </span>
          . When a piece is sold, it is permanently removed from circulation. We
          do not offer prints, reproductions, or digital copies of any
          &quot;Sovereign&quot; series work.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-px mt-4 border border-outline-variant/10 overflow-hidden">
          {[
            { value: '1×', label: 'Created' },
            { value: '0', label: 'Reproductions' },
            { value: '∞', label: 'Permanence' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center px-12 py-8 bg-surface-container-low gap-2 min-w-[140px]"
            >
              <span className="font-headline italic text-4xl text-primary">
                {value}
              </span>
              <span className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
