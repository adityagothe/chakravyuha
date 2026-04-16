import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArtHeroSection } from '@/components/art/ArtHeroSection';
import { ArtworkGrid } from '@/components/art/ArtworkGrid';
import { ScarcitySection } from '@/components/art/ScarcitySection';
import { DoodlesSection } from '@/components/art/DoodlesSection';
import { ArtSocialSection } from '@/components/art/ArtSocialSection';
import { SecretArtistEntrance } from '@/components/art/SecretArtistEntrance';

export const metadata: Metadata = {
  title: 'Original Artworks — Exclusive Collection & Doodles | VAJRAVYUHA',
  description:
    'Two collections in one: the Exclusive Collection — original artworks, each created once and never recreated — and My Doodles, quick sketches at small prices. By VAJRAVYUHA.',
  openGraph: {
    title: 'VAJRAVYUHA | Exclusive Collection & Doodles',
    description:
      'Exclusive 1-of-1 original artworks and casual doodles. Reserve or acquire originals. Browse quick sketches at budget prices. By VAJRAVYUHA.',
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

        {/* 2. Exclusive Collection Grid — live data from Supabase */}
        <ArtworkGrid />

        {/* 3. Scarcity / 1-of-1 value statement */}
        <ScarcitySection />

        {/* 4. My Doodles — casual section */}
        <DoodlesSection />

        {/* 5. Social / Follow the artist */}
        <ArtSocialSection />
      </main>
      <Footer />

      {/* Secret artist entrance — invisible hotspot + Ctrl+Shift+A */}
      <SecretArtistEntrance />
    </>
  );
}
