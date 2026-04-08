import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { BentoGridItem } from '../ui/BentoGridItem';

interface LGTargetSectionProps {
  content: LGContent['target'];
}

export function LGTargetSection({ content }: LGTargetSectionProps) {
  return (
    <SectionWrapper id="target" bg="surface-container">
      <Container>
        <FadeIn delay={0}>
          <h2 className="font-headline text-4xl sm:text-5xl mb-16 text-center">{content.title}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {content.categories.map((cat, index) => (
            <BentoGridItem
              key={index}
              title={cat.title}
              subtitle={cat.subtitle}
              imageSrc={cat.imageSrc}
              imageAlt={cat.imageAlt}
              span={cat.span}
              aspectRatio={cat.aspectRatio}
              delay={index * 200}
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
