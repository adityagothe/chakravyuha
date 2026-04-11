'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LGContent, Locale } from '@/types/local-growth';
import { useLanguage } from '@/hooks/useLanguage';

interface LGFooterProps {
  content: LGContent['footer'];
}

export function LGFooter({ content }: LGFooterProps) {
  const { locale, setLocale } = useLanguage();

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return (
    <footer className="bg-neutral-900 w-full py-12 border-t border-primary/10">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-screen-2xl mx-auto gap-8">
        <div className="font-sans uppercase text-[10px] tracking-[0.2em] font-semibold text-neutral-500 text-center md:text-left">
          {content.copyright}
        </div>
        <div className="flex gap-10">
          <span 
            onClick={() => changeLanguage('en')}
            className={cn(
              "font-sans uppercase text-[10px] tracking-[0.2em] font-semibold transition-colors cursor-pointer",
              locale === 'en' ? "text-red-700" : "text-neutral-500 hover:text-yellow-500 opacity-80 hover:opacity-100"
            )}
          >
            English
          </span>
          <span 
            onClick={() => changeLanguage('hi')}
            className={cn(
              "font-sans uppercase text-[10px] tracking-[0.2em] font-semibold transition-colors cursor-pointer",
              locale === 'hi' ? "text-red-700" : "text-neutral-500 hover:text-yellow-500 opacity-80 hover:opacity-100"
            )}
          >
            Hindi
          </span>
          <span 
            onClick={() => changeLanguage('kn')}
            className={cn(
              "font-sans uppercase text-[10px] tracking-[0.2em] font-semibold transition-colors cursor-pointer",
              locale === 'kn' ? "text-red-700" : "text-neutral-500 hover:text-yellow-500 opacity-80 hover:opacity-100"
            )}
          >
            Kannada
          </span>
        </div>
      </div>
    </footer>
  );
}
