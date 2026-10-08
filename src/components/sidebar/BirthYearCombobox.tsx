import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, CheckCircle } from 'lucide-react';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface BirthYearComboboxProps {
  value: string;
  onChange: (year: string) => void;
  availableYears: number[];
  allYearsLabel: string;
  placeholderLabel?: string;
  searchPlaceholder?: string;
  notFoundLabel?: string;
}

export function BirthYearCombobox({
  value,
  onChange,
  availableYears,
  allYearsLabel,
  placeholderLabel,
  searchPlaceholder = "Cari tahun...",
  notFoundLabel = "Tahun tidak ditemukan"
}: BirthYearComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const isNeu = useIsNeumorphic();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredYears = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return availableYears;
    return availableYears.filter(y => y.toString().includes(q));
  }, [availableYears, searchQuery]);

  // Clamped to maximum 10 items
  const displayedYears = useMemo(() => {
    return filteredYears.slice(0, 10);
  }, [filteredYears]);

  return (
    <div className="relative flex-1 min-w-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery('');
        }}
        className={cn(
          "w-full px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between gap-1 transition-all cursor-pointer select-none",
          value !== 'all' && "font-bold",
          isNeu
            ? "border border-white/60 dark:border-white/5 bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-800 dark:text-zinc-200 shadow-neu-raised-sm active:shadow-neu-pressed"
            : "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-600"
        )}
      >
        <span className="truncate">
          {value === 'all' ? (placeholderLabel || allYearsLabel) : value}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-1 w-48 rounded-xl z-50 py-1.5 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5 shadow-neu-raised"
            : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl"
        )}>
          <div className={cn(
            "px-2 pb-1.5 border-b",
            isNeu ? "border-black/5 dark:border-white/5" : "border-zinc-100 dark:border-zinc-700/60"
          )}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  "w-full pl-7 pr-2 py-1.5 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all",
                  isNeu
                    ? "bg-black/5 dark:bg-white/5 border border-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                )}
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto pt-1">
            {(!searchQuery || "semua".includes(searchQuery.toLowerCase()) || "all".includes(searchQuery.toLowerCase())) && (
              <button
                type="button"
                onClick={() => {
                  onChange('all');
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer",
                  value === 'all'
                    ? "font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-700/60"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60"
                )}
              >
                <span>{allYearsLabel}</span>
                {value === 'all' && <CheckCircle className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
              </button>
            )}

            {displayedYears.length === 0 && searchQuery ? (
              <div className="px-3 py-2 text-xs text-zinc-400 text-center">
                {notFoundLabel}
              </div>
            ) : (
              displayedYears.map((year) => {
                const isSelected = value === year.toString();
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      onChange(year.toString());
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer",
                      isSelected
                        ? "font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-700/60"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60"
                    )}
                  >
                    <span>{year}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
