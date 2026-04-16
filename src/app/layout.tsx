import type { Metadata } from 'next';
import { Inter, Manrope, Newsreader, Noto_Sans_Devanagari, Noto_Sans_Kannada } from 'next/font/google';
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

const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari'],
  display: 'swap',
  variable: '--font-devanagari',
});

const notoSansKannada = Noto_Sans_Kannada({
  weight: ['400', '500', '600', '700'],
  subsets: ['kannada'],
  display: 'swap',
  variable: '--font-kannada',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vajravyuha.in'),
  title: {
    default: 'Aditya Gothe — Founder & CEO of Vajravyuha',
    template: '%s | Aditya Gothe',
  },
  description:
    'Aditya Gothe is the Founder & CEO of Vajravyuha — an Indian entrepreneur, app developer, patriotic musical artist, and 3D game designer. Creator of Habitropolis, Vittora, and Udharo. Alumnus of Sainik School Bijapur.',
  keywords: [
    'Aditya Gothe',
    'Aditya Gothe Vajravyuha',
    'Who is Aditya Gothe',
    'Vajravyuha',
    'Vajravyuha India',
    'What is Vajravyuha',
    'Founder CEO Vajravyuha',
    'Two Stars HQ',
    'Indian patriotic music',
    'Two Stars Rising song',
    'Heart On Duty',
    'NDA music India',
    'defense aspirant songs',
    'Sainik School Bijapur',
    'Indian app developer',
    'Habitropolis',
    'Vittora',
    'Udharo',
    'game developer India',
    '3D artist India',
  ],
  authors: [{ name: 'Aditya Gothe', url: 'https://vajravyuha.in/founder' }],
  creator: 'Aditya Gothe',
  publisher: 'Vajravyuha',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
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
    description: 'Indian entrepreneur, developer, patriotic musical artist & CEO of Vajravyuha. Creator of Habitropolis, Vittora, Two Stars Rising.',
    images: ['https://vajravyuha.in/images/portrait.png'],
  },
  alternates: {
    canonical: 'https://vajravyuha.in',
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
        className={`${inter.variable} ${manrope.variable} ${newsreader.variable} ${notoSansDevanagari.variable} ${notoSansKannada.variable} antialiased`}
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
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://vajravyuha.in/#person",
                  "name": "Aditya Gothe",
                  "givenName": "Aditya",
                  "familyName": "Gothe",
                  "birthDate": "2007-01-29",
                  "nationality": "Indian",
                  "url": "https://vajravyuha.in/founder",
                  "image": "https://vajravyuha.in/images/portrait.png",
                  "jobTitle": "Founder & CEO",
                  "description": "Aditya Gothe is the Founder & CEO of Vajravyuha — an Indian entrepreneur, full-stack developer, patriotic musical artist, 3D game designer, and fintech app creator. Alumnus of Sainik School Bijapur.",
                  "worksFor": { "@id": "https://vajravyuha.in/#organization" },
                  "alumniOf": [
                    {
                      "@type": "EducationalOrganization",
                      "name": "Sainik School Bijapur",
                      "address": { "@type": "PostalAddress", "addressRegion": "Karnataka", "addressCountry": "IN" }
                    },
                    {
                      "@type": "EducationalOrganization",
                      "name": "BLDEA's College of Engineering & Technology",
                      "address": { "@type": "PostalAddress", "addressLocality": "Bijapur", "addressCountry": "IN" }
                    }
                  ],
                  "knowsAbout": [
                    "Full-Stack Development",
                    "React",
                    "React Native",
                    "Node.js",
                    "Supabase",
                    "Game Development",
                    "3D Art",
                    "Music Production",
                    "Fintech Applications",
                    "Business Growth"
                  ],
                  "sameAs": [
                    "https://github.com/adityagothe",
                    "https://www.linkedin.com/in/aditya-gothe-626352383/",
                    "https://www.instagram.com/victor5400_/",
                    "https://www.instagram.com/ascend.with.adi/",
                    "https://youtube.com/@ascend-with-adi",
                    "https://youtube.com/@victor5400_parasf",
                    "https://open.spotify.com/artist/7y9XCzNr4SgPxSV4cGt3kz"
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://vajravyuha.in/#organization",
                  "name": "Vajravyuha",
                  "alternateName": "VAJRAVYUHA",
                  "url": "https://vajravyuha.in",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://vajravyuha.in/images/portrait.png"
                  },
                  "description": "Vajravyuha is a digital studio founded by Aditya Gothe that helps small businesses grow online, hosts art by emerging artists, distributes music, and showcases full-stack software projects.",
                  "founder": { "@id": "https://vajravyuha.in/#person" },
                  "foundingDate": "2024",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Bijapur",
                    "addressRegion": "Karnataka",
                    "addressCountry": "IN"
                  },
                  "sameAs": [
                    "https://github.com/adityagothe",
                    "https://www.linkedin.com/in/aditya-gothe-626352383/"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://vajravyuha.in/#website",
                  "url": "https://vajravyuha.in",
                  "name": "Vajravyuha",
                  "description": "Official website of Aditya Gothe and Vajravyuha",
                  "publisher": { "@id": "https://vajravyuha.in/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://vajravyuha.in/?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
