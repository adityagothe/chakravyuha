// ─────────────────────────────────────────────────────────────────────────────
// Share utilities — WhatsApp, Instagram, Clipboard, Web Share API
// ─────────────────────────────────────────────────────────────────────────────

import { Artwork } from '@/data/artworks';

const BASE_URL = 'https://vajravyuha.in';

export function artworkUrl(artworkId: string): string {
  return `${BASE_URL}/art/${artworkId}`;
}

/**
 * WhatsApp share URL with rich pre-formatted message.
 * Opens wa.me which works on mobile & desktop.
 */
export function buildWhatsAppShareUrl(artwork: Artwork): string {
  const url = artworkUrl(artwork.id);
  const status = artwork.status === 'available' ? '🟢 For Sale' : artwork.status === 'sold' ? '🔴 Sold' : '🟡 Reserved';
  const text = `🎨 *${artwork.title}*\n\n${status} · ${artwork.price}\n${artwork.medium} · ${artwork.dimensions}\n\n${artwork.description.slice(0, 120)}${artwork.description.length > 120 ? '…' : ''}\n\n🔗 View & Buy:\n${url}\n\n_— VAJRAVYUHA Original Art_`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Caption text for Instagram (copy-to-clipboard then open Instagram).
 * Instagram doesn't support direct share URLs for posts from 3rd-party apps.
 */
export function buildInstagramCaption(artwork: Artwork): string {
  const url = artworkUrl(artwork.id);
  return `🎨 "${artwork.title}"\n${artwork.medium} · ${artwork.dimensions}\n${artwork.price} · One of One\n\n${artwork.description.slice(0, 150)}${artwork.description.length > 150 ? '…' : ''}\n\n👉 ${url}\n\n#OriginalArt #OneOfOne #VAJRAVYUHA #ArtForSale #IndianArt #HandmadeArt`;
}

/**
 * Data object for the Web Share API (navigator.share).
 * Works natively on Android/iOS to open the system share sheet.
 */
export function buildShareData(artwork: Artwork): ShareData {
  return {
    title: `${artwork.title} — VAJRAVYUHA Original Art`,
    text: `${artwork.title} · ${artwork.price} · One of One original artwork. ${artwork.medium}, ${artwork.dimensions}.`,
    url: artworkUrl(artwork.id),
  };
}

/**
 * Copy text to clipboard. Returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns true if the Web Share API is available (mainly mobile browsers).
 */
export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}
