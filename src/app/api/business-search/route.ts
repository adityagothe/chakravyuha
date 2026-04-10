import { NextRequest, NextResponse } from 'next/server';
import type { RealSearchData, GoogleMapsData, WebPresenceData, DirectoryPresence, SocialMediaPresence, DistrictFame, DistrictFameLevel } from '@/types/local-growth';

// ─── Rate Limiting ─────────────────────────────────────────────────────────
// Simple in-memory store (per-instance). For prod, use Redis/KV.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;         // max searches per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// ─── Helper: Detect directory/social presence in search results ────────────
function detectPresences(items: Array<{ link: string; title: string; snippet: string }>) {
  const allText = items.map(i => `${i.link} ${i.title} ${i.snippet}`).join(' ').toLowerCase();
  const allLinks = items.map(i => i.link.toLowerCase());

  const directories: DirectoryPresence = {
    justdial: allLinks.some(l => l.includes('justdial.com')),
    indiamart: allLinks.some(l => l.includes('indiamart.com')),
    sulekha: allLinks.some(l => l.includes('sulekha.com')),
    yellowpages: allLinks.some(l => l.includes('yellowpages') || l.includes('indianyellowpages')),
    other: [] as string[],
  };

  // Pick up other directories
  const otherDirPatterns: [RegExp, string][] = [
    [/tradeindia\.com/, 'TradeIndia'],
    [/clickindia\.com/, 'ClickIndia'],
    [/shopclues\.com/, 'ShopClues'],
    [/google\.com\/maps/, 'Google Maps'],
    [/maps\.google/, 'Google Maps'],
    [/tripadvisor\.com/, 'TripAdvisor'],
    [/zomato\.com/, 'Zomato'],
    [/swiggy\.com/, 'Swiggy'],
    [/practo\.com/, 'Practo'],
    [/urbanclap\.com|urbancompany\.com/, 'Urban Company'],
    [/lbb\.in/, 'LBB'],
    [/magicpin\.in/, 'Magicpin'],
  ];

  for (const [pattern, name] of otherDirPatterns) {
    if (allLinks.some(l => pattern.test(l)) && !directories.other.includes(name)) {
      directories.other.push(name);
    }
  }

  const socialMedia: SocialMediaPresence = {
    facebook: allLinks.some(l => l.includes('facebook.com') || l.includes('fb.com')),
    instagram: allLinks.some(l => l.includes('instagram.com')),
    twitter: allLinks.some(l => l.includes('twitter.com') || l.includes('x.com')),
    youtube: allLinks.some(l => l.includes('youtube.com') || l.includes('youtu.be')),
  };

  // Check for google maps via text even if not in links
  const hasMapsInText = allText.includes('google maps') || allText.includes('maps.google') || allText.includes('business profile');

  return { directories, socialMedia, hasMapsInText };
}

// ─── District Fame calculation ─────────────────────────────────────────────
// NOTE: CSE is platform-specific (not full web), so totalResults is small (0–500).
// Fame is based on directHits (results that name the business + district) and
// how many distinct platforms found it.
function calculateDistrictFame(
  totalResultsStr: string,
  businessName: string,
  districtName: string,
  items: Array<{ title: string; link: string; snippet: string }>,
  platformCount: number
): DistrictFame {
  const totalResults = parseInt(totalResultsStr?.replace(/[^0-9]/g, '') || '0', 10);

  const nameLower = businessName.toLowerCase();
  const districtLower = districtName.toLowerCase();

  // Direct hits: results that mention business AND district
  const directHits = items.filter(item => {
    const combined = `${item.title} ${item.snippet}`.toLowerCase();
    return combined.includes(nameLower) &&
      (combined.includes(districtLower) || combined.includes('district') || combined.includes('local'));
  }).length;

  // Total hits: results that mention the business at all  
  const totalHits = items.filter(item =>
    `${item.title} ${item.snippet}`.toLowerCase().includes(nameLower)
  ).length;

  let fameLevel: DistrictFameLevel = 'unknown';
  let fameSummary = '';

  // Calibrated for platform-specific CSE (totalResults 0–500 range)
  if (platformCount >= 5 || directHits >= 5 || totalHits >= 8) {
    fameLevel = 'legendary';
    fameSummary = `"${businessName}" is extremely well-known in ${districtName} — found across ${platformCount} major platforms with strong presence.`;
  } else if (platformCount >= 4 || directHits >= 3 || totalHits >= 5) {
    fameLevel = 'famous';
    fameSummary = `"${businessName}" is well-known in ${districtName} with listings on ${platformCount} major platforms.`;
  } else if (platformCount >= 2 || directHits >= 2 || totalHits >= 3) {
    fameLevel = 'known';
    fameSummary = `"${businessName}" is a recognized name in ${districtName} — found on ${platformCount} platforms.`;
  } else if (platformCount >= 1 || totalHits >= 1) {
    fameLevel = 'emerging';
    fameSummary = `"${businessName}" has a starter digital footprint in ${districtName}. Found on ${platformCount} platform${platformCount === 1 ? '' : 's'} — room to grow.`;
  } else {
    fameLevel = 'unknown';
    fameSummary = `"${businessName}" has no detectable online presence in ${districtName} on any major platform.`;
  }

  return {
    searchResultCount: totalResults,
    isWellKnown: fameLevel === 'famous' || fameLevel === 'legendary',
    fameLevel,
    fameSummary,
  };
}

// ─── Google Maps detection from search results ─────────────────────────────
function extractGoogleMapsData(
  items: Array<{ title: string; link: string; snippet: string }>
): GoogleMapsData {
  // Look for Google Maps / Business Profile result
  const mapsItem = items.find(i =>
    i.link.includes('maps.google') ||
    i.link.includes('google.com/maps') ||
    i.title.toLowerCase().includes('google maps') ||
    i.snippet.toLowerCase().includes('google maps')
  );

  const businessProfileItem = items.find(i =>
    i.snippet.toLowerCase().includes('rating') ||
    i.snippet.toLowerCase().includes('reviews') ||
    i.snippet.toLowerCase().includes('stars') ||
    i.snippet.match(/\d+\.\d+\s*(stars?|rating|★)/i) ||
    i.snippet.match(/\(\d+\s+review/i)
  );

  const targetItem = mapsItem || businessProfileItem;

  if (!targetItem) {
    return { found: false };
  }

  // Try to extract rating and review count from snippet
  const ratingMatch = targetItem.snippet.match(/(\d+\.\d+)\s*(stars?|rating|\/5|★)/i) ||
    targetItem.snippet.match(/rated?\s+(\d+\.\d+)/i);
  const reviewMatch = targetItem.snippet.match(/\((\d[\d,]*)\s+review/i) ||
    targetItem.snippet.match(/(\d[\d,]*)\s+review/i) ||
    targetItem.snippet.match(/(\d[\d,]*)\s+Google review/i);

  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;
  const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, ''), 10) : undefined;

  return {
    found: true,
    rating: rating && rating <= 5 ? rating : undefined,
    reviewCount,
    mapsUrl: mapsItem?.link,
    address: undefined, // Would need Places API for real address
  };
}

// ─── Main Handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: 'rate_limited', message: 'You have reached the limit of 10 searches per hour. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
          'Retry-After': '3600',
        }
      }
    );
  }

  const body = await req.json().catch(() => null);
  const businessName: string = body?.businessName?.trim() ?? '';
  const districtName: string = body?.districtName?.trim() ?? '';
  const stateName: string = body?.stateName?.trim() ?? '';

  if (!businessName || !districtName) {
    return NextResponse.json({ error: 'invalid_input', message: 'businessName and districtName are required.' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;

  // ── If no API keys, tell client to use fallback ──
  if (!apiKey || !cx) {
    return NextResponse.json({ error: 'no_api_keys', message: 'API not configured.' }, { status: 503 });
  }

  try {
    // Build two queries:
    // 1. District-specific search: captures local presence
    // 2. General business search: captures web-wide presence
    const query1 = `"${businessName}" "${districtName}"${stateName ? ` "${stateName}"` : ''}`;
    const query2 = `${businessName} ${districtName} site:justdial.com OR site:indiamart.com OR site:sulekha.com OR site:maps.google.com OR site:facebook.com OR site:instagram.com`;

    const [res1, res2] = await Promise.all([
      fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query1)}&num=10&gl=in&hl=en`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query2)}&num=10&gl=in&hl=en`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    if (!res1.ok || !res2.ok) {
      // API error — client should use fallback
      const errBody = await res1.json().catch(() => ({}));
      const errCode = errBody?.error?.code;

      if (errCode === 429 || errCode === 403) {
        return NextResponse.json({ error: 'quota_exceeded', message: 'Search quota exceeded.' }, { status: 503 });
      }
      return NextResponse.json({ error: 'api_error', message: 'Search API error.' }, { status: 502 });
    }

    const data1 = await res1.json();
    const data2 = await res2.json();

    // Combine items, deduplicate by link
    const items1: Array<{ title: string; link: string; snippet: string }> = data1.items ?? [];
    const items2: Array<{ title: string; link: string; snippet: string }> = data2.items ?? [];
    const seenLinks = new Set<string>();
    const allItems: typeof items1 = [];
    for (const item of [...items1, ...items2]) {
      if (!seenLinks.has(item.link)) {
        seenLinks.add(item.link);
        allItems.push({ title: item.title, link: item.link, snippet: item.snippet });
      }
    }

    const totalResultsStr = data1.searchInformation?.totalResults ?? '0';

    // Parse results
    const { directories, socialMedia } = detectPresences(allItems);
    const googleMaps = extractGoogleMapsData(allItems);
    
    // Calculate how many distinct platforms the business was found on
    const platformCount =
      (directories.justdial ? 1 : 0) +
      (directories.indiamart ? 1 : 0) +
      (directories.sulekha ? 1 : 0) +
      (directories.yellowpages ? 1 : 0) +
      directories.other.length +
      (socialMedia.facebook ? 1 : 0) +
      (socialMedia.instagram ? 1 : 0) +
      (socialMedia.twitter ? 1 : 0) +
      (socialMedia.youtube ? 1 : 0) +
      (googleMaps.found ? 1 : 0);

    const districtFame = calculateDistrictFame(totalResultsStr, businessName, districtName, items1, platformCount);

    // Build top results for display (from query1 — the most relevant)
    const topResults: WebPresenceData['topResults'] = items1.slice(0, 5).map(i => ({
      title: i.title,
      link: i.link,
      snippet: i.snippet,
    }));

    const webPresence: WebPresenceData = {
      totalResults: parseInt(totalResultsStr.replace(/[^0-9]/g, '') || '0', 10),
      topResults,
    };

    const result: RealSearchData = {
      googleMaps,
      webPresence,
      directories,
      socialMedia,
      districtFame,
      isRealData: true,
    };

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
        'X-RateLimit-Remaining': String(remaining),
      }
    });

  } catch {
    return NextResponse.json({ error: 'internal_error', message: 'Internal server error.' }, { status: 500 });
  }
}
