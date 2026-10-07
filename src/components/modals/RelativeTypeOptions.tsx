import type { Person } from '@/types/family';
import type { RelativeType } from '@/components/AddRelativeModal';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface RelativeTypeOptionsProps {
  relativeType: RelativeType;
  relationshipStatus: 'married' | 'divorced' | 'not_married';
  setRelationshipStatus: (status: 'married' | 'divorced' | 'not_married') => void;
  isFoster: boolean;
  setIsFoster: (isFoster: boolean) => void;
  isMaxBioParentsReached: boolean;
  spousesOfTarget: Person[];
  secondParentId: string;
  setSecondParentId: (id: string) => void;
  targetPerson?: Person | null;
  secondParent?: Person | null;
  terms: any;
}

export function RelativeTypeOptions({
  relativeType,
  relationshipStatus,
  setRelationshipStatus,
  isFoster,
  setIsFoster,
  isMaxBioParentsReached,
  spousesOfTarget,
  secondParentId,
  setSecondParentId,
  targetPerson,
  secondParent,
  terms
}: RelativeTypeOptionsProps) {
  const isNeu = useIsNeumorphic();

  const selectCls = isNeu
    ? "w-full px-3 py-2 text-sm rounded-xl border border-white/40 dark:border-white/5 bg-transparent shadow-neu-pressed text-zinc-900 dark:text-zinc-100 focus:outline-none"
    : "w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500";

  const fosterBtnCls = (active: boolean) => cn(
    "py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer",
    active
      ? isNeu
        ? "shadow-neu-pressed bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-400/30 ring-1 ring-indigo-400/40"
        : "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
      : isNeu
        ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-600 dark:text-zinc-400 border-white/50 dark:border-white/5"
        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
  );

  return (
    <>
      {relativeType === 'spouse' && (
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {terms.relationship_status}
          </label>
          <select
            value={relationshipStatus}
            onChange={(e) => setRelationshipStatus(e.target.value as any)}
            className={selectCls}
          >
            <option value="married">{terms.married}</option>
            <option value="divorced">{terms.divorced}</option>
            <option value="not_married">{terms.not_married}</option>
          </select>
        </div>
      )}

      {relativeType === 'parent' && (
        <div className={cn(
          "space-y-1.5 p-3 rounded-xl border",
          isNeu
            ? "shadow-neu-pressed-sm bg-[#e6e9ef]/60 dark:bg-[#181b20]/60 border-white/40 dark:border-white/5"
            : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block">
                Orang Tua Angkat / Wali / Susuan
              </span>
              <span className="text-xs text-zinc-500 block">
                Bukan orang tua kandung (dapat lebih dari 2)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFoster}
                disabled={isMaxBioParentsReached}
                onChange={(e) => setIsFoster(e.target.checked)}
                className="sr-only peer"
              />
              <div className={cn(
                "w-8 h-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all disabled:opacity-50",
                isNeu
                  ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] peer-checked:bg-indigo-600"
                  : "bg-zinc-200 peer-focus:outline-none dark:bg-zinc-700 peer-checked:bg-blue-600"
              )} />
            </label>
          </div>
        </div>
      )}

      {relativeType === 'foster_child' && (
        <div className="space-y-3">
          <div className={cn(
            "p-3 rounded-xl border",
            isNeu
              ? "shadow-neu-pressed-sm bg-amber-500/10 border-amber-400/20"
              : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
          )}>
            <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Anak Angkat / Asuh
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Anak ini akan tercatat sebagai anak angkat untuk {targetPerson?.name}.
            </div>
          </div>

          {spousesOfTarget.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Orang Tua Angkat Kedua (Opsional)
              </label>
              <select
                value={secondParentId}
                onChange={(e) => setSecondParentId(e.target.value)}
                className={selectCls}
              >
                <option value="">-- Hanya {targetPerson?.name} --</option>
                {spousesOfTarget.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {relativeType === 'child' && (
        <div className="space-y-3">
          {secondParent ? (
            <div className={cn(
              "p-3 rounded-xl border",
              isNeu
                ? "shadow-neu-pressed-sm bg-indigo-500/10 border-indigo-400/20"
                : "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60"
            )}>
              <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                Hubungan Orang Tua
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 flex items-center gap-1.5">
                <span>{targetPerson?.name}</span>
                <span className="text-zinc-400 font-normal">&amp;</span>
                <span>{secondParent.name}</span>
              </div>
            </div>
          ) : spousesOfTarget.length > 0 ? (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Orang Tua Kedua (Pasangan)
              </label>
              <select
                value={secondParentId}
                onChange={(e) => setSecondParentId(e.target.value)}
                className={selectCls}
              >
                <option value="">-- Tanpa Pasangan --</option>
                {spousesOfTarget.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Status Hubungan Anak
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsFoster(false)}
                className={fosterBtnCls(!isFoster)}
              >
                Anak Kandung
              </button>
              <button
                type="button"
                onClick={() => setIsFoster(true)}
                className={fosterBtnCls(isFoster)}
              >
                Anak Angkat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
