'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '../ui/MaterialIcon';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy({ targets: ['hero', 'projects', 'about', 'contact'] });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '/#projects', id: 'projects' },
    { name: 'About', href: '/#about', id: 'about' },
    { name: 'Contact', href: '/#contact', id: 'contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled ? 'bg-neutral-950/90 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(233,195,73,0.1)] py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="flex justify-between items-center px-6 md:px-12 max-w-[1920px] mx-auto">
        <Link href="/" className="font-headline text-2xl font-bold tracking-tighter text-primary uppercase">
          CHAKRAVYUHA
        </Link>
        <div className="hidden md:flex items-center gap-12 font-headline tracking-tight text-lg">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'transition-all duration-500 hover:-translate-y-0.5 active:scale-95 relative',
                  isActive
                    ? "text-[#8B0000] after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#8B0000] after:rounded-full"
                    : 'text-neutral-400 hover:text-primary'
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            className="bg-primary text-on-primary px-6 py-2 rounded font-label text-sm uppercase tracking-widest hover:-translate-y-0.5 active:scale-95 transition-transform font-bold"
          >
            Get in Touch
          </Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-primary">
          <MaterialIcon name="menu" size="2xl" />
        </button>
      </div>
    </nav>
  );
}
