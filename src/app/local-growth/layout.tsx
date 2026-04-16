import type { Metadata } from 'next';
import { LocalGrowthClient } from './LocalGrowthClient';

export const metadata: Metadata = {
  title: 'Local Growth — Get Your Business Found Online | Vajravyuha',
  description:
    'Struggling to get customers from Google? Vajravyuha Local Growth helps Indian small businesses become visible online — Google Maps, directories, reviews, and more.',
  keywords: ['local SEO India', 'Google Maps listing', 'local business growth', 'small business marketing India', 'Vajravyuha'],
  openGraph: {
    title: 'Local Growth — Get Your Business Found Online',
    description: 'Helping Indian small businesses become visible online. Google Maps, SEO, reviews, and directories — all handled for you.',
    type: 'website',
    url: 'https://vajravyuha.in/local-growth',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local Growth | Vajravyuha',
    description: 'Helping Indian small businesses become visible online.',
  },
};

export default function LocalGrowthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocalGrowthClient>
      {children}
    </LocalGrowthClient>
  );
}
