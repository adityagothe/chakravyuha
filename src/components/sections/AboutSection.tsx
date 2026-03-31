import React from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionHeader } from '../ui/SectionHeader';
import NextImage from 'next/image';
import { MaterialIcon } from '../ui/MaterialIcon';
import { aboutContent } from '@/data/about';
import { siteConfig } from '@/data/site';

export function AboutSection() {
  const socials = [
    { icon: 'code', label: 'GitHub', href: siteConfig.socials.github },
    { icon: 'work', label: 'LinkedIn', href: siteConfig.socials.linkedin },
    { icon: 'alternate_email', label: 'Twitter', href: siteConfig.socials.twitter },
  ];

  return (
    <section id="about" className="py-20 md:py-32 px-6 md:px-12 bg-surface min-h-screen flex items-center">
      <div className="max-w-[1400px] mx-auto w-full">
        <FadeIn>
          <SectionHeader
            label={aboutContent.label}
            title={aboutContent.heading}
            className="mb-16 md:mb-20"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Portrait */}
          <FadeIn direction="right" delay={100} className="md:col-span-4 relative flex items-center justify-center">
            {/* Keeping relative w-full but aspect-[3/4] using Next.js fill to match natural portrait image ratio without extreme cropping */}
            <div className="relative w-full max-w-[400px] aspect-[8/11] rounded-xl overflow-hidden border border-outline-variant/20 shadow-2xl group mx-auto">
              <NextImage
                src="/images/potrait.png"
                alt="Portrait"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Accent border glow */}
              <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-colors duration-700 pointer-events-none" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 md:-right-6 w-24 h-24 border border-primary/10 rounded-xl -z-10 bg-primary/5" />
            <div className="absolute -top-4 -left-4 md:-left-6 w-16 h-16 border border-secondary-container/10 rounded-xl -z-10 bg-secondary-container/5" />
          </FadeIn>


          {/* Bio Content */}
          <FadeIn direction="left" delay={200} className="md:col-span-8 flex flex-col gap-8">
            {aboutContent.paragraphs.map((paragraph, i) => (
              <p key={i} className="font-body text-base md:text-lg text-neutral-300 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {/* Resume Download */}
            <div className="pt-2">
              <a
                href="/resume.pdf"
                download
                id="download-resume"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg gold-gradient-bg text-on-primary font-label font-bold uppercase tracking-widest text-xs hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(233,195,73,0.35)] active:scale-95 transition-all duration-300"
              >
                <MaterialIcon name="download" size="sm" />
                Download Résumé
              </a>
              <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600 mt-2">
                PDF · Updated 2026
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social flex items-center gap-3 px-5 py-3 rounded-lg border border-outline-variant/15 bg-surface-container/50 hover:border-primary/30 hover:bg-surface-container transition-all duration-300"
                >
                  <MaterialIcon
                    name={social.icon}
                    size="lg"
                    className="text-neutral-500 group-hover/social:text-primary transition-colors"
                  />
                  <span className="font-label text-xs uppercase tracking-widest text-neutral-500 group-hover/social:text-neutral-300 transition-colors">
                    {social.label}
                  </span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
