import { describe, expect, test } from 'bun:test';
import { parseBirthYear } from './date';

describe('parseBirthYear', () => {
  test('extracts 4-digit year from ISO format', () => {
    expect(parseBirthYear('1980-05-12')).toBe(1980);
    expect(parseBirthYear('2005-12-31')).toBe(2005);
  });

  test('extracts 4-digit year from plain year string', () => {
    expect(parseBirthYear('1953')).toBe(1953);
  });

  test('returns null for undefined or missing year', () => {
    expect(parseBirthYear(undefined)).toBeNull();
    expect(parseBirthYear('')).toBeNull();
    expect(parseBirthYear('unknown')).toBeNull();
  });
});
