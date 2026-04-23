import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FadeIn } from '@/components/ui/FadeIn';
import { siteConfig } from '@/data/site';

const founderData = {
  name: 'Aditya Gothe',
  title: 'Founder & CEO, Vajravyuha',
  tagline: 'Dharma Rakshati Rakshitah',
  bio: [
    {
      heading: 'The Architect Behind Vajravyuha',
      text: 'Aditya Gothe is an Indian entrepreneur, full-stack developer, patriotic musical artist, and 3D game designer — born on January 29, 2007, in India. He is the Founder and CEO of Vajravyuha, a digital studio headquartered in Bijapur, Karnataka, that helps small businesses grow online, showcases emerging art, distributes music, and serves as the primary hub for his ever-expanding portfolio of software projects.',
    },
    {
      heading: 'A Foundation Built on Discipline',
      text: "Aditya is a proud alumnus of Sainik School Bijapur, Karnataka (2017–2024), where years of rigorous discipline, leadership training, and national pride shaped his worldview. He currently pursues a BTech degree at BLDEA's College of Engineering & Technology, Bijapur. The ethos of the Sainik School — sacrifice, service, and precision — runs through everything he builds and creates. His personal philosophy, \"Dharma Rakshati Rakshitah\" (Dharma protects those who uphold it), is woven into the fabric of every venture he undertakes.",
    },
    {
      heading: 'Music for the Nation — Two Stars HQ',
      text: 'Aditya Gothe is known across India\'s defense aspirant community as the artist behind Two Stars HQ, a YouTube channel and musical brand dedicated to the journey of service. His breakout single "Two Stars Rising" captures the grueling path of an Indian Army aspirant — from cracking the NDA exam to surviving the SSB interview and earning the coveted commission. His follow-up, "Heart On Duty" (late 2025), deepened his signature theme of national pride, sacrifice, and perseverance. His music is not entertainment — it is a movement for every cadet who dares to dream in uniform.',
    },
    {
      heading: 'Engineering the Future — Apps, Games & Fintech',
      text: "Aditya refuses to be defined by a single lane. As a full-stack developer working with React, React Native, Node.js, and Supabase, he has shipped production-grade fintech applications including Vittora and Udharo, alongside the acclaimed productivity platform Habitropolis. He is also a 3D artist currently building a 2D RPG inspired by Indian mythology — merging visual storytelling with game design. His work has attracted international clients, and he regularly contributes expert research insights to leading companies worldwide.",
    },
    {
      heading: 'What is Vajravyuha?',
      text: 'Vajravyuha — accessible at vajravyuha.in — is Aditya\'s sovereign digital studio. Named after the impenetrable battle formation of ancient Indian warfare, it embodies the same precision and strength. Through Vajravyuha, Aditya helps small Indian businesses gain real visibility online via Google Maps, local SEO, and digital directories. The platform also hosts the art of his sister, an emerging visual artist, and serves as the primary download gateway for all his software projects and music releases. Vajravyuha is, above all, the most authentic way to understand, engage, and collaborate with Aditya Gothe.',
    },
  ],
  milestones: [
    { year: '2007', event: 'Born, January 29' },
    { year: '2017', event: 'Enrolled at Sainik School Bijapur' },
    { year: '2024', event: 'Graduated from Sainik School Bijapur' },
    { year: '2024', event: 'Founded Vajravyuha' },
    { year: '2025', event: 'Released "Two Stars Rising"' },
    { year: '2025', event: 'Launched Habitropolis, Vittora & Udharo' },
    { year: '2025', event: 'Released "Heart On Duty"' },
    { year: '2026', event: 'Serving international clients globally' },
  ],
  socials: [
    { icon: 'code', label: 'GitHub', href: siteConfig.socials.github },
    { icon: 'work', label: 'LinkedIn', href: siteConfig.socials.linkedin },
    { icon: 'photo_camera', label: 'Instagram', href: siteConfig.socials.instagram },
    { icon: 'play_circle', label: 'YouTube', href: siteConfig.socials.youtubePersonal },
    { icon: 'brand_awareness', label: 'Spotify', href: siteConfig.socials.spotify },
  ],
};

export default function FounderPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero Section */}
        <section
          id="founder-hero"
          aria-label="Aditya Gothe — Founder & CEO of Vajravyuha"
          className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 md:px-12 bg-surface overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary rounded-full blur-[220px] opacity-[0.06]" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-20 items-center">
            {/* Portrait */}
            <FadeIn direction="right" delay={80} className="md:col-span-4 flex items-center justify-center">
              <div className="relative w-full max-w-[360px] aspect-[8/11] rounded-xl overflow-hidden border border-outline-variant/20 shadow-2xl group mx-auto">
                <NextImage
                  src="/images/portrait.png"
                  alt="Portrait of Aditya Gothe — Founder & CEO of Vajravyuha"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 90vw, 33vw"
                />
                <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-colors duration-700 pointer-events-none" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 md:-right-6 w-24 h-24 border border-primary/10 rounded-xl -z-10 bg-primary/5" />
              <div className="absolute -top-4 -left-4 md:-left-6 w-16 h-16 border border-secondary-container/10 rounded-xl -z-10 bg-secondary-container/5" />
            </FadeIn>

            {/* Identity Block */}
            <FadeIn direction="left" delay={160} className="md:col-span-8 flex flex-col gap-6">
              <span className="font-label text-primary uppercase tracking-[0.4em] text-xs">
                Founder &amp; CEO — Vajravyuha
              </span>

              <h1 className="font-headline text-[clamp(2.8rem,8vw,6rem)] font-extrabold tracking-tighter text-on-surface leading-none">
                Aditya{' '}
                <span className="gold-gradient-text">Gothe</span>
              </h1>

              <p className="font-headline text-lg sm:text-xl md:text-2xl italic text-on-surface-variant">
                &ldquo;{founderData.tagline}&rdquo;
              </p>

              <p className="font-body text-base md:text-lg text-neutral-300 leading-relaxed max-w-2xl">
                Indian entrepreneur, full-stack developer, patriotic musical artist, 3D game
                designer, and Founder &amp; CEO of{' '}
                <Link href="/" className="text-primary hover:underline">
                  Vajravyuha
                </Link>
                . Alumnus of Sainik School Bijapur. Building systems, apps, and music — layer by layer.
              </p>

              {/* Socials */}
              <div className="flex flex-wrap gap-3 pt-2">
                {founderData.socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Aditya Gothe on ${social.label}`}
                    className="group/social flex items-center gap-3 px-5 py-3 rounded-lg border border-outline-variant/15 bg-surface-container/50 hover:border-primary/30 hover:bg-surface-container transition-all duration-300"
                  >
                    <span
                      className="material-symbols-outlined text-[20px] text-neutral-500 group-hover/social:text-primary transition-colors"
                      style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                    >
                      {social.icon}
                    </span>
                    <span className="font-label text-xs uppercase tracking-widest text-neutral-500 group-hover/social:text-neutral-300 transition-colors">
                      {social.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/#contact"
                  id="founder-contact-cta"
                  className="gold-gradient-bg text-on-primary px-8 py-4 rounded-lg font-label font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:shadow-[0_10px_30px_-10px_rgba(233,195,73,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                  >
                    send
                  </span>
                  Work With Me
                </Link>
                <Link
                  href="/#projects"
                  id="founder-projects-cta"
                  className="border border-primary/20 text-primary px-8 py-4 rounded-lg font-label font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}
                  >
                    deployed_code
                  </span>
                  See My Work
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Bio Deep-Dive */}
        <section
          id="founder-bio"
          aria-label="Biography of Aditya Gothe"
          className="py-20 md:py-28 px-6 md:px-12 bg-surface-container-low"
        >
          <div className="max-w-[900px] mx-auto w-full flex flex-col gap-16">
            <FadeIn>
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px flex-1 bg-outline-variant/20" />
                <span className="font-label text-primary/70 uppercase tracking-[0.4em] text-[10px]">
                  The Full Story
                </span>
                <div className="h-px flex-1 bg-outline-variant/20" />
              </div>
            </FadeIn>

            {founderData.bio.map((section, i) => (
              <FadeIn key={i} delay={i * 60}>
                <article className="flex flex-col gap-4">
                  <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
                    {section.heading}
                  </h2>
                  <p className="font-body text-base md:text-lg text-neutral-300 leading-relaxed">
                    {section.text}
                  </p>
                </article>
                {i < founderData.bio.length - 1 && (
                  <div className="mt-12 h-px bg-outline-variant/10" />
                )}
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Timeline / Milestones */}
        <section
          id="founder-milestones"
          aria-label="Aditya Gothe milestones timeline"
          className="py-20 md:py-28 px-6 md:px-12 bg-surface"
        >
          <div className="max-w-[900px] mx-auto w-full">
            <FadeIn>
              <span className="font-label text-primary uppercase tracking-[0.4em] text-xs mb-4 block">
                Milestones
              </span>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-14">
                The Journey So Far
              </h2>
            </FadeIn>

            <div className="relative flex flex-col gap-0">
              {/* Vertical line */}
              <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-outline-variant/15 hidden sm:block" />

              {founderData.milestones.map((m, i) => (
                <FadeIn key={i} delay={i * 50}>
                  <div className="relative flex items-start gap-6 sm:gap-10 pb-10">
                    {/* Year */}
                    <div className="w-20 shrink-0 text-right">
                      <span className="font-label text-primary text-sm font-bold tracking-wider">
                        {m.year}
                      </span>
                    </div>
                    {/* Dot */}
                    <div className="relative z-10 hidden sm:flex items-center justify-center w-3 h-3 mt-1 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-surface" />
                    </div>
                    {/* Event */}
                    <p className="font-body text-base text-neutral-300 leading-snug pt-0.5">
                      {m.event}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Author / Contact Strip */}
        <section
          id="founder-contact"
          aria-label="Contact Aditya Gothe"
          className="py-16 px-6 md:px-12 bg-surface-container-low border-t border-outline-variant/10"
        >
          <FadeIn>
            <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <span className="font-headline text-xl font-bold text-on-surface">
                  Aditya Gothe
                </span>
                <span className="font-label text-xs uppercase tracking-widest text-neutral-500">
                  Founder &amp; CEO — Vajravyuha · Bijapur, Karnataka, India
                </span>
              </div>
              <Link
                href="/#contact"
                id="founder-bottom-cta"
                className="gold-gradient-bg text-on-primary px-8 py-4 rounded-lg font-label font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:shadow-[0_10px_30px_-10px_rgba(233,195,73,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  send
                </span>
                Get In Touch
              </Link>
            </div>
          </FadeIn>
        </section>

        {/* Page-specific Person JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              '@id': 'https://vajravyuha.in/founder',
              'url': 'https://vajravyuha.in/founder',
              'name': 'Aditya Gothe — Founder & CEO of Vajravyuha',
              'about': {
                '@type': 'Person',
                '@id': 'https://vajravyuha.in/#person',
                'name': 'Aditya Gothe',
                'alternateName': ['Aditya', 'Gothe', 'Gote', 'Ghost5400', '5400'],
                'jobTitle': 'CEO and Founder, Vajravyuha',
                'worksFor': {
                  '@type': 'Organization',
                  '@id': 'https://vajravyuha.in/#organization',
                  'name': 'Vajravyuha',
                  'url': 'https://vajravyuha.in',
                },
                'image': 'https://vajravyuha.in/images/portrait.png',
                'url': 'https://vajravyuha.in/founder',
                'email': 'mailto:vajra.vyuha.official@gmail.com',
                'description':
                  'Aditya Gothe is the CEO and Founder of Vajravyuha from Vijayapura, Karnataka, India. He is a BTech student, full-stack software developer, game developer, and verified music artist with releases including Two Stars Rising and Heart On Duty.',
                'nationality': 'Indian',
                'birthDate': '2007-01-29',
                'address': {
                  '@type': 'PostalAddress',
                  'addressLocality': 'Vijayapura',
                  'addressRegion': 'Karnataka',
                  'addressCountry': 'IN',
                },
                'alumniOf': [
                  {
                    '@type': 'EducationalOrganization',
                    'name': 'Sainik School Bijapur',
                    'address': {
                      '@type': 'PostalAddress',
                      'addressRegion': 'Karnataka',
                      'addressCountry': 'IN',
                    },
                  },
                  {
                    '@type': 'EducationalOrganization',
                    'name': "BLDEA's College of Engineering & Technology",
                    'address': {
                      '@type': 'PostalAddress',
                      'addressLocality': 'Bijapur',
                      'addressCountry': 'IN',
                    },
                  },
                ],
                'sameAs': [
                  'https://github.com/Ghost5400',
                  'https://www.linkedin.com/in/aditya-gothe-626352383/',
                  'https://www.instagram.com/ascend.with.adi/',
                  'https://youtube.com/@ascend-with-adi',
                  'https://open.spotify.com/artist/7y9XCzNr4SgPxSV4cGt3kz',
                  'https://music.apple.com/in/artist/aditya-gothe/1807868168',
                ],
              },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
