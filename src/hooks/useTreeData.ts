import { useState, useEffect, useCallback } from 'react';
import YAML from 'yaml';
import type { FamilyData, Person, Relationship } from '@/types/family';

export interface UseTreeDataReturn {
  yamlContent: string;
  treeData: FamilyData | null;
  isValid: boolean;
  errorMsg: string;
  setYamlContent: (yaml: string) => void;
  updateTreeState: (newPeople: Person[], newRelationships: Relationship[]) => void;
  deduplicateRelationships: (relationships: Relationship[]) => Relationship[];
}

export function deduplicateRelationships(relationships: Relationship[]): Relationship[] {
  const seenRel = new Set<string>();
  const deduplicated: Relationship[] = [];

  for (const r of relationships) {
    if (!r || typeof r !== 'object' || !r.type || !r.from || !r.to) continue;
    const key = ['married', 'divorced', 'not_married'].includes(r.type)
      ? `${r.type}:${[r.from, r.to].sort().join('-')}`
      : `${r.type}:${r.from}:${r.to}`;

    if (!seenRel.has(key)) {
      seenRel.add(key);
      deduplicated.push(r);
    }
  }

  return deduplicated;
}

export function useTreeData(initialYaml: string = ''): UseTreeDataReturn {
  const [yamlContent, setYamlContent] = useState<string>(initialYaml);
  const [treeData, setTreeData] = useState<FamilyData | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Live Validation & Parsing
  useEffect(() => {
    if (!yamlContent) return;

    try {
      const parsed = YAML.parse(yamlContent);

      if (parsed && Array.isArray(parsed.people) && Array.isArray(parsed.relationships)) {
        const safeRelationships = deduplicateRelationships(parsed.relationships);
        const safeParsed: FamilyData = {
          people: parsed.people.filter((p: any) => p && typeof p === 'object'),
          relationships: safeRelationships
        };

        setTreeData(safeParsed);
        setIsValid(true);
        setErrorMsg('');
      } else {
        throw new Error("YAML must contain 'people' and 'relationships' arrays");
      }
    } catch (e: any) {
      setIsValid(false);
      setErrorMsg(e.message || "Invalid YAML syntax");
    }
  }, [yamlContent]);

  // Synchronize TreeData state -> YAML string
  const updateTreeState = useCallback((newPeople: Person[], newRelationships: Relationship[]) => {
    const deduplicated = deduplicateRelationships(newRelationships);
    const newData: FamilyData = { people: newPeople, relationships: deduplicated };
    const yamlString = YAML.stringify(newData);
    setYamlContent(yamlString);
  }, []);

  return {
    yamlContent,
    treeData,
    isValid,
    errorMsg,
    setYamlContent,
    updateTreeState,
    deduplicateRelationships
  };
}
