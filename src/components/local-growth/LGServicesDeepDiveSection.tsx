import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';

interface Props { content: LGContent['servicesDeepDive']; }

export function LGServicesDeepDiveSection({ content }: Props) {
  return (
    <SectionWrapper id="services-deep-dive">
      <Container>
        <FadeIn delay={0}>
          <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
        </FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20">
          <FadeIn delay={150}>
            <h2 className="font-headline text-4xl sm:text-5xl max-w-sm leading-tight">{content.title}</h2>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="font-body text-on-surface-variant text-lg max-w-md leading-relaxed md:text-right">{content.subtitle}</p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/10 rounded-xl overflow-hidden ring-1 ring-outline-variant/10">
          {content.categories.map((cat, i) => (
            <FadeIn key={i} delay={i * 150} className="bg-surface-container hover:bg-surface-container-high transition-colors duration-300 group relative overflow-hidden flex flex-col">
              <div className="p-10 md:p-12 flex flex-col h-full">
                <span className="material-symbols-outlined text-3xl text-primary mb-6 block group-hover:scale-110 transition-transform duration-500 origin-left">{cat.icon}</span>
                <h3 className="font-headline text-2xl mb-3">{cat.title}</h3>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-8">{cat.description}</p>
                <ul className="space-y-3 mt-auto">
                  {cat.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 font-body text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full gold-gradient-bg transition-all duration-700 ease-out" />
            </FadeIn>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
