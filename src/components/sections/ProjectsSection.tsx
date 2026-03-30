import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { ProjectCard } from '../project/ProjectCard';
import { ComingSoonCard } from '../project/ComingSoonCard';
import { getAllProjects } from '@/data/projects';
import { comingSoonPlaceholder } from '@/data/projects/_coming-soon';

export function ProjectsSection() {
  const projects = getAllProjects();

  return (
    <section id="projects" className="py-32 px-6 md:px-12 bg-surface-container-low min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeader
          label="Portfolio"
          title="Active Layers"
          description="Forging digital artifacts that combine narrative depth with functional excellence."
          className="mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              // First project is large (8 col), others are small (4 col) depending on design
              variant={index === 0 ? 'large' : 'small'}
              className={index === 0 ? 'md:col-span-8' : 'md:col-span-4'}
            />
          ))}

          {/* Render the coming soon card crossing the full width */}
          <ComingSoonCard className="md:col-span-12" title={comingSoonPlaceholder.name!} subtitle={comingSoonPlaceholder.tagline!} />
        </div>
      </div>
    </section>
  );
}
