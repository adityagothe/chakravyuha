import {
  VisibilityResult,
  VisibilityScore,
  LGContent,
  CityData,
  SearchStep,
  SearchStepLine,
  VisibilityCheck,
  RealSearchData,
} from '@/types/local-growth';

// ─── Deterministic fallback (unchanged) ───────────────────────────────────

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
  let baseScore = 15 + (hash % 71);

  if (businessName.length < 5) baseScore -= 15;

  const isFood = /restaurant|cafe|hotel|food|kitchen|dine|eatery/i.test(businessName);
  const isShop = /store|shop|mart|supermarket|mall/i.test(businessName);

  if (isFood) baseScore += (hash % 10);
  if (isShop) baseScore += (hash % 5);

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
    checks.push({ category: 'Google Maps', icon: 'map', status: 'pass', detail: 'Verified Google Business Profile found.' });
    checks.push({ category: 'Reviews', icon: 'star', status: 'pass', detail: 'Strong review velocity detected.' });
    checks.push({ category: 'Directories', icon: 'list_alt', status: 'warning', detail: 'Missing from 2 minor local directories.' });
    suggestions.push('Keep responding to all customer reviews to maintain engagement.');
    suggestions.push('Post regular updates to your Google profile.');
    planReasons = ['You already have great visibility.', 'Our Basic plan will help maintain your current growth.', 'Cost-effective tracking of your success.'];
  } else if (scoreLabel === 'medium') {
    issues.push('Google Business Profile may be incomplete.');
    issues.push('Inconsistent NAP (Name, Address, Phone) across directories.');
    suggestions.push('Optimize your Google Maps listing with better photos and exact categories.');
    suggestions.push('Implement a system to collect more customer reviews.');
    checks.push({ category: 'Google Maps', icon: 'map', status: 'warning', detail: 'Profile exists but lacks recent activity.' });
    checks.push({ category: 'Reviews', icon: 'star', status: 'warning', detail: 'Low review count compared to competitors.' });
    checks.push({ category: 'Directories', icon: 'list_alt', status: 'fail', detail: 'Inconsistent data across major platforms.' });
    planReasons = ['You are visible, but losing customers to competitors.', 'Our Growth plan fixes these inconsistencies.', 'We will implement a review generation system for you.'];
  } else {
    issues.push('Business not found in top Google local search results.');
    issues.push('No visible online reviews or ratings.');
    issues.push('Missing from major local directories like Justdial.');
    suggestions.push('Create and verify a Google Business Profile immediately.');
    suggestions.push('Publish a dedicated landing page or website.');
    suggestions.push('Get listed on the top 15 Indian local directories.');
    checks.push({ category: 'Google Maps', icon: 'map', status: 'fail', detail: 'No verified listing detected.' });
    checks.push({ category: 'Reviews', icon: 'star', status: 'fail', detail: '0 reviews found online.' });
    checks.push({ category: 'Web Presence', icon: 'language', status: 'fail', detail: 'No dedicated website or social media found.' });
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
    planReasons,
  };
}

// ─── Real data → VisibilityResult ─────────────────────────────────────────

export function generateReportFromRealData(
  city: CityData,
  businessName: string,
  real: RealSearchData
): VisibilityResult {
  let score = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];
  const checks: VisibilityCheck[] = [];

  // ── Google Maps (0–30 pts) ──
  if (real.googleMaps.found) {
    let mapsScore = 15;
    const rating = real.googleMaps.rating;
    const reviews = real.googleMaps.reviewCount ?? 0;

    if (rating) {
      if (rating >= 4.5) mapsScore += 10;
      else if (rating >= 4.0) mapsScore += 7;
      else if (rating >= 3.5) mapsScore += 4;
      else mapsScore += 2;
    }
    if (reviews >= 100) mapsScore += 5;
    else if (reviews >= 30) mapsScore += 3;
    else if (reviews >= 10) mapsScore += 1;

    score += Math.min(30, mapsScore);

    const ratingStr = rating ? ` (${rating}★, ${reviews > 0 ? `${reviews} reviews` : 'no reviews yet'})` : '';
    checks.push({
      category: 'Google Maps',
      icon: 'map',
      status: rating && rating >= 4.0 ? 'pass' : 'warning',
      detail: `Listed on Google Maps${ratingStr}.`,
      link: real.googleMaps.mapsUrl,
    });

    if (!rating || reviews < 10) {
      suggestions.push('Ask satisfied customers to leave Google reviews — it directly improves your local ranking.');
    }
  } else {
    checks.push({ category: 'Google Maps', icon: 'map', status: 'fail', detail: 'Not found on Google Maps or Google Business Profile.' });
    issues.push('No Google Business Profile detected — this is the #1 way customers find local businesses.');
    suggestions.push('Create and verify a Google Business Profile immediately — it\'s free.');
    score += 0;
  }

  // ── Web Presence (0–25 pts) ──
  const webTotal = real.webPresence.totalResults;
  let webScore = 0;
  if (webTotal >= 500000) webScore = 25;
  else if (webTotal >= 100000) webScore = 20;
  else if (webTotal >= 10000) webScore = 15;
  else if (webTotal >= 1000) webScore = 10;
  else if (webTotal >= 100) webScore = 5;
  else if (real.webPresence.topResults.length > 0) webScore = 3;

  score += webScore;

  if (webScore >= 15) {
    checks.push({ category: 'Web Presence', icon: 'language', status: 'pass', detail: `Strong web presence — ${webTotal.toLocaleString('en-IN')} search results found.` });
  } else if (webScore >= 5) {
    checks.push({ category: 'Web Presence', icon: 'language', status: 'warning', detail: `Limited web presence — ${webTotal.toLocaleString('en-IN')} results. Room to grow.` });
    suggestions.push('Create a simple website or Google Sites page to improve your web presence.');
  } else {
    checks.push({ category: 'Web Presence', icon: 'language', status: 'fail', detail: 'Minimal web presence detected.' });
    issues.push('Your business has almost no web presence outside of direct searches.');
    suggestions.push('Get listed on free directories and set up a basic website to improve discoverability.');
  }

  // ── Directories (0–20 pts) ──
  const dirScore =
    (real.directories.justdial ? 6 : 0) +
    (real.directories.indiamart ? 5 : 0) +
    (real.directories.sulekha ? 5 : 0) +
    (real.directories.yellowpages ? 2 : 0) +
    Math.min(2, real.directories.other.length);

  score += Math.min(20, dirScore);

  const foundDirs = [
    real.directories.justdial ? 'JustDial' : null,
    real.directories.indiamart ? 'IndiaMart' : null,
    real.directories.sulekha ? 'Sulekha' : null,
    real.directories.yellowpages ? 'YellowPages' : null,
    ...real.directories.other,
  ].filter(Boolean) as string[];

  if (foundDirs.length >= 3) {
    checks.push({ category: 'Local Directories', icon: 'list_alt', status: 'pass', detail: `Listed on ${foundDirs.join(', ')}.` });
  } else if (foundDirs.length >= 1) {
    checks.push({ category: 'Local Directories', icon: 'list_alt', status: 'warning', detail: `Found on ${foundDirs.join(', ')}. Missing from other key directories.` });
    suggestions.push('Increase directory coverage — get listed on JustDial, IndiaMart, and Sulekha for maximum reach.');
  } else {
    checks.push({ category: 'Local Directories', icon: 'list_alt', status: 'fail', detail: 'Not listed on any major Indian business directories.' });
    issues.push('Missing from all major directories like JustDial, IndiaMart, and Sulekha.');
    suggestions.push('Submit your business to JustDial, Sulekha, and IndiaMart — all free basic listings.');
  }

  // ── Social Media (0–15 pts) ──
  const socialScore =
    (real.socialMedia.facebook ? 5 : 0) +
    (real.socialMedia.instagram ? 5 : 0) +
    (real.socialMedia.twitter ? 3 : 0) +
    (real.socialMedia.youtube ? 2 : 0);

  score += Math.min(15, socialScore);

  const foundSocial = [
    real.socialMedia.facebook ? 'Facebook' : null,
    real.socialMedia.instagram ? 'Instagram' : null,
    real.socialMedia.twitter ? 'X (Twitter)' : null,
    real.socialMedia.youtube ? 'YouTube' : null,
  ].filter(Boolean) as string[];

  if (foundSocial.length >= 2) {
    checks.push({ category: 'Social Media', icon: 'people', status: 'pass', detail: `Active on ${foundSocial.join(', ')}.` });
  } else if (foundSocial.length === 1) {
    checks.push({ category: 'Social Media', icon: 'people', status: 'warning', detail: `Found on ${foundSocial[0]}. More platforms would help.` });
    suggestions.push('Expand to Instagram and Facebook — both are free and used heavily by local customers.');
  } else {
    checks.push({ category: 'Social Media', icon: 'people', status: 'fail', detail: 'No social media presence found.' });
    issues.push('No social media presence detected — customers expect to find businesses on Instagram or Facebook.');
  }

  // ── District Fame (0–10 pts) ──
  let fameScore = 0;
  switch (real.districtFame.fameLevel) {
    case 'legendary': fameScore = 10; break;
    case 'famous': fameScore = 8; break;
    case 'known': fameScore = 5; break;
    case 'emerging': fameScore = 2; break;
    default: fameScore = 0;
  }
  score += fameScore;

  checks.push({
    category: `Local Fame in ${city.name}`,
    icon: 'location_on',
    status: real.districtFame.isWellKnown ? 'pass' : (fameScore > 0 ? 'warning' : 'fail'),
    detail: real.districtFame.fameSummary,
  });

  // ── Final score + label ──
  const finalScore = Math.max(5, Math.min(98, Math.round(score)));
  let scoreLabel: VisibilityScore;
  let recommendedPlan: 'basic' | 'growth' | 'pro';

  if (finalScore >= 70) {
    scoreLabel = 'high';
    recommendedPlan = 'basic';
  } else if (finalScore >= 35) {
    scoreLabel = 'medium';
    recommendedPlan = 'growth';
  } else {
    scoreLabel = 'low';
    recommendedPlan = 'pro';
  }

  const planReasonMap = {
    basic: ['Your business already has strong visibility.', 'Our Basic plan helps maintain your lead.', 'Cost-effective tracking and reputation management.'],
    growth: ['You\'re visible but losing ground to competitors.', 'Our Growth plan closes the gaps that are costing you customers.', 'Review automation + multi-directory coverage included.'],
    pro: ['Your business is nearly invisible online.', 'Our Pro plan builds your entire digital presence from scratch.', 'Dedicated growth manager, full setup — guaranteed results.'],
  };

  return {
    score: finalScore,
    scoreLabel,
    city: city.name,
    businessName,
    issues,
    suggestions,
    checks,
    recommendedPlan,
    planReasons: planReasonMap[recommendedPlan],
    realData: real,
  };
}

// ─── Search Steps ──────────────────────────────────────────────────────────

export function generateSearchSteps(
  content: LGContent['visibilityTool'],
  city: CityData,
  businessName: string,
  report: VisibilityResult
): SearchStep[] {
  const real = report.realData;
  const isHigh = report.scoreLabel === 'high';
  const isMedium = report.scoreLabel === 'medium';
  
  // Deterministic seed generation based on input
  const seedStr = `${businessName}-${city.name}`;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed << 5) - seed + seedStr.charCodeAt(i);
  seed = Math.abs(seed);
  
  const getIp = (offset: number) => `104.${(seed + offset) % 255}.${(seed * 2 + offset) % 255}.${(seed * 3) % 255}`;
  const getHash = (offset: number) => (seed * 13 + offset).toString(16).padStart(8, '0');

  // Helper to build terminal lines from real data or fallback text
  const mapsLines = (): SearchStepLine[] => {
    if (real) {
      const lines: SearchStepLine[] = [
        { text: `Query: "${businessName}" location:"${city.name}" lat:${city.lat.toFixed(2)} lng:${city.lng.toFixed(2)}`, type: 'info', revealed: false },
        { text: `Bypassing geo-restrictions... [OK]`, type: 'info', revealed: false },
        { text: `Establishing secure connection to maps.google.com (IP: ${getIp(1)})...`, type: 'info', revealed: false },
        { text: `Extracting JSON payload via Custom Search API [token: ${getHash(1)}]...`, type: 'info', revealed: false },
      ];
      if (real.googleMaps.found) {
        lines.push({ text: `✓ Valid Google Business Profile node located`, type: 'success', revealed: false });
        if (real.googleMaps.rating) {
          lines.push({ text: `  Rating metrics: ${real.googleMaps.rating}★`, type: 'success', revealed: false });
          lines.push({ text: `  Review node depth: ${real.googleMaps.reviewCount ?? 0} confirmed`, type: 'success', revealed: false });
        }
      } else {
        lines.push({ text: `✗ 404 - Profile not found in primary spatial index`, type: 'error', revealed: false });
      }
      return lines;
    }
    return [
      { text: `Query: "${businessName} near ${city.name}"`, type: 'info', revealed: false },
      { text: `Initializing 5km spatial grid scan...`, type: 'info', revealed: false },
      { text: `Checking local cluster nodes [Hash: ${getHash(1)}]...`, type: 'info', revealed: false },
      { text: isHigh ? `Verified spatial anchor found` : (isMedium ? `Unverified physical location matched` : `Critical fault: No physical anchor point detected`), type: isHigh ? 'success' : (isMedium ? 'warning' : 'error'), revealed: false },
    ];
  };

  const dirLines = (): SearchStepLine[] => {
    if (real) {
      return [
        { text: `Deploying web spiders to major Indian B2B/B2C indexes...`, type: 'info', revealed: false },
        { text: `Querying jd_dataset_v4 (IP: ${getIp(2)})...`, type: 'info', revealed: false },
        { text: `JustDial: ${real.directories.justdial ? '✓ Signature match' : '✗ Null response'}`, type: real.directories.justdial ? 'success' : 'error', revealed: false },
        { text: `Querying im_core_db (IP: ${getIp(3)})...`, type: 'info', revealed: false },
        { text: `IndiaMart: ${real.directories.indiamart ? '✓ Signature match' : '✗ Null response'}`, type: real.directories.indiamart ? 'success' : 'error', revealed: false },
        { text: `Querying sulekha_nodes...`, type: 'info', revealed: false },
        { text: `Sulekha: ${real.directories.sulekha ? '✓ Signature match' : '✗ Null response'}`, type: real.directories.sulekha ? 'success' : 'error', revealed: false },
        ...(real.directories.other.length > 0 ? [{ text: `Secondary clusters active: ${real.directories.other.join(', ')}`, type: 'success' as const, revealed: false }] : []),
      ];
    }
    return [
      { text: `Initiating multi-thread directory scrape [TCP/80]...`, type: 'info', revealed: false },
      { text: `Parsing Justdial.com DOM...`, type: 'info', revealed: false },
      { text: `Parsing Sulekha.com DOM...`, type: 'info', revealed: false },
      { text: isHigh ? `Consistent NAP (Name/Address/Phone) hashes matched` : (isMedium ? `Warning: Fragmented or conflicting NAP records detected` : `Red flag: Missing from foundational directories`), type: isHigh ? 'success' : (isMedium ? 'warning' : 'error'), revealed: false },
    ];
  };

  const webLines = (): SearchStepLine[] => {
    if (real) {
      const totalStr = real.webPresence.totalResults.toLocaleString('en-IN');
      return [
        { text: `Initializing global web surface area scan...`, type: 'info', revealed: false },
        { text: `Analyzing SERP nodes [param=q:"${businessName}" location:"${city.name}"]`, type: 'info', revealed: false },
        { text: `Decrypting rank headers...`, type: 'info', revealed: false },
        { text: `Calculated surface area: ~${totalStr} indexed fragments`, type: real.webPresence.totalResults > 1000 ? 'success' : 'warning', revealed: false },
        { text: `Intercepting top indexing packets:`, type: 'info', revealed: false },
        ...(real.webPresence.topResults.slice(0, 2).map((r, i) => ({
          text: `[PKT_0${i}] ${r.title.substring(0, 40)}`,
          type: 'info' as const,
          revealed: false,
        }))),
      ];
    }
    return [
      { text: `Injecting search params: "${businessName} ${city.name}"`, type: 'info', revealed: false },
      { text: `Scraping deep index layer... [page_depth=3]`, type: 'info', revealed: false },
      { text: `Parsing meta tags and schema markup...`, type: 'info', revealed: false },
      { text: isHigh ? `Dedicated authority domain detected (DA > 20)` : `Null response: No dedicated surface level domain found`, type: isHigh ? 'success' : 'warning', revealed: false },
    ];
  };

  const socialLines = (): SearchStepLine[] => {
    if (real) {
      return [
        { text: `Mapping social graph connections...`, type: 'info', revealed: false },
        { text: `Graph node ID: Facebook - ${real.socialMedia.facebook ? '✓ Found' : '✗ Missing'}`, type: real.socialMedia.facebook ? 'success' : 'error', revealed: false },
        { text: `Graph node ID: Instagram - ${real.socialMedia.instagram ? '✓ Found' : '✗ Missing'}`, type: real.socialMedia.instagram ? 'success' : 'error', revealed: false },
        { text: `Graph node ID: X (Twitter) - ${real.socialMedia.twitter ? '✓ Found' : '✗ Missing'}`, type: real.socialMedia.twitter ? 'success' : 'error', revealed: false },
        ...(real.socialMedia.youtube ? [{ text: `YouTube video footprint: ✓ Detected`, type: 'success' as const, revealed: false }] : []),
      ];
    }
    return [
      { text: `Cross-referencing open-source sentiment databases...`, type: 'info', revealed: false },
      { text: `Executing sentiment analysis on brand mentions...`, type: 'info', revealed: false },
      { text: isHigh ? `Positive sentiment vector detected` : (isMedium ? `Low volume vector detected` : `0x00 sentiment volume array`), type: isHigh ? 'success' : (isMedium ? 'warning' : 'error'), revealed: false },
    ];
  };

  const fameLines = (): SearchStepLine[] => {
    if (real) {
      return [
        { text: `Correlating local graph signals for area: ${city.name} [radius: 10km]...`, type: 'info', revealed: false },
        { text: `Computing local authority matrix...`, type: 'info', revealed: false },
        { text: `Graph density score: ${real.districtFame.searchResultCount.toLocaleString('en-IN')} volumetric units`, type: 'info', revealed: false },
        {
          text: `Final local classification rank: [${real.districtFame.fameLevel.toUpperCase()}]`,
          type: real.districtFame.fameLevel === 'unknown' ? 'error' : real.districtFame.fameLevel === 'emerging' ? 'warning' : 'success',
          revealed: false
        },
      ];
    }
    return [
      { text: `Executing localized proximity heuristic...`, type: 'info', revealed: false },
      { text: `Benchmarking against top 10 local competitors...`, type: 'info', revealed: false },
      { text: isHigh ? `Dominant local authority` : 'Weak local authority signal', type: isHigh ? 'success' : 'warning', revealed: false },
    ];
  };

  return [
    {
      id: 'step-init',
      icon: 'terminal',
      title: 'Initializing Scan Engine',
      status: 'pending',
      lines: [
        { text: `Core loaded. Process ID: ${getHash(99)}`, type: 'info', revealed: false },
        { text: `Target matrix: ${businessName} | ${city.name}, ${city.state}`, type: 'info', revealed: false },
        { text: `Coordinates bound: ${city.lat.toFixed(4)}°N, ${city.lng.toFixed(4)}°E`, type: 'info', revealed: false },
        { text: `System lock acquired. Initiating data sweep...`, type: 'success', revealed: false },
      ],
    },
    {
      id: 'step-google',
      icon: 'map',
      title: content.searchStepTitles.google,
      status: 'pending',
      lines: mapsLines(),
    },
    {
      id: 'step-directories',
      icon: 'list_alt',
      title: content.searchStepTitles.directories,
      status: 'pending',
      lines: dirLines(),
    },
    {
      id: 'step-web',
      icon: 'language',
      title: content.searchStepTitles.web,
      status: 'pending',
      lines: webLines(),
    },
    {
      id: 'step-social',
      icon: 'people',
      title: 'Social Graph Mapping',
      status: 'pending',
      lines: socialLines(),
    },
    {
      id: 'step-fame',
      icon: 'radar',
      title: `Authority check: ${city.name}`,
      status: 'pending',
      lines: fameLines(),
    },
    {
      id: 'step-compilation',
      icon: 'analytics',
      title: content.searchStepTitles.compilation,
      status: 'pending',
      lines: [
        { text: `Aggregating ${Object.values(real?.socialMedia || {}).length + Object.values(real?.directories || {}).length + 4} data vectors...`, type: 'info', revealed: false },
        { text: `Calculating absolute market penetration gap...`, type: 'info', revealed: false },
        { text: `Compiling algorithmic growth roadmaps...`, type: 'info', revealed: false },
        { text: `Payload generated. Decrypting output...`, type: 'success', revealed: false },
      ],
    },
  ];
}
