import React from 'react';
import { artworks } from '@/data/artworks';
import { ArtworkCard } from './ArtworkCard';

export function ArtworkGrid() {
  const available = artworks.filter((a) => a.status === 'available').length;
  const total = artworks.length;

  return (
    <section
      id="artworks"
      className="px-6 md:px-12 py-24 bg-surface-container-low"
      aria-label="Artwork gallery"
    >
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
        <div>
          <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-3 block">
            The Collection
          </span>
          <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface">
            Original Works
          </h2>
        </div>
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">
          {available} available · {total - available} sold · {total} total
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  );
}
