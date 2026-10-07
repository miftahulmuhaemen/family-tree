import { Search } from 'lucide-react';
import type { Person } from '@/types/family';

export interface PersonSelectComboboxProps {
  candidates: Person[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  emptyLabel: string;
}

export function PersonSelectCombobox({
  candidates,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  emptyLabel
}: PersonSelectComboboxProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari anggota yang ada..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="max-h-56 overflow-y-auto space-y-1 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        {candidates.length === 0 ? (
          <div className="text-center py-6 text-sm text-zinc-400">
            {emptyLabel}
          </div>
        ) : (
          candidates.map(p => (
            <div
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`p-2.5 rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                selectedId === p.id 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  selectedId === p.id 
                    ? 'bg-white/20 text-white' 
                    : p.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
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
