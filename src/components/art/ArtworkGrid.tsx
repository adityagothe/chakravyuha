import React from 'react';
import { artworks } from '@/data/artworks';
import { ArtworkCard } from './ArtworkCard';

export function ArtworkGrid() {
  // Exclude upcoming artworks — they have their own dedicated section
  const gridArtworks = artworks.filter((a) => a.status !== 'upcoming');

  const auctionCount = gridArtworks.filter((a) => a.status === 'auction').length;
  const availableCount = gridArtworks.filter((a) => a.status === 'available').length;
  const soldCount = gridArtworks.filter((a) => a.status === 'sold').length;

  return (
    <section
      id="artworks"
      className="px-6 md:px-12 py-16 md:py-24 bg-surface-container-low"
      aria-label="Current collection"
    >
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
        <div>
          <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-3 block">
            The Collection
          </span>
          <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface">
            Current <span className="text-primary">Works</span>
          </h2>
        </div>
        {/* Status counts */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {auctionCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                {auctionCount} Live Auction
              </span>
            </div>
          )}
          <span className="font-label text-[10px] uppercase tracking-widest text-neutral-600">
            {availableCount} Fixed Price
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-neutral-700">
            {soldCount} Sold
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
        {gridArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  );
}
