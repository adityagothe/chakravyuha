import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';

interface Props { content: LGContent['education']; }

export function LGEducationSection({ content }: Props) {
  return (
    <SectionWrapper id="education" bg="surface-container-lowest">
      <Container>
        <FadeIn delay={0}>
          <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
        </FadeIn>
        <FadeIn delay={150}>
          <h2 className="font-headline text-4xl sm:text-5xl mb-6 leading-tight max-w-2xl">{content.title}</h2>
        </FadeIn>
        <FadeIn delay={300}>
          <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-xl mb-20">{content.subtitle}</p>
        </FadeIn>

        {/* Steps timeline */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-10 right-10 h-px bg-outline-variant/15 -z-0">
            <div className="h-full w-1/2 bg-gradient-to-r from-primary/40 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {content.steps.map((step, i) => (
              <FadeIn key={i} delay={i * 150} className="group flex flex-col">
                {/* Icon circle */}
                <div className="w-20 h-20 rounded-sm bg-surface-container-high border border-primary/20 flex items-center justify-center mb-8 z-10 relative transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:scale-105">
                  <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                </div>
                <span className="font-label text-primary/40 text-xs font-bold tracking-[0.3em] mb-2">{step.number}</span>
                <h4 className="font-headline text-xl mb-3 group-hover:text-primary transition-colors duration-300">{step.title}</h4>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">{step.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
