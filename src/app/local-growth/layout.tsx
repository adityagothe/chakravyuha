'use client';

import React, { useState } from 'react';
import { LanguageContext } from '@/hooks/useLanguage';
import { Locale } from '@/types/local-growth';

export default function LocalGrowthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>('en');

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}
