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

// ─── Doodle type ──────────────────────────────────────────────────────────────

export interface Doodle {
  id: string;
  title: string;
  image_url: string | null;
  price: string;
  price_number: number;
  status: 'available' | 'sold';
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending_verification' // Buyer submitted UTR — awaiting artist verification
  | 'pending'              // Legacy / reservation fee pending
  | 'confirmed'            // Artist verified payment
  | 'packing'              // Artist is packing the artwork
  | 'shipped'              // Artwork dispatched via India Post
  | 'completed'            // Delivered / all done
  | 'expired'              // 7-day reservation expired
  | 'cancelled';           // Cancelled

export interface Order {
  id: string;
  /** Human-readable ID, e.g. CHK-2026-0042 */
  order_id: string | null;
  artwork_id: string;
  artwork_title: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_whatsapp: string | null;
  buyer_address: string | null;
  buyer_pincode: string | null;
  order_type: 'reservation' | 'purchase';
  amount: string;
  status: OrderStatus;
  reserved_until: string | null;
  /** UPI Transaction Reference ID entered by buyer */
  upi_transaction_id: string | null;
  /** Whether artist has verified the UTR against their bank */
  payment_verified: boolean;
  /** India Post tracking number */
  tracking_id: string | null;
  /** How many daily reminder emails have been sent (0–7) */
  day_reminder_sent: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Studio email ─────────────────────────────────────────────────────────────

const STUDIO_EMAIL = 'vajra.vyuha.official@gmail.com';

// ─── Pricing helpers ──────────────────────────────────────────────────────────

/** Calculates 10% reservation fee from artwork price_number */
export function calculateReservationFee(artwork: Artwork): {
  display: string;
  number: number;
} {
  const fee = Math.ceil(artwork.price_number * 0.1);
  return {
    display: `₹${fee.toLocaleString('en-IN')}`,
    number: fee,
  };
}

// ─── Delivery estimation ──────────────────────────────────────────────────────

/** Artist PIN code (source of all shipments) */
const ARTIST_PINCODE_ZONE = 58; // 586103 — Vijayapura, Karnataka

export interface DeliveryEstimate {
  minDays: number;
  maxDays: number;
  zone: string;
  isValid: boolean;
}

/**
 * Estimates delivery days from artist PIN 586103 based on buyer's PIN code.
 * Always adds 3 days for packing + posting.
 */
export function estimateDelivery(buyerPincode: string): DeliveryEstimate {
  const clean = buyerPincode.replace(/\D/g, '');
  if (clean.length !== 6) {
    return { minDays: 0, maxDays: 0, zone: '', isValid: false };
  }

  const PACKING_DAYS = 3;
  const zone = parseInt(clean.substring(0, 2), 10);

  // Same district – Vijayapura area (585xxx, 586xxx, 587xxx)
  if (zone === ARTIST_PINCODE_ZONE || zone === 58) {
    return { minDays: PACKING_DAYS + 1, maxDays: PACKING_DAYS + 2, zone: 'Same District (Karnataka)', isValid: true };
  }

  // Neighboring Karnataka zones (56–59)
  if (zone >= 56 && zone <= 59) {
    return { minDays: PACKING_DAYS + 2, maxDays: PACKING_DAYS + 3, zone: 'Karnataka', isValid: true };
  }

  // Neighboring states: Maharashtra (40–44), Goa (403), AP/Telangana (50–53), TN (60–64), Kerala (67–69)
  const neighbor = [40, 41, 42, 43, 44, 50, 51, 52, 53, 60, 61, 62, 63, 64, 67, 68, 69];
  if (neighbor.includes(zone)) {
    return { minDays: PACKING_DAYS + 3, maxDays: PACKING_DAYS + 5, zone: 'Neighboring State', isValid: true };
  }

  // Rest of India
  return { minDays: PACKING_DAYS + 5, maxDays: PACKING_DAYS + 7, zone: 'Rest of India', isValid: true };
}

// ─── Email helpers ────────────────────────────────────────────────────────────

export function buildReservationEmailHref(
  artwork: Artwork,
  order: {
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    buyer_whatsapp?: string;
    buyer_address?: string;
    buyer_pincode?: string;
    upi_transaction_id: string;
    amount: string;
    order_id?: string | null;
  }
): string {
  const subject = encodeURIComponent(
    `Reservation Request — "${artwork.title}" | VAJRAVYUHA`
  );
  const body = encodeURIComponent(
    `Hello,\n\nI would like to RESERVE "${artwork.title}" (${artwork.medium}, ${artwork.dimensions}) for ${order.amount}.\n\nI have made the reservation fee payment via Paytm/UPI.\n\nUPI Transaction Reference (UTR): ${order.upi_transaction_id}\n\n— Buyer Details —\nOrder ID: ${order.order_id ?? 'N/A'}\nName: ${order.buyer_name}\nEmail: ${order.buyer_email}\nPhone: ${order.buyer_phone}${order.buyer_whatsapp ? `\nWhatsApp: ${order.buyer_whatsapp}` : ''}${order.buyer_address ? `\nAddress: ${order.buyer_address}` : ''}${order.buyer_pincode ? `\nPIN Code: ${order.buyer_pincode}` : ''}\n\nPlease verify the payment and confirm my 7-day reservation.\n\nThank you.`
  );
  return `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
}

export function buildPurchaseEmailHref(
  artwork: Artwork,
  order: {
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    buyer_whatsapp?: string;
    buyer_address: string;
    buyer_pincode?: string;
    upi_transaction_id: string;
    amount: string;
    order_id?: string | null;
  }
): string {
  const subject = encodeURIComponent(
    `Purchase Request — "${artwork.title}" | VAJRAVYUHA`
  );
  const body = encodeURIComponent(
    `Hello,\n\nI would like to PURCHASE "${artwork.title}" (${artwork.medium}, ${artwork.dimensions}) for ${order.amount}.\n\nI have made the full payment via Paytm/UPI.\n\nUPI Transaction Reference (UTR): ${order.upi_transaction_id}\n\n— Buyer Details —\nOrder ID: ${order.order_id ?? 'N/A'}\nName: ${order.buyer_name}\nEmail: ${order.buyer_email}\nPhone: ${order.buyer_phone}${order.buyer_whatsapp ? `\nWhatsApp: ${order.buyer_whatsapp}` : ''}\nShipping Address: ${order.buyer_address}${order.buyer_pincode ? `\nPIN Code: ${order.buyer_pincode}` : ''}\n\nPlease verify the UTR and arrange shipping.\n\nThank you.`
  );
  return `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
}

export function buildShippingNotificationHref(order: Order): string {
  const subject = encodeURIComponent(
    `Your Artwork is on its Way! 🎁 | ${order.order_id ?? 'VAJRAVYUHA'}`
  );
  const body = encodeURIComponent(
    `Dear ${order.buyer_name},\n\nGreat news! Your artwork "${order.artwork_title}" has been packed and dispatched! 🎉\n\n📦 Shipped via India Post\nTracking ID: ${order.tracking_id ?? 'N/A'}\nTrack here: https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx\n\nYour Order ID: ${order.order_id ?? 'N/A'}\n\nImportant:\n• A signed Certificate of Authenticity is included in the package.\n• Handle with care — original artwork inside!\n\nFor any questions, simply reply to this email.\n\nWith gratitude,\nVAJRAVYUHA Studio\nvajra.vyuha.official@gmail.com`
  );
  return `mailto:${order.buyer_email}?subject=${subject}&body=${body}`;
}

export function buildWhatsAppShippingHref(order: Order): string {
  const number = (order.buyer_whatsapp ?? order.buyer_phone).replace(/\D/g, '');
  const text = encodeURIComponent(
    `Hi ${order.buyer_name}! 🎉 Your artwork "${order.artwork_title}" has been shipped via India Post!\n\nTracking ID: ${order.tracking_id ?? 'N/A'}\nTrack here: https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx\n\nOrder ID: ${order.order_id ?? 'N/A'}\n\nA signed Certificate of Authenticity is included. 🏷️\n\n– VAJRAVYUHA`
  );
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * Sent BY THE ARTIST from the dashboard after manually verifying the buyer's UTR.
 * Contains full order details + payment confirmation.
 */
export function buildOrderConfirmationEmailHref(order: Order, artwork?: { medium?: string; dimensions?: string }): string {
  const delivery = order.buyer_pincode ? estimateDelivery(order.buyer_pincode) : null;
  const deliveryText = delivery?.isValid
    ? `Estimated Delivery: ${delivery.minDays}–${delivery.maxDays} business days (${delivery.zone})`
    : '';

  const subject = encodeURIComponent(
    `✅ Order Confirmed — "${order.artwork_title}" | VAJRAVYUHA`
  );

  const mediumLine = artwork?.medium && artwork?.dimensions
    ? `Medium: ${artwork.medium}, ${artwork.dimensions}\n`
    : '';

  const body = encodeURIComponent(
    `Dear ${order.buyer_name},\n\nGreat news! Your payment has been verified and your order is officially confirmed! 🎉\n\n— Order Details —\nOrder ID:        ${order.order_id ?? 'N/A'}\nArtwork:         ${order.artwork_title}\n${mediumLine}Order Type:      ${order.order_type === 'reservation' ? '7-Day Reservation Hold' : 'Direct Purchase'}\nAmount Paid:     ${order.amount}\nPayment Ref:     ${order.upi_transaction_id ?? 'N/A'}\n\n${order.buyer_address ? `— Shipping Details —\nShipping To: ${order.buyer_address}${order.buyer_pincode ? `\nPIN Code: ${order.buyer_pincode}` : ''}\n${deliveryText}\n\n📦 Shipping via India Post:\nYour artwork will be carefully packed and dispatched. Your India Post Tracking ID will be sent to this email as soon as your order ships.\n\n🏷️ A signed Certificate of Authenticity will be included with your artwork.\n\n` : `— What's Next —\nYou have 7 days to complete the remaining balance. Once paid, your artwork ships via India Post and you will receive a Tracking ID on this email.\n\n`}For any questions, simply reply to this email.\n\nWith gratitude,\nVAJRAVYUHA Studio\nvajra.vyuha.official@gmail.com`
  );

  return `mailto:${order.buyer_email}?subject=${subject}&body=${body}`;
}

export function buildDailyReminderHref(order: Order, day: number): string {
  const daysLeft = 7 - day;
  let subject = '';
  let body = '';

  if (day === 1) {
    subject = encodeURIComponent(
      `Reservation Confirmed — "${order.artwork_title}" | VAJRAVYUHA`
    );
    body = encodeURIComponent(
      `Dear ${order.buyer_name},\n\nYour reservation for "${order.artwork_title}" has been confirmed! 🎉\n\nOrder ID: ${order.order_id ?? 'N/A'}\nReservation Fee Paid: ${order.amount}\n\nYou have 6 days remaining to complete your purchase. Please reply to this email or contact us to arrange the remaining balance and shipping.\n\nReservation expires: ${order.reserved_until ? new Date(order.reserved_until).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'N/A'}\n\nImportant: Once full payment is confirmed, your artwork will be shipped via India Post and you will receive the tracking ID on this email.\n\nWarm regards,\nVAJRAVYUHA Studio\nvajra.vyuha.official@gmail.com`
    );
  } else if (day >= 2 && day <= 6) {
    subject = encodeURIComponent(
      `Reminder — ${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left on Your Reservation | VAJRAVYUHA`
    );
    body = encodeURIComponent(
      `Dear ${order.buyer_name},\n\nThis is a friendly reminder that your reservation for "${order.artwork_title}" has ${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining.\n\nOrder ID: ${order.order_id ?? 'N/A'}\n\nPlease complete your payment before your reservation expires on ${order.reserved_until ? new Date(order.reserved_until).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'N/A'}.\n\nTo proceed, simply reply to this email with your full payment UTR reference.\n\nWarm regards,\nVAJRAVYUHA Studio\nvajra.vyuha.official@gmail.com`
    );
  } else {
    subject = encodeURIComponent(
      `FINAL DAY — Your Reservation Expires Today | VAJRAVYUHA`
    );
    body = encodeURIComponent(
      `Dear ${order.buyer_name},\n\nThis is your FINAL reminder — your reservation for "${order.artwork_title}" expires TODAY.\n\nOrder ID: ${order.order_id ?? 'N/A'}\n\nIf the remaining balance is not received by end of day, the artwork will be made available for others.\n\nPlease reply urgently with your payment UTR reference to complete the purchase.\n\nWarm regards,\nVAJRAVYUHA Studio\nvajra.vyuha.official@gmail.com`
    );
  }

  return `mailto:${order.buyer_email}?subject=${subject}&body=${body}`;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

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
