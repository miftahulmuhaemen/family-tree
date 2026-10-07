import { useState, useMemo } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Person, Relationship } from '@/types/family';
import type { Language } from '@/utils/i18n';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { RelativePills, type RelativeItem } from './RelativePills';
import { PersonContactSection } from './PersonContactSection';
import { PersonEditForm } from './PersonEditForm';

export interface PersonDetailViewProps {
  person: Person;
  people: Person[];
  relationships: Relationship[];
  onSelectPerson?: (id: string) => void;
  onEditPerson?: (person: Person) => void;
  onAddChildToRelationship?: (parent1: Person, parent2: Person) => void;
  onChangeRelationshipStatus?: (person1Id: string, person2Id: string, type: 'married' | 'divorced' | 'not_married') => void;
  language: Language;
  terms: any;
}

export function PersonDetailView({
  person, people, relationships, onSelectPerson,
  onEditPerson, onAddChildToRelationship, onChangeRelationshipStatus, language, terms
}: PersonDetailViewProps) {
  const isNeu = useIsNeumorphic();
  const [isEditing, setIsEditing] = useState(false);

  const relatives = useMemo(() => {
    const pId = person.id;

    const spouses = relationships
      .filter(r => ['married', 'divorced', 'not_married'].includes(r.type) && (r.from === pId || r.to === pId))
      .reduce<RelativeItem[]>((acc, r) => {
        const spouseId = r.from === pId ? r.to : r.from;
        if (!acc.some(s => s.id === spouseId)) {
          const spousePerson = people.find(p => p.id === spouseId);
          acc.push({ id: spouseId, name: spousePerson?.name || spouseId, type: r.type });
        }
        return acc;
      }, []);

    const parents = relationships
      .filter(r => ['parent', 'foster_parent'].includes(r.type) && r.from === pId)
      .reduce<RelativeItem[]>((acc, r) => {
        if (!acc.some(p => p.id === r.to)) {
          const parentPerson = people.find(p => p.id === r.to);
          acc.push({ id: r.to, name: parentPerson?.name || r.to, type: r.type, isFoster: r.type === 'foster_parent' });
        }
        return acc;
      }, []);

    const children = relationships
      .filter(r => ['parent', 'foster_parent'].includes(r.type) && r.to === pId)
      .reduce<RelativeItem[]>((acc, r) => {
        if (!acc.some(c => c.id === r.from)) {
          const childPerson = people.find(p => p.id === r.from);
          acc.push({ id: r.from, name: childPerson?.name || r.from, type: r.type, isFoster: r.type === 'foster_parent' });
        }
        return acc;
      }, []);

    return { spouses, parents, children };
  }, [person.id, people, relationships]);

  const isDeceased = typeof person.deceased === 'boolean' ? person.deceased : person.deceased?.status;
  const deceasedObj = typeof person.deceased === 'object' && person.deceased !== null ? person.deceased : null;

  const age = (() => {
    if (!person.birthDate) return null;
    const today = new Date();
    const bDate = new Date(person.birthDate);
    let a = today.getFullYear() - bDate.getFullYear();
    const m = today.getMonth() - bDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) a--;
    return a;
  })();

  if (isEditing) {
    return (
      <PersonEditForm
        person={person}
        onSave={(updated) => {
          onEditPerson?.(updated);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        terms={terms}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Profile Card Header */}
      <div className={cn(
        "flex flex-col items-center p-4 rounded-2xl text-center transition-all",
        isNeu
          ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5"
          : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
      )}>
        <div className="w-full">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{person.name}</h3>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-zinc-500">
              {person.gender === 'male' ? terms.male : terms.female}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-semibold",
              isNeu
                ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-700 dark:text-zinc-300 border border-white/40 dark:border-white/5"
                : isDeceased 
                  ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" 
                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
            )}>
              {isDeceased ? terms.deceased : terms.alive}
            </span>
            {!isDeceased && age !== null && (
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold",
                isNeu
                  ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-700 dark:text-zinc-300 border border-white/40 dark:border-white/5"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              )}>
                {age} {terms.years}
              </span>
            )}
          </div>
          {deceasedObj && (deceasedObj.date || deceasedObj.place) && (
            <div className="text-xs text-zinc-500 italic mt-1.5">
              {deceasedObj.date && <span>{deceasedObj.date}</span>}
              {deceasedObj.date && deceasedObj.place && <span> • </span>}
              {deceasedObj.place && <span>{deceasedObj.place}</span>}
            </div>
          )}
        </div>

        {onEditPerson && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={cn(
              "mt-3 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 border border-white/60 dark:border-white/5"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 shadow-2xs"
            )}
          >
            <Pencil className="w-3.5 h-3.5 text-zinc-400" />
            <span>{terms.edit_person || "Edit Profil"}</span>
          </button>
        )}
      </div>

      {/* Relative Pills */}
      <RelativePills
        spouses={relatives.spouses}
        parents={relatives.parents}
        children={relatives.children}
        onSelectPerson={onSelectPerson}
        onAddChildToRelationship={onAddChildToRelationship ? (spouseId) => {
          const spousePerson = people.find(p => p.id === spouseId);
          if (spousePerson) {
            onAddChildToRelationship(person, spousePerson);
          }
        } : undefined}
        onChangeRelationshipStatus={onChangeRelationshipStatus ? (spouseId, newType) => {
          onChangeRelationshipStatus(person.id, spouseId, newType);
        } : undefined}
        terms={terms}
      />

      {/* Bio */}
      {person.short_bio && (
        <div className={cn(
          "transition-all",
          isNeu
            ? "shadow-neu-raised-sm rounded-xl p-4 bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5"
            : "bg-zinc-50 dark:bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800"
        )}>
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{terms.short_bio}</h4>
          <p className="text-zinc-700 dark:text-zinc-300 italic text-sm">
            "{person.short_bio}"
          </p>
        </div>
      )}

      {/* Contact & Address Section */}
      <PersonContactSection
        phoneNumbers={person.phone_number}
        addresses={person.address}
        phoneLabel={terms.phone_label}
        locationLabel={terms.location}
        viewMapsLabel={terms.view_maps}
      />

      {/* Metadata */}
      <div className={cn(
        "space-y-2 text-sm pt-2 transition-all",
        isNeu
          ? "shadow-neu-raised-sm rounded-xl p-4 bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5 text-zinc-600 dark:text-zinc-400"
          : "border-t border-zinc-200 dark:border-zinc-800 text-zinc-500"
      )}>
        <div className="flex justify-between">
          <span>{terms.birth_date}:</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {person.birthDate 
              ? new Date(person.birthDate).toLocaleDateString(language === 'id' ? "id-ID" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' })
              : "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>{terms.gender}:</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
            {person.gender === 'male' ? terms.male : terms.female}
          </span>
        </div>
      </div>
    </div>
  );
}
