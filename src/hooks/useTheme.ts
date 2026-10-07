import { useState, useEffect, useCallback } from 'react';

export type Theme = 'default' | 'neumorphism';

export const THEME_STORAGE_KEY = 'familytree_theme';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'default';
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return saved === 'neumorphism' ? 'neumorphism' : 'default';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'neumorphism') {
        root.setAttribute('data-theme', 'neumorphism');
      } else {
        root.removeAttribute('data-theme');
      }
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'default' ? 'neumorphism' : 'default'));
  }, []);

  return { theme, setTheme, toggleTheme };
}

export function useIsNeumorphic(): boolean {
  const [isNeu, setIsNeu] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.getAttribute('data-theme') === 'neumorphism';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const update = () => setIsNeu(document.documentElement.getAttribute('data-theme') === 'neumorphism');
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return isNeu;
}
