import { useState, useRef, useEffect } from 'react';
import { Settings, Info, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NodeActionMenuProps {
  personName: string;
  onOpenDetail?: () => void;
  onDelete?: () => void;
}

export function NodeActionMenu({
  personName,
  onOpenDetail,
  onDelete
}: NodeActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleOutsideClick, true);
    window.addEventListener('click', handleOutsideClick, true);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handleOutsideClick, true);
      window.removeEventListener('click', handleOutsideClick, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const hasAnyAction = onOpenDetail || onDelete;
  if (!hasAnyAction) return null;

  return (
    <div 
      ref={menuRef} 
      className={cn("absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2", isOpen ? "z-[70]" : "z-30")}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-200 shadow-md transition-transform hover:scale-105"
        title="Menu Tindakan"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-2 w-36 rounded-xl bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xl p-1 z-[70] text-xs animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {onOpenDetail && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenDetail();
              }}
              className="w-full px-3 py-2 flex items-center gap-2.5 text-zinc-200 hover:bg-zinc-800 hover:text-white rounded-lg font-medium text-left transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Detail</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (window.confirm(`Hapus ${personName}?`)) {
                  onDelete();
                }
              }}
              className="w-full px-3 py-2 flex items-center gap-2.5 text-red-400 hover:bg-red-950/50 hover:text-red-300 rounded-lg font-medium text-left transition-colors border-t border-zinc-800/80 mt-0.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
