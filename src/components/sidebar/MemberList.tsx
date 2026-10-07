import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Person } from '@/types/family';

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
  if (people.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-zinc-400">
        {terms.no_members}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
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
              "group p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 shadow-xs",
              isSelected
                ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-zinc-800"
                : "border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border",
                p.gender === 'male'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-900/60'
                  : 'bg-pink-50 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300 border-pink-200 dark:border-pink-900/60'
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
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.2 rounded text-[10px]">
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
                className="p-1 rounded text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors"
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
