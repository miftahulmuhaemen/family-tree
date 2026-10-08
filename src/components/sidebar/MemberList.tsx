import { useRef } from 'react';
import { Pencil } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import type { Person } from '@/types/family';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

export interface MemberListProps {
  people: Person[];
  selectedPersonId: string | null;
  onSelectPerson?: (id: string) => void;
  onSwitchToDetail: () => void;
  terms: any;
}

export function MemberList({
  people,
  selectedPersonId,
  onSelectPerson,
  onSwitchToDetail,
  terms
}: MemberListProps) {
  const isNeu = useIsNeumorphic();
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!listRef.current) return;
    const cards = listRef.current.querySelectorAll('.member-card-item');
    if (cards.length === 0) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.25, stagger: 0.02, ease: 'power2.out' }
    );
  }, { scope: listRef, dependencies: [people] });

  if (people.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-zinc-400">
        {terms.no_members}
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto [direction:rtl]">
      <div className="[direction:ltr] pl-3.5 pr-1 space-y-2.5">
        {people.map(p => {
          const isDeceased = typeof p.deceased === 'boolean' ? p.deceased : p.deceased?.status;
          const isSelected = p.id === selectedPersonId;

          const genderLabel = p.gender === 'female'
            ? (terms.filter_female || "Female")
            : p.gender === 'male'
              ? (terms.filter_male || "Male")
              : null;
          const birthYear = p.birthDate ? p.birthDate.slice(0, 4) : null;
          const statusLabel = isDeceased
            ? (terms.filter_deceased || terms.deceased || "Deceased")
            : (terms.alive || terms.filter_alive || "Alive");

          return (
            <div
              key={p.id}
              onClick={() => {
                onSelectPerson && onSelectPerson(p.id);
                onSwitchToDetail();
              }}
              className={cn(
                "member-card-item group p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3",
                isNeu
                  ? isSelected
                    ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] ring-2 ring-indigo-500/50 border border-transparent"
                    : "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5 hover:brightness-102"
                  : isSelected
                    ? "border border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-zinc-800 shadow-xs"
                    : "border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 shadow-xs"
              )}
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 truncate leading-snug">
                  {p.name}
                </h4>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 flex-wrap mt-0.5">
                  {genderLabel && <span>({genderLabel})</span>}
                  {birthYear && (
                    <>
                      <span className="text-zinc-300 dark:text-zinc-600 select-none">•</span>
                      <span>{birthYear}</span>
                    </>
                  )}
                  <span className="text-zinc-300 dark:text-zinc-600 select-none">•</span>
                  <span>{statusLabel}</span>
                </div>
              </div>

              {/* Quick card action buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPerson && onSelectPerson(p.id);
                    onSwitchToDetail();
                  }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all cursor-pointer",
                    isNeu
                      ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-white/50 dark:border-white/5"
                      : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                  title={terms.edit_person}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
