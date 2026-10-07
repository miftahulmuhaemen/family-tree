import { useReactFlow, useViewport } from '@xyflow/react';
import { Maximize2, RotateCcw, MousePointer2, Hand, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ControlPanelCanvasProps {
  isNeu: boolean;
  canvasMode?: 'pointer' | 'hand';
  onCanvasModeChange?: (mode: 'pointer' | 'hand') => void;
}

export function ControlPanelCanvas({
  isNeu,
  canvasMode = 'hand',
  onCanvasModeChange,
}: ControlPanelCanvasProps) {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();

  const iconBtnClass = isNeu
    ? 'p-2 sm:p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] transition-all flex items-center justify-center cursor-pointer'
    : 'p-2 sm:p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer';

  const miniBtnClass = isNeu
    ? 'w-7 h-7 rounded-lg text-zinc-600 dark:text-zinc-300 shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] transition-all flex items-center justify-center text-xs cursor-pointer'
    : 'w-7 h-7 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center text-xs cursor-pointer';

  const dividerClass = isNeu
    ? 'w-px h-6 bg-zinc-300/80 dark:bg-zinc-800 shrink-0'
    : 'w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0';

  const clampedZoom = Math.min(Math.max(zoom, 0.2), 2.5);
  const zoomPercent = Math.round(clampedZoom * 100);

  return (
    <div className="flex items-center gap-2.5 sm:gap-3.5">
      {/* Canvas Viewport Controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => fitView({ padding: 0.35, duration: 400 })}
          className={iconBtnClass}
          title="Sesuaikan Tampilan (Fit View)"
          aria-label="Fit View"
        >
          <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>
        <button
          type="button"
          onClick={() => zoomTo(1, { duration: 300 })}
          className={iconBtnClass}
          title="Reset Zoom 100%"
          aria-label="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        {/* Cursor Mode Switcher: Normal Pointer vs Grab Hand */}
        <div className="flex items-center gap-1 ml-0.5">
          <button
            type="button"
            onClick={() => onCanvasModeChange?.('pointer')}
            className={cn(
              iconBtnClass,
              canvasMode === 'pointer' && (
                isNeu
                  ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-900 dark:text-zinc-100 font-bold"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
              )
            )}
            title="Kursor Normal (V / Default)"
            aria-label="Kursor Normal"
          >
            <MousePointer2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
          <button
            type="button"
            onClick={() => onCanvasModeChange?.('hand')}
            className={cn(
              iconBtnClass,
              canvasMode === 'hand' && (
                isNeu
                  ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-900 dark:text-zinc-100 font-bold"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
              )
            )}
            title="Kursor Geser / Grab (H / Spasi)"
            aria-label="Kursor Geser"
          >
            <Hand className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>

      <div className={dividerClass} />

      {/* Zoom Slider */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => zoomOut({ duration: 150 })}
          className={miniBtnClass}
          title="Perkecil (-)"
          aria-label="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="range"
          min="0.2"
          max="2.5"
          step="0.05"
          value={clampedZoom}
          onChange={(e) => zoomTo(parseFloat(e.target.value), { duration: 0 })}
          className={cn(
            "w-20 sm:w-32 h-2 rounded-lg appearance-none cursor-pointer outline-none transition-colors",
            isNeu
              ? "bg-[#d8dce6] dark:bg-[#13161a] shadow-neu-pressed-sm accent-zinc-700 dark:accent-zinc-300"
              : "bg-zinc-200 dark:bg-zinc-800 accent-zinc-700 dark:accent-zinc-300"
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
          <Plus className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs sm:text-sm font-bold tabular-nums text-zinc-600 dark:text-zinc-300 w-11 text-center">
          {zoomPercent}%
        </span>
      </div>
    </div>
  );
}
