import React from 'react';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionHeader } from '../ui/SectionHeader';
import { ProjectCard } from '../project/ProjectCard';
import { ComingSoonCard } from '../project/ComingSoonCard';
import { getAllProjects } from '@/data/projects';
import { comingSoonPlaceholder } from '@/data/projects/_coming-soon';

export function ProjectsSection() {
  const projects = getAllProjects();

  return (
    <section id="projects" className="py-20 md:py-32 px-6 md:px-12 bg-surface-container-low min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <SectionHeader
            label="Portfolio"
            title="Active Layers"
            description="Forging digital artifacts that combine narrative depth with functional excellence."
            className="mb-16 md:mb-20"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <FadeIn
              key={project.id}
              delay={index * 120}
              direction="up"
              className={index === 0 ? 'md:col-span-8' : 'md:col-span-4'}
            >
              <ProjectCard
                project={project}
                variant={index === 0 ? 'large' : 'small'}
                className="h-full"
              />
            </FadeIn>
          ))}

          <FadeIn delay={projects.length * 120} direction="up" className="md:col-span-12">
            <ComingSoonCard
              title={comingSoonPlaceholder.name!}
              subtitle={comingSoonPlaceholder.tagline!}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
