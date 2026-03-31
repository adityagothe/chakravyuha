'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Project } from '@/types/project';
import { StatusBadge } from '../ui/StatusBadge';
import { MaterialIcon } from '../ui/MaterialIcon';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';

interface ProjectCardProps {
  project: Project;
  variant?: 'large' | 'small';
  className?: string;
}

export function ProjectCard({ project, variant = 'small', className }: ProjectCardProps) {
  const isLarge = variant === 'large';

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden transition-all duration-500',
        'bg-surface-container border border-outline-variant/10',
        'hover:border-primary/30 hover:shadow-[0_20px_60px_-15px_rgba(233,195,73,0.15)]',
        'hover:-translate-y-1',
        isLarge ? 'min-h-[480px]' : 'min-h-[400px]',
        className
      )}
    >
      {/* Cover Image Area */}
      <div className={cn('relative w-full aspect-video overflow-hidden')}>
        {project.coverImage ? (
          <img
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder
            label={project.name}
            icon="deployed_code"
            accentColor={project.colorAccent}
            className="rounded-none w-full h-full"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80" />

        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <StatusBadge status={project.status} />
        </div>

        {/* Category label */}
        <div className="absolute top-4 right-4">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-neutral-400 bg-surface/60 backdrop-blur-sm px-3 py-1 rounded-full">
            {project.categoryLabel}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col gap-4">
        <div>
          <h3 className={cn(
            'font-headline font-bold tracking-tight text-on-surface mb-2 transition-colors duration-300 group-hover:text-primary',
            isLarge ? 'text-3xl' : 'text-2xl'
          )}>
            {project.name}
          </h3>
          <p className="font-body text-neutral-400 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="font-label text-[10px] uppercase tracking-widest text-neutral-500 bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/10"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Features preview (large only) */}
        {isLarge && project.features.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {project.features.slice(0, 3).map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/5 transition-colors group-hover:border-primary/10"
              >
                <MaterialIcon
                  name={feature.icon}
                  size="xl"
                  className="text-primary/70 mb-2"
                />
                <span className="font-label text-[9px] uppercase tracking-wider text-neutral-500 leading-tight">
                  {feature.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-auto pt-4 border-t border-outline-variant/10">
          <Link
            href={`/projects/${project.slug}`}
            className="relative z-20 flex items-center justify-center gap-2 px-5 py-3 rounded border border-primary/20 text-primary font-label text-[10px] uppercase tracking-widest font-bold hover:bg-primary/5 hover:border-primary/40 active:scale-95 transition-all flex-1"
          >
            <MaterialIcon name="visibility" size="sm" />
            View Details
          </Link>
          <Link
            href={`/projects/${project.slug}/download`}
            className="relative z-20 flex items-center justify-center gap-2 px-5 py-3 rounded gold-gradient-bg text-on-primary font-label text-[10px] uppercase tracking-widest font-bold hover:shadow-[0_8px_24px_-8px_rgba(233,195,73,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all flex-1"
          >
            <MaterialIcon name="download" size="sm" />
            Download
          </Link>
        </div>
      </div>
    </div>
  );
}
