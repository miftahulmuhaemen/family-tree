import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';

export interface RelativeItem {
  id: string;
  name: string;
  type?: string;
  isFoster?: boolean;
}

export interface RelativePillsProps {
  spouses: RelativeItem[];
  parents: RelativeItem[];
  children: RelativeItem[];
  onSelectPerson?: (id: string) => void;
  onAddChildToRelationship?: (spouseId: string) => void;
  terms: any;
}

export function RelativePills({
  spouses,
  parents,
  children,
  onSelectPerson,
  onAddChildToRelationship,
  terms
}: RelativePillsProps) {
  const isNeu = useIsNeumorphic();

  if (spouses.length === 0 && parents.length === 0 && children.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "space-y-3 text-xs transition-all",
      isNeu
        ? "shadow-neu-raised-sm rounded-xl p-4 bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5"
        : "p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800"
    )}>
      {spouses.length > 0 && (
        <div>
          <span className="font-bold text-zinc-500 uppercase tracking-wide block mb-1 text-xs">
            {terms.spouses} ({spouses.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {spouses.map(s => (
              <div key={s.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSelectPerson && onSelectPerson(s.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer",
                    isNeu
                      ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-800 dark:text-zinc-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/60 dark:border-white/5"
                      : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200 dark:border-zinc-700/80"
                  )}
                >
                  <span>{s.name}</span>
                  {s.type !== 'married' && (
                    <span className="opacity-75 text-[11px] ml-1">
                      ({terms[s.type as keyof typeof terms] || s.type})
                    </span>
                  )}
                </button>
                {onAddChildToRelationship && (
                  <button
                    type="button"
                    onClick={() => onAddChildToRelationship(s.id)}
                    className={cn(
                      "px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer",
                      isNeu
                        ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-indigo-600 dark:text-indigo-400 border border-white/60 dark:border-white/5"
                        : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800/80"
                    )}
                    title={`Tambah Anak dengan ${s.name}`}
                  >
                    <span>+ Anak</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {parents.length > 0 && (
        <div>
          <span className="font-bold text-zinc-500 uppercase tracking-wide block mb-1 text-xs">
            {terms.parents} ({parents.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {parents.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPerson && onSelectPerson(p.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer",
                  isNeu
                    ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-800 dark:text-zinc-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/60 dark:border-white/5"
                    : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200 dark:border-zinc-700/80"
                )}
              >
                <span>{p.name}</span>
                {p.isFoster && <span className="ml-1 text-[11px] text-zinc-500">({terms.foster_guardian})</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {children.length > 0 && (
        <div>
          <span className="font-bold text-zinc-500 uppercase tracking-wide block mb-1 text-xs">
            {terms.children} ({children.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {children.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectPerson && onSelectPerson(c.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer",
                  isNeu
                    ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-800 dark:text-zinc-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/60 dark:border-white/5"
                    : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200 dark:border-zinc-700/80"
                )}
              >
                <span>{c.name}</span>
                {c.isFoster && <span className="ml-1 text-[11px] text-zinc-500">({terms.foster_badge})</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
