'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { artworks, buildNotifyHref } from '@/data/artworks';

export function UpcomingDropsSection() {
  const upcomingArtworks = artworks.filter((a) => a.status === 'upcoming');

  if (upcomingArtworks.length === 0) return null;

  return (
    <section
      className="px-6 md:px-12 py-16 md:py-24 bg-surface overflow-hidden"
      aria-label="Upcoming artwork drops"
    >
      {/* Section header */}
      <div className="mb-12">
        <span className="font-label text-[10px] uppercase tracking-[0.35em] text-primary/60 block mb-3">
          Next Releases
        </span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface">
            Upcoming <span className="text-primary">Drops</span>
          </h2>
          <p className="font-label text-[10px] uppercase tracking-widest text-neutral-600">
            {upcomingArtworks.length} works in studio · releasing soon
          </p>
        </div>
      </div>

      {/* Grid */}
      <div
        className={cn(
          'grid gap-6 md:gap-8',
          upcomingArtworks.length === 1
            ? 'grid-cols-1 max-w-md'
            : upcomingArtworks.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
        )}
      >
        {upcomingArtworks.map((artwork) => (
          <UpcomingCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  );
}

function UpcomingCard({
  artwork,
}: {
  artwork: (typeof artworks)[number];
}) {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    const target = email.trim() || 'interested@collector.com';
    window.location.href = buildNotifyHref(artwork, target);
    setNotified(true);
  }

  return (
    <article
      className="group relative overflow-hidden border border-outline-variant/10 hover:border-primary/20 transition-colors duration-500"
      aria-label={`Upcoming: ${artwork.title}`}
    >
      {/* Blurred image area */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Heavily blurred placeholder */}
        <div className="absolute inset-0 blur-xl opacity-40 scale-110">
          <ImagePlaceholder
            label=""
            icon="palette"
            accentColor="#e9c349"
            className="w-full h-full rounded-none"
          />
        </div>

        {/* Hover: slightly less blurred */}
        <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-700 scale-110">
          <ImagePlaceholder
            label=""
            icon="palette"
            accentColor="#e9c349"
            className="w-full h-full rounded-none"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-surface/60" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
          {/* Coming soon badge */}
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-primary border border-primary/30 px-4 py-2 bg-primary/5">
            Coming Soon
          </span>

          {/* Artwork title (deliberately obscured / italic) */}
          <h3 className="font-headline italic text-2xl text-on-surface/60 leading-tight">
            {artwork.title}
          </h3>

          {/* Countdown */}
          {artwork.dropCountdown && (
            <div className="font-headline text-2xl text-primary tracking-wider">
              {artwork.dropCountdown}
            </div>
          )}

          {/* Expected date */}
          {artwork.dropDate && (
            <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
              Expected: {artwork.dropDate}
            </p>
          )}

          {/* Notify form */}
          {notified ? (
            <div className="flex items-center gap-2 text-primary border border-primary/20 bg-primary/5 px-4 py-3">
              <MaterialIcon name="check_circle" size="sm" />
              <span className="font-label text-[10px] uppercase tracking-widest">
                You&apos;re on the list
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleNotify}
              className="w-full flex flex-col gap-3"
              noValidate
            >
              <input
                id={`upcoming-notify-${artwork.id}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className={cn(
                  'w-full bg-surface-container-lowest/80 border border-outline-variant/20',
                  'focus:border-primary/50 focus:outline-none',
                  'py-3 px-4 font-label text-[10px] uppercase tracking-widest',
                  'text-on-surface placeholder:text-neutral-700',
                  'transition-colors duration-300 text-center'
                )}
                aria-label={`Email to be notified about ${artwork.title}`}
              />
              <button
                type="submit"
                id={`upcoming-notify-btn-${artwork.id}`}
                className={cn(
                  'w-full border border-primary/30 text-primary',
                  'font-label text-[10px] uppercase tracking-widest py-3',
                  'hover:bg-primary/10 hover:border-primary/60',
                  'active:scale-95 transition-all duration-300'
                )}
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom meta strip */}
      <div className="px-6 py-5 bg-surface-container-lowest border-t border-outline-variant/10">
        <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600 mb-1">
          {artwork.medium}
        </p>
        <p className="font-label text-[9px] uppercase tracking-widest text-neutral-700">
          {artwork.dimensions} · Starting from {artwork.price}
        </p>
      </div>
    </article>
  );
}
