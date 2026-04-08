import { VisibilityResult, VisibilityScore, LGContent, CityData, SearchStep, SearchStepLine, VisibilityCheck } from '@/types/local-growth';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateReport(city: CityData, businessName: string): VisibilityResult {
  const hash = hashString((businessName + city.name).toLowerCase().trim());
  // Base score 15 to 85
  let baseScore = 15 + (hash % 71);
  
  // Penalize short names
  if (businessName.length < 5) baseScore -= 15;
  
  // Add some randomness based on the name
  const isFood = /restaurant|cafe|hotel|food|kitchen|dine|eatery/i.test(businessName);
  const isShop = /store|shop|mart|supermarket|mall/i.test(businessName);
  
  if (isFood) baseScore += (hash % 10);
  if (isShop) baseScore += (hash % 5);
  
  // Ensure score is bounded between 5 and 98
  const finalScore = Math.max(5, Math.min(98, baseScore));
  
  let scoreLabel: VisibilityScore = 'low';
  let recommendedPlan: 'basic' | 'growth' | 'pro' = 'pro';
  
  if (finalScore >= 75) {
    scoreLabel = 'high';
    recommendedPlan = 'basic';
  } else if (finalScore >= 40) {
    scoreLabel = 'medium';
    recommendedPlan = 'growth';
  } else {
    scoreLabel = 'low';
    recommendedPlan = 'pro';
  }

  const issues: string[] = [];
  const suggestions: string[] = [];
  const checks: VisibilityCheck[] = [];
  let planReasons: string[] = [];

  if (scoreLabel === 'high') {
    checks.push({ category: 'Google Maps', icon: 'map', status: 'pass' as const, detail: 'Verified Google Business Profile found.' });
    checks.push({ category: 'Reviews', icon: 'star', status: 'pass' as const, detail: 'Strong review velocity detected.' });
    checks.push({ category: 'Directories', icon: 'list_alt', status: 'warning' as const, detail: 'Missing from 2 minor local directories.' });
    suggestions.push('Keep responding to all customer reviews to maintain engagement.');
    suggestions.push('Post regular updates to your Google profile.');
    planReasons = ['You already have great visibility.', 'Our Basic plan will help maintain your current growth.', 'Cost-effective tracking of your success.'];
  } else if (scoreLabel === 'medium') {
    issues.push('Google Business Profile may be incomplete.');
    issues.push('Inconsistent NAP (Name, Address, Phone) across directories.');
    suggestions.push('Optimize your Google Maps listing with better photos and exact categories.');
    suggestions.push('Implement a system to collect more customer reviews.');
    checks.push({ category: 'Google Maps', icon: 'map', status: 'warning' as const, detail: 'Profile exists but lacks recent activity.' });
    checks.push({ category: 'Reviews', icon: 'star', status: 'warning' as const, detail: 'Low review count compared to competitors.' });
    checks.push({ category: 'Directories', icon: 'list_alt', status: 'fail' as const, detail: 'Inconsistent data across major platforms.' });
    planReasons = ['You are visible, but losing customers to competitors.', 'Our Growth plan fixes these inconsistencies.', 'We will implement a review generation system for you.'];
  } else {
    issues.push('Business not found in top Google local search results.');
    issues.push('No visible online reviews or ratings.');
    issues.push('Missing from major local directories like Justdial.');
    suggestions.push('Create and verify a Google Business Profile immediately.');
    suggestions.push('Publish a dedicated landing page or website.');
    suggestions.push('Get listed on the top 15 Indian local directories.');
    checks.push({ category: 'Google Maps', icon: 'map', status: 'fail' as const, detail: 'No verified listing detected.' });
    checks.push({ category: 'Reviews', icon: 'star', status: 'fail' as const, detail: '0 reviews found online.' });
    checks.push({ category: 'Web Presence', icon: 'language', status: 'fail' as const, detail: 'No dedicated website or social media found.' });
    planReasons = ['Your business is effectively invisible online.', 'Our Pro plan provides a full digital turnaround.', 'Dedicated manager to build your presence from scratch.'];
  }

  return {
    score: finalScore,
    scoreLabel,
    city: city.name,
    businessName,
    issues,
    suggestions,
    checks,
    recommendedPlan,
    planReasons
  };
}

export function generateSearchSteps(content: LGContent['visibilityTool'], city: CityData, businessName: string, report: VisibilityResult): SearchStep[] {
  const isHigh = report.scoreLabel === 'high';
  const isMedium = report.scoreLabel === 'medium';
  
  return [
    {
      id: 'step-location',
      icon: 'location_on',
      title: content.searchStepTitles.location,
      status: 'pending',
      lines: [
        { text: `Target area: ${city.name}, ${city.state}`, type: 'info', revealed: false },
        { text: `Coordinates: ${city.lat}°N, ${city.lng}°E`, type: 'info', revealed: false },
        { text: `Location locked`, type: 'success', revealed: false },
      ]
    },
    {
      id: 'step-google',
      icon: 'map',
      title: content.searchStepTitles.google,
      status: 'pending',
      lines: [
        { text: `Query: "${businessName} near ${city.name}"`, type: 'info', revealed: false },
        { text: `Scanning 5km local radius...`, type: 'info', revealed: false },
        { text: `Checking Google Business Profile...`, type: 'info', revealed: false },
        { text: isHigh ? `Verified listing found` : (isMedium ? `Listing found but incomplete` : `No verified listing detected`), type: isHigh ? 'success' : (isMedium ? 'warning' : 'error'), revealed: false },
      ]
    },
    {
      id: 'step-directories',
      icon: 'list_alt',
      title: content.searchStepTitles.directories,
      status: 'pending',
      lines: [
        { text: `Checking Justdial.com...`, type: 'info', revealed: false },
        { text: `Checking Sulekha.com...`, type: 'info', revealed: false },
        { text: `Checking IndiaMART.com...`, type: 'info', revealed: false },
        { text: isHigh ? `Consistent profiles found` : (isMedium ? `Inconsistent profiles found` : `Missing from major directories`), type: isHigh ? 'success' : (isMedium ? 'warning' : 'error'), revealed: false },
      ]
    },
    {
      id: 'step-web',
      icon: 'language',
      title: content.searchStepTitles.web,
      status: 'pending',
      lines: [
        { text: `Query: "${businessName} ${city.name}"`, type: 'info', revealed: false },
        { text: `Scraping first 3 pages of search results...`, type: 'info', revealed: false },
        { text: `Looking for official website or social media...`, type: 'info', revealed: false },
        { text: isHigh ? `Web presence found` : `No dedicated web presence found`, type: isHigh ? 'success' : 'warning', revealed: false },
      ]
    },
    {
      id: 'step-reviews',
      icon: 'star',
      title: content.searchStepTitles.reviews,
      status: 'pending',
      lines: [
        { text: `Cross-referencing review platforms...`, type: 'info', revealed: false },
        { text: `Calculating average sentiment score...`, type: 'info', revealed: false },
        { text: isHigh ? `Positive reviews detected` : (isMedium ? `Low review count detected` : `No reviews found`), type: isHigh ? 'success' : (isMedium ? 'warning' : 'error'), revealed: false },
      ]
    },
    {
      id: 'step-compilation',
      icon: 'analytics',
      title: content.searchStepTitles.compilation,
      status: 'pending',
      lines: [
        { text: `Aggregating local signals...`, type: 'info', revealed: false },
        { text: `Calculating visibility score...`, type: 'info', revealed: false },
        { text: `Generating recommendations...`, type: 'info', revealed: false },
        { text: `Analysis complete`, type: 'success', revealed: false },
      ]
    }
  ];
}
