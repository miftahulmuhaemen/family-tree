import { cn } from '@/lib/utils';
import { BirthYearCombobox } from './BirthYearCombobox';

export interface MemberFilterBarProps {
  filterGender: 'all' | 'male' | 'female';
  setFilterGender: (val: 'all' | 'male' | 'female') => void;
  filterStatus: 'all' | 'alive' | 'deceased';
  setFilterStatus: (val: 'all' | 'alive' | 'deceased') => void;
  filterYear: string;
  setFilterYear: (val: string) => void;
  availableYears: number[];
  terms: any;
}

export function MemberFilterBar({
  filterGender,
  setFilterGender,
  filterStatus,
  setFilterStatus,
  filterYear,
  setFilterYear,
  availableYears,
  terms
}: MemberFilterBarProps) {
  const isFiltered = filterGender !== 'all' || filterStatus !== 'all' || filterYear !== 'all';

  const handleReset = () => {
    setFilterGender('all');
    setFilterStatus('all');
    setFilterYear('all');
  };

  return (
    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Gender filter */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            {terms.filter_gender}
          </span>
          <div className="flex w-full bg-zinc-200/80 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setFilterGender('all')}
              className={cn(
                "flex-1 py-1 rounded-md font-semibold transition-all text-xs text-center",
                filterGender === 'all'
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title={terms.filter_all}
            >
              {terms.filter_all}
            </button>
            <button
              type="button"
              onClick={() => setFilterGender('male')}
              className={cn(
                "flex-1 py-1 rounded-md font-semibold transition-all text-xs text-center",
                filterGender === 'male'
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title={terms.filter_male}
            >
              L
            </button>
            <button
              type="button"
              onClick={() => setFilterGender('female')}
              className={cn(
                "flex-1 py-1 rounded-md font-semibold transition-all text-xs text-center",
                filterGender === 'female'
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title={terms.filter_female}
            >
              P
            </button>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            {terms.filter_status}
          </span>
          <div className="flex w-full bg-zinc-200/80 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={cn(
                "flex-1 py-1 rounded-md font-semibold transition-all text-xs text-center",
                filterStatus === 'all'
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title={terms.filter_all}
            >
              {terms.filter_all}
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('alive')}
              className={cn(
                "flex-1 py-1 rounded-md font-semibold transition-all text-xs text-center",
                filterStatus === 'alive'
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title={terms.filter_alive}
            >
              {terms.alive}
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('deceased')}
              className={cn(
                "flex-1 py-1 rounded-md font-semibold transition-all text-xs text-center",
                filterStatus === 'deceased'
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title={terms.filter_deceased}
            >
              {terms.deceased_badge}
            </button>
          </div>
        </div>
      </div>

      {/* Birth Year Dropdown & Reset */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-bold text-zinc-500 uppercase shrink-0">
            {terms.filter_year}:
          </span>
          <BirthYearCombobox
            value={filterYear}
            onChange={setFilterYear}
            availableYears={availableYears}
            allYearsLabel={terms.all_birth_years}
            searchPlaceholder={terms.search_year}
            notFoundLabel={terms.year_not_found}
          />
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0 px-1"
          >
            {terms.filter_reset}
          </button>
        )}
      </div>
    </div>
  );
}
