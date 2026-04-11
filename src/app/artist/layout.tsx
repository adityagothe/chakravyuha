import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artist Control Panel | CHAKRAVYUHA',
  description: 'Restricted access — Sovereign Archive management system.',
  robots: { index: false, follow: false },
};

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
