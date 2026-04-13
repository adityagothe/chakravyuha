import type { Metadata } from 'next';
import { ArtistDashboard } from '@/components/artist/ArtistDashboard';

export const metadata: Metadata = {
  title: 'Artist Control Panel | VAJRAVYUHA',
  robots: { index: false, follow: false },
};

export default function ArtistPage() {
  return <ArtistDashboard />;
}
