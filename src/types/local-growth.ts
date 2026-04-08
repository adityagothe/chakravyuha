export type Locale = 'en' | 'hi' | 'kn';

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
  cta: {
    title: string;
    buttonText: string;
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
