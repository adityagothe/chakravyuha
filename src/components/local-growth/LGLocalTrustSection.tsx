import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';

interface Props { content: LGContent['localTrust']; }

export function LGLocalTrustSection({ content }: Props) {
  return (
    <SectionWrapper id="local-trust">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4">
            <FadeIn delay={0}>
              <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
            </FadeIn>
            <FadeIn delay={150}>
              <h2 className="font-headline text-4xl sm:text-5xl leading-tight sticky top-32">{content.title}</h2>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="font-body text-on-surface-variant text-lg leading-relaxed mt-6">{content.subtitle}</p>
            </FadeIn>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.signals.map((signal, i) => (
              <FadeIn key={i} delay={i * 100} className="group flex gap-5 p-6 bg-surface-container-low border border-outline-variant/10 rounded-xl hover:border-primary/20 hover:bg-surface-container transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <span className="material-symbols-outlined text-primary text-xl">{signal.icon}</span>
                </div>
                <div>
                  <h4 className="font-headline text-lg mb-1.5 group-hover:text-primary transition-colors duration-300">{signal.title}</h4>
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed">{signal.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
