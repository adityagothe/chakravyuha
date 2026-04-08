import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';

interface Props { content: LGContent['brandStory']; }

export function LGBrandStorySection({ content }: Props) {
  return (
    <SectionWrapper id="brand-story" bg="surface-container-low">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4">
            <FadeIn delay={0}>
              <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
            </FadeIn>
            <FadeIn delay={150}>
              <h2 className="font-headline text-4xl sm:text-5xl leading-tight sticky top-32">{content.title}</h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-8 space-y-8">
            {content.paragraphs.map((p, i) => (
              <FadeIn key={i} delay={i * 150}>
                <p className={`font-body leading-relaxed text-on-surface-variant ${i === 0 ? 'text-xl md:text-2xl' : 'text-lg'}`}>{p}</p>
              </FadeIn>
            ))}
            <FadeIn delay={content.paragraphs.length * 150}>
              <p className="font-headline text-xl italic text-primary mt-6">{content.signature}</p>
            </FadeIn>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
