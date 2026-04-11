'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { artworks, buildBidHref } from '@/data/artworks';

export function LiveAuctionSection() {
  const auctionArtwork = artworks.find((a) => a.status === 'auction');
  const [bidAmount, setBidAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!auctionArtwork) return null;

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount.trim()) return;
    const href = buildBidHref(auctionArtwork, `₹${bidAmount}`);
    window.location.href = href;
    setSubmitted(true);
    setBidAmount('');
  };

  return (
    <section
      id="live-auction"
      className="px-6 md:px-12 py-16 md:py-24"
      aria-label="Live auction panel"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.35em] text-primary/60 block mb-2">
            Currently Live
          </span>
          <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface">
            Active <span className="text-primary">Auction</span>
          </h2>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse-live" />
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold">
            Live Now
          </span>
        </div>
      </div>

      {/* Glass card */}
      <div className="glass-card p-0 overflow-hidden flex flex-col lg:flex-row gap-0">
        {/* Left: Artwork image */}
        <div className="lg:w-[45%] relative group overflow-hidden">
          <div className="aspect-square lg:aspect-auto lg:h-full min-h-[380px]">
            <ImagePlaceholder
              label={auctionArtwork.title}
              icon="palette"
              accentColor="#e9c349"
              className="w-full h-full rounded-none"
            />
          </div>

          {/* Live badge over image */}
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-900/80 backdrop-blur-sm px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live" />
            <span className="font-label text-[10px] uppercase tracking-widest text-red-400 font-bold">
              Live Auction
            </span>
          </div>

          {/* Gradient overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-70 pointer-events-none" />

          {/* Artwork info overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-label text-[9px] uppercase tracking-widest text-primary/60 block mb-1">
              Lot {auctionArtwork.auctionId}
            </span>
            <h3 className="font-headline italic text-2xl text-on-surface">
              {auctionArtwork.title}
            </h3>
            <p className="font-body text-sm text-on-surface-variant/70 mt-1">
              {auctionArtwork.medium} · {auctionArtwork.dimensions}
            </p>
          </div>
        </div>

        {/* Right: Bid info */}
        <div className="lg:w-[55%] p-8 md:p-10 flex flex-col gap-8 justify-between">
          {/* Bid stats */}
          <div className="grid grid-cols-2 gap-6 py-6 border-b border-outline-variant/10">
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                Current Bid
              </span>
              <div className="font-headline italic text-4xl md:text-5xl text-primary">
                {auctionArtwork.highestBid}
              </div>
              <span className="font-label text-[9px] uppercase tracking-widest text-neutral-600 block mt-1">
                Starting bid: {auctionArtwork.startingBid}
              </span>
            </div>
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                Auction Ends In
              </span>
              <div className="font-headline text-4xl md:text-5xl text-on-surface tabular-nums tracking-tight">
                {auctionArtwork.timeRemaining}
              </div>
              <span className="font-label text-[9px] uppercase tracking-widest text-neutral-600 block mt-1">
                HH : MM : SS
              </span>
            </div>
          </div>

          {/* Engagement stats */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <MaterialIcon name="group" size="sm" className="text-primary" />
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                {auctionArtwork.bidders} Bidders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon name="visibility" size="sm" className="text-primary" />
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                {auctionArtwork.watchers} Watching
              </span>
            </div>
          </div>

          {/* Bid input */}
          <div>
            {submitted ? (
              <div className="flex items-center gap-3 border border-primary/20 bg-primary/5 px-6 py-5 text-primary">
                <MaterialIcon name="check_circle" size="md" />
                <span className="font-label text-xs uppercase tracking-widest">
                  Bid request sent — we&apos;ll confirm shortly
                </span>
              </div>
            ) : (
              <form onSubmit={handleBid} className="flex gap-0">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-label text-sm text-neutral-500">
                    ₹
                  </span>
                  <input
                    id="live-auction-bid-input"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid amount"
                    min="1"
                    className={cn(
                      'w-full bg-surface-container-high border border-outline-variant/20',
                      'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30',
                      'py-4 pl-8 pr-4 font-label text-sm uppercase tracking-wide',
                      'text-on-surface placeholder:text-neutral-700',
                      'transition-all duration-300'
                    )}
                    aria-label="Enter bid amount in rupees"
                  />
                </div>
                <button
                  type="submit"
                  id="live-auction-bid-submit"
                  className={cn(
                    'gold-gradient-bg text-on-primary font-label font-bold px-8 py-4',
                    'uppercase tracking-widest text-xs whitespace-nowrap',
                    'hover:-translate-y-0.5 active:scale-95 transition-all duration-300',
                    'shadow-[0_4px_20px_rgba(233,195,73,0.2)] hover:shadow-[0_8px_30px_rgba(233,195,73,0.35)]'
                  )}
                >
                  Place Bid
                </button>
              </form>
            )}
            <p className="font-label text-[9px] uppercase tracking-widest text-neutral-700 mt-3">
              Submitting opens a bid confirmation email. Minimum increment: ₹5,000
            </p>
          </div>

          {/* Recent activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                Recent Bids
              </span>
              <span className="font-label text-[9px] uppercase tracking-widest text-primary/50">
                {auctionArtwork.bidHistory?.length ?? 0} recorded
              </span>
            </div>
            <div className="space-y-0 border border-outline-variant/10 overflow-hidden">
              {auctionArtwork.bidHistory?.map((bid, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-between px-5 py-3 transition-colors',
                    i === 0
                      ? 'bg-primary/5 border-b border-outline-variant/10'
                      : 'bg-surface-container-lowest border-b border-outline-variant/5 last:border-0'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {i === 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                    <span
                      className={cn(
                        'font-label text-[10px] uppercase tracking-wide',
                        i === 0 ? 'text-on-surface font-bold' : 'text-neutral-500'
                      )}
                    >
                      {bid.user}
                    </span>
                    {i === 0 && (
                      <span className="font-label text-[8px] uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5">
                        Highest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        'font-label text-xs',
                        i === 0 ? 'text-primary font-bold' : 'text-neutral-600'
                      )}
                    >
                      {bid.amount}
                    </span>
                    <span className="font-label text-[9px] uppercase tracking-widest text-neutral-700">
                      {bid.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link to full auction page */}
          <Link
            href="/art#live-auction"
            className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-primary/50 hover:text-primary transition-colors"
          >
            <MaterialIcon name="open_in_new" size="sm" />
            View full auction details
          </Link>
        </div>
      </div>
    </section>
  );
}
