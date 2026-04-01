import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArtHeroSection } from '@/components/art/ArtHeroSection';
import { ArtworkGrid } from '@/components/art/ArtworkGrid';
import { ScarcitySection } from '@/components/art/ScarcitySection';
import { ComingSoonSection } from '@/components/art/ComingSoonSection';
import { ArtSocialSection } from '@/components/art/ArtSocialSection';

export const metadata: Metadata = {
  title: 'Original Artworks — One of One',
  description:
    'A curated collection of original artworks — each piece created once and never recreated. Once sold, permanently unavailable. Explore the Sovereign series by CHAKRAVYUHA.',
  openGraph: {
    title: 'CHAKRAVYUHA | Original Artworks — One of One',
    description:
      'Each artwork exists only once. Created once, never reproduced. Explore and acquire originals from the Sovereign archive.',
    type: 'website',
  },
};

export default function ArtPage() {
  return (
    <>
      <Navbar />
      <main className="animate-page-in relative pt-24 min-h-screen">
        <ArtHeroSection />
        <ArtworkGrid />
        <ScarcitySection />
        <ComingSoonSection />
        <ArtSocialSection />
      </main>
      <Footer />
    </>
  );
}
