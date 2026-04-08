import { VisibilityResult, VisibilityScore } from '@/types/local-growth';

const HIGH_SCORE_ISSUES: string[] = [];
const HIGH_SCORE_SUGGESTIONS = [
  'Add more photos to your Google Business Profile.',
  'Respond to all customer reviews to boost engagement.',
  'Update your business hours for holidays.',
];

const MEDIUM_SCORE_ISSUES = [
  'Your Google Business Profile may be incomplete.',
  'No customer reviews found or reviews are limited.',
];
const MEDIUM_SCORE_SUGGESTIONS = [
  'Verify your business on Google Maps.',
  'Add your business to local directories like Justdial and Sulekha.',
  'Start collecting customer reviews via WhatsApp.',
  'Add high-quality photos of your products/services.',
];

const LOW_SCORE_ISSUES = [
  'Business not found in Google local search.',
  'No Google Business Profile detected.',
  'Missing from local directories.',
  'No visible online reviews or ratings.',
];
const LOW_SCORE_SUGGESTIONS = [
  'Create a Google Business Profile immediately — it\'s free.',
  'Add your business to Google Maps with accurate NAP (Name, Address, Phone).',
  'Set up a basic presence on Justdial and IndiaMART.',
  'Ask your existing customers to leave Google reviews.',
  'Post regular updates and offers on your GBP listing.',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getScore(name: string): VisibilityScore {
  const hash = hashString(name.toLowerCase().trim());
  const bucket = hash % 10;
  if (bucket <= 2) return 'high';
  if (bucket <= 6) return 'medium';
  return 'low';
}

export async function checkBusinessVisibility(businessName: string): Promise<VisibilityResult> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const score = getScore(businessName);

  const resultMap: Record<VisibilityScore, VisibilityResult> = {
    high: { score: 'high', issues: HIGH_SCORE_ISSUES, suggestions: HIGH_SCORE_SUGGESTIONS },
    medium: { score: 'medium', issues: MEDIUM_SCORE_ISSUES, suggestions: MEDIUM_SCORE_SUGGESTIONS },
    low: { score: 'low', issues: LOW_SCORE_ISSUES, suggestions: LOW_SCORE_SUGGESTIONS },
  };

  return resultMap[score];
}
