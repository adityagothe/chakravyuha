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
    inputPlaceholder: string;
    buttonText: string;
    loadingText: string;
    resultLabels: {
      scoreHigh: string;
      scoreMedium: string;
      scoreLow: string;
      issuesTitle: string;
      suggestionsTitle: string;
      checkAgain: string;
      noIssues: string;
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

export interface VisibilityResult {
  score: VisibilityScore;
  issues: string[];
  suggestions: string[];
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
