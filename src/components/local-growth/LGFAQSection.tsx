import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { Accordion } from '../ui/Accordion';

interface Props { content: LGContent['faq']; }

export function LGFAQSection({ content }: Props) {
  return (
    <SectionWrapper id="faq" bg="surface-container-lowest">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <FadeIn delay={0}>
              <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
            </FadeIn>
            <FadeIn delay={150}>
              <h2 className="font-headline text-4xl sm:text-5xl leading-tight sticky top-32">{content.title}</h2>
            </FadeIn>
          </div>
          <FadeIn delay={200} className="lg:col-span-8">
            <Accordion items={content.items} />
          </FadeIn>
        </div>
      </Container>
    </SectionWrapper>
  );
}
