import { useState, useMemo } from 'react';
import type { Person } from '@/types/family';

export interface UseMemberFiltersReturn {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterGender: 'all' | 'male' | 'female';
  setFilterGender: (val: 'all' | 'male' | 'female') => void;
  filterStatus: 'all' | 'alive' | 'deceased';
  setFilterStatus: (val: 'all' | 'alive' | 'deceased') => void;
  filterYear: string;
  setFilterYear: (val: string) => void;
  availableBirthYears: number[];
  filteredPeople: Person[];
}

import { parseBirthYear } from '@/utils/date';

export function getBirthYear(p: Person): number | null {
  return parseBirthYear(p.birthDate);
}

export function matchesYear(p: Person, selectedYear: string): boolean {
  if (!selectedYear || selectedYear === 'all') return true;
  const birthYear = getBirthYear(p);
  if (birthYear === null) return false;
  return birthYear.toString() === selectedYear;
}

export function useMemberFilters(people: Person[]): UseMemberFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'alive' | 'deceased'>('all');
  const [filterYear, setFilterYear] = useState('all');

  const availableBirthYears = useMemo(() => {
    const years = new Set<number>();
    for (const p of people) {
      const y = getBirthYear(p);
      if (y !== null) years.add(y);
    }
    return Array.from(years).sort((a, b) => a - b);
  }, [people]);

  const filteredPeople = useMemo(() => {
    const list = people.filter(p => {
      if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterGender === 'male' && p.gender !== 'male') return false;
      if (filterGender === 'female' && p.gender !== 'female') return false;

      const isDeceased = typeof p.deceased === 'boolean' ? p.deceased : Boolean(p.deceased?.status);
      if (filterStatus === 'alive' && isDeceased) return false;
      if (filterStatus === 'deceased' && !isDeceased) return false;

      if (!matchesYear(p, filterYear)) return false;
      return true;
    });

    return list.slice().sort((pA, pB) => {
      const yearA = getBirthYear(pA);
      const yearB = getBirthYear(pB);

      if (yearA !== null && yearB !== null) {
        if (yearA !== yearB) return yearA - yearB;
        if (pA.birthDate && pB.birthDate && pA.birthDate !== pB.birthDate) {
          return pA.birthDate.localeCompare(pB.birthDate);
        }
        return pA.name.localeCompare(pB.name);
      }
      if (yearA !== null) return -1;
      if (yearB !== null) return 1;
      return pA.name.localeCompare(pB.name);
    });
  }, [people, searchQuery, filterGender, filterStatus, filterYear]);

  return {
    searchQuery,
    setSearchQuery,
    filterGender,
    setFilterGender,
    filterStatus,
    setFilterStatus,
    filterYear,
    setFilterYear,
    availableBirthYears,
    filteredPeople
  };
}
