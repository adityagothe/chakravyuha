import React from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export function ArtHeroSection() {
  return (
    <section className="relative px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-12 items-end gap-12 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-secondary-container/10 rounded-full blur-[100px]" />
      </div>

      {/* Left: text */}
      <div className="lg:col-span-8 relative z-10">
        <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-5 block">
          Original Artworks · One of One
        </span>

        <h1
          className="font-headline italic font-extrabold leading-[0.9] tracking-tighter mb-8"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}
        >
          Original
          <br />
          <span className="text-primary">Artworks</span>
        </h1>

        <p className="font-body text-xl text-on-surface-variant max-w-xl mb-12 border-l-2 border-secondary-container pl-6 leading-relaxed">
          Each piece exists only once. Created by{' '}
          <span className="text-on-surface font-semibold italic">
            Aditya&apos;s sister
          </span>
          . Exploring the intersection of ancient myths, raw emotion, and visual
          language that refuses to repeat itself.
        </p>

        <a
          href="#artworks"
          className="inline-flex items-center gap-3 gold-gradient-bg text-on-primary font-label font-bold px-10 py-4 uppercase tracking-widest text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(233,195,73,0.2)]"
        >
          <MaterialIcon name="palette" size="sm" />
          View the Collection
        </a>
      </div>

      {/* Right: feature artwork teaser */}
      <div className="lg:col-span-4 hidden lg:block relative z-10">
        <div className="aspect-[3/4] bg-surface-container overflow-hidden relative group">
          <ImagePlaceholder
            label="Featured Work"
            icon="palette"
            accentColor="#e9c349"
            className="w-full h-full rounded-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Floating label */}
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-label text-[9px] uppercase tracking-widest text-primary/60 block mb-1">
              Latest Work
            </span>
            <span className="font-headline italic text-lg text-on-surface">
              The Gilded Cage
            </span>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="lg:col-span-12 relative z-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
        >
          <MaterialIcon
            name="arrow_back"
            size="sm"
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
