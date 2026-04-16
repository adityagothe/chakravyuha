import React from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function ArtHeroSection() {
  return (
    <section
      className="relative px-6 md:px-12 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 items-end gap-12 overflow-hidden"
      aria-label="Art page hero"
    >
      {/* Animated gold border glow at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0" />

      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary-container/8 rounded-full blur-[120px]" />
        {/* Extra gold corner glow */}
        <div className="absolute top-[-80px] right-[-80px] w-[350px] h-[350px] bg-primary/8 rounded-full blur-[120px]" />
      </div>

      {/* Left: text */}
      <div className="lg:col-span-8 relative z-10 space-y-8">
        {/* Overline */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px]">
            Exclusive Collection · 1 of 1
          </span>
          <div className="flex items-center gap-2 border border-primary/30 bg-primary/8 px-3 py-1.5 shadow-[0_0_12px_rgba(233,195,73,0.1)]">
            {/* Crown / diamond icon */}
            <span className="text-primary text-[13px] leading-none select-none">✦</span>
            <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary/80">
              Original Art for Sale
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="font-headline italic font-extrabold leading-[0.88] tracking-tighter"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)' }}
        >
          Exclusive
          <br />
          <span className="text-primary relative">
            Art.
            {/* subtle underline glow */}
            <span className="absolute bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
          </span>
          <br />
          <span className="text-neutral-500 text-[0.6em]">1 of 1.</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg text-on-surface-variant max-w-xl border-l-2 border-primary/40 pl-6 leading-relaxed">
          Each piece exists only once. No reproductions. No prints. Exclusive
          permanent ownership — acquired by a single collector and never
          re-issued. Created by{' '}
          <span className="text-on-surface font-semibold italic">
            Aditya&apos;s sister
          </span>
          , exploring the intersection of ancient myth and raw visual language.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            id="hero-browse-collection-cta"
            href="#artworks"
            className="inline-flex items-center gap-3 gold-gradient-bg text-on-primary font-label font-bold px-10 py-4 uppercase tracking-widest text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(233,195,73,0.2)] hover:shadow-[0_8px_30px_rgba(233,195,73,0.35)]"
          >
            <span className="text-base leading-none">✦</span>
            Browse Exclusive Collection
          </a>
          <a
            id="hero-enquire-cta"
            href="mailto:vajra.vyuha.official@gmail.com?subject=Art%20Enquiry%20%E2%80%94%20VAJRAVYUHA"
            className="inline-flex items-center gap-3 border border-primary/30 text-primary font-label font-bold px-8 py-4 uppercase tracking-widest text-sm hover:bg-primary/5 hover:border-primary/60 active:scale-95 transition-all duration-300"
          >
            <MaterialIcon name="mail" size="sm" />
            Enquire
          </a>
        </div>
      </div>

      {/* Right: value statement */}
      <div className="lg:col-span-4 hidden lg:flex flex-col gap-6 relative z-10">
        {/* Gold seal badge */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 border border-primary/40 flex items-center justify-center bg-primary/5 shadow-[0_0_20px_rgba(233,195,73,0.15)]">
            <span className="text-primary text-lg leading-none">♦</span>
          </div>
          <div>
            <p className="font-label text-[9px] uppercase tracking-widest text-primary/80">Sovereign Quality</p>
            <p className="font-label text-[8px] text-neutral-600 uppercase tracking-wider">Each work hand-verified</p>
          </div>
        </div>
        {[
          { icon: 'looks_one', label: '1 × Created', sub: 'Each work made exactly once' },
          { icon: 'block', label: '0 Reproductions', sub: 'No prints, no digital copies' },
          { icon: 'verified', label: 'With Certificate', sub: 'Provenance & authenticity docs' },
          { icon: 'workspace_premium', label: 'Exclusive Access', sub: 'Private collector ownership' },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="flex items-start gap-4 border-l border-primary/20 pl-4 group hover:border-primary/50 transition-colors">
            <MaterialIcon name={icon} size="md" className="text-primary/50 mt-0.5 shrink-0 group-hover:text-primary/80 transition-colors" />
            <div>
              <p className="font-label text-xs uppercase tracking-wider text-on-surface">{label}</p>
              <p className="font-label text-[9px] text-neutral-600 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row: back link + scroll hint */}
      <div className="lg:col-span-12 relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-primary/50 hover:text-primary transition-colors"
        >
          <MaterialIcon
            name="arrow_back"
            size="sm"
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>
        <div className="flex items-center gap-2 text-neutral-700">
          <MaterialIcon name="keyboard_arrow_down" size="sm" className="animate-bounce" />
          <span className="font-label text-[9px] uppercase tracking-widest">Scroll to view</span>
        </div>
      </div>
    </section>
  );
}
