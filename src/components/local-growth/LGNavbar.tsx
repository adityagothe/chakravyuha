'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Locale } from '@/types/local-growth';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'kn', label: 'KN' },
];

const LOCALE_FULL: Record<Locale, string> = {
  en: 'English',
  hi: 'हिंदी',
  kn: 'ಕನ್ನಡ',
};

export function LGNavbar() {
  const { locale, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handler = () => setLangOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [langOpen]);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    setLangOpen(false);
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
        {/* Logo */}
        <Link href="/" className="text-xl font-serif text-primary uppercase tracking-widest font-headline">
          The Sovereign Archive
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/#projects', label: 'Projects' },
            { href: '/#about', label: 'About' },
            { href: '/music', label: 'Music' },
            { href: '/art', label: 'Art' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-neutral-400 hover:text-primary transition-colors duration-300 font-label text-sm uppercase tracking-widest"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-3">
          {/* Desktop: inline toggles */}
          <div className="hidden md:flex items-center gap-1 bg-surface-container rounded-lg p-1">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className={cn(
                  'px-3 py-1.5 rounded font-label text-[11px] font-bold uppercase tracking-widest transition-all duration-200',
                  locale === code
                    ? 'gold-gradient-bg text-on-primary'
                    : 'text-neutral-500 hover:text-primary'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mobile: dropdown */}
          <div className="relative md:hidden">
            <button
              onClick={(e) => { e.stopPropagation(); setLangOpen((v) => !v); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container rounded-lg font-label text-xs font-bold uppercase tracking-widest text-primary"
              aria-label="Change language"
            >
              <span className="material-symbols-outlined text-sm">language</span>
              {LOCALES.find((l) => l.code === locale)?.label}
              <span className={cn('material-symbols-outlined text-sm transition-transform', langOpen ? 'rotate-180' : '')}>expand_more</span>
            </button>
            {langOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full right-0 mt-2 w-36 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl overflow-hidden"
              >
                {LOCALES.map(({ code }) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={cn(
                      'w-full text-left px-4 py-3 font-body text-sm transition-colors',
                      locale === code
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    )}
                  >
                    {LOCALE_FULL[code]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
