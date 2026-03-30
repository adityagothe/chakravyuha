import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '../ui/SectionHeader';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';
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
    <section id="about" className="py-32 px-6 md:px-12 bg-surface min-h-screen flex items-center">
      <div className="max-w-[1400px] mx-auto w-full">
        <SectionHeader
          label={aboutContent.label}
          title={aboutContent.heading}
          className="mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Portrait */}
          <div className="md:col-span-5 relative">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-outline-variant/20 group">
              <ImagePlaceholder
                label="Portrait"
                icon="person"
                accentColor="#e9c349"
                className="rounded-none"
              />

              {/* Accent border glow */}
              <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-colors duration-700" />
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-primary/10 rounded-xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 border border-secondary-container/10 rounded-xl -z-10" />
          </div>

          {/* Bio Content */}
          <div className="md:col-span-7 flex flex-col gap-8">
            {aboutContent.paragraphs.map((paragraph, i) => (
              <p key={i} className="font-body text-lg text-neutral-300 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
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
          </div>
        </div>
      </div>
    </section>
  );
}
