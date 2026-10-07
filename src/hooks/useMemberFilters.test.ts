import { describe, expect, test } from 'bun:test';
import { getBirthYear, matchesYear } from './useMemberFilters';
import type { Person } from '@/types/family';

describe('useMemberFilters helper functions', () => {
  const personWithYear: Person = {
    id: 'p1',
    name: 'Budi',
    gender: 'male',
    birthDate: '1985-05-20'
  };

  const personWithNoDate: Person = {
    id: 'p2',
    name: 'Siti',
    gender: 'female'
  };

  test('extracts birth year accurately from ISO string', () => {
    expect(getBirthYear(personWithYear)).toBe(1985);
    expect(getBirthYear(personWithNoDate)).toBeNull();
  });

  test('matches year filter correctly', () => {
    expect(matchesYear(personWithYear, 'all')).toBe(true);
    expect(matchesYear(personWithYear, '1985')).toBe(true);
    expect(matchesYear(personWithYear, '1990')).toBe(false);
    expect(matchesYear(personWithNoDate, '1985')).toBe(false);
  });
});
