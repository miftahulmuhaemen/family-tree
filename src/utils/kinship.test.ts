import { describe, expect, test } from 'bun:test';
import { calculateRelationship } from './kinship';

describe('calculateRelationship', () => {
  const people = [
    { id: 'p1', gender: 'male' },
    { id: 'p2', gender: 'female' },
    { id: 'p3', gender: 'male' },
    { id: 'p4', gender: 'female' }
  ];

  test('identifies self as Me', () => {
    const rel = calculateRelationship('p1', 'p1', [], people);
    expect(rel).toBe('Me');
  });

  test('identifies wife and husband spouses correctly', () => {
    const edges = [{ source: 'p1', target: 'p2', type: 'married' }];
    expect(calculateRelationship('p1', 'p2', edges, people)).toBe('Wife');
    expect(calculateRelationship('p2', 'p1', edges, people)).toBe('Husband');
  });

  test('identifies father and son relationships correctly', () => {
    const edges = [{ source: 'p1', target: 'p3', type: 'parent' }];
    expect(calculateRelationship('p3', 'p1', edges, people)).toBe('Father');
    expect(calculateRelationship('p1', 'p3', edges, people)).toBe('Son');
  });

  test('identifies brother and sister relationships correctly', () => {
    const edges = [
      { source: 'p1', target: 'p3', type: 'parent' },
      { source: 'p1', target: 'p4', type: 'parent' }
    ];
    expect(calculateRelationship('p3', 'p4', edges, people)).toBe('Sister');
    expect(calculateRelationship('p4', 'p3', edges, people)).toBe('Brother');
  });
});
