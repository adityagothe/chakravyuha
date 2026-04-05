import type { Metadata } from 'next';
import { Inter, Manrope, Newsreader } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chakravyuha-aditya-gothe.vercel.app'),
  title: {
    default: 'Aditya Gothe — Developer, Creator, Musician | CHAKRAVYUHA',
    template: '%s | Aditya Gothe',
  },
  description:
    'Aditya Gothe — building systems, apps, and music layer by layer. A digital manifestation of architectural precision and visionary engineering.',
  keywords: ['Aditya Gothe', 'developer', 'React Native', 'Habitropolis', 'Vittora', 'Two Stars HQ', 'Chakravyuha'],
  authors: [{ name: 'Aditya Gothe' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CHAKRAVYUHA — Aditya Gothe',
    images: [
      {
        url: 'https://chakravyuha-aditya-gothe.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aditya Gothe portfolio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Gothe | CHAKRAVYUHA',
    description: 'Aditya Gothe — building systems, apps, and music layer by layer.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} ${newsreader.variable} antialiased`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-surface p-4 border border-primary text-primary font-bold rounded">
          Skip to main content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Aditya Gothe",
              "url": "https://chakravyuha-aditya-gothe.vercel.app",
              "jobTitle": "System Builder & Creator",
              "sameAs": [
                "https://github.com/adityagothe",
                "https://www.linkedin.com/in/aditya-gothe-626352383/",
                "https://www.instagram.com/victor5400_/",
                "https://open.spotify.com/artist/7y9XCzNr4SgPxSV4cGt3kz"
              ]
            })
          }}
        />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
