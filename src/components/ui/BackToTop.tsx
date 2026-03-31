'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        'fixed bottom-6 right-6 z-40 w-12 h-12 rounded-xl',
        'gold-gradient-bg text-on-primary',
        'flex items-center justify-center',
        'shadow-[0_8px_32px_-8px_rgba(233,195,73,0.4)]',
        'hover:-translate-y-1 hover:shadow-[0_14px_40px_-8px_rgba(233,195,73,0.5)]',
        'active:scale-95 transition-all duration-300',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <span
        className="material-symbols-outlined text-[22px]"
        style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}
      >
        arrow_upward
      </span>
    </button>
  );
}
