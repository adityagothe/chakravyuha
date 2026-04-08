'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Locale } from '@/types/local-growth';

export function LGNavbar() {
  const { locale, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    // Persist in URL if necessary or state manages it. 
    // Usually handled upstream, but we'll let context do its job.
  };

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled 
          ? 'bg-neutral-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(233,195,73,0.05)] py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-screen-2xl mx-auto">
        <Link href="/" className="text-2xl font-serif text-primary uppercase tracking-widest font-headline">
          The Sovereign Archive
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link href="/#projects" className="text-neutral-400 hover:text-primary transition-colors duration-300 font-label text-sm uppercase tracking-widest">Projects</Link>
          <Link href="/#about" className="text-neutral-400 hover:text-primary transition-colors duration-300 font-label text-sm uppercase tracking-widest">About</Link>
          <Link href="/#contact" className="text-neutral-400 hover:text-primary transition-colors duration-300 font-label text-sm uppercase tracking-widest">Contact</Link>
          <Link href="/music" className="text-neutral-400 hover:text-primary transition-colors duration-300 font-label text-sm uppercase tracking-widest">Music</Link>
          <Link href="/art" className="text-neutral-400 hover:text-primary transition-colors duration-300 font-label text-sm uppercase tracking-widest">Art</Link>
        </div>
        <div className="flex items-center gap-6">
          <button className="material-symbols-outlined text-primary hover:text-primary/80 transition-all duration-300">language</button>
          <div className="hidden md:flex gap-2 text-[10px] font-label font-bold text-neutral-500 uppercase tracking-widest">
            <span 
              onClick={() => changeLanguage('en')}
              className={cn("cursor-pointer transition-colors", locale === 'en' ? 'text-secondary' : 'hover:text-primary')}
            >
              English
            </span>
            <span>/</span>
            <span 
              onClick={() => changeLanguage('hi')}
              className={cn("cursor-pointer transition-colors", locale === 'hi' ? 'text-secondary' : 'hover:text-primary')}
            >
              Hindi
            </span>
            <span>/</span>
            <span 
              onClick={() => changeLanguage('kn')}
              className={cn("cursor-pointer transition-colors", locale === 'kn' ? 'text-secondary' : 'hover:text-primary')}
            >
              Kannada
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
