import { useRef } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';
import type { Person } from '@/types/family';

gsap.registerPlugin(useGSAP);

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
  dependents: {
    children: Person[];
    spouses: Person[];
    parents: Person[];
  };
  onConfirmDelete: (personId: string) => void;
  language?: 'id' | 'en';
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  person,
  dependents,
  onConfirmDelete,
  language = 'id',
}: DeleteConfirmModalProps) {
  const isNeu = useIsNeumorphic();
  const modalRef = useRef<HTMLDivElement>(null);

  const personName = (person?.name || '').trim();
  const totalDependents = dependents.children.length + dependents.spouses.length + dependents.parents.length;
  const hasDependents = totalDependents > 0;

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.24, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  if (!isOpen || !person) return null;

  const handleDelete = () => {
    onConfirmDelete(person.id);
    onClose();
  };

  const isId = language === 'id';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-lg overflow-hidden transition-all select-none",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-3xl"
            : "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <div className={cn(
              "p-2.5 rounded-xl flex items-center justify-center shrink-0",
              isNeu
                ? "shadow-neu-pressed-sm bg-red-100/50 dark:bg-red-950/40"
                : "bg-red-100 dark:bg-red-950/50"
            )}>
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-zinc-100">
              {isId ? 'Hapus Anggota Keluarga' : 'Delete Family Member'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-2 space-y-5">
          {hasDependents ? (
            <>
              <div className={cn(
                "p-4 rounded-2xl space-y-2.5 border",
                isNeu
                  ? "shadow-neu-pressed-sm bg-[#e0e4eb] dark:bg-[#181b20] border-red-300/40 dark:border-red-900/30 text-zinc-700 dark:text-zinc-300"
                  : "bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-zinc-700 dark:text-zinc-300"
              )}>
                <p className="font-bold text-red-600 dark:text-red-400 text-sm sm:text-base">
                  {isId
                    ? `Perhatian: Anggota ini memiliki ${totalDependents} relasi aktif:`
                    : `Warning: This member has ${totalDependents} active relations:`}
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-medium pl-1">
                  {dependents.children.length > 0 && (
                    <li>{dependents.children.length} {isId ? 'anak' : 'children'}</li>
                  )}
                  {dependents.spouses.length > 0 && (
                    <li>{dependents.spouses.length} {isId ? 'pasangan' : 'spouses'}</li>
                  )}
                  {dependents.parents.length > 0 && (
                    <li>{dependents.parents.length} {isId ? 'orang tua' : 'parents'}</li>
                  )}
                </ul>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 pt-1">
                  {isId
                    ? 'Menghapus anggota ini akan memutuskan seluruh keterkaitan garis keturunan tersebut.'
                    : 'Deleting this member will disconnect these lineage connections from the tree.'}
                </p>
              </div>

              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isId
                  ? `Apakah Anda yakin ingin menghapus ${personName}? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.`
                  : `Are you sure you want to delete ${personName}? This action is permanent and cannot be undone.`}
              </p>
            </>
          ) : (
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {isId
                ? `Apakah Anda yakin ingin menghapus ${personName}? Tindakan ini tidak dapat dibatalkan.`
                : `Are you sure you want to delete ${personName}? This action cannot be undone.`}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-700 dark:text-zinc-300"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            )}
          >
            {isId ? 'Batal' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all text-white bg-red-600 hover:bg-red-700 cursor-pointer",
              isNeu
                ? "shadow-neu-raised active:shadow-neu-pressed"
                : "shadow-md active:scale-95"
            )}
          >
            <Trash2 className="w-4 h-4" />
            <span>{isId ? 'Hapus Anggota' : 'Delete Member'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
