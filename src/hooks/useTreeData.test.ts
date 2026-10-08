import { describe, expect, test } from 'bun:test';
import { deduplicateRelationships } from './useTreeData';
import type { Relationship } from '@/types/family';

describe('deduplicateRelationships', () => {
  test('removes duplicate marriage relationships regardless of order', () => {
    const rels: Relationship[] = [
      { type: 'married', from: 'person-1', to: 'person-2' },
      { type: 'married', from: 'person-2', to: 'person-1' }
    ];
    const result = deduplicateRelationships(rels);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({ type: 'married', from: 'person-1', to: 'person-2' });
  });

  test('preserves directional parent-child relationships', () => {
    const rels: Relationship[] = [
      { type: 'parent', from: 'child-1', to: 'parent-1' },
      { type: 'parent', from: 'child-1', to: 'parent-2' },
      { type: 'parent', from: 'child-1', to: 'parent-1' } // duplicate
    ];
    const result = deduplicateRelationships(rels);
    expect(result.length).toBe(2);
  });

  test('filters out invalid or empty relationship objects', () => {
    const rels: any[] = [
      null,
      {},
      { type: 'married' },
      { type: 'married', from: 'p1', to: 'p2' }
    ];
    const result = deduplicateRelationships(rels);
    expect(result.length).toBe(1);
    expect(result[0].from).toBe('p1');
  });

  test('handles empty array without error', () => {
    const result = deduplicateRelationships([]);
    expect(result).toEqual([]);
  });
});
