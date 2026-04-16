'use client';

import React, { useEffect, useState } from 'react';
import { Artwork } from '@/data/artworks';
import { ArtworkCard } from './ArtworkCard';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function ArtworkGrid() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/artworks')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setArtworks(data);
        else setError('Failed to load artworks.');
      })
      .catch(() => setError('Failed to load artworks.'))
      .finally(() => setLoading(false));
  }, []);

  const availableCount = artworks.filter((a) => a.status === 'available').length;
  const reservedCount = artworks.filter((a) => a.status === 'reserved').length;
  const soldCount = artworks.filter((a) => a.status === 'sold').length;

  return (
    <section
      id="artworks"
      className="relative px-6 md:px-12 py-16 md:py-24 bg-surface-container-low"
      aria-label="Exclusive collection"
    >
      {/* Gold accent strip at very top of section */}
      <div className="absolute top-0 left-0 right-0 h-0.5 gold-gradient-bg opacity-70" />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-primary text-sm leading-none select-none">✦</span>
            <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px]">
              The Exclusive Collection
            </span>
            <span className="text-primary text-sm leading-none select-none">✦</span>
          </div>
          <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface">
            Exclusive <span className="text-primary">Originals</span>
          </h2>
        </div>

        {/* Status counts */}
        {!loading && artworks.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {availableCount > 0 && (
              <span className="font-label text-[10px] uppercase tracking-widest text-primary">
                {availableCount} Available
              </span>
            )}
            {reservedCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-label text-[10px] uppercase tracking-widest text-amber-500/70">
                  {reservedCount} Reserved
                </span>
              </div>
            )}
            {soldCount > 0 && (
              <span className="font-label text-[10px] uppercase tracking-widest text-neutral-700">
                {soldCount} Sold
              </span>
            )}
          </div>
        )}
      </div>

      {/* Decorative gold divider */}
      <div className="flex items-center gap-4 mb-14">
        <div className="flex-1 h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
        <span className="font-label text-[9px] uppercase tracking-[0.4em] text-primary/50 shrink-0">
          1 of 1 · Sovereign
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-primary/40 via-primary/20 to-transparent" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">
            Loading exclusive collection…
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
          <MaterialIcon name="error_outline" size="2xl" className="text-neutral-700" />
          <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && artworks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
          <div className="w-20 h-20 border border-primary/15 flex items-center justify-center">
            <MaterialIcon name="palette" size="2xl" className="text-primary/30" />
          </div>
          <div>
            <h3 className="font-headline italic text-2xl text-on-surface mb-2">
              No Artworks Yet
            </h3>
            <p className="font-body text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
              New exclusive works are being added to the collection. Check back soon — or follow the artist on social media for updates.
            </p>
          </div>
          <a
            href="#social"
            className="font-label text-[10px] uppercase tracking-widest text-primary border-b border-primary/30 hover:border-primary transition-colors"
          >
            Follow for Updates
          </a>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && artworks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </section>
  );
}
