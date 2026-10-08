import { Search } from 'lucide-react';
import type { Person } from '@/types/family';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface PersonSelectComboboxProps {
  candidates: Person[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  emptyLabel: string;
}

export function PersonSelectCombobox({
  candidates, selectedId, onSelect, searchQuery, onSearchChange, emptyLabel
}: PersonSelectComboboxProps) {
  const isNeu = useIsNeumorphic();

  const inputCls = isNeu
    ? "shadow-neu-pressed rounded-xl border border-white/40 dark:border-white/5 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
    : "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600";

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari anggota yang ada..."
          className={cn("w-full pl-9 pr-3 py-2 text-sm", inputCls)}
        />
      </div>

      <div className={cn(
        "max-h-56 overflow-y-auto space-y-1 p-1 rounded-xl border",
        isNeu
          ? "shadow-neu-pressed-sm border-white/30 dark:border-white/5 bg-[#e6e9ef]/50 dark:bg-[#181b20]/50"
          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
      )}>
        {candidates.length === 0 ? (
          <div className="text-center py-6 text-sm text-zinc-400">
            {emptyLabel}
          </div>
        ) : (
          candidates.map(p => (
            <div
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={cn(
                "p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all",
                selectedId === p.id
                  ? isNeu
                    ? "shadow-neu-pressed bg-[#dde1e9] dark:bg-[#16181d] text-zinc-900 dark:text-zinc-100 font-bold"
                    : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs"
                  : isNeu
                    ? "hover:shadow-neu-raised-sm text-zinc-700 dark:text-zinc-300"
                    : "hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                  selectedId === p.id
                    ? isNeu
                      ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                      : "bg-white/20 text-white"
                    : isNeu
                      ? "shadow-neu-pressed-sm bg-[#dde1e9] dark:bg-[#16181d] text-zinc-700 dark:text-zinc-300"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                )}>
                  {p.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium">{p.name}</span>
              </div>
              <span className={`text-xs ${selectedId === p.id ? 'text-white/80' : 'text-zinc-400'}`}>
                {p.birthDate ? p.birthDate.slice(0, 4) : ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
