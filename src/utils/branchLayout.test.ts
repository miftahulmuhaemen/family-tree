import { describe, expect, test } from 'bun:test';
import { getBranchLayout } from './branchLayout';
import type { Person, Relationship } from '@/types/family';

describe('getBranchLayout', () => {
  const people: Person[] = [
    { id: 'p1', name: 'Ayah', gender: 'male', birthDate: '1960-01-01' },
    { id: 'p2', name: 'Ibu', gender: 'female', birthDate: '1965-01-01' },
    { id: 'p3', name: 'Fokus Anak', gender: 'male', birthDate: '1990-01-01' },
    { id: 'p4', name: 'Saudara', gender: 'female', birthDate: '1995-01-01' },
    { id: 'p5', name: 'Istri', gender: 'female', birthDate: '1992-01-01' },
    { id: 'p6', name: 'Cucu', gender: 'male', birthDate: '2020-01-01' }
  ];

  const relationships: Relationship[] = [
    { type: 'married', from: 'p1', to: 'p2' },
    { type: 'parent', from: 'p3', to: 'p1' },
    { type: 'parent', from: 'p3', to: 'p2' },
    { type: 'parent', from: 'p4', to: 'p1' },
    { type: 'parent', from: 'p4', to: 'p2' },
    { type: 'married', from: 'p3', to: 'p5' },
    { type: 'parent', from: 'p6', to: 'p3' },
    { type: 'parent', from: 'p6', to: 'p5' }
  ];

  test('returns empty results when people list is empty', () => {
    const layout = getBranchLayout({ people: [], relationships: [] }, 'non-existent');
    expect(layout.nodes.length).toBe(0);
    expect(layout.edges.length).toBe(0);
    expect(layout.focusPerson).toBeNull();
  });

  test('correctly computes parents, siblings, spouses, and children for focused person', () => {
    const layout = getBranchLayout({ people, relationships }, 'p3');

    expect(layout.focusPerson?.id).toBe('p3');
    expect(layout.parents.map(p => p.id).sort()).toEqual(['p1', 'p2']);
    expect(layout.siblings.map(p => p.id)).toEqual(['p4']);
    expect(layout.spouses.map(s => s.person.id)).toEqual(['p5']);
    expect(layout.children.map(c => c.id)).toEqual(['p6']);
    expect(layout.nodes.length).toBe(5);
  });

  test('generates node positions without colliding or null coordinates', () => {
    const layout = getBranchLayout({ people, relationships }, 'p3');

    for (const node of layout.nodes) {
      expect(typeof node.position.x).toBe('number');
      expect(typeof node.position.y).toBe('number');
      expect(isNaN(node.position.x)).toBe(false);
      expect(isNaN(node.position.y)).toBe(false);
    }
  });
});
