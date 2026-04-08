import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { FeatureBlock } from '../ui/FeatureBlock';

interface LGWhyUsSectionProps {
  content: LGContent['whyUs'];
}

export function LGWhyUsSection({ content }: LGWhyUsSectionProps) {
  return (
    <SectionWrapper id="why-us">
      <Container>
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3">
            <FadeIn delay={0}>
              <h2 className="font-headline text-4xl sm:text-5xl sticky top-32">{content.title}</h2>
            </FadeIn>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-x-12 sm:gap-y-16">
            {content.features.map((feature, index) => (
              <FeatureBlock
                key={index}
                title={feature.title}
                description={feature.description}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
