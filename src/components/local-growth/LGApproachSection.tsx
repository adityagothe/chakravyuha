import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { StepItem } from '../ui/StepItem';

interface LGApproachSectionProps {
  content: LGContent['approach'];
}

export function LGApproachSection({ content }: LGApproachSectionProps) {
  return (
    <SectionWrapper id="approach" bg="surface-container-lowest">
      <Container>
        <FadeIn delay={0}>
          <h2 className="font-headline text-4xl sm:text-5xl mb-24">{content.title}</h2>
        </FadeIn>
        <div className="flex flex-col md:flex-row items-start gap-12 relative">
          <div className="hidden md:block absolute top-10 left-0 w-full h-[1px] bg-outline-variant/20 -z-0">
            <div className="h-full w-1/3 bg-gradient-to-r from-primary/50 to-transparent"></div>
          </div>
          {content.steps.map((step, index) => (
            <StepItem
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={index * 200}
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
