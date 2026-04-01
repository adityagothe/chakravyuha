export type ArtworkStatus = 'available' | 'sold';

export interface Artwork {
  id: string;
  title: string;
  description: string;
  image: string | null; // null → ImagePlaceholder fallback
  price: string;
  status: ArtworkStatus;
  medium: string;
  dimensions: string;
}

const ENQUIRY_EMAIL = 'chakravyuha.studio@gmail.com';

export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'The Gilded Cage',
    description:
      'A meditation on the constraints of divine lineage. The figure stands bound by golden threads that simultaneously adorn and imprison — beauty inseparable from its burden.',
    image: null,
    price: '$4,500',
    status: 'available',
    medium: 'Mixed media on canvas',
    dimensions: '48 × 48 in',
  },
  {
    id: '2',
    title: 'Echoes of Indra',
    description:
      'Capturing the resonance of celestial storms through overlapping Sanskrit glyphs and circuitry — ancient frequency colliding with synthetic hum.',
    image: null,
    price: '$3,200',
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
    price: '$5,800',
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
    price: '$6,200',
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
    price: '$7,000',
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
    price: '$5,100',
    status: 'available',
    medium: 'Watercolour & charcoal on paper',
    dimensions: '22 × 30 in',
  },
];

export function buildEnquiryHref(artwork: Artwork): string {
  const subject = encodeURIComponent(`Enquiry — "${artwork.title}" (One of One)`);
  const body = encodeURIComponent(
    `Hello,\n\nI am interested in acquiring "${artwork.title}" (${artwork.medium}, ${artwork.dimensions}, ${artwork.price}).\n\nPlease share availability and next steps.\n\nThank you.`
  );
  return `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}
