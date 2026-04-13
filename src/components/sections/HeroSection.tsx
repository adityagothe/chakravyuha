import React from 'react';
import { FadeIn } from '@/components/ui/FadeIn';
import { GradientButton } from '../ui/GradientButton';
import { OutlineButton } from '../ui/OutlineButton';
import { siteConfig } from '@/data/site';

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-surface">
      {/* Background glow effect */}
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[160px] opacity-10" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <FadeIn delay={0} direction="up">
          <span className="font-label text-primary uppercase tracking-[0.4em] text-xs sm:text-sm mb-6 block">
            The Sovereign Archive
          </span>
        </FadeIn>

        <FadeIn delay={120} direction="up">
          <h1 className="font-headline text-[clamp(3.5rem,14vw,9rem)] font-extrabold tracking-tighter text-on-surface mb-6 md:mb-8 leading-none">
            VAJRA<span className="gold-gradient-text">VYUHA</span>
            <span className="block text-xl md:text-2xl font-body font-normal text-on-surface-variant/70 mt-2 tracking-widest uppercase">
              by Aditya Gothe
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={240} direction="up">
          <p className="font-headline text-xl sm:text-3xl md:text-4xl italic text-on-surface-variant mb-4 md:mb-6">
            {siteConfig.tagline}
          </p>
        </FadeIn>

        <FadeIn delay={360} direction="up">
          <p className="font-body text-base md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
            {siteConfig.description}
          </p>
        </FadeIn>

        <FadeIn delay={480} direction="up">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center w-full max-w-sm sm:max-w-none">
            <GradientButton label="View Projects" href="#projects" size="lg" className="w-full sm:w-auto text-center" />
            <OutlineButton label="About Me" href="#about" size="lg" className="w-full sm:w-auto text-center" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
