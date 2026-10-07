import { X } from 'lucide-react';
import type { Person, Relationship } from '@/types/family';
import { TERMS } from '@/utils/i18n';
import type { Language } from '@/utils/i18n';
import { useAddRelativeForm } from '@/hooks/useAddRelativeForm';
import { PersonSelectCombobox } from './modals/PersonSelectCombobox';
import { NewRelativeFieldsGroup } from './modals/NewRelativeFieldsGroup';
import { RelativeTypeOptions } from './modals/RelativeTypeOptions';
import { parseBirthYear } from '@/utils/date';

export type RelativeType = 'spouse' | 'child' | 'parent' | 'foster_child';

export interface AddRelativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPerson: Person | null;
  secondParent?: Person | null;
  relativeType: RelativeType;
  allPeople: Person[];
  allRelationships?: Relationship[];
  spousesOfTarget?: Person[];
  onAddRelative: (payload: {
    targetPersonId: string;
    relativeType: RelativeType;
    isNewPerson: boolean;
    personData?: Partial<Person>;
    existingPersonId?: string;
    relationshipStatus?: 'married' | 'divorced' | 'not_married';
    isFoster?: boolean;
    secondParentId?: string;
  }) => void;
  language?: Language;
}

export function AddRelativeModal({
  isOpen,
  onClose,
  targetPerson,
  secondParent,
  relativeType,
  allPeople,
  allRelationships = [],
  spousesOfTarget = [],
  onAddRelative,
  language = 'id'
}: AddRelativeModalProps) {
  const terms = TERMS[language];

  const {
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
  } = useAddRelativeForm({
    isOpen,
    targetPerson,
    secondParent,
    relativeType,
    allPeople,
    allRelationships,
    spousesOfTarget
  });

  if (!isOpen || !targetPerson) return null;

  const getTitle = () => {
    switch (relativeType) {
      case 'spouse':
        return `${terms.add_spouse} / Mantan (${targetPerson.name})`;
      case 'foster_child':
        return `Tambah Anak Angkat (${targetPerson.name})`;
      case 'child':
        if (secondParent) {
          return `Tambah Anak (${targetPerson.name} & ${secondParent.name})`;
        }
        return `${terms.add_child} (${targetPerson.name})`;
      case 'parent':
        return `${terms.add_parent} (${targetPerson.name})`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'new') {
      if (!name.trim()) return;

      const targetYear = parseBirthYear(targetPerson.birthDate);
      const secondParentYear = secondParent ? parseBirthYear(secondParent.birthDate) : null;
      const newPersonYear = parseBirthYear(birthDate);

      if (targetYear !== null && newPersonYear !== null) {
        if (relativeType === 'parent' && newPersonYear >= targetYear) {
          alert("Gagal: Tahun kelahiran orang tua tidak boleh sama atau lebih muda dari anak!");
          return;
        }
        if ((relativeType === 'child' || relativeType === 'foster_child') && !isFoster) {
          if (newPersonYear <= targetYear) {
            alert("Gagal: Tahun kelahiran anak tidak boleh sama atau lebih tua dari orang tua!");
            return;
          }
          if (secondParentYear !== null && newPersonYear <= secondParentYear) {
            alert("Gagal: Tahun kelahiran anak tidak boleh sama atau lebih tua dari orang tua kedua!");
            return;
          }
        }
      }

      onAddRelative({
        targetPersonId: targetPerson.id,
        relativeType,
        isNewPerson: true,
        personData: {
          name: name.trim(),
          gender,
          ...(birthDate ? { birthDate } : {})
        },
        relationshipStatus,
        isFoster,
        secondParentId: secondParentId || undefined
      });
    } else {
      if (!selectedPersonId) return;
      onAddRelative({
        targetPersonId: targetPerson.id,
        relativeType,
        isNewPerson: false,
        existingPersonId: selectedPersonId,
        relationshipStatus,
        isFoster,
        secondParentId: secondParentId || undefined
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate">
            {getTitle()}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 p-2 gap-2 bg-zinc-50 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              mode === 'new' 
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs' 
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {terms.create_new}
          </button>
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              mode === 'existing' 
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs' 
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {terms.pick_existing}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <RelativeTypeOptions
            relativeType={relativeType}
            relationshipStatus={relationshipStatus}
            setRelationshipStatus={setRelationshipStatus}
            isFoster={isFoster}
            setIsFoster={setIsFoster}
            isMaxBioParentsReached={isMaxBioParentsReached}
            spousesOfTarget={spousesOfTarget}
            secondParentId={secondParentId}
            setSecondParentId={setSecondParentId}
            targetPerson={targetPerson}
            secondParent={secondParent}
            terms={terms}
          />

          {mode === 'new' ? (
            <NewRelativeFieldsGroup
              name={name}
              setName={setName}
              gender={gender}
              setGender={setGender}
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              terms={terms}
            />
          ) : (
            <PersonSelectCombobox
              candidates={candidatePeople}
              selectedId={selectedPersonId}
              onSelect={setSelectedPersonId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              emptyLabel={terms.no_members}
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              {terms.cancel}
            </button>
            <button
              type="submit"
              disabled={mode === 'new' ? !name.trim() : !selectedPersonId}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
            >
              Simpan Hubungan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
