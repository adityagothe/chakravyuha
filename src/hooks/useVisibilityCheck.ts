'use client';

import { useState, useCallback } from 'react';
import { CityData, SearchStep, VisibilityResult, LGContent, RealSearchData } from '@/types/local-growth';
import { generateReport, generateReportFromRealData, generateSearchSteps } from '@/lib/visibility';

export type VisibilityPhase = 'city-select' | 'business-input' | 'searching' | 'results';
export type SearchMode = 'real' | 'fallback';

export function useVisibilityCheck() {
  const [phase, setPhase] = useState<VisibilityPhase>('city-select');
  const [city, setCity] = useState<CityData | null>(null);
  const [businessName, setBusinessName] = useState('');

  const [report, setReport] = useState<VisibilityResult | null>(null);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>('real');
  const [rateLimitError, setRateLimitError] = useState(false);

  const reset = useCallback(() => {
    setPhase('city-select');
    setCity(null);
    setBusinessName('');
    setReport(null);
    setSearchSteps([]);
    setSearchMode('real');
    setRateLimitError(false);
  }, []);

  const selectCity = useCallback((selectedCity: CityData) => {
    setCity(selectedCity);
    setPhase('business-input');
  }, []);

  const proceedToBusiness = useCallback(() => {
    if (city) setPhase('business-input');
  }, [city]);

  const startSearch = useCallback(async (content: LGContent['visibilityTool']) => {
    const trimmedName = businessName.trim();
    if (!city || !trimmedName) return;

    setRateLimitError(false);

    // Switch to searching phase immediately so animation starts
    setPhase('searching');

    let finalReport: VisibilityResult;
    let mode: SearchMode = 'fallback';

    try {
      const res = await fetch('/api/business-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: trimmedName,
          districtName: city.name,
          stateName: city.state,
        }),
      });

      if (res.status === 429) {
        setRateLimitError(true);
        // Still show fallback result instead of nothing
        finalReport = generateReport(city, trimmedName);
        mode = 'fallback';
      } else if (res.ok) {
        const realData = await res.json() as RealSearchData;
        if (realData?.isRealData) {
          finalReport = generateReportFromRealData(city, trimmedName, realData);
          mode = 'real';
        } else {
          // Unexpected shape — use fallback
          finalReport = generateReport(city, trimmedName);
          mode = 'fallback';
        }
      } else {
        // 503 (no API keys / quota exceeded), 5xx, etc. → use fallback silently
        finalReport = generateReport(city, trimmedName);
        mode = 'fallback';
      }
    } catch {
      // Network error — fallback silently
      finalReport = generateReport(city, trimmedName);
      mode = 'fallback';
    }

    setReport(finalReport);
    setSearchMode(mode);

    const steps = generateSearchSteps(content, city, trimmedName, finalReport);
    setSearchSteps(steps);
  }, [city, businessName]);

  const finishSearch = useCallback(() => {
    setPhase('results');
  }, []);

  return {
    phase,
    setPhase,
    city,
    selectCity,
    proceedToBusiness,
    businessName,
    setBusinessName,
    startSearch,
    finishSearch,
    searchSteps,
    report,
    searchMode,
    rateLimitError,
    reset,
  };
}
