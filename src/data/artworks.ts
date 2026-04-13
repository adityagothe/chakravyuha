// ─────────────────────────────────────────────────────────────────────────────
// Artworks Data — source of truth is Supabase (artworks table).
// This file ONLY contains the TypeScript types and helper functions.
// Artwork data is fetched live from the DB via API routes.
// ─────────────────────────────────────────────────────────────────────────────

export type ArtworkStatus = 'available' | 'sold' | 'reserved' | 'coming_soon';

export interface Artwork {
  id: string;
  title: string;
  description: string;
  /** Supabase Storage public URL or null */
  image_url: string | null;
  price: string;
  /** For filtering / sorting */
  price_number: number;
  status: ArtworkStatus;
  medium: string;
  dimensions: string;
  /** ISO 8601 string — when the 7-day reservation expires */
  reserved_until: string | null;
  reserved_by_name: string | null;
  reserved_by_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  artwork_id: string;
  artwork_title: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_address: string | null;
  order_type: 'reservation' | 'purchase';
  amount: string;
  status: 'pending' | 'confirmed' | 'completed' | 'expired' | 'cancelled';
  reserved_until: string | null;
  /** How many daily reminder emails have been sent (0–7) */
  day_reminder_sent: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const STUDIO_EMAIL = 'chakravyuha.studio@gmail.com';

// ─── Email helpers ────────────────────────────────────────────────────────────

export function buildReservationEmailHref(artwork: Artwork, order: {
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  amount: string;
}): string {
  const subject = encodeURIComponent(
    `Reservation Request — "${artwork.title}" | CHAKRAVYUHA`
  );
  const body = encodeURIComponent(
    `Hello,\n\nI would like to RESERVE "${artwork.title}" (${artwork.medium}, ${artwork.dimensions}) for ${order.amount}.\n\nI have made the reservation fee payment via Paytm QR.\n\n— Buyer Details —\nName: ${order.buyer_name}\nEmail: ${order.buyer_email}\nPhone: ${order.buyer_phone}\n\nPlease confirm my 7-day reservation.\n\nThank you.`
  );
  return `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
}

export function buildPurchaseEmailHref(artwork: Artwork, order: {
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_address: string;
  amount: string;
}): string {
  const subject = encodeURIComponent(
    `Purchase Request — "${artwork.title}" | CHAKRAVYUHA`
  );
  const body = encodeURIComponent(
    `Hello,\n\nI would like to PURCHASE "${artwork.title}" (${artwork.medium}, ${artwork.dimensions}) for ${order.amount}.\n\nI have made the full payment via Paytm QR.\n\n— Buyer Details —\nName: ${order.buyer_name}\nEmail: ${order.buyer_email}\nPhone: ${order.buyer_phone}\nShipping Address: ${order.buyer_address}\n\nPlease confirm and arrange shipping.\n\nThank you.`
  );
  return `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
}

export function buildDailyReminderHref(order: Order, day: number): string {
  const daysLeft = 7 - day;
  let subject = '';
  let body = '';

  if (day === 1) {
    subject = encodeURIComponent(
      `Reservation Confirmed — "${order.artwork_title}" | CHAKRAVYUHA`
    );
    body = encodeURIComponent(
      `Dear ${order.buyer_name},\n\nYour reservation for "${order.artwork_title}" has been confirmed!\n\nYou have 6 days remaining to complete your purchase. Please reply to this email or contact us to arrange the final payment and shipping.\n\nReservation expires: ${order.reserved_until ? new Date(order.reserved_until).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'N/A'}\n\nWarm regards,\nCHAKRAVYUHA Studio`
    );
  } else if (day >= 2 && day <= 6) {
    subject = encodeURIComponent(
      `Reminder — ${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left on Your Reservation | CHAKRAVYUHA`
    );
    body = encodeURIComponent(
      `Dear ${order.buyer_name},\n\nThis is a friendly reminder that your reservation for "${order.artwork_title}" has ${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining.\n\nPlease complete your purchase before your reservation expires on ${order.reserved_until ? new Date(order.reserved_until).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'N/A'}.\n\nTo proceed, simply reply to this email.\n\nWarm regards,\nCHAKRAVYUHA Studio`
    );
  } else {
    subject = encodeURIComponent(
      `Final Day — Your Reservation Expires Tomorrow | CHAKRAVYUHA`
    );
    body = encodeURIComponent(
      `Dear ${order.buyer_name},\n\nThis is your final reminder — your reservation for "${order.artwork_title}" expires TOMORROW.\n\nIf you do not complete the purchase by end of day, the artwork will be made available again.\n\nPlease reply urgently to complete your purchase.\n\nWarm regards,\nCHAKRAVYUHA Studio`
    );
  }

  return `mailto:${order.buyer_email}?subject=${subject}&body=${body}`;
}

/** Returns how many days into the 7-day hold we are (1-indexed). Returns null if not reserved. */
export function getReservationDay(order: Order): number | null {
  if (!order.reserved_until) return null;
  const created = new Date(order.created_at).getTime();
  const now = Date.now();
  const daysPassed = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  return Math.min(daysPassed + 1, 7);
}

/** True if 7-day reservation window has expired */
export function isReservationExpired(reservedUntil: string | null): boolean {
  if (!reservedUntil) return false;
  return new Date(reservedUntil).getTime() < Date.now();
}

/** Returns days remaining string, e.g. "5 days remaining" */
export function reservationCountdown(reservedUntil: string): string {
  const ms = new Date(reservedUntil).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}
