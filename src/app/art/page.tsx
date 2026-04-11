import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArtHeroSection } from '@/components/art/ArtHeroSection';
import { LiveAuctionSection } from '@/components/art/LiveAuctionSection';
import { ArtworkGrid } from '@/components/art/ArtworkGrid';
import { UpcomingDropsSection } from '@/components/art/UpcomingDropsSection';
import { ScarcitySection } from '@/components/art/ScarcitySection';
import { ComingSoonSection } from '@/components/art/ComingSoonSection';
import { ArtSocialSection } from '@/components/art/ArtSocialSection';
import { SecretArtistEntrance } from '@/components/art/SecretArtistEntrance';

export const metadata: Metadata = {
  title: 'Original Artworks — One of One | Live Auction',
  description:
    'A curated collection of original artworks — each piece created once and never recreated. Bid live or request purchase. Explore the Sovereign series by CHAKRAVYUHA.',
  openGraph: {
    title: 'CHAKRAVYUHA | Original Artworks — Live Auction & Collection',
    description:
      'Each artwork exists only once. Bid on the live auction or acquire a fixed-price original. No reproductions. Permanent sovereign ownership.',
    type: 'website',
  },
};

export default function ArtPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="animate-page-in relative pt-24 min-h-screen">
        {/* 1. Hero — strong identity, dual CTAs, live indicator */}
        <ArtHeroSection />

        {/* 2. Live Auction — core conversion section */}
        <LiveAuctionSection />

        {/* 3. Collection Grid — auction + fixed price + sold cards */}
        <ArtworkGrid />

        {/* 4. Upcoming Drops — blurred previews with countdowns */}
        <UpcomingDropsSection />

        {/* 5. Scarcity / Value — emotional 1-of-1 statement */}
        <ScarcitySection />

        {/* 6. Whitelist CTA — first access to auctions */}
        <ComingSoonSection />

        {/* 7. Social / Follow the artist */}
        <ArtSocialSection />
      </main>
      <Footer />

      {/* Secret artist entrance — invisible hotspot + Ctrl+Shift+A */}
      <SecretArtistEntrance />
    </>
  );
}
