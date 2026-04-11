import React from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { artworks } from '@/data/artworks';

export function ArtHeroSection() {
  const auctionArtwork = artworks.find((a) => a.status === 'auction');

  return (
    <section
      className="relative px-6 md:px-12 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 items-end gap-12 overflow-hidden"
      aria-label="Art page hero"
    >
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary-container/8 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] bg-primary/3 rounded-full blur-[80px]" />
      </div>

      {/* Left: text */}
      <div className="lg:col-span-8 relative z-10 space-y-8">
        {/* Overline label */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px]">
            Sovereign Archive · 1 of 1
          </span>
          {/* Live auction indicator */}
          {auctionArtwork && (
            <div className="flex items-center gap-2 border border-red-900/40 bg-red-950/30 px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-red-400 font-bold">
                Live Auction Active
              </span>
            </div>
          )}
        </div>

        {/* Headline */}
        <h1
          className="font-headline italic font-extrabold leading-[0.88] tracking-tighter"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)' }}
        >
          Original
          <br />
          <span className="text-primary">Art.</span>
          <br />
          <span className="text-neutral-500 text-[0.6em]">1 of 1.</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg text-on-surface-variant max-w-xl border-l-2 border-secondary-container pl-6 leading-relaxed">
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
          {/* Primary: Enter Auction */}
          <a
            id="hero-enter-auction-cta"
            href="#live-auction"
            className="inline-flex items-center gap-3 gold-gradient-bg text-on-primary font-label font-bold px-10 py-4 uppercase tracking-widest text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(233,195,73,0.2)] hover:shadow-[0_8px_30px_rgba(233,195,73,0.35)]"
          >
            <MaterialIcon name="gavel" size="sm" />
            Enter Auction
          </a>
          {/* Secondary: Explore Collection */}
          <a
            id="hero-explore-collection-cta"
            href="#artworks"
            className="inline-flex items-center gap-3 border border-primary/30 text-primary font-label font-bold px-8 py-4 uppercase tracking-widest text-sm hover:bg-primary/5 hover:border-primary/60 active:scale-95 transition-all duration-300"
          >
            <MaterialIcon name="palette" size="sm" />
            Explore Collection
          </a>
        </div>
      </div>

      {/* Right: featured auction teaser */}
      <div className="lg:col-span-4 hidden lg:block relative z-10">
        <a href="#live-auction" className="block group cursor-pointer">
          {/* Outer border accent */}
          <div className="absolute -inset-2 border border-primary/10 group-hover:border-primary/30 transition-colors duration-500 pointer-events-none" />
          <div className="aspect-[3/4] bg-surface-container overflow-hidden relative">
            <ImagePlaceholder
              label={auctionArtwork?.title ?? 'Featured Lot'}
              icon="palette"
              accentColor="#e9c349"
              className="w-full h-full rounded-none"
            />
            {/* Scale on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 pointer-events-none group-hover:opacity-40 transition-opacity duration-500" />

            {/* Featured lot badge */}
            {auctionArtwork && (
              <div className="absolute top-5 right-5 flex items-center gap-2 bg-red-900/80 backdrop-blur-sm px-3 py-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                <span className="font-label text-[9px] uppercase tracking-widest text-red-400 font-bold">
                  Live
                </span>
              </div>
            )}

            {/* Bottom: artwork info */}
            <div className="absolute bottom-5 left-5 right-5">
              <div className="bg-surface/80 backdrop-blur-md p-4 border-l-2 border-primary/60">
                <span className="font-label text-[8px] uppercase tracking-widest text-primary/60 block mb-1">
                  Featured Lot · {auctionArtwork?.auctionId}
                </span>
                <span className="font-headline italic text-base text-on-surface block">
                  {auctionArtwork?.title ?? 'The Gilded Cage'}
                </span>
                <span className="font-label text-[9px] text-primary block mt-1">
                  Bid from {auctionArtwork?.highestBid}
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Back link & scroll indicator row */}
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
        {/* Scroll hint */}
        <div className="flex items-center gap-2 text-neutral-700">
          <MaterialIcon name="keyboard_arrow_down" size="sm" className="animate-bounce" />
          <span className="font-label text-[9px] uppercase tracking-widest">
            Scroll to auction
          </span>
        </div>
      </div>
    </section>
  );
}
