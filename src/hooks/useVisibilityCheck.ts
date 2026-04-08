'use client';

import { useState, useCallback } from 'react';
import { VisibilityStatus, VisibilityResult } from '@/types/local-growth';
import { checkBusinessVisibility } from '@/lib/visibility';

export function useVisibilityCheck() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<VisibilityStatus>('idle');
  const [result, setResult] = useState<VisibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkVisibility = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setStatus('loading');
    setResult(null);
    setError(null);

    try {
      const data = await checkBusinessVisibility(trimmed);
      setResult(data);
      setStatus('success');
    } catch {
      setError('Could not check visibility. Please try again.');
      setStatus('error');
    }
  }, [input]);

  const reset = useCallback(() => {
    setInput('');
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { input, setInput, status, result, error, checkVisibility, reset };
}
