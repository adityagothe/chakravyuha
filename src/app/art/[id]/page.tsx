import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArtworkDetailView } from '@/components/art/ArtworkDetailView';
import { Artwork } from '@/data/artworks';

export const dynamic = 'force-dynamic';

// ─── Fetch artwork from API ───────────────────────────────────────────────────

async function getArtwork(id: string): Promise<Artwork | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/artworks/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Dynamic OG metadata for WhatsApp / Instagram / Twitter previews ─────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtwork(id);

  if (!artwork) {
    return {
      title: 'Artwork Not Found | VAJRAVYUHA',
      description: 'This artwork could not be found.',
    };
  }

  const title = `${artwork.title} — Original Art | VAJRAVYUHA`;
  const description = `${artwork.price} · ${artwork.medium} · ${artwork.dimensions} · One of One. ${artwork.description.slice(0, 140)}`;
  const image = artwork.image_url ?? 'https://vajravyuha.in/og-image.png';
  const url = `https://vajravyuha.in/art/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'VAJRAVYUHA',
      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
          alt: artwork.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    // WhatsApp reads og: tags — no special handling needed.
    // Canonical URL so Instagram shows correct link when shared via story link sticker.
    alternates: {
      canonical: url,
    },
  };
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtwork(id);

  if (!artwork) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main id="main-content">
        <ArtworkDetailView artwork={artwork} />
      </main>
      <Footer />
    </>
  );
}
