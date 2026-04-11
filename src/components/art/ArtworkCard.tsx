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
  const isAuction = artwork.status === 'auction';
  const isUpcoming = artwork.status === 'upcoming';
  const isAvailable = artwork.status === 'available';

  return (
    <article
      className={cn(
        'group flex flex-col gap-0 transition-all duration-500',
        isSold && 'opacity-60',
        isAvailable && 'hover:-translate-y-1',
        isAuction &&
          'hover:-translate-y-1 ring-1 ring-primary/20 hover:ring-primary/50 shadow-[0_0_30px_-8px_rgba(233,195,73,0.1)] hover:shadow-[0_0_40px_-4px_rgba(233,195,73,0.2)] transition-shadow duration-500'
      )}
      aria-label={artwork.title}
    >
      {/* Image */}
      <div
        className={cn(
          'aspect-square overflow-hidden relative bg-surface-container',
          isSold && 'grayscale',
          isUpcoming && 'grayscale opacity-40'
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
            accentColor={isAuction ? '#e9c349' : '#353535'}
            className="w-full h-full rounded-none"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-40 pointer-events-none" />

        {/* Status badge */}
        <div
          className={cn(
            'absolute top-4 right-4 font-label text-[9px] px-3 py-1.5 uppercase tracking-widest font-bold flex items-center gap-1.5',
            isSold && 'bg-neutral-800/90 text-neutral-500',
            isAvailable && 'bg-primary text-on-primary',
            isAuction && 'bg-red-900/90 text-red-400',
            isUpcoming && 'bg-surface-container-highest/90 text-neutral-500'
          )}
        >
          {isAuction && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          )}
          {isSold && 'Sold'}
          {isAvailable && 'Fixed Price'}
          {isAuction && 'Live Auction'}
          {isUpcoming && 'Coming Soon'}
        </div>

        {/* Auction: hover info panel */}
        {isAuction && (
          <div className="absolute bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
                Time Left
              </span>
              <span className="font-label text-xs text-primary font-bold">
                {artwork.timeRemaining}
              </span>
            </div>
            <div className="w-full h-px bg-outline-variant/20" />
            <div className="flex gap-4 mt-2">
              <span className="font-label text-[9px] text-neutral-600 uppercase tracking-widest">
                {artwork.bidders} bidders
              </span>
              <span className="font-label text-[9px] text-neutral-600 uppercase tracking-widest">
                {artwork.watchers} watching
              </span>
            </div>
          </div>
        )}

        {/* Sold: diagonal stamp */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border border-neutral-600/30 px-6 py-3 rotate-[-12deg]">
              <span className="font-headline italic text-neutral-500 text-xl tracking-widest">
                SOLD
              </span>
            </div>
          </div>
        )}

        {/* Upcoming: lock icon overlay */}
        {isUpcoming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <MaterialIcon name="lock" size="2xl" className="text-neutral-600" />
            <span className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
              {artwork.dropCountdown ?? 'Coming Soon'}
            </span>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div
        className={cn(
          'p-6 border border-t-0 flex flex-col gap-4',
          'transition-colors duration-300',
          isSold && 'border-outline-variant/5 bg-surface-container-lowest',
          isAvailable &&
            'border-outline-variant/10 bg-surface-container-low group-hover:border-outline-variant/20',
          isAuction &&
            'border-primary/15 bg-surface-container group-hover:border-primary/30',
          isUpcoming && 'border-outline-variant/5 bg-surface-container-lowest'
        )}
      >
        {/* Title + price */}
        <div className="flex items-baseline justify-between gap-4">
          <h3
            className={cn(
              'font-headline italic text-2xl leading-tight',
              isSold || isUpcoming ? 'text-neutral-500' : 'text-on-surface'
            )}
          >
            {artwork.title}
          </h3>
          <span
            className={cn(
              'font-label text-sm shrink-0',
              isSold && 'text-neutral-700 line-through',
              isAvailable && 'text-primary',
              isAuction && 'text-primary font-bold',
              isUpcoming && 'text-neutral-600'
            )}
          >
            {isAuction ? artwork.highestBid : artwork.price}
          </span>
        </div>

        {/* Auction sub-label */}
        {isAuction && (
          <p className="font-label text-[9px] uppercase tracking-widest text-primary/50">
            Current highest bid · {artwork.bidders} active bidders
          </p>
        )}

        {/* Medium + dimensions */}
        <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">
          {artwork.medium} · {artwork.dimensions}
        </p>

        {/* Description */}
        <p
          className={cn(
            'font-body text-sm leading-relaxed line-clamp-2',
            isSold || isUpcoming
              ? 'text-neutral-700'
              : 'text-on-surface-variant'
          )}
        >
          {artwork.description}
        </p>

        {/* CTA */}
        {isSold && (
          <button
            disabled
            className="w-full bg-surface-container text-neutral-700 font-label text-[10px] font-bold py-4 uppercase tracking-widest cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            aria-label="Artwork sold out"
          >
            <MaterialIcon name="block" size="sm" />
            Sold Out
          </button>
        )}

        {isAvailable && (
          <a
            href={buildEnquiryHref(artwork)}
            id={`artwork-card-enquire-${artwork.id}`}
            className={cn(
              'w-full mt-2 gold-gradient-bg text-on-primary font-label text-[10px] font-bold py-4 uppercase tracking-widest',
              'flex items-center justify-center gap-2',
              'hover:scale-[1.01] active:scale-[0.98] transition-transform duration-300',
              'shadow-[0_4px_20px_rgba(233,195,73,0.12)] hover:shadow-[0_8px_30px_rgba(233,195,73,0.22)]'
            )}
            aria-label={`Request purchase of ${artwork.title}`}
          >
            <MaterialIcon name="mail" size="sm" />
            Request Purchase
          </a>
        )}

        {isAuction && (
          <a
            href="#live-auction"
            id={`artwork-card-bid-${artwork.id}`}
            className={cn(
              'w-full mt-2 font-label text-[10px] font-bold py-4 uppercase tracking-widest',
              'flex items-center justify-center gap-2',
              'border border-red-800/40 text-red-400',
              'hover:bg-red-950/30 hover:border-red-800/60',
              'active:scale-[0.98] transition-all duration-300'
            )}
            aria-label={`Place bid on ${artwork.title}`}
          >
            <MaterialIcon name="gavel" size="sm" />
            Place Bid
          </a>
        )}

        {isUpcoming && (
          <a
            href="#upcoming"
            id={`artwork-card-notify-${artwork.id}`}
            className={cn(
              'w-full mt-2 font-label text-[10px] font-bold py-4 uppercase tracking-widest',
              'flex items-center justify-center gap-2',
              'border border-outline-variant/20 text-neutral-600',
              'hover:border-outline-variant/40 hover:text-neutral-400',
              'active:scale-[0.98] transition-all duration-300'
            )}
            aria-label={`Get notified about ${artwork.title}`}
          >
            <MaterialIcon name="notifications" size="sm" />
            Notify Me
          </a>
        )}
      </div>
    </article>
  );
}
