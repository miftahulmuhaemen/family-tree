import { useState, useEffect, useMemo } from 'react';
import type { Person, Relationship } from '@/types/family';
import type { RelativeType } from '@/components/AddRelativeModal';
import { parseBirthYear } from '@/utils/date';

export interface UseAddRelativeFormProps {
  isOpen: boolean;
  targetPerson: Person | null;
  secondParent?: Person | null;
  relativeType: RelativeType;
  allPeople: Person[];
  allRelationships?: Relationship[];
  spousesOfTarget?: Person[];
}

export function useAddRelativeForm({
  isOpen,
  targetPerson,
  secondParent,
  relativeType,
  allPeople,
  allRelationships = [],
  spousesOfTarget = []
}: UseAddRelativeFormProps) {
  const targetBioParents = useMemo(() => {
    if (!targetPerson) return [];
    return allRelationships
      .filter(r => r.type === 'parent' && r.from === targetPerson.id)
      .map(r => allPeople.find(p => p.id === r.to))
      .filter(Boolean) as Person[];
  }, [targetPerson, allRelationships, allPeople]);

  const hasBioFather = targetBioParents.some(p => p.gender === 'male');
  const hasBioMother = targetBioParents.some(p => p.gender === 'female');
  const isMaxBioParentsReached = targetBioParents.length >= 2;

  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState<'married' | 'divorced' | 'not_married'>('married');
  const [isFoster, setIsFoster] = useState(false);
  const [secondParentId, setSecondParentId] = useState<string>('');

  useEffect(() => {
    if (!targetPerson) return;

    if (relativeType === 'spouse') {
      setGender(targetPerson.gender === 'male' ? 'female' : 'male');
      setIsFoster(false);
    } else if (relativeType === 'parent') {
      if (isMaxBioParentsReached) {
        setIsFoster(true);
        setGender('female');
      } else if (hasBioFather && !hasBioMother) {
        setGender('female');
        setIsFoster(false);
      } else if (hasBioMother && !hasBioFather) {
        setGender('male');
        setIsFoster(false);
      } else {
        setGender('male');
        setIsFoster(false);
      }
    } else if (relativeType === 'foster_child') {
      setGender('male');
      setIsFoster(true);
    } else {
      setGender('male');
      setIsFoster(false);
    }

    if (secondParent) {
      setSecondParentId(secondParent.id);
    } else if (relativeType === 'child') {
      setSecondParentId(spousesOfTarget[0]?.id || '');
    } else {
      setSecondParentId('');
    }

    setName('');
    setSelectedPersonId('');
    setSearchQuery('');
    setRelationshipStatus('married');
  }, [isOpen, targetPerson, secondParent, relativeType, isMaxBioParentsReached, hasBioFather, hasBioMother, spousesOfTarget]);

  const candidatePeople = useMemo(() => {
    if (!targetPerson) return [];
    const targetYear = parseBirthYear(targetPerson.birthDate);
    const secondParentYear = secondParent ? parseBirthYear(secondParent.birthDate) : null;

    return allPeople.filter(p => {
      if (p.id === targetPerson.id) return false;
      if (secondParent && p.id === secondParent.id) return false;
      const candidateYear = parseBirthYear(p.birthDate);

      // Chronological age validation:
      // Parent cannot be born after (younger than) the child
      if (relativeType === 'parent') {
        if (targetYear !== null && candidateYear !== null && candidateYear >= targetYear) {
          return false;
        }

        const alreadyParent = allRelationships.some(
          r => (r.type === 'parent' || r.type === 'foster_parent') && r.from === targetPerson.id && r.to === p.id
        );
        if (alreadyParent) return false;

        if (!isFoster) {
          if (hasBioFather && p.gender === 'male') return false;
          if (hasBioMother && p.gender === 'female') return false;
        }
      }

      // Child cannot be born before (older than) the parent
      if (relativeType === 'child' || relativeType === 'foster_child') {
        if (!isFoster) {
          if (targetYear !== null && candidateYear !== null && candidateYear <= targetYear) {
            return false;
          }
          if (secondParentYear !== null && candidateYear !== null && candidateYear <= secondParentYear) {
            return false;
          }
        }

        const alreadyChildOfTarget = allRelationships.some(
          r => (r.type === 'parent' || r.type === 'foster_parent') && r.from === p.id && r.to === targetPerson.id
        );
        if (alreadyChildOfTarget) return false;

        if (secondParent) {
          const alreadyChildOfSecond = allRelationships.some(
            r => (r.type === 'parent' || r.type === 'foster_parent') && r.from === p.id && r.to === secondParent.id
          );
          if (alreadyChildOfSecond) return false;
        }
      }

      if (searchQuery.trim()) {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [targetPerson, secondParent, allPeople, relativeType, allRelationships, isFoster, hasBioFather, hasBioMother, searchQuery]);

  return {
    mode,
    setMode,
    name,
    setName,
    gender,
    setGender,
    birthDate,
    setBirthDate,
    selectedPersonId,
    setSelectedPersonId,
    searchQuery,
    setSearchQuery,
    relationshipStatus,
    setRelationshipStatus,
    isFoster,
    setIsFoster,
    secondParentId,
    setSecondParentId,
    candidatePeople,
    isMaxBioParentsReached
  };
}
