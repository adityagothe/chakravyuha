'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Artwork, buildEnquiryHref } from '@/data/artworks';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const isSold = artwork.status === 'sold';

  return (
    <article
      className={cn(
        'group flex flex-col gap-0 transition-all duration-500',
        isSold ? 'opacity-70' : 'hover:-translate-y-1'
      )}
      aria-label={artwork.title}
    >
      {/* Image */}
      <div
        className={cn(
          'aspect-square overflow-hidden relative bg-surface-container',
          isSold && 'grayscale'
        )}
      >
        {artwork.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder
            label={artwork.title}
            icon="palette"
            accentColor="#e9c349"
            className="w-full h-full rounded-none"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-40 pointer-events-none" />

        {/* Status badge */}
        <div
          className={cn(
            'absolute top-4 right-4 font-label text-[9px] px-3 py-1.5 uppercase tracking-widest font-bold',
            isSold
              ? 'bg-neutral-800/90 text-neutral-500'
              : 'bg-primary text-on-primary'
          )}
        >
          {isSold ? 'Sold' : 'Available'}
        </div>

        {/* Sold overlay */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border border-neutral-600/40 px-6 py-3 rotate-[-12deg]">
              <span className="font-headline italic text-neutral-500 text-xl tracking-widest">
                SOLD
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className={cn(
          'p-6 border border-t-0 border-outline-variant/10 flex flex-col gap-4 bg-surface-container-low',
          'transition-colors duration-300 group-hover:border-outline-variant/20'
        )}
      >
        {/* Title + price row */}
        <div className="flex items-baseline justify-between gap-4">
          <h3
            className={cn(
              'font-headline italic text-2xl leading-tight',
              isSold ? 'text-neutral-500' : 'text-on-surface'
            )}
          >
            {artwork.title}
          </h3>
          <span
            className={cn(
              'font-label text-base shrink-0',
              isSold ? 'text-neutral-600' : 'text-primary'
            )}
          >
            {artwork.price}
          </span>
        </div>

        {/* Medium + dimensions */}
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">
          {artwork.medium} · {artwork.dimensions}
        </p>

        {/* Description */}
        <p
          className={cn(
            'font-body text-sm leading-relaxed line-clamp-2',
            isSold ? 'text-neutral-600' : 'text-on-surface-variant'
          )}
        >
          {artwork.description}
        </p>

        {/* CTA */}
        {isSold ? (
          <button
            disabled
            className="w-full bg-surface-container-high text-neutral-600 font-label text-[10px] font-bold py-4 uppercase tracking-widest cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            aria-label="Artwork sold out"
          >
            <MaterialIcon name="block" size="sm" />
            Sold Out
          </button>
        ) : (
          <a
            href={buildEnquiryHref(artwork)}
            className={cn(
              'w-full mt-2 gold-gradient-bg text-on-primary font-label text-[10px] font-bold py-4 uppercase tracking-widest',
              'flex items-center justify-center gap-2',
              'hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300',
              'shadow-[0_4px_20px_rgba(233,195,73,0.15)] hover:shadow-[0_8px_30px_rgba(233,195,73,0.25)]'
            )}
            aria-label={`Buy or enquire about ${artwork.title}`}
          >
            <MaterialIcon name="mail" size="sm" />
            Buy / Enquire
          </a>
        )}
      </div>
    </article>
  );
}
