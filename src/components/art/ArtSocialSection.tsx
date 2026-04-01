import React from 'react';
import { siteConfig } from '@/data/site';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

const socialLinks = [
  {
    id: 'youtube',
    label: 'YouTube',
    href: siteConfig.socials.youtubePersonal,
    icon: 'play_circle',
    description: 'Watch the process',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: siteConfig.socials.instagram,
    icon: 'photo_camera',
    description: 'Follow the journey',
  },
];

export function ArtSocialSection() {
  return (
    <section
      className="px-6 md:px-12 py-24 bg-surface border-t border-outline-variant/10"
      aria-label="Follow the artist on social media"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        {/* Label */}
        <span className="font-label text-neutral-600 uppercase tracking-[0.4em] text-[10px]">
          Follow the Artist
        </span>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              id={`art-social-${link.id}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 transition-all duration-300"
              aria-label={`Follow on ${link.label}`}
            >
              <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-110">
                <MaterialIcon
                  name={link.icon}
                  size="xl"
                  className="text-primary"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <span className="font-label text-[9px] text-neutral-700 group-hover:text-neutral-500 transition-colors">
                  {link.description}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
