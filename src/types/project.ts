export type ProjectStatus = 'live' | 'beta' | 'coming_soon' | 'archived';
export type ProjectCategory = 'app' | 'tool' | 'system' | 'experiment';
export type Platform = 'android' | 'ios' | 'web' | 'desktop' | 'cross_platform';

export interface Project {
  // === Identity ===
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;

  // === Classification ===
  status: ProjectStatus;
  category: ProjectCategory;
  platforms: Platform[];
  categoryLabel: string;

  // === Visual ===
  coverImage: ImageAsset | null; // null = show placeholder
  screenshots: Screenshot[];
  icon: ImageAsset | null;
  colorAccent: string; // Per-project accent hex

  // === Features ===
  features: Feature[];

  // === Distribution ===
  downloads: DownloadInfo;

  // === Metadata ===
  mascot?: MascotInfo;
  techStack?: string[];
  createdAt: string;
  updatedAt: string;
  sortOrder: number;

  // === SEO ===
  metaTitle: string;
  metaDescription: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Screenshot {
  image: ImageAsset | null;
  caption?: string;
  gridSpan: 1 | 2;
  gridRowSpan: 1 | 2;
}

export interface Feature {
  icon: string; // Material Symbols name
  title: string;
  description: string;
  sortOrder: number;
}

export interface DownloadInfo {
  apkUrl: string | null;
  githubReleaseUrl: string | null;
  sourceCodeUrl: string | null;
  version: string;
  versionCode: number;
  releaseDate: string;
  releaseNotes?: string;
  fileSize?: string;
  minAndroidVersion?: string;
  sha256Checksum?: string;
}

export interface MascotInfo {
  name: string;
  species: string;
  description: string;
  image?: ImageAsset | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
