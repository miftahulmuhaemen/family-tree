import { useState, useRef, useEffect } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';
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
  const isNeu = useIsNeumorphic();
  const isFiltered = filterGender !== 'all' || filterStatus !== 'all' || filterYear !== 'all';

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const genderRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (genderRef.current && !genderRef.current.contains(e.target as Node)) {
        setIsGenderOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleReset = () => {
    setFilterGender('all');
    setFilterStatus('all');
    setFilterYear('all');
  };

  const genderLabel = filterGender === 'all'
    ? terms.filter_gender
    : filterGender === 'male'
      ? terms.filter_male
      : terms.filter_female;

  const statusLabel = filterStatus === 'all'
    ? terms.filter_status
    : filterStatus === 'alive'
      ? (terms.alive || terms.filter_alive)
      : (terms.filter_deceased || terms.deceased_badge);

  const buttonBase = isNeu
    ? "px-2.5 py-1.5 text-xs rounded-lg border border-white/60 dark:border-white/5 bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-800 dark:text-zinc-200 shadow-neu-raised-sm active:shadow-neu-pressed flex items-center justify-between gap-1 transition-all cursor-pointer select-none"
    : "px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-between gap-1 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer select-none";

  const popoverBase = isNeu
    ? "absolute left-0 top-full mt-1 min-w-[130px] rounded-xl p-1 z-50 shadow-neu-raised border border-white/60 dark:border-white/5 bg-[#e6e9ef] dark:bg-[#1c2027] animate-in fade-in zoom-in-95 duration-100"
    : "absolute left-0 top-full mt-1 min-w-[130px] rounded-xl p-1 z-50 shadow-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 animate-in fade-in zoom-in-95 duration-100";

  return (
    <div className="flex items-center gap-1.5 w-full">
      {/* 1. Gender Dropdown */}
      <div className="relative flex-1 min-w-0" ref={genderRef}>
        <button
          type="button"
          onClick={() => {
            setIsGenderOpen(!isGenderOpen);
            setIsStatusOpen(false);
          }}
          className={cn(buttonBase, "w-full", filterGender !== 'all' && "font-bold")}
          title={terms.filter_gender}
        >
          <span className="truncate">{genderLabel}</span>
          <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform", isGenderOpen && "rotate-180")} />
        </button>

        {isGenderOpen && (
          <div className={popoverBase}>
            <button
              type="button"
              onClick={() => { setFilterGender('all'); setIsGenderOpen(false); }}
              className={cn(
                "w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                filterGender === 'all'
                  ? "bg-zinc-100 dark:bg-zinc-700/60 font-bold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/40"
              )}
            >
              <span>{terms.filter_all}</span>
              {filterGender === 'all' && <CheckCircle className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
            </button>
            <button
              type="button"
              onClick={() => { setFilterGender('male'); setIsGenderOpen(false); }}
              className={cn(
                "w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                filterGender === 'male'
                  ? "bg-zinc-100 dark:bg-zinc-700/60 font-bold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/40"
              )}
            >
              <span>{terms.filter_male}</span>
              {filterGender === 'male' && <CheckCircle className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
            </button>
            <button
              type="button"
              onClick={() => { setFilterGender('female'); setIsGenderOpen(false); }}
              className={cn(
                "w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                filterGender === 'female'
                  ? "bg-zinc-100 dark:bg-zinc-700/60 font-bold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/40"
              )}
            >
              <span>{terms.filter_female}</span>
              {filterGender === 'female' && <CheckCircle className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
            </button>
          </div>
        )}
      </div>

      {/* 2. Status Dropdown */}
      <div className="relative flex-1 min-w-0" ref={statusRef}>
        <button
          type="button"
          onClick={() => {
            setIsStatusOpen(!isStatusOpen);
            setIsGenderOpen(false);
          }}
          className={cn(buttonBase, "w-full", filterStatus !== 'all' && "font-bold")}
          title={terms.filter_status}
        >
          <span className="truncate">{statusLabel}</span>
          <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform", isStatusOpen && "rotate-180")} />
        </button>

        {isStatusOpen && (
          <div className={popoverBase}>
            <button
              type="button"
              onClick={() => { setFilterStatus('all'); setIsStatusOpen(false); }}
              className={cn(
                "w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                filterStatus === 'all'
                  ? "bg-zinc-100 dark:bg-zinc-700/60 font-bold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/40"
              )}
            >
              <span>{terms.filter_all}</span>
              {filterStatus === 'all' && <CheckCircle className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
            </button>
            <button
              type="button"
              onClick={() => { setFilterStatus('alive'); setIsStatusOpen(false); }}
              className={cn(
                "w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                filterStatus === 'alive'
                  ? "bg-zinc-100 dark:bg-zinc-700/60 font-bold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/40"
              )}
            >
              <span>{terms.alive || terms.filter_alive}</span>
              {filterStatus === 'alive' && <CheckCircle className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
            </button>
            <button
              type="button"
              onClick={() => { setFilterStatus('deceased'); setIsStatusOpen(false); }}
              className={cn(
                "w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                filterStatus === 'deceased'
                  ? "bg-zinc-100 dark:bg-zinc-700/60 font-bold text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/40"
              )}
            >
              <span>{terms.filter_deceased || terms.deceased_badge}</span>
              {filterStatus === 'deceased' && <CheckCircle className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
            </button>
          </div>
        )}
      </div>

      {/* 3. Year Born Dropdown (with search) */}
      <div className="flex-1 min-w-0">
        <BirthYearCombobox
          value={filterYear}
          onChange={setFilterYear}
          availableYears={availableYears}
          allYearsLabel={terms.all_birth_years}
          placeholderLabel={terms.filter_year}
          searchPlaceholder={terms.search_year}
          notFoundLabel={terms.year_not_found}
        />
      </div>

      {/* 4. Reset Button */}
      <button
        type="button"
        onClick={handleReset}
        disabled={!isFiltered}
        className={cn(
          "px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 cursor-pointer select-none",
          isFiltered
            ? isNeu
              ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-900 dark:text-zinc-100 border-white/60 dark:border-white/5"
              : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 shadow-xs"
            : "opacity-40 cursor-not-allowed border-zinc-200 dark:border-zinc-800 text-zinc-400 bg-white dark:bg-zinc-800"
        )}
        title={terms.filter_reset}
      >
        {terms.filter_reset}
      </button>
    </div>
  );
}
