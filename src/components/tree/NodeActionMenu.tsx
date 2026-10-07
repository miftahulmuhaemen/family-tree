import { useState, useRef, useEffect } from 'react';
import { Settings, Info, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

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
  const isNeu = useIsNeumorphic();
  const menuRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<SVGSVGElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // GSAP animation for popup entrance swinging from gear center
  useGSAP(() => {
    if (isOpen && popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        {
          opacity: 0,
          scale: 0.35,
          rotation: -40,
          transformOrigin: '16px -24px'
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.32,
          ease: 'back.out(1.6)'
        }
      );
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (gearRef.current) {
      gsap.to(gearRef.current, {
        rotation: '+=45',
        duration: 0.28,
        ease: 'power2.out'
      });
    }
  };

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (gearRef.current) {
      gsap.to(gearRef.current, {
        rotation: nextState ? 90 : 0,
        duration: 0.35,
        ease: 'back.out(1.5)'
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (gearRef.current) {
          gsap.to(gearRef.current, { rotation: 0, duration: 0.25, ease: 'power2.out' });
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        if (gearRef.current) {
          gsap.to(gearRef.current, { rotation: 0, duration: 0.25, ease: 'power2.out' });
        }
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
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-700 dark:text-zinc-200 shadow-neu-raised-sm border border-white/60 dark:border-white/5 hover:shadow-neu-raised active:shadow-neu-pressed"
            : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-200 shadow-md"
        )}
        title="Menu Tindakan"
      >
        <Settings ref={gearRef} className="w-4 h-4 pointer-events-none" />
      </button>

      {isOpen && (
        <div 
          ref={popupRef}
          className={cn(
            "absolute left-0 top-full mt-2 w-36 rounded-xl p-1 z-[70] text-xs shadow-2xl",
            isNeu
              ? "bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-800 dark:text-zinc-100 shadow-neu-raised border border-white/60 dark:border-white/5"
              : "bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xl"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {onOpenDetail && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (gearRef.current) gsap.to(gearRef.current, { rotation: 0, duration: 0.25 });
                onOpenDetail();
              }}
              className={cn(
                "w-full px-3 py-2 flex items-center gap-2.5 rounded-lg font-medium text-left transition-colors",
                isNeu
                  ? "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                  : "text-zinc-200 hover:bg-zinc-800 hover:text-white"
              )}
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
                if (gearRef.current) gsap.to(gearRef.current, { rotation: 0, duration: 0.25 });
                if (window.confirm(`Hapus ${personName}?`)) {
                  onDelete();
                }
              }}
              className={cn(
                "w-full px-3 py-2 flex items-center gap-2.5 text-red-500 rounded-lg font-medium text-left transition-colors mt-0.5",
                isNeu
                  ? "hover:bg-red-50 dark:hover:bg-red-950/30 border-t border-zinc-200/60 dark:border-zinc-800/60"
                  : "hover:bg-red-950/50 hover:text-red-300 border-t border-zinc-800/80"
              )}
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
