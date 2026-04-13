import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArtHeroSection } from '@/components/art/ArtHeroSection';
import { ArtworkGrid } from '@/components/art/ArtworkGrid';
import { ScarcitySection } from '@/components/art/ScarcitySection';
import { ArtSocialSection } from '@/components/art/ArtSocialSection';
import { SecretArtistEntrance } from '@/components/art/SecretArtistEntrance';

export const metadata: Metadata = {
  title: 'Original Artworks — One of One | VAJRAVYUHA',
  description:
    'A curated collection of original artworks — each piece created once and never recreated. Reserve or purchase directly. Explore the Sovereign series by VAJRAVYUHA.',
  openGraph: {
    title: 'VAJRAVYUHA | Original Artworks — One of One Collection',
    description:
      'Each artwork exists only once. Reserve or acquire a fixed-price original. No reproductions. Permanent sovereign ownership.',
    type: 'website',
  },
};

export default function ArtPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="animate-page-in relative pt-24 min-h-screen">
        {/* 1. Hero — identity + CTAs */}
        <ArtHeroSection />

        {/* 2. Collection Grid — live data from Supabase */}
        <ArtworkGrid />

        {/* 3. Scarcity / 1-of-1 value statement */}
        <ScarcitySection />

        {/* 4. Social / Follow the artist */}
        <ArtSocialSection />
      </main>
      <Footer />

      {/* Secret artist entrance — invisible hotspot + Ctrl+Shift+A */}
      <SecretArtistEntrance />
    </>
  );
}
