import React from 'react';
import { GradientButton } from '../ui/GradientButton';
import { OutlineButton } from '../ui/OutlineButton';
import { siteConfig } from '@/data/site';

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-surface">
      {/* Background glow effect */}
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[160px] opacity-10"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <span className="font-label text-primary uppercase tracking-[0.4em] text-sm mb-6 block animate-fade-in">
          The Sovereign Archive
        </span>
        
        <h1 className="font-headline text-7xl md:text-9xl font-extrabold tracking-tighter text-on-surface mb-8">
          CHAKRA<span className="gold-gradient-text">VYUHA</span>
        </h1>
        
        <p className="font-headline text-3xl md:text-4xl italic text-on-surface-variant mb-6">
          {siteConfig.tagline}
        </p>
        
        <p className="font-body text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          {siteConfig.description}
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full max-w-sm md:max-w-none">
          <GradientButton label="View Projects" href="#projects" size="lg" className="w-full md:w-auto text-center" />
          <OutlineButton label="About Me" href="#about" size="lg" className="w-full md:w-auto text-center" />
        </div>
      </div>
    </section>
  );
}
