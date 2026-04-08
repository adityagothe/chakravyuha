'use client';

import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { cn } from '@/lib/utils';

interface Props { content: LGContent['pricing']; }

export function LGPricingSection({ content }: Props) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SectionWrapper id="pricing" bg="surface-container-low">
      <Container>
        <div className="text-center mb-16">
          <FadeIn delay={0}>
            <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
          </FadeIn>
          <FadeIn delay={150}>
            <h2 className="font-headline text-4xl sm:text-5xl mb-6">{content.title}</h2>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-xl mx-auto">{content.subtitle}</p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {content.plans.map((plan, i) => (
            <FadeIn key={i} delay={i * 100} className="h-full">
              <div className={cn(
                'relative flex flex-col h-full rounded-xl border p-8 md:p-10 transition-all duration-300',
                plan.highlighted
                  ? 'border-primary/40 bg-surface-container ring-1 ring-primary/20 shadow-[0_0_60px_-20px_rgba(233,195,73,0.2)] md:-mt-4 md:pb-14'
                  : 'border-outline-variant/15 bg-surface-container-lowest hover:border-outline-variant/30'
              )}>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="gold-gradient-bg text-on-primary text-[10px] font-label font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3">{plan.title}</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={cn('font-headline text-5xl', plan.highlighted ? 'text-primary' : 'text-on-surface')}>{plan.price}</span>
                    <span className="font-body text-on-surface-variant text-sm">{plan.period}</span>
                  </div>
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3.5 mb-10 flex-grow">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 font-body text-sm text-on-surface-variant">
                      <span
                        className={cn('material-symbols-outlined text-base mt-0.5 shrink-0', plan.highlighted ? 'text-primary' : 'text-on-surface-variant/60')}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToContact}
                  className={cn(
                    'w-full py-3.5 rounded font-label font-bold text-sm uppercase tracking-widest transition-all duration-200 active:scale-95',
                    plan.highlighted
                      ? 'gold-gradient-bg text-on-primary hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-10px_rgba(233,195,73,0.3)]'
                      : 'border border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50'
                  )}
                >
                  {plan.ctaText}
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
