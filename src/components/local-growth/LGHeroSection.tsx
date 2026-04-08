import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { OutlineButton } from '../ui/OutlineButton';

interface LGHeroSectionProps {
  content: LGContent['hero'];
}

export function LGHeroSection({ content }: LGHeroSectionProps) {
  return (
    <SectionWrapper id="hero" padding="hero" className="overflow-hidden min-h-screen flex items-center">
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 z-10">
          <FadeIn delay={0}>
            <span className="font-label text-primary text-sm font-bold uppercase tracking-[0.3em] mb-6 block">
              {content.label}
            </span>
          </FadeIn>
          <FadeIn delay={150}>
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.1] mb-8 text-on-surface">
              {content.title} <span className="italic text-primary">{content.titleHighlight}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed mb-12">
              {content.subtitle}
            </p>
          </FadeIn>
          <FadeIn delay={450}>
            <div className="flex flex-wrap gap-6">
              <GradientButton label={content.ctaPrimary} href="#approach" size="lg" className="crimson-glow" />
              <OutlineButton label={content.ctaSecondary} href="#services" size="lg" />
            </div>
          </FadeIn>
        </div>
        <div className="lg:col-span-5 relative">
          <FadeIn delay={600} direction="left">
            <GlassCard className="aspect-square p-8 flex flex-col justify-center relative z-10">
              <div className="space-y-6">
                <div className="h-12 w-full bg-surface-container rounded-sm flex items-center px-4 gap-3 animate-pulse">
                  <span className="material-symbols-outlined text-primary text-lg">search</span>
                  <div className="h-2 w-32 bg-primary/20 rounded-full"></div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="p-4 bg-surface-container-high rounded-sm border-l-2 border-primary transform transition-transform hover:translate-x-2">
                    <div className="h-3 w-48 bg-primary/40 rounded-full mb-3"></div>
                    <div className="h-2 w-full bg-on-surface-variant/10 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-surface-container rounded-sm opacity-50">
                    <div className="h-3 w-40 bg-on-surface-variant/20 rounded-full mb-3"></div>
                    <div className="h-2 w-full bg-on-surface-variant/10 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-surface-container rounded-sm opacity-30">
                    <div className="h-3 w-56 bg-on-surface-variant/20 rounded-full mb-3"></div>
                    <div className="h-2 w-full bg-on-surface-variant/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </GlassCard>
            <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-secondary/10 blur-[64px] rounded-full animate-pulse z-0"></div>
          </FadeIn>
        </div>
      </Container>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10 animate-fade-in opacity-50"></div>
    </SectionWrapper>
  );
}
