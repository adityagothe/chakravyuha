import type { Metadata } from 'next';
import { Inter, Manrope, Newsreader } from 'next/font/google';
import './globals.css';

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
  metadataBase: new URL('https://chakravyuha.vercel.app'), // Replace with actual domain later
  title: {
    default: 'CHAKRAVYUHA | Layers of Imagination',
    template: '%s | CHAKRAVYUHA',
  },
  description:
    'Building systems, apps, and ideas — layer by layer. A digital manifestation of architectural precision and visionary engineering.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CHAKRAVYUHA',
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
        {children}
      </body>
    </html>
  );
}
