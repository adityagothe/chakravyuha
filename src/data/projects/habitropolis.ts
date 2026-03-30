import { Project } from '@/types/project';

export const habitropolis: Project = {
  id: '01',
  name: 'Habitropolis',
  slug: 'habitropolis',
  tagline: 'Build your city through habits',
  description:
    'A habit tracker where users grow a digital sovereign city and take care of a mascot named Parth the Tiger. Discipline becomes architecture.',
  status: 'live',
  category: 'app',
  platforms: ['android', 'web'],
  categoryLabel: 'Gamified Productivity',
  coverImage: null,
  screenshots: [
    { image: null, gridSpan: 2, gridRowSpan: 2, caption: 'City skyline' },
    { image: null, gridSpan: 1, gridRowSpan: 1, caption: 'Progress rings' },
    { image: null, gridSpan: 1, gridRowSpan: 2, caption: 'Parth the Tiger' },
    { image: null, gridSpan: 1, gridRowSpan: 1, caption: 'Neural pathways' },
  ],
  icon: null,
  colorAccent: '#e9c349',
  features: [
    {
      icon: 'pets',
      title: 'Mascot care',
      description:
        'Bond with Parth the Tiger. Your progress fuels his vitality. A well-maintained habit streak ensures your companion thrives within the digital fortress.',
      sortOrder: 1,
    },
    {
      icon: 'location_city',
      title: 'City growth mechanics',
      description:
        'Every task completed constructs another layer of your sovereign domain. Watch your skyline evolve from a singular monolith into a sprawling high-tech metropolis.',
      sortOrder: 2,
    },
    {
      icon: 'trending_up',
      title: 'Streak-based progression',
      description:
        'Consistency is the ultimate weapon. High-tier architecture and rare aesthetic unlocks are reserved only for those who maintain unbroken command over their routines.',
      sortOrder: 3,
    },
  ],
  downloads: {
    apkUrl: 'https://github.com/aditya-gothe/habitropolis/releases/download/v1.2.0/habitropolis-v1.2.0.apk',
    githubReleaseUrl: 'https://github.com/aditya-gothe/habitropolis/releases/tag/v1.2.0',
    sourceCodeUrl: 'https://github.com/aditya-gothe/habitropolis',
    version: '1.2.0',
    versionCode: 12,
    releaseDate: '2026-03-15T00:00:00Z',
    releaseNotes: "• Fixed streak calculation bug\n• New building type: Observatory\n• Performance improvements",
    fileSize: '24.5 MB',
    minAndroidVersion: 'Android 8.0+',
    sha256Checksum: 'a1b2c3d4e5f6g7h8i9j0',
  },
  mascot: {
    name: 'Parth',
    species: 'Tiger',
    description: 'Digital companion whose vitality thrives on consistency',
  },
  techStack: ['React Native', 'Expo', 'SQLite'],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-03-15T00:00:00Z',
  sortOrder: 1,
  metaTitle: 'Habitropolis — Gamified Habit Tracker',
  metaDescription: 'Build your city through habits with Habitropolis, a visually stunning gamified productivity app.',
};
