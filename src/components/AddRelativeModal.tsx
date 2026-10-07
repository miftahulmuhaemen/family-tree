import { useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Person, Relationship } from '@/types/family';
import { TERMS, type Language } from '@/utils/i18n';
import { useAddRelativeForm } from '@/hooks/useAddRelativeForm';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { PersonSelectCombobox } from './modals/PersonSelectCombobox';
import { NewRelativeFieldsGroup } from './modals/NewRelativeFieldsGroup';
import { RelativeTypeOptions } from './modals/RelativeTypeOptions';
import { parseBirthYear } from '@/utils/date';

gsap.registerPlugin(useGSAP);

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
    targetPersonId: string; relativeType: RelativeType; isNewPerson: boolean;
    personData?: Partial<Person>; existingPersonId?: string;
    relationshipStatus?: 'married' | 'divorced' | 'not_married'; isFoster?: boolean; secondParentId?: string;
  }) => void;
  language?: Language;
}

export function AddRelativeModal({
  isOpen, onClose, targetPerson, secondParent, relativeType,
  allPeople, allRelationships = [], spousesOfTarget = [],
  onAddRelative, language = 'id'
}: AddRelativeModalProps) {
  const terms = TERMS[language];
  const isNeu = useIsNeumorphic();
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.24, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const {
    mode, setMode, name, setName, gender, setGender, birthDate, setBirthDate,
    selectedPersonId, setSelectedPersonId, searchQuery, setSearchQuery,
    relationshipStatus, setRelationshipStatus, isFoster, setIsFoster,
    secondParentId, setSecondParentId, candidatePeople, isMaxBioParentsReached
  } = useAddRelativeForm({
    isOpen, targetPerson, secondParent, relativeType,
    allPeople, allRelationships, spousesOfTarget
  });

  if (!isOpen || !targetPerson) return null;

  const getTitle = () => {
    if (relativeType === 'spouse') return `${terms.add_spouse} (${targetPerson.name})`;
    if (relativeType === 'foster_child') return `${terms.add_foster_child || terms.foster} (${targetPerson.name})`;
    if (relativeType === 'child') {
      return secondParent ? `${terms.add_child} (${targetPerson.name} & ${secondParent.name})` : `${terms.add_child} (${targetPerson.name})`;
    }
    return `${terms.add_parent} (${targetPerson.name})`;
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
          alert(terms.err_parent_younger || "Gagal: Tahun kelahiran orang tua tidak boleh sama atau lebih muda dari anak!");
          return;
        }
        if ((relativeType === 'child' || relativeType === 'foster_child') && !isFoster) {
          if (newPersonYear <= targetYear || (secondParentYear !== null && newPersonYear <= secondParentYear)) {
            alert(terms.err_child_older || "Gagal: Tahun kelahiran anak tidak boleh sama atau lebih tua dari orang tua!");
            return;
          }
        }
      }
      onAddRelative({
        targetPersonId: targetPerson.id, relativeType, isNewPerson: true,
        personData: { name: name.trim(), gender, ...(birthDate ? { birthDate } : {}) },
        relationshipStatus, isFoster, secondParentId: secondParentId || undefined
      });
    } else {
      if (!selectedPersonId) return;
      onAddRelative({
        targetPersonId: targetPerson.id, relativeType, isNewPerson: false,
        existingPersonId: selectedPersonId, relationshipStatus, isFoster,
        secondParentId: secondParentId || undefined
      });
    }
    onClose();
  };

  const tabCls = (active: boolean) => cn(
    "flex-1 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer",
    active
      ? isNeu ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] text-indigo-600 dark:text-indigo-400" : "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs"
      : isNeu ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-white/50 dark:border-white/5" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-md shadow-2xl overflow-hidden",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-3xl"
            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
        )}
      >
        {/* Modal Header */}
        <div className={cn("flex items-center justify-between p-4 border-b", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")}>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate">{getTitle()}</h3>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "p-1.5 rounded-xl transition-all cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-white/60 dark:border-white/5"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className={cn("flex border-b p-2 gap-2", isNeu ? "border-white/40 dark:border-white/5 bg-transparent" : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50")}>
          <button type="button" onClick={() => setMode('new')} className={tabCls(mode === 'new')}>
            {terms.create_new}
          </button>
          <button type="button" onClick={() => setMode('existing')} className={tabCls(mode === 'existing')}>
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
          <div className={cn("flex items-center justify-end gap-2 pt-3 border-t", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")}>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer",
                isNeu
                  ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] hover:shadow-neu-raised active:shadow-neu-pressed text-zinc-600 dark:text-zinc-400 border border-white/50 dark:border-white/5"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {terms.cancel}
            </button>
            <button
              type="submit"
              disabled={mode === 'new' ? !name.trim() : !selectedPersonId}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50",
                isNeu
                  ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] hover:shadow-neu-raised active:shadow-neu-pressed text-indigo-600 dark:text-indigo-400 border border-white/60 dark:border-white/5 font-bold"
                  : "text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
              )}
            >
              Simpan Hubungan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
