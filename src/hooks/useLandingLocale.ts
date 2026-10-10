import { useState, useEffect } from 'react';
import { LANDING_TRANSLATIONS, type LandingContent } from '../constants/landingTranslations';

export type Locale = 'en' | 'id';

const STORAGE_KEY = 'sanak_landing_locale';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'id') return saved;
  } catch {
    // Local storage access error fallback
  }

  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('id')) {
    return 'id';
  }
  return 'en';
}

export function useLandingLocale() {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable fallback
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
  }, [locale]);

  const t: LandingContent = LANDING_TRANSLATIONS[locale];

  return { locale, setLocale, t };
}
