'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LGContent } from '@/types/local-growth';

interface Props { content: LGContent['stickyCta']; }

export function LGStickyCTA({ content }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after hero (~100vh), hide when contact section is in view
      const contactEl = document.getElementById('contact');
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const contactTop = contactEl ? contactEl.getBoundingClientRect().top + scrollY : Infinity;
      setVisible(scrollY > heroHeight && scrollY < contactTop - 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById('visibility-tool')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop: bottom-left floating button */}
      <button
        onClick={scrollToContact}
        aria-label={content.text}
        className={cn(
          'hidden md:flex fixed bottom-6 left-6 z-40 items-center gap-2',
          'gold-gradient-bg text-on-primary rounded-xl',
          'px-5 py-3 font-label font-bold text-sm uppercase tracking-widest',
          'shadow-[0_8px_32px_-8px_rgba(233,195,73,0.4)]',
          'hover:-translate-y-1 hover:shadow-[0_14px_40px_-8px_rgba(233,195,73,0.5)]',
          'active:scale-95 transition-all duration-300',
          visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <span className="material-symbols-outlined text-base">rocket_launch</span>
        {content.text}
      </button>

      {/* Mobile: full-width bottom bar */}
      <div className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-surface-container-highest/90 backdrop-blur-xl border-t border-primary/10',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-100 translate-y-0 pointer-events-auto'
      )}>
        <button
          onClick={scrollToContact}
          className="w-full gold-gradient-bg text-on-primary py-3.5 rounded font-label font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-base">rocket_launch</span>
          {content.text}
        </button>
      </div>
    </>
  );
}
