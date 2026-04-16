import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aditya Gothe – Founder & CEO of Vajravyuha | Developer, Musician & Entrepreneur',
  description:
    'Aditya Gothe is the Founder & CEO of Vajravyuha — an Indian entrepreneur, app developer, musical artist, and 3D game designer from Sainik School Bijapur. Known for patriotic music, fintech apps, and international expert research.',
  keywords: [
    'Aditya Gothe',
    'Aditya Gothe Vajravyuha',
    'Who is Aditya Gothe',
    'Vajravyuha founder',
    'Vajravyuha CEO',
    'Founder CEO Vajravyuha',
    'Vajravyuha India',
    'Indian app developer',
    'Two Stars HQ',
    'Sainik School Bijapur alumni',
    'Indian patriotic music artist',
    'Habitropolis',
    'Vittora',
    'Udharo',
    'NDA music',
    'defense aspirant songs',
    'Two Stars Rising',
  ],
  openGraph: {
    type: 'profile',
    title: 'Aditya Gothe — Founder & CEO of Vajravyuha',
    description:
      'Indian entrepreneur, app developer, musical artist, and game designer. Founder & CEO of Vajravyuha — a digital studio helping small businesses grow.',
    url: 'https://vajravyuha.in/founder',
    siteName: 'VAJRAVYUHA — Aditya Gothe',
    images: [
      {
        url: 'https://vajravyuha.in/images/portrait.png',
        width: 1200,
        height: 630,
        alt: 'Aditya Gothe — Founder & CEO of Vajravyuha',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Gothe — Founder & CEO of Vajravyuha',
    description:
      'Indian entrepreneur, developer, patriotic musical artist, and game designer. CEO of Vajravyuha.',
    images: ['https://vajravyuha.in/images/portrait.png'],
  },
  alternates: {
    canonical: 'https://vajravyuha.in/founder',
  },
  robots: { index: true, follow: true },
};

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
