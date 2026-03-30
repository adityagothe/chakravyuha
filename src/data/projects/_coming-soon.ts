import { Project } from '@/types/project';

// This is a partial mock for the UI component, not a real project entity
export const comingSoonPlaceholder: Partial<Project> = {
  id: '99',
  name: 'Project [REDACTED]',
  slug: 'redacted',
  tagline: 'A new layer is being built',
  status: 'coming_soon',
  categoryLabel: 'Neural Protocol',
  coverImage: null,
};
