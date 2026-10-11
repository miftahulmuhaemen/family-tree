import { describe, expect, test } from 'bun:test';
import {
  parseGedcom,
  serializeGedcom,
  formatGedcomDate,
  parseGedcomDate,
  formatGedcomName,
  parseGedcomName,
  deduplicateRelationships
} from './gedcom';
import type { FamilyData, Relationship } from '@/types/family';

describe('gedcom utilities', () => {
  describe('formatGedcomDate and parseGedcomDate', () => {
    test('converts ISO YYYY-MM-DD to standard GEDCOM DD MMM YYYY and back', () => {
      const iso = '1980-05-15';
      const ged = formatGedcomDate(iso);
      expect(ged).toBe('15 MAY 1980');
      const parsed = parseGedcomDate(ged);
      expect(parsed).toBe('1980-05-15');
    });

    test('preserves YYYY when only year is given', () => {
      const year = '1950';
      const ged = formatGedcomDate(year);
      expect(ged).toBe('1950');
      const parsed = parseGedcomDate(ged);
      expect(parsed).toBe('1950-01-01');
    });

    test('handles empty or invalid dates gracefully', () => {
      expect(formatGedcomDate('')).toBe('');
      expect(parseGedcomDate('')).toBe('');
    });
  });

  describe('formatGedcomName and parseGedcomName', () => {
    test('encloses surname in slashes when formatting multi-word name', () => {
      expect(formatGedcomName('John Doe')).toBe('John /Doe/');
      expect(formatGedcomName('Mary Jane Watson')).toBe('Mary Jane /Watson/');
      expect(formatGedcomName('Cher')).toBe('Cher');
    });

    test('strips surname slashes when parsing', () => {
      expect(parseGedcomName('John /Doe/')).toBe('John Doe');
      expect(parseGedcomName('Cher')).toBe('Cher');
      expect(parseGedcomName('')).toBe('Unknown');
    });
  });

  describe('deduplicateRelationships', () => {
    test('deduplicates marriage relationships regardless of direction', () => {
      const rels: Relationship[] = [
        { type: 'married', from: 'p1', to: 'p2' },
        { type: 'married', from: 'p2', to: 'p1' }
      ];
      const result = deduplicateRelationships(rels);
      expect(result.length).toBe(1);
    });

    test('preserves separate parent-child relationships', () => {
      const rels: Relationship[] = [
        { type: 'parent', from: 'c1', to: 'p1' },
        { type: 'parent', from: 'c1', to: 'p2' }
      ];
      const result = deduplicateRelationships(rels);
      expect(result.length).toBe(2);
    });
  });

  describe('parseGedcom and serializeGedcom roundtrip', () => {
    test('roundtrips individuals and relationships accurately', () => {
      const data: FamilyData = {
        people: [
          { id: 'father', name: 'John Doe', gender: 'male', birthDate: '1970-05-15' },
          { id: 'mother', name: 'Jane Smith', gender: 'female', birthDate: '1972-08-20' },
          {
            id: 'child1',
            name: 'Bobby Doe',
            gender: 'male',
            birthDate: '2000-01-10',
            deceased: { status: true, date: '2020-03-01', place: 'City Hospital' }
          }
        ],
        relationships: [
          { type: 'married', from: 'father', to: 'mother' },
          { type: 'parent', from: 'child1', to: 'father' },
          { type: 'parent', from: 'child1', to: 'mother' }
        ]
      };

      const serialized = serializeGedcom(data);
      expect(serialized).toContain('0 HEAD');
      expect(serialized).toContain('0 @father@ INDI');
      expect(serialized).toContain('0 @mother@ INDI');
      expect(serialized).toContain('0 @child1@ INDI');
      expect(serialized).toContain('1 DEAT Y');
      expect(serialized).toContain('0 TRLR');

      const parsed = parseGedcom(serialized);
      expect(parsed.people.length).toBe(3);
      expect(parsed.relationships.length).toBe(3);

      const child = parsed.people.find(p => p.id === 'child1');
      expect(child).toBeDefined();
      expect(child?.name).toBe('Bobby Doe');
      expect(child?.gender).toBe('male');
      expect(typeof child?.deceased).toBe('object');
      if (typeof child?.deceased === 'object') {
        expect(child.deceased.status).toBe(true);
        expect(child.deceased.date).toBe('2020-03-01');
        expect(child.deceased.place).toBe('City Hospital');
      }
    });

    test('supports divorced and foster parent relationships', () => {
      const data: FamilyData = {
        people: [
          { id: 'p1', name: 'Alice Doe', gender: 'female', birthDate: '1980-01-01' },
          { id: 'p2', name: 'Bob Doe', gender: 'male', birthDate: '1978-01-01' },
          { id: 'p3', name: 'Charlie Foster', gender: 'male', birthDate: '2010-01-01' }
        ],
        relationships: [
          { type: 'divorced', from: 'p2', to: 'p1' },
          { type: 'foster_parent', from: 'p3', to: 'p1' }
        ]
      };

      const serialized = serializeGedcom(data);
      expect(serialized).toContain('1 DIV');
      expect(serialized).toContain('2 PEDI foster');

      const parsed = parseGedcom(serialized);
      const divRel = parsed.relationships.find(r => r.type === 'divorced');
      expect(divRel).toBeDefined();

      const fosterRel = parsed.relationships.find(r => r.type === 'foster_parent');
      expect(fosterRel).toBeDefined();
      expect(fosterRel?.from).toBe('p3');
      expect(fosterRel?.to).toBe('p1');
    });

    test('handles fallback when parsing YAML text', () => {
      const yaml = `people:
  - id: "p1"
    name: "Legacy Person"
    gender: "male"
relationships: []`;

      const parsed = parseGedcom(yaml);
      expect(parsed.people.length).toBe(1);
      expect(parsed.people[0].id).toBe('p1');
      expect(parsed.people[0].name).toBe('Legacy Person');
    });
  });
});
