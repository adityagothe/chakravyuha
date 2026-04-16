'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { Doodle } from '@/data/artworks';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PurchaseModal } from './PurchaseModal';

// Build a fake Artwork shape so we can reuse PurchaseModal
import { Artwork } from '@/data/artworks';

function doodleToArtwork(d: Doodle): Artwork {
  return {
    id: d.id,
    title: d.title,
    description: `Doodle — ${d.title}`,
    image_url: d.image_url,
    price: d.price,
    price_number: d.price_number,
    status: d.status,
    medium: 'Hand-drawn doodle',
    dimensions: '—',
    reserved_until: null,
    reserved_by_name: null,
    reserved_by_email: null,
    created_at: d.created_at,
    updated_at: d.updated_at,
  };
}

interface DoodleCardProps {
  doodle: Doodle;
}

export function DoodleCard({ doodle }: DoodleCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const isSold = doodle.status === 'sold';
  const isAvailable = doodle.status === 'available';

  const isNew =
    Date.now() - new Date(doodle.created_at).getTime() <
    7 * 24 * 60 * 60 * 1000;

  const handleBuyClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  }, []);

  return (
    <>
      <article
        className={cn(
          'group flex flex-col gap-0 transition-all duration-300 hover:-translate-y-1',
          isSold && 'opacity-60'
        )}
        aria-label={doodle.title}
      >
        {/* Image */}
        <div
          className={cn(
            'aspect-square relative overflow-hidden bg-surface-container',
            isSold && 'grayscale'
          )}
        >
          {doodle.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doodle.image_url}
              alt={doodle.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder
              label={doodle.title}
              icon="draw"
              accentColor="#4a4a3a"
              className="w-full h-full rounded-none"
            />
          )}

          {/* NEW badge */}
          {isNew && !isSold && (
            <div className="absolute top-3 left-3 bg-primary text-on-primary font-label text-[8px] uppercase tracking-widest px-2 py-1 font-bold">
              NEW
            </div>
          )}

          {/* Status badge */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border border-neutral-600/30 px-5 py-2 rotate-[-10deg] bg-surface/30 backdrop-blur-sm">
                <span className="font-headline italic text-neutral-400 text-lg tracking-widest">SOLD</span>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div
          className={cn(
            'p-4 border border-t-0 flex flex-col gap-2 transition-colors duration-300',
            isSold
              ? 'border-outline-variant/5 bg-surface-container-lowest'
              : 'border-outline-variant/10 bg-surface-container-low group-hover:border-outline-variant/25'
          )}
        >
          {/* Title */}
          <h3
            className={cn(
              'font-headline italic text-lg leading-tight',
              isSold ? 'text-neutral-500' : 'text-on-surface'
            )}
          >
            {doodle.title}
          </h3>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <span
              className={cn(
                'inline-block font-label text-xs font-bold px-2.5 py-1 rounded-sm',
                isSold
                  ? 'text-neutral-600 bg-surface-container line-through'
                  : 'text-on-primary gold-gradient-bg shadow-[0_2px_8px_rgba(233,195,73,0.15)]'
              )}
            >
              {doodle.price}
            </span>

            {isAvailable && (
              <button
                id={`doodle-card-buy-${doodle.id}`}
                onClick={handleBuyClick}
                className={cn(
                  'flex items-center gap-1.5 font-label text-[9px] uppercase tracking-widest font-bold',
                  'border border-primary/30 text-primary px-3 py-1.5',
                  'hover:bg-primary/8 hover:border-primary/60 active:scale-95 transition-all duration-200'
                )}
                aria-label={`Buy ${doodle.title}`}
              >
                <MaterialIcon name="shopping_bag" size="sm" />
                Buy
              </button>
            )}

            {isSold && (
              <span className="font-label text-[9px] uppercase tracking-widest text-neutral-700">
                Sold
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Reuse PurchaseModal with doodle adapted as artwork */}
      {isAvailable && (
        <PurchaseModal
          artwork={doodleToArtwork(doodle)}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
