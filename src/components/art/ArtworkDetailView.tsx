'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Artwork, isReservationExpired, reservationCountdown } from '@/data/artworks';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PurchaseModal } from './PurchaseModal';
import { BidModal } from './BidModal';
import { ImageViewer } from './ImageViewer';
import {
  buildWhatsAppShareUrl,
  buildInstagramCaption,
  buildShareData,
  copyToClipboard,
  canNativeShare,
  artworkUrl,
} from '@/lib/share';

// ── Reusable label/value row ────────────────────────────────────────────────
const MetaRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-6 py-3 border-b border-outline-variant/10 last:border-b-0">
    <span className="font-label text-[9px] uppercase tracking-widest text-neutral-600 w-24 shrink-0 pt-0.5">
      {label}
    </span>
    <span className="font-body text-sm text-on-surface-variant">{value}</span>
  </div>
);

interface ArtworkDetailViewProps {
  artwork: Artwork;
}

export function ArtworkDetailView({ artwork }: ArtworkDetailViewProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'insta-copied'>('idle');

  const isSold = artwork.status === 'sold';
  const isReserved =
    artwork.status === 'reserved' && !isReservationExpired(artwork.reserved_until);
  const isAvailable =
    artwork.status === 'available' ||
    (artwork.status === 'reserved' && isReservationExpired(artwork.reserved_until));
  const isComingSoon = artwork.status === 'coming_soon';

  // ── Share handlers ─────────────────────────────────────────────────────────

  const handleCopyLink = useCallback(async () => {
    const ok = await copyToClipboard(artworkUrl(artwork.id));
    if (ok) {
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  }, [artwork.id]);

  const handleInstagramShare = useCallback(async () => {
    const caption = buildInstagramCaption(artwork);
    await copyToClipboard(caption);
    setCopyState('insta-copied');
    setTimeout(() => setCopyState('idle'), 2500);
    // Open Instagram app (deep link)
    setTimeout(() => {
      window.open('instagram://app', '_blank');
    }, 300);
  }, [artwork]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share(buildShareData(artwork));
    } catch {
      // User dismissed or API not available
    }
  }, [artwork]);


  return (
    <>
      <div className="min-h-screen bg-surface pt-24 animate-page-in">
        {/* ── Back nav ─────────────────────────────────────────────────────── */}
        <div className="px-6 md:px-12 mb-8">
          <Link
            href="/art"
            className="group inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-primary/50 hover:text-primary transition-colors"
          >
            <MaterialIcon
              name="arrow_back"
              size="sm"
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Collection
          </Link>
        </div>

        {/* ── Main grid ────────────────────────────────────────────────────── */}
        <div className="px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-7xl mx-auto">

          {/* LEFT — Image ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main image */}
            <div
              className={cn(
                'relative overflow-hidden bg-surface-container group',
                artwork.image_url && !isSold && !isComingSoon ? 'cursor-zoom-in' : '',
                isSold && 'grayscale opacity-60',
                isComingSoon && 'grayscale opacity-40'
              )}
              onClick={() => artwork.image_url && setViewerOpen(true)}
            >
              {artwork.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full object-contain max-h-[80vh] transition-transform duration-700 group-hover:scale-[1.02]"
                />
              ) : (
                <ImagePlaceholder
                  label={artwork.title}
                  icon="palette"
                  accentColor="#353535"
                  className="w-full aspect-square"
                />
              )}

              {/* Zoom hint */}
              {artwork.image_url && isAvailable && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-surface/80 backdrop-blur-sm border border-outline-variant/20 px-3 py-1.5">
                  <MaterialIcon name="zoom_in" size="sm" className="text-primary" />
                  <span className="font-label text-[9px] uppercase tracking-widest text-primary">
                    Click to zoom
                  </span>
                </div>
              )}

              {/* Sold stamp */}
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border border-neutral-600/30 px-8 py-4 rotate-[-12deg]">
                    <span className="font-headline italic text-neutral-500 text-3xl tracking-widest">
                      SOLD
                    </span>
                  </div>
                </div>
              )}

              {/* Status badge */}
              <div
                className={cn(
                  'absolute top-4 left-4 font-label text-[9px] px-3 py-1.5 uppercase tracking-widest font-bold flex items-center gap-1.5',
                  isSold && 'bg-neutral-800/90 text-neutral-500',
                  isAvailable && 'bg-primary text-on-primary',
                  isReserved && 'bg-amber-950/90 text-amber-400 border border-amber-800/40',
                  isComingSoon && 'bg-surface-container-highest/90 text-neutral-500'
                )}
              >
                {isReserved && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                )}
                {isSold && 'Sold'}
                {isAvailable && 'For Sale'}
                {isReserved && 'Reserved'}
                {isComingSoon && 'Coming Soon'}
              </div>

              {/* Reserved countdown */}
              {isReserved && artwork.reserved_until && (
                <div className="absolute bottom-0 left-0 right-0 bg-amber-950/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
                  <span className="font-label text-[9px] uppercase tracking-widest text-amber-400/70">
                    Hold expires
                  </span>
                  <span className="font-label text-[9px] text-amber-300 font-bold tabular-nums">
                    {reservationCountdown(artwork.reserved_until)}
                  </span>
                </div>
              )}
            </div>

            {/* Zoom open button (mobile-visible) */}
            {artwork.image_url && (
              <button
                id="detail-open-viewer-btn"
                onClick={() => setViewerOpen(true)}
                className="flex items-center justify-center gap-2 border border-outline-variant/20 py-3 font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:text-primary hover:border-primary/30 transition-all"
              >
                <MaterialIcon name="zoom_in" size="sm" />
                Open Full-Screen Viewer
              </button>
            )}
          </div>

          {/* RIGHT — Info Panel ─────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-8">

            {/* Title + price */}
            <div>
              <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-3 block">
                VAJRAVYUHA · Original Art · 1 of 1
              </span>
              <h1 className="font-headline italic text-4xl md:text-5xl text-on-surface leading-tight mb-4">
                {artwork.title}
              </h1>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'font-headline italic text-3xl',
                    isSold && 'text-neutral-600 line-through',
                    isAvailable && 'text-primary',
                    isReserved && 'text-amber-400',
                    isComingSoon && 'text-neutral-600'
                  )}
                >
                  {artwork.price}
                </span>
                {!isSold && !isComingSoon && (
                  <span className="font-label text-[9px] text-neutral-600 uppercase tracking-widest border border-outline-variant/20 px-2 py-1">
                    Fixed Price
                  </span>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              {isAvailable && (
                <>
                  <button
                    id="detail-buy-now-btn"
                    onClick={() => setModalOpen(true)}
                    className="w-full gold-gradient-bg text-on-primary font-label font-bold text-sm py-4 uppercase tracking-widest flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_4px_20px_rgba(233,195,73,0.15)] hover:shadow-[0_8px_30px_rgba(233,195,73,0.28)]"
                    aria-label={`Buy ${artwork.title}`}
                  >
                    <MaterialIcon name="shopping_bag" size="sm" />
                    Buy Now — {artwork.price}
                  </button>
                  <button
                    id="detail-reserve-btn"
                    onClick={() => setModalOpen(true)}
                    className="w-full border border-primary/30 text-primary font-label text-[10px] font-bold py-3.5 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/60 transition-all"
                    aria-label={`Reserve ${artwork.title}`}
                  >
                    <MaterialIcon name="bookmark" size="sm" />
                    Reserve — 7-Day Hold
                  </button>
                  <button
                    id="detail-make-offer-btn"
                    onClick={() => setBidModalOpen(true)}
                    className="w-full border border-outline-variant/20 text-neutral-400 font-label text-[10px] font-bold py-3.5 uppercase tracking-widest flex items-center justify-center gap-2 hover:border-primary/30 hover:text-primary transition-all"
                    aria-label={`Make an offer for ${artwork.title}`}
                  >
                    <MaterialIcon name="gavel" size="sm" />
                    Make an Offer — Negotiate Price
                  </button>
                </>
              )}
              {isSold && (
                <button
                  disabled
                  className="w-full bg-surface-container text-neutral-700 font-label text-[10px] font-bold py-4 uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MaterialIcon name="block" size="sm" />
                  Sold Out
                </button>
              )}
              {isReserved && (
                <button
                  disabled
                  className="w-full bg-amber-950/40 border border-amber-900/30 text-amber-600 font-label text-[10px] font-bold py-4 uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MaterialIcon name="bookmark" size="sm" />
                  Currently Reserved
                </button>
              )}
              {isComingSoon && (
                <button
                  disabled
                  className="w-full border border-outline-variant/20 text-neutral-700 font-label text-[10px] font-bold py-4 uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MaterialIcon name="schedule" size="sm" />
                  Coming Soon
                </button>
              )}
            </div>

            {/* ── Share bar ──────────────────────────────────────────────────── */}
            <div className="border border-outline-variant/15 p-5 space-y-4">
              <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
                Share This Artwork
              </p>
              <div className="grid grid-cols-2 gap-2">
                {/* WhatsApp */}
                <a
                  id="detail-share-whatsapp"
                  href={buildWhatsAppShareUrl(artwork)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 border border-outline-variant/15 px-4 py-3 hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all group"
                  aria-label="Share on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366] shrink-0" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant group-hover:text-[#25D366] transition-colors">
                    WhatsApp
                  </span>
                </a>

                {/* Instagram */}
                <button
                  id="detail-share-instagram"
                  onClick={handleInstagramShare}
                  className="flex items-center gap-2.5 border border-outline-variant/15 px-4 py-3 hover:border-[#E1306C]/40 hover:bg-[#E1306C]/5 transition-all group"
                  aria-label="Share to Instagram"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true" style={{ fill: copyState === 'insta-copied' ? '#E1306C' : 'currentColor' }}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className={cn('font-label text-[10px] uppercase tracking-widest transition-colors', copyState === 'insta-copied' ? 'text-[#E1306C]' : 'text-on-surface-variant group-hover:text-[#E1306C]')}>
                    {copyState === 'insta-copied' ? 'Caption Copied!' : 'Instagram'}
                  </span>
                </button>

                {/* Copy Link */}
                <button
                  id="detail-share-copy-link"
                  onClick={handleCopyLink}
                  className={cn(
                    'flex items-center gap-2.5 border px-4 py-3 transition-all group',
                    copyState === 'copied'
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-outline-variant/15 hover:border-primary/30 hover:bg-primary/5'
                  )}
                  aria-label="Copy link"
                >
                  <MaterialIcon
                    name={copyState === 'copied' ? 'check' : 'link'}
                    size="sm"
                    className={cn(copyState === 'copied' ? 'text-primary' : 'text-neutral-500 group-hover:text-primary', 'transition-colors shrink-0')}
                  />
                  <span className={cn('font-label text-[10px] uppercase tracking-widest transition-colors', copyState === 'copied' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary')}>
                    {copyState === 'copied' ? 'Copied!' : 'Copy Link'}
                  </span>
                </button>

                {/* Native share or WhatsApp Status */}
                <button
                  id="detail-share-native"
                  onClick={canNativeShare() ? handleNativeShare : () => window.open(buildWhatsAppShareUrl(artwork), '_blank')}
                  className="flex items-center gap-2.5 border border-outline-variant/15 px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  aria-label={canNativeShare() ? 'Share via…' : 'More share options'}
                >
                  <MaterialIcon name="share" size="sm" className="text-neutral-500 group-hover:text-primary transition-colors shrink-0" />
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                    {canNativeShare() ? 'Share via…' : 'More'}
                  </span>
                </button>
              </div>

              {/* Instagram tip */}
              {copyState === 'insta-copied' && (
                <p className="font-label text-[9px] text-neutral-500 leading-relaxed animate-fade-in">
                  Caption copied! Open Instagram, paste it in your story or post caption, and include your link in bio.
                </p>
              )}
            </div>

            {/* ── Artwork details ─────────────────────────────────────────────── */}
            <div className="space-y-0 border border-outline-variant/15">
              <div className="px-5 py-4 border-b border-outline-variant/10">
                <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
                  Artwork Details
                </p>
              </div>
              <div className="px-5">
                <MetaRow label="Medium" value={artwork.medium} />
                <MetaRow label="Dimensions" value={artwork.dimensions} />
                <MetaRow label="Price" value={artwork.price} />
                <MetaRow label="Status" value={
                  isSold ? 'Sold' :
                  isReserved ? 'Reserved (7-Day Hold)' :
                  isComingSoon ? 'Coming Soon' :
                  'Available for Purchase'
                } />
                <MetaRow label="Provenance" value="Signed Certificate of Authenticity included" />
                <MetaRow label="Shipping" value="Via India Post · Carefully packed" />
                <MetaRow label="Source" value="VAJRAVYUHA · Original · 1 of 1" />
              </div>
            </div>

            {/* ── Description ────────────────────────────────────────────────── */}
            {artwork.description && (
              <div className="space-y-3">
                <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600">
                  About This Work
                </p>
                <p className="font-body text-base text-on-surface-variant leading-relaxed">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* ── Sovereign guarantee ────────────────────────────────────────── */}
            <div className="flex items-start gap-4 border border-outline-variant/10 p-5 bg-surface-container-low">
              <MaterialIcon name="workspace_premium" size="lg" className="text-primary/50 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-label text-xs uppercase tracking-widest text-on-surface">
                  Sovereign Guarantee
                </p>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  This is an original work — created once, sold once. No prints, no reproductions, no digital copies. A signed Certificate of Authenticity ships with every piece.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Image Viewer */}
      {artwork.image_url && (
        <ImageViewer
          src={artwork.image_url}
          alt={artwork.title}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}

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
