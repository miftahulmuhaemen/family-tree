import { useState, useEffect, useCallback } from 'react';
import type { FamilyData, Person, Relationship } from '@/types/family';
import { parseGedcom, serializeGedcom, deduplicateRelationships } from '@/utils/gedcom';

export interface UseTreeDataReturn {
  gedcomContent: string;
  yamlContent: string; // Backward compatibility alias
  treeData: FamilyData | null;
  isValid: boolean;
  errorMsg: string;
  setGedcomContent: (gedcom: string) => void;
  setYamlContent: (gedcom: string) => void; // Backward compatibility alias
  updateTreeState: (newPeople: Person[], newRelationships: Relationship[]) => void;
  deduplicateRelationships: (relationships: Relationship[]) => Relationship[];
}

export { deduplicateRelationships };

export function useTreeData(initialContent: string = ''): UseTreeDataReturn {
  const [content, setContent] = useState<string>(initialContent);
  const [treeData, setTreeData] = useState<FamilyData | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Live Validation & Parsing
  useEffect(() => {
    if (!content) return;

    try {
      const parsed = parseGedcom(content);

      if (parsed && Array.isArray(parsed.people)) {
        const safeRelationships = deduplicateRelationships(parsed.relationships);
        const safeParsed: FamilyData = {
          people: parsed.people.filter((p: any) => p && typeof p === 'object'),
          relationships: safeRelationships
        };

        setTreeData(safeParsed);
        setIsValid(true);
        setErrorMsg('');
      } else {
        throw new Error("GEDCOM data must contain individuals and relationships");
      }
    } catch (e: any) {
      setIsValid(false);
      setErrorMsg(e.message || "Invalid GEDCOM syntax");
    }
  }, [content]);

  // Synchronize TreeData state -> GEDCOM string
  const updateTreeState = useCallback((newPeople: Person[], newRelationships: Relationship[]) => {
    const deduplicated = deduplicateRelationships(newRelationships);
    const newData: FamilyData = { people: newPeople, relationships: deduplicated };
    const gedcomString = serializeGedcom(newData);
    setContent(gedcomString);
  }, []);

  return {
    gedcomContent: content,
    yamlContent: content,
    treeData,
    isValid,
    errorMsg,
    setGedcomContent: setContent,
    setYamlContent: setContent,
    updateTreeState,
    deduplicateRelationships
  };
}
