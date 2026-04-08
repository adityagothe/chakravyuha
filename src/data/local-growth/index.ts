import { LGContent, Locale } from '@/types/local-growth';
import { deepMerge } from '@/lib/i18n';
import { contentEN } from './content';
import { contentHI } from './content.hi';
import { contentKN } from './content.kn';

const contentMap: Record<Locale, LGContent> = {
  en: contentEN,
  hi: deepMerge(contentEN, contentHI),
  kn: deepMerge(contentEN, contentKN),
};

export function getContent(locale: Locale): LGContent {
  return contentMap[locale] ?? contentEN;
}
