import { useRef } from 'react';
import { X, Heart, Baby, Users, Link2, HeartOff } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Person, Relationship } from '@/types/family';
import { parseBirthYear } from '@/utils/date';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

interface ConnectNodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcePerson: Person | null;
  targetPerson: Person | null;
  allRelationships: Relationship[];
  onConnect: (rel: { type: 'parent' | 'married' | 'divorced' | 'not_married'; from: string; to: string }) => void;
}

export function ConnectNodesModal({
  isOpen, onClose, sourcePerson, targetPerson, allRelationships, onConnect
}: ConnectNodesModalProps) {
  const isNeu = useIsNeumorphic();
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.24, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  if (!isOpen || !sourcePerson || !targetPerson) return null;

  const sourceParents = allRelationships.filter(
    r => (r.type === 'parent' || r.type === 'foster_parent') && r.from === sourcePerson.id
  );
  const targetParents = allRelationships.filter(
    r => (r.type === 'parent' || r.type === 'foster_parent') && r.from === targetPerson.id
  );

  const sourceYear = parseBirthYear(sourcePerson.birthDate);
  const targetYear = parseBirthYear(targetPerson.birthDate);

  const isChronologicallyInvalidForSourceAsParent = 
    sourceYear !== null && targetYear !== null && sourceYear >= targetYear;
  const isChronologicallyInvalidForTargetAsParent = 
    sourceYear !== null && targetYear !== null && targetYear >= sourceYear;

  const canSourceBeParentOfTarget = targetParents.length < 2 && !isChronologicallyInvalidForSourceAsParent;
  const canTargetBeParentOfSource = sourceParents.length < 2 && !isChronologicallyInvalidForTargetAsParent;

  const handleSelectRelation = (type: 'parent' | 'married' | 'divorced' | 'not_married', from: string, to: string) => {
    onConnect({ type, from, to });
    onClose();
  };

  const optionBtnCls = (enabled: boolean) => cn(
    "w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all",
    enabled
      ? isNeu
        ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] hover:shadow-neu-raised border-white/60 dark:border-white/5 text-zinc-900 dark:text-zinc-100 cursor-pointer"
        : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-blue-500 text-zinc-900 dark:text-zinc-100 cursor-pointer"
      : isNeu
        ? "shadow-neu-pressed-sm bg-[#e6e9ef]/60 dark:bg-[#181b20]/60 opacity-50 cursor-not-allowed border-transparent text-zinc-400"
        : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/40 opacity-50 cursor-not-allowed text-zinc-400"
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={cn(
          "w-full max-w-md overflow-hidden my-8 shadow-2xl",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-3xl"
            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn(
          "flex items-center justify-between px-6 py-4 border-b",
          isNeu ? "border-white/40 dark:border-white/5 bg-transparent" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"
        )}>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Link2 className={cn("w-5 h-5", isNeu ? "text-indigo-600 dark:text-indigo-400" : "text-blue-600")} />
            <span>Hubungkan Anggota Keluarga</span>
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className={cn(
              "p-1.5 rounded-xl transition-all cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-white/60 dark:border-white/5"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Tentukan hubungan antara <span className="font-bold text-zinc-900 dark:text-zinc-100">{sourcePerson.name}</span> dan{' '}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{targetPerson.name}</span>:
          </p>

          <div className="space-y-2.5">
            {/* 1. Source is Parent of Target */}
            <button
              type="button"
              disabled={!canSourceBeParentOfTarget}
              onClick={() => handleSelectRelation('parent', targetPerson.id, sourcePerson.id)}
              className={optionBtnCls(canSourceBeParentOfTarget)}
            >
              <div className="flex items-center gap-3">
                <Baby className={cn("w-5 h-5 shrink-0", isNeu ? "text-indigo-500" : "text-zinc-500")} />
                <div>
                  <h4 className="text-xs font-bold">{sourcePerson.name} adalah Orang Tua dari {targetPerson.name}</h4>
                  <p className="text-[11px] text-zinc-500">
                    {canSourceBeParentOfTarget 
                      ? `${targetPerson.name} menjadi Anak` 
                      : (isChronologicallyInvalidForSourceAsParent 
                          ? `Tidak valid: ${sourcePerson.name} tidak lebih tua dari ${targetPerson.name}` 
                          : `${targetPerson.name} sudah punya 2 orang tua`)}
                  </p>
                </div>
              </div>
            </button>

            {/* 2. Target is Parent of Source */}
            <button
              type="button"
              disabled={!canTargetBeParentOfSource}
              onClick={() => handleSelectRelation('parent', sourcePerson.id, targetPerson.id)}
              className={optionBtnCls(canTargetBeParentOfSource)}
            >
              <div className="flex items-center gap-3">
                <Users className={cn("w-5 h-5 shrink-0", isNeu ? "text-indigo-500" : "text-zinc-500")} />
                <div>
                  <h4 className="text-xs font-bold">{targetPerson.name} adalah Orang Tua dari {sourcePerson.name}</h4>
                  <p className="text-[11px] text-zinc-500">
                    {canTargetBeParentOfSource 
                      ? `${sourcePerson.name} menjadi Anak` 
                      : (isChronologicallyInvalidForTargetAsParent 
                          ? `Tidak valid: ${targetPerson.name} tidak lebih tua dari ${sourcePerson.name}` 
                          : `${sourcePerson.name} sudah punya 2 orang tua`)}
                  </p>
                </div>
              </div>
            </button>

            {/* 3. Spouses (Married) */}
            <button
              type="button"
              onClick={() => handleSelectRelation('married', sourcePerson.id, targetPerson.id)}
              className={optionBtnCls(true)}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">Pasangan Suami / Istri (Menikah)</h4>
                  <p className="text-[11px] text-zinc-500">Hubungkan {sourcePerson.name} &amp; {targetPerson.name} sebagai pasangan aktif</p>
                </div>
              </div>
            </button>

            {/* 4. Divorced / Ex-Spouse */}
            <button
              type="button"
              onClick={() => handleSelectRelation('divorced', sourcePerson.id, targetPerson.id)}
              className={optionBtnCls(true)}
            >
              <div className="flex items-center gap-3">
                <HeartOff className="w-5 h-5 text-zinc-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">Mantan Pasangan (Bercerai / Ex-Wife / Ex-Husband)</h4>
                  <p className="text-[11px] text-zinc-500">Tercatat pernah menikah namun telah bercerai</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className={cn(
          "px-6 py-3 border-t flex justify-end",
          isNeu ? "border-white/40 dark:border-white/5 bg-transparent" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"
        )}>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] hover:shadow-neu-raised active:shadow-neu-pressed text-zinc-600 dark:text-zinc-400 border border-white/50 dark:border-white/5"
                : "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
