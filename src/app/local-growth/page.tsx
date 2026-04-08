'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { getContent } from '@/data/local-growth';
import { LGNavbar } from '@/components/local-growth/LGNavbar';
import { LGHeroSection } from '@/components/local-growth/LGHeroSection';
import { LGStorySection } from '@/components/local-growth/LGStorySection';
import { LGServicesSection } from '@/components/local-growth/LGServicesSection';
import { LGApproachSection } from '@/components/local-growth/LGApproachSection';
import { LGImpactSection } from '@/components/local-growth/LGImpactSection';
import { LGTargetSection } from '@/components/local-growth/LGTargetSection';
import { LGWhyUsSection } from '@/components/local-growth/LGWhyUsSection';
import { LGVisibilityToolSection } from '@/components/local-growth/LGVisibilityToolSection';
import { LGServicesDeepDiveSection } from '@/components/local-growth/LGServicesDeepDiveSection';
import { LGEducationSection } from '@/components/local-growth/LGEducationSection';
import { LGPricingSection } from '@/components/local-growth/LGPricingSection';
import { LGLocalTrustSection } from '@/components/local-growth/LGLocalTrustSection';
import { LGFAQSection } from '@/components/local-growth/LGFAQSection';
import { LGBrandStorySection } from '@/components/local-growth/LGBrandStorySection';
import { LGContactSection } from '@/components/local-growth/LGContactSection';
import { LGCtaSection } from '@/components/local-growth/LGCtaSection';
import { LGFooter } from '@/components/local-growth/LGFooter';
import { LGStickyCTA } from '@/components/local-growth/LGStickyCTA';
import { BackToTop } from '@/components/ui/BackToTop';

export default function LocalGrowthPage() {
  const { locale } = useLanguage();
  const content = getContent(locale);

  const fontClass =
    locale === 'hi' ? 'font-[var(--font-devanagari),var(--font-inter),sans-serif]'
    : locale === 'kn' ? 'font-[var(--font-kannada),var(--font-inter),sans-serif]'
    : 'font-body';

  return (
    <div className={fontClass}>
      <LGNavbar />
      <main id="main-content">
        <LGHeroSection content={content.hero} />
        <LGStorySection content={content.story} />
        <LGServicesSection content={content.services} />
        <LGApproachSection content={content.approach} />
        <LGImpactSection content={content.impact} />
        <LGTargetSection content={content.target} />
        <LGWhyUsSection content={content.whyUs} />
        <LGVisibilityToolSection content={content.visibilityTool} />
        <LGServicesDeepDiveSection content={content.servicesDeepDive} />
        <LGEducationSection content={content.education} />
        <LGPricingSection content={content.pricing} />
        <LGLocalTrustSection content={content.localTrust} />
        <LGFAQSection content={content.faq} />
        <LGBrandStorySection content={content.brandStory} />
        <LGContactSection content={content.contact} />
        <LGCtaSection content={content.cta} />
      </main>
      <LGFooter content={content.footer} />
      <LGStickyCTA content={content.stickyCta} />
      <BackToTop />
    </div>
  );
}
