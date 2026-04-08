'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '@/types/local-growth';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}
