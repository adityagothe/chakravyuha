'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MaterialIcon } from '../ui/MaterialIcon';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy({ targets: ['hero', 'projects', 'skills', 'about', 'contact'] });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const navLinks = [
    { name: 'Projects', href: '/#projects', id: 'projects' },
    { name: 'Skills', href: '/#skills', id: 'skills' },
    { name: 'About', href: '/#about', id: 'about' },
    { name: 'Music', href: '/music', id: 'music' },
    { name: 'Contact', href: '/#contact', id: 'contact' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'bg-neutral-950/90 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(233,195,73,0.1)] py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="flex justify-between items-center px-6 md:px-12 max-w-[1920px] mx-auto">
          <Link
            href="/"
            className="font-headline text-2xl font-bold tracking-tighter text-primary uppercase"
            onClick={closeMobile}
          >
            CHAKRAVYUHA
          </Link>

          {/* Desktop Nav */}
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

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden text-primary p-2 rounded transition-colors hover:bg-primary/10 active:scale-95"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span
              className="material-symbols-outlined text-[28px] transition-all duration-300"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
            >
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-neutral-950/70 backdrop-blur-sm transition-all duration-300 md:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-[min(85vw,340px)] z-50 flex flex-col',
          'bg-neutral-950 border-l border-outline-variant/20',
          'shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.8)]',
          'transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-8 border-b border-outline-variant/10">
          <span className="font-headline text-lg font-bold text-primary tracking-tighter uppercase">
            Navigation
          </span>
          <button
            id="mobile-menu-close"
            className="text-neutral-400 hover:text-primary p-2 rounded transition-colors active:scale-95"
            aria-label="Close menu"
            onClick={closeMobile}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
            >
              close
            </span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobile}
                style={{ transitionDelay: mobileOpen ? `${i * 60 + 80}ms` : '0ms' }}
                className={cn(
                  'group flex items-center gap-4 px-5 py-4 rounded-lg font-headline text-xl tracking-tight',
                  'transition-all duration-300',
                  mobileOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
                  isActive
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-neutral-300 hover:text-primary hover:bg-surface-container'
                )}
              >
                <span
                  className="material-symbols-outlined text-[20px] text-primary/60 group-hover:text-primary transition-colors"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  {link.id === 'projects'
                    ? 'deployed_code'
                    : link.id === 'skills'
                    ? 'build'
                    : link.id === 'about'
                    ? 'person'
                    : link.id === 'music'
                    ? 'music_note'
                    : 'mail'}
                </span>
                {link.name}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA at bottom */}
        <div className="px-4 pb-10 pt-4 border-t border-outline-variant/10">
          <Link
            href="/#contact"
            onClick={closeMobile}
            id="mobile-get-in-touch"
            className={cn(
              'gold-gradient-bg text-on-primary px-6 py-4 rounded-lg font-label font-bold uppercase tracking-widest',
              'flex items-center justify-center gap-3 text-sm w-full',
              'hover:shadow-[0_8px_24px_-8px_rgba(233,195,73,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all',
              mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
              'transition-all duration-300 delay-300'
            )}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
            >
              send
            </span>
            Get in Touch
          </Link>
          <p className="text-center font-label text-[9px] uppercase tracking-widest text-neutral-600 mt-4">
            © CHAKRAVYUHA — Sovereign Archive
          </p>
        </div>
      </aside>
    </>
  );
}
