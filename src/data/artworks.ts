export type ArtworkStatus = 'available' | 'sold' | 'auction' | 'upcoming';

export interface BidEntry {
  user: string;
  amount: string;
  time: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  image: string | null; // null → ImagePlaceholder fallback
  price: string;
  status: ArtworkStatus;
  medium: string;
  dimensions: string;
  // Auction-specific fields
  auctionId?: string;
  highestBid?: string;
  startingBid?: string;
  timeRemaining?: string; // display string, e.g. "04:12:55"
  bidders?: number;
  watchers?: number;
  bidHistory?: BidEntry[];
  // Upcoming-specific fields
  dropCountdown?: string; // display string, e.g. "03D : 14H : 22M"
  dropDate?: string;
}

const ENQUIRY_EMAIL = 'chakravyuha.studio@gmail.com';

export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'The Gilded Cage',
    description:
      'A meditation on the constraints of divine lineage. The figure stands bound by golden threads that simultaneously adorn and imprison — beauty inseparable from its burden.',
    image: null,
    price: '₹4,50,000',
    status: 'auction',
    medium: 'Mixed media on canvas',
    dimensions: '48 × 48 in',
    auctionId: 'CH-9042',
    highestBid: '₹3,45,000',
    startingBid: '₹1,50,000',
    timeRemaining: '04:12:55',
    bidders: 18,
    watchers: 247,
    bidHistory: [
      { user: 'User_882', amount: '₹3,45,000', time: '2m ago' },
      { user: 'Karthik_A', amount: '₹3,20,000', time: '11m ago' },
      { user: 'ZenithArt', amount: '₹3,10,000', time: '24m ago' },
      { user: 'Anon-429', amount: '₹2,90,000', time: '41m ago' },
    ],
  },
  {
    id: '2',
    title: 'Echoes of Indra',
    description:
      'Capturing the resonance of celestial storms through overlapping Sanskrit glyphs and circuitry — ancient frequency colliding with synthetic hum.',
    image: null,
    price: '₹3,20,000',
    status: 'sold',
    medium: 'Digital pigment print on archival paper',
    dimensions: '36 × 48 in',
  },
  {
    id: '3',
    title: 'Ritual Mask IV',
    description:
      'Part of the "Modern Myth" series. The mask as persona, the persona as truth. Hand-embellished with real gold leaf across the crown.',
    image: null,
    price: '₹5,80,000',
    status: 'available',
    medium: 'Acrylic & gold leaf on linen',
    dimensions: '30 × 40 in',
  },
  {
    id: '4',
    title: 'Sovereign Dark',
    description:
      'A composition born from stillness. Layers of obsidian ink pulled across textured ground, interrupted only by a single luminous thread — the moment before dawn.',
    image: null,
    price: '₹6,20,000',
    status: 'available',
    medium: 'Ink & resin on wood panel',
    dimensions: '24 × 36 in',
  },
  {
    id: '5',
    title: 'Ashura Rising',
    description:
      'The demon-god in motion — not of destruction but of creative chaos. Every stroke a deliberate contradiction, every colour a paradox of identity.',
    image: null,
    price: '₹7,00,000',
    status: 'sold',
    medium: 'Oil on stretched canvas',
    dimensions: '40 × 60 in',
  },
  {
    id: '6',
    title: 'The Last Yuga',
    description:
      'Kali Yuga rendered in quiet horror — not as apocalypse but as the mundane forgetting of sacred things. Muted golds dissolve into grey.',
    image: null,
    price: '₹5,10,000',
    status: 'available',
    medium: 'Watercolour & charcoal on paper',
    dimensions: '22 × 30 in',
  },
  {
    id: '7',
    title: 'Celestial Bloom',
    description:
      'A fractal explosion of sacred geometry — each petal a universe collapsing inward. The first work in the upcoming Cosmos series.',
    image: null,
    price: '₹8,00,000',
    status: 'upcoming',
    medium: 'Oil & gold leaf on canvas',
    dimensions: '60 × 60 in',
    dropCountdown: '03D : 14H : 22M',
    dropDate: 'April 15, 2026',
  },
  {
    id: '8',
    title: 'Shadow Architect',
    description:
      'The silent builder of unseen structures — form emerging from void. A study in negative space and implied mass across deep obsidian layers.',
    image: null,
    price: '₹6,50,000',
    status: 'upcoming',
    medium: 'Ink & silver leaf on panel',
    dimensions: '36 × 48 in',
    dropCountdown: '08D : 04H : 12M',
    dropDate: 'April 20, 2026',
  },
];

export function buildEnquiryHref(artwork: Artwork): string {
  const subject = encodeURIComponent(`Enquiry — "${artwork.title}" (One of One)`);
  const body = encodeURIComponent(
    `Hello,\n\nI am interested in acquiring "${artwork.title}" (${artwork.medium}, ${artwork.dimensions}, ${artwork.price}).\n\nPlease share availability and next steps.\n\nThank you.`
  );
  return `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}

export function buildBidHref(artwork: Artwork, bidAmount: string): string {
  const subject = encodeURIComponent(`Bid Submission — "${artwork.title}" (${artwork.auctionId ?? ''})`);
  const body = encodeURIComponent(
    `Hello,\n\nI would like to place a bid of ${bidAmount} on "${artwork.title}" (Auction ID: ${artwork.auctionId ?? 'N/A'}).\n\nPlease confirm receipt and next steps.\n\nThank you.`
  );
  return `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}

export function buildNotifyHref(artwork: Artwork, email: string): string {
  const subject = encodeURIComponent(`Notify Me — "${artwork.title}" Drop`);
  const body = encodeURIComponent(
    `Hello,\n\nPlease notify me when "${artwork.title}" drops (expected: ${artwork.dropDate ?? 'TBD'}).\n\nEmail: ${email}\n\nThank you.`
  );
  return `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}
