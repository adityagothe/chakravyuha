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
import { LGCtaSection } from '@/components/local-growth/LGCtaSection';
import { LGFooter } from '@/components/local-growth/LGFooter';
import { BackToTop } from '@/components/ui/BackToTop';
import Head from 'next/head';

export default function LocalGrowthPage() {
  const { locale } = useLanguage();
  const content = getContent(locale);

  // Set proper font families based on locale
  const mainClassname = locale === 'hi' 
    ? 'font-[-apple-system,var(--font-devanagari),var(--font-inter),sans-serif]' 
    : locale === 'kn' 
      ? 'font-[-apple-system,var(--font-kannada),var(--font-inter),sans-serif]' 
      : 'font-body';

  return (
    <div className={mainClassname}>
      <Head>
        <title>{content.meta.title}</title>
        <meta name="description" content={content.meta.description} />
      </Head>
      <LGNavbar />
      <main id="main-content">
        <LGHeroSection content={content.hero} />
        <LGStorySection content={content.story} />
        <LGServicesSection content={content.services} />
        <LGApproachSection content={content.approach} />
        <LGImpactSection content={content.impact} />
        <LGTargetSection content={content.target} />
        <LGWhyUsSection content={content.whyUs} />
        <LGCtaSection content={content.cta} />
      </main>
      <LGFooter content={content.footer} />
      <BackToTop />
    </div>
  );
}
