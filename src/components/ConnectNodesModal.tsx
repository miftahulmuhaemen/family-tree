import { X, Heart, Baby, Users } from 'lucide-react';
import type { Person, Relationship } from '@/types/family';
import { parseBirthYear } from '@/utils/date';

interface ConnectNodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcePerson: Person | null;
  targetPerson: Person | null;
  allRelationships: Relationship[];
  onConnect: (rel: { type: 'parent' | 'married' | 'divorced' | 'not_married'; from: string; to: string }) => void;
}

export function ConnectNodesModal({
  isOpen,
  onClose,
  sourcePerson,
  targetPerson,
  allRelationships,
  onConnect
}: ConnectNodesModalProps) {
  if (!isOpen || !sourcePerson || !targetPerson) return null;

  // Calculate parent limits
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>🔗</span>
            <span>Hubungkan Anggota Keluarga</span>
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                canSourceBeParentOfTarget
                  ? 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-blue-500 text-zinc-900 dark:text-zinc-100 cursor-pointer'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/40 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-zinc-500 shrink-0" />
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
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                canTargetBeParentOfSource
                  ? 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-blue-500 text-zinc-900 dark:text-zinc-100 cursor-pointer'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/40 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-zinc-500 shrink-0" />
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
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-blue-500 text-zinc-900 dark:text-zinc-100 text-left flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-zinc-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">Pasangan Suami / Istri (Menikah)</h4>
                  <p className="text-[11px] text-zinc-500">Hubungkan {sourcePerson.name} & {targetPerson.name} sebagai pasangan aktif</p>
                </div>
              </div>
            </button>

            {/* 4. Divorced / Ex-Spouse */}
            <button
              type="button"
              onClick={() => handleSelectRelation('divorced', sourcePerson.id, targetPerson.id)}
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-blue-500 text-zinc-900 dark:text-zinc-100 text-left flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-base shrink-0">💔</span>
                <div>
                  <h4 className="text-xs font-bold">Mantan Pasangan (Bercerai / Ex-Wife / Ex-Husband)</h4>
                  <p className="text-[11px] text-zinc-500">Tercatat pernah menikah namun telah bercerai</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
