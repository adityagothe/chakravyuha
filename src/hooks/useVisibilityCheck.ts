'use client';

import { useState, useCallback } from 'react';
import { CityData, SearchStep, VisibilityResult, LGContent } from '@/types/local-growth';
import { generateReport, generateSearchSteps } from '@/lib/visibility';

export type VisibilityPhase = 'city-select' | 'business-input' | 'searching' | 'results';

export function useVisibilityCheck() {
  const [phase, setPhase] = useState<VisibilityPhase>('city-select');
  const [city, setCity] = useState<CityData | null>(null);
  const [businessName, setBusinessName] = useState('');
  
  const [report, setReport] = useState<VisibilityResult | null>(null);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);

  const reset = useCallback(() => {
    setPhase('city-select');
    setCity(null);
    setBusinessName('');
    setReport(null);
    setSearchSteps([]);
  }, []);

  const selectCity = useCallback((selectedCity: CityData) => {
    setCity(selectedCity);
    setPhase('business-input');
  }, []);

  const proceedToBusiness = useCallback(() => {
    if (city) setPhase('business-input');
  }, [city]);

  const startSearch = useCallback((content: LGContent['visibilityTool']) => {
    const trimmedName = businessName.trim();
    if (!city || !trimmedName) return;

    // Generate immediate deterministic report
    const newReport = generateReport(city, trimmedName);
    setReport(newReport);

    // Generate steps with final outcomes already known
    const steps = generateSearchSteps(content, city, trimmedName, newReport);
    setSearchSteps(steps);

    // Switch to search animation phase
    setPhase('searching');
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
    reset,
  };
}
