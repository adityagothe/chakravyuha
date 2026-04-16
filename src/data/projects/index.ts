import { Project } from '@/types/project';
import { habitropolis } from './habitropolis';
import { vittora } from './vittora';
import { udharo } from './udharo';
import { comingSoonPlaceholder } from './_coming-soon';

const allProjects: Project[] = [habitropolis, vittora, udharo];

export function getAllProjects(): Project[] {
  return allProjects.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getActiveProjects(): Project[] {
  return getAllProjects().filter((p) => p.status !== 'archived');
}

export function getProjectSlugs(): string[] {
  return allProjects.map((p) => p.slug);
}

export { habitropolis, vittora, udharo, comingSoonPlaceholder };
