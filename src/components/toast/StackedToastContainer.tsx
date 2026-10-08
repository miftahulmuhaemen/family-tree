import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNotifications, type ToastItem } from '@/context/NotificationContext';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export function StackedToastContainer() {
  const { toasts, dismissToast } = useNotifications();
  const [isHovered, setIsHovered] = useState(false);
  const isNeu = useIsNeumorphic();

  if (toasts.length === 0) return null;
  const latestToast = toasts[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-11 sm:top-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-auto"
    >
      <ToastCard
        key={latestToast.id}
        toast={latestToast}
        isHovered={isHovered}
        isNeu={isNeu}
        onDismiss={() => dismissToast(latestToast.id)}
      />
    </div>
  );
}

interface ToastCardProps {
  toast: ToastItem;
  isHovered: boolean;
  isNeu: boolean;
  onDismiss: () => void;
}

function ToastCard({ toast, isHovered, isNeu, onDismiss }: ToastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Entrance animation coming slowly from above with GSAP
  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: -30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, { scope: cardRef });

  // 3-second auto close timer, paused when hovered
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const duration = toast.duration || 3000;
    timerRef.current = setTimeout(() => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -20,
          opacity: 0,
          scale: 0.95,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: onDismiss
        });
      } else {
        onDismiss();
      }
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isHovered, toast.duration, onDismiss]);

  const handleManualClose = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -20,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onDismiss
      });
    } else {
      onDismiss();
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />;
    }
  };

  return (
    <div
      ref={cardRef}
      className="cursor-pointer select-none relative pointer-events-auto"
    >
      <div
        className={cn(
          "rounded-full px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 shadow-xl transition-all max-w-[90vw] sm:max-w-md",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 text-zinc-800 dark:text-zinc-200"
            : "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/60 text-zinc-900 dark:text-zinc-100"
        )}
      >
        {getIcon()}

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold truncate text-zinc-900 dark:text-zinc-100">
              {toast.title}
            </span>
          </div>
          {toast.message && (
            <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleManualClose();
          }}
          className={cn(
            "p-1 rounded-full transition-colors shrink-0 cursor-pointer",
            isNeu
              ? "hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          )}
          title="Tutup notifikasi"
          aria-label="Tutup notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default StackedToastContainer;
