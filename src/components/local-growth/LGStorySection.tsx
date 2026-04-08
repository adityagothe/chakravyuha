import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { GlassCard } from '../ui/GlassCard';

interface LGStorySectionProps {
  content: LGContent['story'];
}

export function LGStorySection({ content }: LGStorySectionProps) {
  return (
    <SectionWrapper id="story" bg="surface-container-low" className="overflow-hidden">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <FadeIn delay={0}>
            <h2 className="font-headline text-4xl sm:text-5xl mb-8 leading-tight">{content.title}</h2>
          </FadeIn>
          <div className="space-y-6 text-on-surface-variant text-lg md:text-xl leading-relaxed font-body">
            {content.paragraphs.map((p, idx) => (
              <FadeIn key={idx} delay={(idx + 1) * 150}>
                <p>{p}</p>
              </FadeIn>
            ))}
          </div>
        </div>
        <FadeIn delay={300} direction="left" className="relative group perspective-1000">
          <div className="aspect-[4/3] overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:rotate-1">
            <div className="w-full h-full bg-surface-container animate-pulse flex items-center justify-center">
               <span className="text-on-surface-variant/30 font-label tracking-widest uppercase">Visual Payload</span>
            </div>
          </div>
          <GlassCard className="absolute -bottom-8 -left-8 md:-left-12 p-6 md:p-8 max-w-xs transform group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform duration-500 z-10 crimson-glow">
            <p className="italic font-headline text-primary text-xl md:text-2xl leading-relaxed">{content.quote}</p>
          </GlassCard>
        </FadeIn>
      </Container>
    </SectionWrapper>
  );
}
