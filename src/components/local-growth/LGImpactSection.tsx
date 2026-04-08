import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { StatCard } from '../ui/StatCard';

interface LGImpactSectionProps {
  content: LGContent['impact'];
}

export function LGImpactSection({ content }: LGImpactSectionProps) {
  return (
    <SectionWrapper id="impact">
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4">
          <FadeIn delay={0}>
            <h2 className="font-headline text-4xl sm:text-5xl sticky top-32 leading-tight">{content.title}</h2>
          </FadeIn>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {content.stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              span={stat.span}
              delay={index * 150 + 150}
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
