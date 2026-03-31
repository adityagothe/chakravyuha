import React from 'react';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionHeader } from '@/components/ui/SectionHeader';

const skills = [
  {
    category: 'Mobile',
    icon: 'smartphone',
    items: ['React Native', 'Expo', 'Android SDK', 'React Navigation'],
  },
  {
    category: 'Frontend',
    icon: 'web',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    icon: 'dns',
    items: ['Node.js', 'Supabase', 'PostgreSQL', 'REST APIs'],
  },
  {
    category: 'Database',
    icon: 'storage',
    items: ['SQLite', 'PostgreSQL', 'Supabase', 'AsyncStorage'],
  },
  {
    category: 'Tooling',
    icon: 'build',
    items: ['Git', 'GitHub Actions', 'Vercel', 'VS Code'],
  },
  {
    category: 'Design',
    icon: 'palette',
    items: ['Figma', 'Material Design', 'UI/UX Principles', 'Dark Mode Systems'],
  },
];

const stats = [
  { value: '2+', label: 'Live Apps' },
  { value: '1K+', label: 'Lines Written' },
  { value: '3+', label: 'Tech Stacks' },
  { value: '∞', label: 'Systems Built' },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 md:py-32 px-6 md:px-12 bg-surface">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <SectionHeader
            label="Arsenal"
            title="The Technology Forge"
            description="A curated stack forged through real projects and sovereign systems."
            className="mb-16 md:mb-20"
          />
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={100} className="mb-16 md:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant/10 rounded-xl overflow-hidden border border-outline-variant/10">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-surface-container px-6 py-8 md:px-10 md:py-10 flex flex-col items-center text-center hover:bg-surface-container-high transition-colors duration-300"
              >
                <span
                  className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2"
                  style={{
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  {stat.value}
                </span>
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {skills.map((group, i) => (
            <FadeIn key={group.category} delay={i * 80} direction="up">
              <div className="group glass-panel rounded-xl border border-outline-variant/10 hover:border-primary/25 p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(233,195,73,0.08)]">
                {/* Icon + category */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-primary text-[22px]"
                      style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                    >
                      {group.icon}
                    </span>
                  </div>
                  <h3 className="font-label text-[11px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-primary transition-colors duration-300">
                    {group.category}
                  </h3>
                </div>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="font-label text-[11px] uppercase tracking-widest text-on-surface bg-surface-container-high border border-outline-variant/10 px-3 py-1.5 rounded-full hover:border-primary/30 hover:text-primary transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
