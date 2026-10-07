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
    <div ref={listRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
      {people.map(p => {
        const isDeceased = typeof p.deceased === 'boolean' ? p.deceased : p.deceased?.status;
        const isSelected = p.id === selectedPersonId;

        return (
          <div
            key={p.id}
            onClick={() => {
              onSelectPerson && onSelectPerson(p.id);
              onSwitchToDetail();
            }}
            className={cn(
              "member-card-item group p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2",
              isNeu
                ? isSelected
                  ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] ring-2 ring-indigo-500/50 border border-transparent"
                  : "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5 hover:brightness-102"
                : isSelected
                  ? "border border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-zinc-800 shadow-xs"
                  : "border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 shadow-xs"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                isNeu
                  ? p.gender === 'male'
                    ? "shadow-neu-pressed-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-400/20"
                    : "shadow-neu-pressed-sm bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-400/20"
                  : p.gender === 'male'
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60"
                    : "bg-pink-50 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300 border border-pink-200 dark:border-pink-900/60"
              )}>
                {p.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {p.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {p.birthDate && <span>{p.birthDate.slice(0, 4)}</span>}
                  {isDeceased && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px]",
                      isNeu
                        ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-600 dark:text-zinc-400 border border-white/40 dark:border-white/5"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                    )}>
                      ({terms.deceased_badge})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick card action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPerson && onSelectPerson(p.id);
                  onSwitchToDetail();
                }}
                className={cn(
                  "p-1 rounded transition-all cursor-pointer",
                  isNeu
                    ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/50 dark:border-white/5"
                    : "text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800"
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
  );
}
