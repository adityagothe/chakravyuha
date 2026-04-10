export interface CityData {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export type Locale = 'en' | 'hi' | 'kn';

// ─── Section Content Types ─────────────────────────────────────────

export interface LGContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  story: {
    title: string;
    paragraphs: string[];
    quote: string;
  };
  services: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  approach: {
    title: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  impact: {
    title: string;
    stats: Array<{
      value: string;
      label: string;
      description: string;
      span?: 1 | 2;
    }>;
  };
  target: {
    title: string;
    categories: Array<{
      title: string;
      subtitle: string;
      imageSrc: string;
      imageAlt: string;
      span?: 1 | 2;
      aspectRatio?: 'video' | 'square';
    }>;
  };
  whyUs: {
    title: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
  visibilityTool: {
    label: string;
    title: string;
    subtitle: string;
    cityLabel: string;
    cityPlaceholder: string;
    businessLabel: string;
    businessPlaceholder: string;
    buttonText: string;
    resultLabels: {
      scoreHigh: string;
      scoreMedium: string;
      scoreLow: string;
      issuesTitle: string;
      suggestionsTitle: string;
      checkAgain: string;
      noIssues: string;
      planCta: string;
      planCtaSecondary: string;
      // Real search result labels
      googleMapsFound: string;
      googleMapsNotFound: string;
      webPresenceTitle: string;
      directoriesTitle: string;
      socialMediaTitle: string;
      districtFameTitle: string;
      fameUnknown: string;
      fameEmerging: string;
      fameKnown: string;
      fameFamous: string;
      fameLegendary: string;
      realDataBadge: string;
      fallbackBadge: string;
    };
    searchStepTitles: {
      location: string;
      google: string;
      directories: string;
      web: string;
      reviews: string;
      compilation: string;
    };
  };
  servicesDeepDive: {
    label: string;
    title: string;
    subtitle: string;
    categories: Array<{
      icon: string;
      title: string;
      description: string;
      features: string[];
    }>;
  };
  education: {
    label: string;
    title: string;
    subtitle: string;
    steps: Array<{
      number: string;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  pricing: {
    label: string;
    title: string;
    subtitle: string;
    plans: Array<{
      tier: 'basic' | 'growth' | 'pro';
      title: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      ctaText: string;
      highlighted?: boolean;
      badge?: string;
    }>;
  };
  localTrust: {
    label: string;
    title: string;
    subtitle: string;
    signals: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  faq: {
    label: string;
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  brandStory: {
    label: string;
    title: string;
    paragraphs: string[];
    signature: string;
  };
  contact: {
    label: string;
    title: string;
    subtitle: string;
    fields: {
      name: string;
      email: string;
      phone: string;
      message: string;
    };
    placeholders: {
      name: string;
      email: string;
      phone: string;
      message: string;
    };
    submitText: string;
    submittingText: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
    whatsappText: string;
    orText: string;
  };
  cta: {
    title: string;
    buttonText: string;
  };
  stickyCta: {
    text: string;
  };
  footer: {
    copyright: string;
    links: {
      music: string;
      projects: string;
      about: string;
      contact: string;
    };
  };
}

// ─── Functional State Types ────────────────────────────────────────

export type VisibilityStatus = 'idle' | 'loading' | 'success' | 'error';
export type VisibilityScore = 'low' | 'medium' | 'high';

export type SearchStepStatus = 'pending' | 'running' | 'done';

export interface SearchStepLine {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  revealed: boolean;
}

export interface SearchStep {
  id: string;
  icon: string;
  title: string;
  lines: SearchStepLine[];
  status: SearchStepStatus;
}

export interface VisibilityCheck {
  category: string;
  icon: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
  link?: string;
}

// ─── Real Search Data Types ────────────────────────────────────────

export type DistrictFameLevel = 'unknown' | 'emerging' | 'known' | 'famous' | 'legendary';

export interface GoogleMapsData {
  found: boolean;
  rating?: number;
  reviewCount?: number;
  address?: string;
  types?: string[];
  website?: string;
  mapsUrl?: string;
}

export interface WebResultItem {
  title: string;
  link: string;
  snippet: string;
}

export interface WebPresenceData {
  totalResults: number;
  topResults: WebResultItem[];
}

export interface DirectoryPresence {
  justdial: boolean;
  indiamart: boolean;
  sulekha: boolean;
  yellowpages: boolean;
  other: string[];
}

export interface SocialMediaPresence {
  facebook: boolean;
  instagram: boolean;
  twitter: boolean;
  youtube: boolean;
}

export interface DistrictFame {
  searchResultCount: number;
  isWellKnown: boolean;
  fameLevel: DistrictFameLevel;
  fameSummary: string;
}

export interface RealSearchData {
  googleMaps: GoogleMapsData;
  webPresence: WebPresenceData;
  directories: DirectoryPresence;
  socialMedia: SocialMediaPresence;
  districtFame: DistrictFame;
  isRealData: true;
}

export interface VisibilityResult {
  score: number;
  scoreLabel: VisibilityScore;
  city: string;
  businessName: string;
  issues: string[];
  suggestions: string[];
  checks: VisibilityCheck[];
  recommendedPlan: 'basic' | 'growth' | 'pro';
  planReasons: string[];
  // Real data — present when API search succeeded
  realData?: RealSearchData;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}
