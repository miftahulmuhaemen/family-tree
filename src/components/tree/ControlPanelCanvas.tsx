import { useReactFlow, useViewport } from '@xyflow/react';
import { Maximize2, RotateCcw, Lock, Unlock, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ControlPanelCanvasProps {
  isNeu: boolean;
  isLocked?: boolean;
  onToggleLock?: () => void;
}

export function ControlPanelCanvas({
  isNeu,
  isLocked = false,
  onToggleLock,
}: ControlPanelCanvasProps) {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();

  const iconBtnClass = isNeu
    ? 'p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] transition-all flex items-center justify-center cursor-pointer'
    : 'p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer';

  const miniBtnClass = isNeu
    ? 'w-5 h-5 rounded-md text-zinc-600 dark:text-zinc-300 shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] transition-all flex items-center justify-center text-[10px] cursor-pointer'
    : 'w-5 h-5 rounded-md text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center text-[10px] cursor-pointer';

  const dividerClass = isNeu
    ? 'w-px h-4 bg-zinc-300/80 dark:bg-zinc-800 shrink-0'
    : 'w-px h-4 bg-zinc-200 dark:bg-zinc-800 shrink-0';

  const clampedZoom = Math.min(Math.max(zoom, 0.2), 2.5);
  const zoomPercent = Math.round(clampedZoom * 100);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Canvas Viewport Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => fitView({ duration: 400 })}
          className={iconBtnClass}
          title="Sesuaikan Tampilan (Fit View)"
          aria-label="Fit View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => zoomTo(1, { duration: 300 })}
          className={iconBtnClass}
          title="Reset Zoom 100%"
          aria-label="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        {onToggleLock && (
          <button
            type="button"
            onClick={onToggleLock}
            className={cn(iconBtnClass, isLocked && "text-amber-500 dark:text-amber-400")}
            title={isLocked ? "Buka Kunci Kanvas" : "Kunci Navigasi Kanvas"}
            aria-label={isLocked ? "Unlock Canvas" : "Lock Canvas"}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      <div className={dividerClass} />

      {/* Zoom Slider */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => zoomOut({ duration: 150 })}
          className={miniBtnClass}
          title="Perkecil (-)"
          aria-label="Zoom Out"
        >
          <Minus className="w-3 h-3" />
        </button>
        <input
          type="range"
          min="0.2"
          max="2.5"
          step="0.05"
          value={clampedZoom}
          onChange={(e) => zoomTo(parseFloat(e.target.value), { duration: 0 })}
          className={cn(
            "w-16 sm:w-24 h-1.5 rounded-lg appearance-none cursor-pointer outline-none transition-colors",
            isNeu
              ? "bg-[#d8dce6] dark:bg-[#13161a] shadow-neu-pressed-sm accent-indigo-600 dark:accent-indigo-400"
              : "bg-zinc-200 dark:bg-zinc-800 accent-blue-600 dark:accent-blue-500"
          )}
          aria-label="Zoom Canvas"
        />
        <button
          type="button"
          onClick={() => zoomIn({ duration: 150 })}
          className={miniBtnClass}
          title="Perbesar (+)"
          aria-label="Zoom In"
        >
          <Plus className="w-3 h-3" />
        </button>
        <span className="text-[11px] font-bold tabular-nums text-zinc-600 dark:text-zinc-300 w-8 text-center">
          {zoomPercent}%
        </span>
      </div>
    </div>
  );
}
