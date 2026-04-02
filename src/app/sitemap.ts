import { MetadataRoute } from 'next';
import { getProjectSlugs } from '@/data/projects';

const BASE_URL = 'https://chakravyuha-aditya-gothe.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const projectSlugs = getProjectSlugs();

  const projectRoutes = projectSlugs.flatMap((slug) => [
    {
      url: `${BASE_URL}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects/${slug}/download`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]);

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/music`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/art`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...projectRoutes,
  ];
}
