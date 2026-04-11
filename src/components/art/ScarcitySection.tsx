import React from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

const principles = [
  {
    icon: 'looks_one',
    title: '1 × Created',
    body: 'Each work is created exactly once. There is no edition, no series, no re-release.',
  },
  {
    icon: 'block',
    title: '0 Reproductions',
    body: 'No prints. No digital copies. No licensed derivatives. The original is the only object.',
  },
  {
    icon: 'all_inclusive',
    title: 'Permanent Ownership',
    body: 'Once acquired, it is yours — with provenance documentation and certificate of authenticity.',
  },
];

export function ScarcitySection() {
  return (
    <section
      className="py-24 md:py-32 px-6 md:px-12 bg-surface text-center overflow-hidden relative"
      aria-label="One of one scarcity statement"
    >
      {/* Watermark text */}
      <div
        className="absolute -left-8 top-1/2 -translate-y-1/2 font-headline italic opacity-[0.03] select-none pointer-events-none text-primary whitespace-nowrap"
        style={{ fontSize: 'clamp(6rem, 20vw, 18rem)' }}
        aria-hidden="true"
      >
        ORIGINAL
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-10">
        {/* Label */}
        <span className="font-label text-primary/50 uppercase tracking-[0.4em] text-[10px]">
          The Sovereign Principle
        </span>

        {/* Headline with shimmer */}
        <h2
          className="gold-shimmer-text font-headline italic leading-tight"
          style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)' }}
        >
          One of One
        </h2>

        {/* Divider */}
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Body text */}
        <p className="font-body text-xl md:text-2xl text-on-surface-variant leading-relaxed max-w-2xl">
          Each artwork in this collection is created once and{' '}
          <span className="text-on-surface font-semibold italic">
            never recreated
          </span>
          . When a piece is sold, it is permanently removed from circulation. We
          do not offer prints, reproductions, or digital copies of any work in
          the Sovereign series.
        </p>

        {/* Principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-4 border border-outline-variant/10 overflow-hidden w-full">
          {principles.map(({ icon, title, body }, i) => (
            <div
              key={title}
              className={`flex flex-col items-center justify-start px-8 py-10 bg-surface-container-low gap-4 group hover:bg-surface-container transition-colors duration-300 ${
                i < principles.length - 1 ? 'border-b md:border-b-0 md:border-r border-outline-variant/10' : ''
              }`}
            >
              <div className="w-12 h-12 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors duration-300">
                <MaterialIcon name={icon} size="lg" className="text-primary/60 group-hover:text-primary transition-colors duration-300" />
              </div>
              <span className="font-headline italic text-2xl text-primary">
                {title}
              </span>
              <p className="font-body text-sm text-on-surface-variant/70 text-center leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Certificate note */}
        <div className="flex items-center gap-3 text-neutral-600 mt-2">
          <MaterialIcon name="verified" size="sm" className="text-primary/40" />
          <span className="font-label text-[9px] uppercase tracking-widest">
            All acquisitions include provenance certificate & physical documentation
          </span>
        </div>
      </div>
    </section>
  );
}
