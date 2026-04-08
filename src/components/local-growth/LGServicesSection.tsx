import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';

interface LGServicesSectionProps {
  content: LGContent['services'];
}

export function LGServicesSection({ content }: LGServicesSectionProps) {
  return (
    <SectionWrapper id="services">
      <Container>
        <FadeIn delay={0}>
          <h2 className="font-headline text-4xl sm:text-5xl mb-20 text-center">{content.title}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 ring-1 ring-outline-variant/10 rounded-xl overflow-hidden bg-outline-variant/10">
          {content.items.map((item, index) => (
            <FadeIn key={index} delay={index * 150} className="h-full bg-surface-container hover:bg-surface-container-high transition-colors group relative overflow-hidden">
              <div className="p-10 md:p-12 flex flex-col h-full z-10 relative">
                <span className="material-symbols-outlined text-4xl text-primary mb-8 block group-hover:scale-110 group-hover:text-tertiary transition-transform duration-500 origin-left">{item.icon}</span>
                <h3 className="font-headline text-3xl mb-6">{item.title}</h3>
                <p className="text-on-surface-variant font-body leading-relaxed flex-grow">{item.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full gold-gradient-bg transition-all duration-700 ease-out z-20"></div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
