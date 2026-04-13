'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Client-side session guard:
// SecretArtistEntrance sets sessionStorage['vajravyuha_artist_auth'] = 'true'
// before navigating here. Anyone who types /artist directly is redirected to /art.

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const flag = sessionStorage.getItem('vajravyuha_artist_auth');
    if (flag === 'true') {
      setAuthorized(true);
    } else {
      // Not authorized → redirect immediately
      router.replace('/art');
    }
  }, [router]);

  // While checking, show a blank black screen (avoids flash of content)
  if (authorized === null) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
    );
  }

  return <>{children}</>;
}
