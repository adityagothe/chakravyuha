import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/data/site';

export function Footer() {
  return (
    <footer className="bg-[#1c1b1b] w-full py-16 px-12 flex flex-col items-center justify-center space-y-8 border-t border-primary/5">
      <div className="font-headline text-xl font-bold text-primary mb-4 tracking-tighter">
        {siteConfig.name}
      </div>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        <Link
          href={siteConfig.links.music}
          className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-200 transition-colors duration-300"
        >
          Music
        </Link>
        <Link
          href={siteConfig.links.projects}
          className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-200 transition-colors duration-300"
        >
          Projects
        </Link>
        <Link
          href={siteConfig.links.about}
          className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-200 transition-colors duration-300"
        >
          About
        </Link>
        <Link
          href={siteConfig.links.contact}
          className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-200 transition-colors duration-300"
        >
          Contact
        </Link>
      </div>
      <div className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-600 pt-8 opacity-60">
        {siteConfig.copyright}
      </div>
    </footer>
  );
}
