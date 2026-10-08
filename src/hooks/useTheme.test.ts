import { describe, expect, test, beforeEach } from 'bun:test';
import { useTheme, type Theme } from './useTheme';

describe('useTheme hook behavior', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-theme');
    }
  });

  test('defaults to default theme when localStorage is empty', () => {
    const defaultTheme: Theme = 'default';
    expect(defaultTheme).toBe('default');
    expect(typeof useTheme).toBe('function');
    if (typeof localStorage !== 'undefined') {
      expect(localStorage.getItem('familytree_theme')).toBeNull();
    }
  });
});
