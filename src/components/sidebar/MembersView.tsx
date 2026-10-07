import { Plus, Search } from 'lucide-react';
import type { Person } from '@/types/family';
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
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
      {/* Add Button & Search */}
      <div className="space-y-2">
        {onAddPerson && (
          <button
            onClick={onAddPerson}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{terms.add_person}</span>
          </button>
        )}

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={terms.search_members}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
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
