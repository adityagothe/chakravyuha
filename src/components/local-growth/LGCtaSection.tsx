import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeIn } from '../ui/FadeIn';
import { GradientButton } from '../ui/GradientButton';

interface LGCtaSectionProps {
  content: LGContent['cta'];
}

export function LGCtaSection({ content }: LGCtaSectionProps) {
  return (
    <SectionWrapper id="cta" padding="none" className="py-48 px-6 md:px-12 text-center overflow-hidden">
      <div className="max-w-screen-md mx-auto z-10 relative">
        <FadeIn delay={0}>
          <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl mb-12 leading-tight">{content.title}</h2>
        </FadeIn>
        <FadeIn delay={200} direction="up">
          <GradientButton 
            label={content.buttonText} 
            href="#contact" 
            size="lg" 
            className="crimson-glow text-lg md:text-xl px-12 py-6 tracking-[0.2em]" 
          />
        </FadeIn>
      </div>
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-secondary/10 blur-[120px] -z-0 rounded-full animate-pulse opacity-60"></div>
    </SectionWrapper>
  );
}
