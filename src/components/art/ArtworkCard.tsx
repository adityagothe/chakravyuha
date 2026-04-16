'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { Artwork, reservationCountdown, isReservationExpired } from '@/data/artworks';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PurchaseModal } from './PurchaseModal';
import { BidModal } from './BidModal';
import { buildWhatsAppShareUrl } from '@/lib/share';

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);

  const isSold = artwork.status === 'sold';
  const isReserved = artwork.status === 'reserved' && !isReservationExpired(artwork.reserved_until);
  const isAvailable = artwork.status === 'available' || (artwork.status === 'reserved' && isReservationExpired(artwork.reserved_until));
  const isComingSoon = artwork.status === 'coming_soon';

  const handlePurchaseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  }, []);

  return (
    <>
      <article
        className={cn(
          'group flex flex-col gap-0 transition-all duration-500',
          isSold && 'opacity-55',
          isAvailable && 'hover:-translate-y-1',
          isComingSoon && 'opacity-50',
        )}
        aria-label={artwork.title}
      >
        {/* ── Image (links to detail page) ── */}
        <div
          className={cn(
            'aspect-square overflow-hidden relative bg-surface-container',
            isSold && 'grayscale',
            isComingSoon && 'grayscale opacity-50'
          )}
        >
          <Link href={`/art/${artwork.id}`} aria-label={`View details for ${artwork.title}`} className="block w-full h-full">
          {artwork.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <ImagePlaceholder
                label={artwork.title}
                icon="palette"
                accentColor="#353535"
                className="w-full h-full rounded-none"
              />
            )}
          </Link>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-40 pointer-events-none" />

          {/* Share icon — top-left */}
          <a
            id={`artwork-card-share-${artwork.id}`}
            href={buildWhatsAppShareUrl(artwork)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 w-8 h-8 bg-surface/70 backdrop-blur-sm border border-outline-variant/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:border-primary/40 z-10"
            aria-label={`Share ${artwork.title} on WhatsApp`}
          >
            <MaterialIcon name="share" size="sm" className="text-primary" />
          </a>

          {/* ── Status badge ── */}
          <div
            className={cn(
              'absolute top-4 right-4 font-label text-[9px] px-3 py-1.5 uppercase tracking-widest font-bold flex items-center gap-1.5',
              isSold && 'bg-neutral-800/90 text-neutral-500',
              isAvailable && 'bg-primary text-on-primary',
              isReserved && 'bg-amber-950/90 text-amber-400 border border-amber-800/40',
              isComingSoon && 'bg-surface-container-highest/90 text-neutral-500'
            )}
          >
            {isReserved && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />}
            {isSold && 'Sold'}
            {isAvailable && 'For Sale'}
            {isReserved && 'Reserved'}
            {isComingSoon && 'Coming Soon'}
          </div>

          {/* Reserved: countdown ribbon */}
          {isReserved && artwork.reserved_until && (
            <div className="absolute bottom-0 left-0 w-full bg-amber-950/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
              <span className="font-label text-[9px] uppercase tracking-widest text-amber-400/70">Hold expires</span>
              <span className="font-label text-[9px] text-amber-300 font-bold tabular-nums">
                {reservationCountdown(artwork.reserved_until)}
              </span>
            </div>
          )}

          {/* Sold: diagonal stamp */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border border-neutral-600/30 px-6 py-3 rotate-[-12deg]">
                <span className="font-headline italic text-neutral-500 text-xl tracking-widest">SOLD</span>
              </div>
            </div>
          )}

          {/* Coming Soon: lock overlay */}
          {isComingSoon && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              <MaterialIcon name="lock" size="2xl" className="text-neutral-600" />
              <span className="font-label text-[9px] uppercase tracking-widest text-neutral-600">Coming Soon</span>
            </div>
          )}
        </div>

        {/* ── Info panel ── */}
        {/* Gold top-border: exclusive marker */}
        <div className="h-0.5 w-full bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
        <div
          className={cn(
            'p-6 border border-t-0 flex flex-col gap-4 transition-colors duration-300',
            isSold && 'border-outline-variant/5 bg-surface-container-lowest',
            isAvailable && 'border-outline-variant/10 bg-surface-container-low group-hover:border-outline-variant/20',
            isReserved && 'border-amber-900/20 bg-surface-container-low',
            isComingSoon && 'border-outline-variant/5 bg-surface-container-lowest'
          )}
        >
          {/* ✦ EXCLUSIVE micro-badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-primary text-[10px] leading-none">✦</span>
            <span className="font-label text-[8px] uppercase tracking-[0.35em] text-primary/70">Exclusive</span>
          </div>
          {/* Title + price */}
          <div className="flex items-baseline justify-between gap-4">
            <h3
              className={cn(
                'font-headline italic text-2xl leading-tight',
                isSold || isComingSoon ? 'text-neutral-500' : 'text-on-surface'
              )}
            >
              {artwork.title}
            </h3>
            <span
              className={cn(
                'font-label text-sm shrink-0',
                isSold && 'text-neutral-700 line-through',
                isAvailable && 'text-primary',
                isReserved && 'text-amber-500',
                isComingSoon && 'text-neutral-600'
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
              isSold || isComingSoon ? 'text-neutral-700' : 'text-on-surface-variant'
            )}
          >
            {artwork.description}
          </p>

          {/* ── CTA ── */}
          {isSold && (
            <button
              disabled
              className="w-full bg-surface-container text-neutral-700 font-label text-[10px] font-bold py-4 uppercase tracking-widest cursor-not-allowed mt-2 flex items-center justify-center gap-2"
              aria-label="Artwork sold"
            >
              <MaterialIcon name="block" size="sm" />
              Sold Out
            </button>
          )}

          {isAvailable && (
            <div className="flex flex-col gap-2 mt-2">
              <button
                id={`artwork-card-purchase-${artwork.id}`}
                onClick={handlePurchaseClick}
                className={cn(
                  'w-full gold-gradient-bg text-on-primary font-label text-[10px] font-bold py-4 uppercase tracking-widest',
                  'flex items-center justify-center gap-2',
                  'hover:scale-[1.01] active:scale-[0.98] transition-transform duration-300',
                  'shadow-[0_4px_20px_rgba(233,195,73,0.12)] hover:shadow-[0_8px_30px_rgba(233,195,73,0.22)]'
                )}
                aria-label={`Purchase ${artwork.title}`}
              >
                <MaterialIcon name="shopping_bag" size="sm" />
                Purchase / Reserve
              </button>
              <button
                id={`artwork-card-bid-${artwork.id}`}
                onClick={(e) => { e.preventDefault(); setBidModalOpen(true); }}
                className="w-full border border-outline-variant/20 text-neutral-400 font-label text-[10px] font-bold py-3 uppercase tracking-widest flex items-center justify-center gap-2 hover:border-primary/30 hover:text-primary transition-all duration-300"
                aria-label={`Make an offer for ${artwork.title}`}
              >
                <MaterialIcon name="gavel" size="sm" />
                Make an Offer
              </button>
            </div>
          )}

          {isReserved && (
            <button
              disabled
              className="w-full mt-2 bg-amber-950/40 border border-amber-900/30 text-amber-600 font-label text-[10px] font-bold py-4 uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Artwork currently reserved"
            >
              <MaterialIcon name="bookmark" size="sm" />
              Currently Reserved
            </button>
          )}

          {isComingSoon && (
            <button
              disabled
              className="w-full mt-2 border border-outline-variant/20 text-neutral-700 font-label text-[10px] font-bold py-4 uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Coming soon"
            >
              <MaterialIcon name="schedule" size="sm" />
              Coming Soon
            </button>
          )}
        </div>
      </article>

      {/* Purchase Modal */}
      {isAvailable && (
        <PurchaseModal
          artwork={artwork}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Bid Modal */}
      {isAvailable && (
        <BidModal
          artwork={artwork}
          isOpen={bidModalOpen}
          onClose={() => setBidModalOpen(false)}
        />
      )}
    </>
  );
}
