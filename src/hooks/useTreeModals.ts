import { useState, useCallback, useMemo } from 'react';
import type { FamilyData, Person, Relationship } from '@/types/family';
import type { RelativeType } from '@/components/AddRelativeModal';

export interface AddRelativePayload {
  targetPersonId: string;
  relativeType: RelativeType;
  isNewPerson: boolean;
  personData?: Partial<Person>;
  existingPersonId?: string;
  relationshipStatus?: 'married' | 'divorced' | 'not_married';
  isFoster?: boolean;
  secondParentId?: string;
}

export interface UseTreeModalsProps {
  treeData: FamilyData | null;
  updateTreeState: (people: Person[], rels: Relationship[]) => void;
  povId: string | null;
  setPovId: (id: string | null) => void;
}

export interface UseTreeModalsReturn {
  isPersonModalOpen: boolean;
  editingPerson: Person | null;
  isRelativeModalOpen: boolean;
  relativeTargetPerson: Person | null;
  secondParent: Person | null;
  relativeType: RelativeType;
  targetSpouses: Person[];
  openEditPerson: (person: Person) => void;
  openAddPerson: () => void;
  closePersonModal: () => void;
  openAddRelative: (targetPerson: Person, type: RelativeType) => void;
  openAddRelationshipChild: (parent1: Person, parent2: Person) => void;
  closeRelativeModal: () => void;
  handleSavePerson: (person: Person) => void;
  handleDeletePerson: (personId: string) => void;
  handleAddRelative: (payload: AddRelativePayload) => void;
  handleAddDirectRelationship: (rel: { type: 'parent' | 'married' | 'divorced' | 'not_married'; from: string; to: string }) => void;
}

export function useTreeModals({
  treeData,
  updateTreeState,
  povId,
  setPovId
}: UseTreeModalsProps): UseTreeModalsReturn {
  const [isPersonModalOpen, setIsPersonModalOpen] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const [isRelativeModalOpen, setIsRelativeModalOpen] = useState<boolean>(false);
  const [relativeTargetPerson, setRelativeTargetPerson] = useState<Person | null>(null);
  const [secondParent, setSecondParent] = useState<Person | null>(null);
  const [relativeType, setRelativeType] = useState<RelativeType>('spouse');

  const openEditPerson = useCallback((person: Person) => {
    setEditingPerson(person);
    setIsPersonModalOpen(true);
  }, []);

  const openAddPerson = useCallback(() => {
    setEditingPerson(null);
    setIsPersonModalOpen(true);
  }, []);

  const closePersonModal = useCallback(() => {
    setIsPersonModalOpen(false);
    setEditingPerson(null);
  }, []);

  const openAddRelative = useCallback((targetPerson: Person, type: RelativeType) => {
    setRelativeTargetPerson(targetPerson);
    setSecondParent(null);
    setRelativeType(type);
    setIsRelativeModalOpen(true);
  }, []);

  const openAddRelationshipChild = useCallback((parent1: Person, parent2: Person) => {
    setRelativeTargetPerson(parent1);
    setSecondParent(parent2);
    setRelativeType('child');
    setIsRelativeModalOpen(true);
  }, []);

  const closeRelativeModal = useCallback(() => {
    setIsRelativeModalOpen(false);
    setRelativeTargetPerson(null);
    setSecondParent(null);
  }, []);

  // Compute spouses of the target person
  const targetSpouses = useMemo(() => {
    if (!relativeTargetPerson || !treeData) return [];
    return treeData.relationships
      .filter(r => ['married', 'divorced', 'not_married'].includes(r.type) && (r.from === relativeTargetPerson.id || r.to === relativeTargetPerson.id))
      .map(r => {
        const spouseId = r.from === relativeTargetPerson.id ? r.to : r.from;
        return treeData.people.find(p => p.id === spouseId);
      })
      .filter(Boolean) as Person[];
  }, [relativeTargetPerson, treeData]);

  // Add or Edit Person
  const handleSavePerson = useCallback((person: Person) => {
    if (!treeData) return;
    const existingIndex = treeData.people.findIndex(p => p.id === person.id);
    let updatedPeople: Person[];
    if (existingIndex >= 0) {
      updatedPeople = treeData.people.map(p => p.id === person.id ? person : p);
    } else {
      updatedPeople = [...treeData.people, person];
    }
    updateTreeState(updatedPeople, treeData.relationships);
  }, [treeData, updateTreeState]);

  // Delete Person
  const handleDeletePerson = useCallback((personId: string) => {
    if (!treeData) return;
    const updatedPeople = treeData.people.filter(p => p.id !== personId);
    const updatedRelationships = treeData.relationships.filter(
      r => r.from !== personId && r.to !== personId
    );
    if (povId === personId) {
      setPovId(null);
    }
    updateTreeState(updatedPeople, updatedRelationships);
  }, [treeData, povId, setPovId, updateTreeState]);

  // Add Relative (Spouse, Child, Parent)
  const handleAddRelative = useCallback((payload: AddRelativePayload) => {
    if (!treeData) return;

    let relativeId = payload.existingPersonId;
    let newPeople = [...treeData.people];

    if (payload.isNewPerson && payload.personData) {
      const generatedId = `p_${crypto.randomUUID().slice(0, 8)}`;
      const newPerson: Person = {
        id: generatedId,
        name: payload.personData.name || 'Anggota Baru',
        gender: payload.personData.gender || 'male',
        ...(payload.personData.birthDate ? { birthDate: payload.personData.birthDate } : {})
      };
      newPeople.push(newPerson);
      relativeId = generatedId;
    }

    if (!relativeId) return;

    const newRelationships = [...treeData.relationships];

    if (payload.relativeType === 'spouse') {
      newRelationships.push({
        type: payload.relationshipStatus || 'married',
        from: payload.targetPersonId,
        to: relativeId
      });
    } else if (payload.relativeType === 'child') {
      const relType = payload.isFoster ? 'foster_parent' : 'parent';

      if (!payload.isFoster) {
        const currentBioParents = treeData.relationships.filter(
          r => r.type === 'parent' && r.from === relativeId
        );
        const addingCount = payload.secondParentId ? 2 : 1;
        if (currentBioParents.length + addingCount > 2) {
          alert("Gagal: Anak tidak boleh memiliki lebih dari 2 orang tua kandung!");
          return;
        }
      }

      newRelationships.push({
        type: relType,
        from: relativeId,
        to: payload.targetPersonId
      });
      if (payload.secondParentId && payload.secondParentId !== payload.targetPersonId) {
        newRelationships.push({
          type: relType,
          from: relativeId,
          to: payload.secondParentId
        });
      }
    } else if (payload.relativeType === 'foster_child') {
      newRelationships.push({
        type: 'foster_parent',
        from: relativeId,
        to: payload.targetPersonId
      });
      if (payload.secondParentId && payload.secondParentId !== payload.targetPersonId) {
        newRelationships.push({
          type: 'foster_parent',
          from: relativeId,
          to: payload.secondParentId
        });
      }
    } else if (payload.relativeType === 'parent') {
      const relType = payload.isFoster ? 'foster_parent' : 'parent';

      if (!payload.isFoster) {
        const existingBioParents = treeData.relationships.filter(
          r => r.type === 'parent' && r.from === payload.targetPersonId
        );
        if (existingBioParents.length >= 2) {
          alert("Gagal: Seseorang tidak dapat memiliki lebih dari 2 orang tua kandung!");
          return;
        }
        if (existingBioParents.some(r => r.to === relativeId)) {
          alert("Gagal: Hubungan orang tua kandung ini sudah ada!");
          return;
        }
      } else {
        const alreadyFoster = treeData.relationships.some(
          r => r.type === 'foster_parent' && r.from === payload.targetPersonId && r.to === relativeId
        );
        if (alreadyFoster) {
          alert("Gagal: Hubungan orang tua angkat/wali ini sudah ada!");
          return;
        }
      }

      newRelationships.push({
        type: relType,
        from: payload.targetPersonId,
        to: relativeId
      });
    }

    updateTreeState(newPeople, newRelationships);
  }, [treeData, updateTreeState]);

  // Direct relationship connection (drag-and-drop from canvas)
  const handleAddDirectRelationship = useCallback((rel: { type: 'parent' | 'married' | 'divorced' | 'not_married'; from: string; to: string }) => {
    if (!treeData) return;

    if (rel.type === 'parent') {
      const existingBioParents = treeData.relationships.filter(
        r => r.type === 'parent' && r.from === rel.from
      );
      if (existingBioParents.length >= 2) {
        alert("Gagal: Anggota ini sudah memiliki 2 orang tua kandung!");
        return;
      }
      if (existingBioParents.some(r => r.to === rel.to)) {
        alert("Hubungan orang tua ini sudah tercatat.");
        return;
      }
    } else if (['married', 'divorced', 'not_married'].includes(rel.type)) {
      const existingIdx = treeData.relationships.findIndex(
        r => ['married', 'divorced', 'not_married'].includes(r.type) &&
             ((r.from === rel.from && r.to === rel.to) || (r.from === rel.to && r.to === rel.from))
      );
      if (existingIdx >= 0) {
        const updated = [...treeData.relationships];
        updated[existingIdx] = rel;
        updateTreeState(treeData.people, updated);
        return;
      }
    }

    updateTreeState(treeData.people, [...treeData.relationships, rel]);
  }, [treeData, updateTreeState]);

  return {
    isPersonModalOpen,
    editingPerson,
    isRelativeModalOpen,
    relativeTargetPerson,
    secondParent,
    relativeType,
    targetSpouses,
    openEditPerson,
    openAddPerson,
    closePersonModal,
    openAddRelative,
    openAddRelationshipChild,
    closeRelativeModal,
    handleSavePerson,
    handleDeletePerson,
    handleAddRelative,
    handleAddDirectRelationship
  };
}
