import { Plus, Search } from 'lucide-react';
import type { Person } from '@/types/family';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { MemberFilterBar } from './MemberFilterBar';
import { MemberList } from './MemberList';

export interface MembersViewProps {
  people: Person[];
  filteredPeople: Person[];
  selectedPersonId: string | null;
  onSelectPerson?: (id: string) => void;
  onAddPerson?: () => void;
  onSwitchToDetail: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterGender: 'all' | 'male' | 'female';
  setFilterGender: (val: 'all' | 'male' | 'female') => void;
  filterStatus: 'all' | 'alive' | 'deceased';
  setFilterStatus: (val: 'all' | 'alive' | 'deceased') => void;
  filterYear: string;
  setFilterYear: (val: string) => void;
  availableYears: number[];
  terms: any;
}

export function MembersView({
  filteredPeople,
  selectedPersonId,
  onSelectPerson,
  onAddPerson,
  onSwitchToDetail,
  searchQuery,
  setSearchQuery,
  filterGender,
  setFilterGender,
  filterStatus,
  setFilterStatus,
  filterYear,
  setFilterYear,
  availableYears,
  terms
}: MembersViewProps) {
  const isNeu = useIsNeumorphic();

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
      {/* Add Button & Search */}
      <div className="space-y-2">
        {onAddPerson && (
          <button
            type="button"
            onClick={onAddPerson}
            className={cn(
              "w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-indigo-600 dark:text-indigo-400 border border-white/60 dark:border-white/10 hover:brightness-105"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            )}
          >
            <Plus className="w-4 h-4" />
            <span>{terms.add_person}</span>
          </button>
        )}

        <div className="relative">
          <Search className={cn(
            "w-3.5 h-3.5 absolute left-3 top-2.5 transition-colors",
            isNeu ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400"
          )} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={terms.search_members}
            className={cn(
              "w-full pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none transition-all",
              isNeu
                ? "shadow-neu-pressed rounded-xl border border-white/50 dark:border-white/5 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:ring-1 focus:ring-indigo-500/40"
                : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-1 focus:ring-blue-500"
            )}
          />
        </div>

        {/* Filter Controls: Gender, Deceased Status, Year Born */}
        <MemberFilterBar
          filterGender={filterGender}
          setFilterGender={setFilterGender}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterYear={filterYear}
          setFilterYear={setFilterYear}
          availableYears={availableYears}
          terms={terms}
        />
      </div>

      {/* Members Scrollable List */}
      <MemberList
        people={filteredPeople}
        selectedPersonId={selectedPersonId}
        onSelectPerson={onSelectPerson}
        onSwitchToDetail={onSwitchToDetail}
        terms={terms}
      />
    </div>
  );
}
