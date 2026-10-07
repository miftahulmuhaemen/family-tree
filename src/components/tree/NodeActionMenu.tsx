import { useState, useRef, useEffect } from 'react';
import { Settings, Info, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { TERMS, type Language } from '@/utils/i18n';

gsap.registerPlugin(useGSAP);

export interface NodeActionMenuProps {
  personName: string;
  gender?: 'male' | 'female';
  isDeceased?: boolean;
  language?: Language;
  onOpenDetail?: () => void;
  onDelete?: () => void;
}

export function NodeActionMenu({
  personName,
  gender = 'male',
  isDeceased = false,
  language = 'en',
  onOpenDetail,
  onDelete
}: NodeActionMenuProps) {
  const t = TERMS[language] || TERMS.en;
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
            ? cn(
                "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed",
                isDeceased
                  ? "border border-zinc-400/40 text-zinc-500"
                  : gender === 'female'
                    ? "border border-rose-400/50 text-rose-500 hover:text-rose-600"
                    : "border border-sky-400/50 text-sky-500 hover:text-sky-600"
              )
            : cn(
                "bg-white dark:bg-zinc-900 border-2 shadow-md hover:scale-105",
                isDeceased
                  ? "border-zinc-400 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  : gender === 'female'
                    ? "border-pink-400 dark:border-pink-500 text-pink-500 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/40"
                    : "border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              )
        )}
        title={t.action_menu}
        aria-label={`${t.action_menu} - ${personName}`}
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
              <span>{t.detail}</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (gearRef.current) gsap.to(gearRef.current, { rotation: 0, duration: 0.25 });
                onDelete();
              }}
              className={cn(
                "w-full px-3 py-2 flex items-center gap-2.5 text-red-500 rounded-lg font-medium text-left transition-colors mt-0.5",
                isNeu
                  ? "hover:bg-red-50 dark:hover:bg-red-950/30 border-t border-zinc-200/60 dark:border-zinc-800/60"
                  : "hover:bg-red-950/50 hover:text-red-300 border-t border-zinc-800/80"
              )}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{t.delete}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
