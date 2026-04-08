import { LGContent } from '@/types/local-growth';

export const contentEN: LGContent = {
  meta: {
    title: 'Local Growth | The Sovereign Archive',
    description: 'Chakravyuha helps local businesses get the visibility they deserve.',
  },
  hero: {
    label: 'Empowering local legacy',
    title: 'We Help Local ',
    titleHighlight: 'Businesses',
    subtitle: 'Chakravyuha is built to empower small businesses by improving how they appear, compete, and grow in today\'s digital world.',
    ctaPrimary: 'Start Growing',
    ctaSecondary: 'Explore Services',
  },
  story: {
    title: 'The Problem We\'re Solving',
    paragraphs: [
      'In every neighborhood, there are hidden gems—local craftsmen, dedicated restaurateurs, and expert service providers who form the backbone of our community.',
      'Yet, in the digital age, being "great" isn\'t enough. While global corporations dominate search results with massive budgets, local legacies remain unseen, trapped behind the limitations of simple word-of-mouth.',
      'We believe merit should dictate visibility, not just marketing spend. We are here to level the digital playing field.',
    ],
    quote: '"The finest tea in the city shouldn\'t be a secret."',
  },
  services: {
    title: 'How Chakravyuha Helps You Grow',
    items: [
      {
        icon: 'visibility',
        title: 'Visibility',
        description: 'We ensure your business appears exactly where your customers are searching, turning digital intent into physical footfall.',
      },
      {
        icon: 'campaign',
        title: 'Marketing',
        description: 'Simple, tailored strategies that don\'t require a tech degree. Effective communication designed for the real world.',
      },
      {
        icon: 'verified',
        title: 'Positioning',
        description: 'Building digital trust through authentic presentation, helping you stand out even against larger competitors.',
      },
    ],
  },
  approach: {
    title: 'Our Approach is Simple',
    steps: [
      { number: '01', title: 'Understand your business', description: 'We dive deep into what makes your service unique and who your real neighbors are.' },
      { number: '02', title: 'Improve your presence', description: 'Polishing your digital storefront to reflect the quality of your physical craft.' },
      { number: '03', title: 'Help you grow consistently', description: 'Implementing sustainable habits that ensure steady growth month after month.' },
    ],
  },
  impact: {
    title: 'What This Means for You',
    stats: [
      { value: '3x', label: 'More discovery', description: 'A significant increase in local search impressions and map discovery within your area.' },
      { value: '85%', label: 'Better trust', description: 'Enhanced reputation metrics through verified profiles and authentic customer engagement.' },
      { value: 'High-Intent', label: 'Increased inquiries', description: 'Moving beyond casual browsing to direct calls, bookings, and store visits from customers ready to purchase.', span: 2 },
    ],
  },
  target: {
    title: 'Built for Local Businesses',
    categories: [
      { title: 'Shops', subtitle: 'Boutiques, grocers, and specialty stores.', imageSrc: '/images/LG-shops.jpg', imageAlt: 'Artisanal grocery shop', span: 2, aspectRatio: 'video' },
      { title: 'Restaurants', subtitle: 'Cafes, bistros, and local kitchens.', imageSrc: '/images/LG-restaurants.jpg', imageAlt: 'Elegant restaurant interior', aspectRatio: 'square' },
      { title: 'Services', subtitle: 'Salons, repair shops, and clinics.', imageSrc: '/images/LG-services.jpg', imageAlt: 'Skilled craftsman at work', aspectRatio: 'square' },
    ],
  },
  whyUs: {
    title: 'Why Choose Us',
    features: [
      { title: 'Focused on small businesses', description: 'We don\'t chase corporate giants. Our tools and empathy are reserved for the independent spirit.' },
      { title: 'Practical & Results-Oriented', description: 'No abstract metrics. We measure success by the chime of your door and the growth of your revenue.' },
      { title: 'Built for real-world growth', description: 'Strategies that work in physical neighborhoods, not just on virtual screens.' },
      { title: 'Personalized approach', description: 'Every business has a soul. We ensure yours is felt in everything we do.' },
    ],
  },
  cta: {
    title: 'Your Business Should Not Stay Hidden',
    buttonText: 'Let\'s Grow Your Business',
  },
  footer: {
    copyright: '© 2024 The Sovereign Archive. All Rights Reserved.',
    links: {
      music: '/music',
      projects: '/#projects',
      about: '/#about',
      contact: '/#contact',
    }
  },
};
