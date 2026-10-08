import { useState, useEffect, useRef } from 'react';
import { Settings2, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TERMS, type Language } from '@/utils/i18n';
import { type Theme } from '@/hooks/useTheme';
import { ControlPanelSettings } from './tree/ControlPanelSettings';
import { ControlPanelCanvas } from './tree/ControlPanelCanvas';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

export type ViewMode = 'editor' | 'public';

export interface ControlPanelProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  accent: string;
  setAccent: (accent: string) => void;
  mode?: ViewMode;
  setMode?: (mode: ViewMode) => void;
  canToggleMode?: boolean;
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
  canvasMode?: 'pointer' | 'hand';
  onCanvasModeChange?: (mode: 'pointer' | 'hand') => void;
  fileName?: string | null;
  fileStatus?: 'saved' | 'saving' | 'failed';
  lastAction?: 'loaded' | 'saved';
  lastSaved?: Date | null;
  fileErrorMessage?: string;
}

const ACCENTS = {
  id: ['Indonesian'],
  en: ['English America'],
} as const;

export function ControlPanel({
  language, setLanguage, accent, setAccent,
  mode = 'editor', setMode, canToggleMode = true,
  theme = 'default', setTheme,
  canvasMode = 'hand', onCanvasModeChange,
  fileStatus = 'saved', lastAction = 'loaded', lastSaved, fileErrorMessage
}: ControlPanelProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [panelView, setPanelView] = useState<'canvas' | 'settings'>('canvas');
  const terms = TERMS[language];
  const isNeu = theme === 'neumorphism';

  const statusLabel = fileStatus === 'failed'
    ? (language === 'id' ? 'Gagal' : 'Failed')
    : fileStatus === 'saving'
    ? (language === 'id' ? 'Menyimpan...' : 'Saving...')
    : lastAction === 'saved'
    ? (language === 'id' ? 'Tersimpan' : 'Saved')
    : (language === 'id' ? 'Dimuat' : 'Loaded');

  const timestampStr = lastSaved
    ? lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '';

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstVisible = useRef(true);
  const prevTheme = useRef(theme);

  useEffect(() => {
    const validAccents = ACCENTS[language] as readonly string[];
    if (!validAccents.includes(accent)) setAccent(validAccents[0]);
  }, [language, accent, setAccent]);

  // Smooth GSAP expand/collapse animation for dock
  useGSAP(() => {
    if (isFirstVisible.current) {
      isFirstVisible.current = false;
      if (wrapperRef.current) wrapperRef.current.style.overflow = 'visible';
      return;
    }
    if (!wrapperRef.current) return;
    if (isVisible) {
      wrapperRef.current.style.overflow = 'hidden';
      gsap.fromTo(wrapperRef.current,
        { maxWidth: 0, opacity: 0, scale: 0.95 },
        {
          maxWidth: 1000, opacity: 1, scale: 1, duration: 0.32, ease: 'power2.out', clearProps: 'transform',
          onComplete: () => {
            if (wrapperRef.current) wrapperRef.current.style.overflow = 'visible';
          }
        }
      );
    } else {
      wrapperRef.current.style.overflow = 'hidden';
      gsap.to(wrapperRef.current, {
        maxWidth: 0, opacity: 0, scale: 0.95, duration: 0.26, ease: 'power2.inOut',
      });
    }
  }, { dependencies: [isVisible], scope: rootRef });

  // GSAP animation for subview switch (canvas vs settings)
  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: panelView === 'settings' ? 12 : -12, scale: 0.98 },
        { opacity: 1, x: 0, scale: 1, duration: 0.22, ease: 'power2.out' }
      );
    }
  }, { dependencies: [panelView], scope: rootRef });

  // GSAP subtle spring on theme change
  useGSAP(() => {
    if (panelRef.current && prevTheme.current !== theme) {
      prevTheme.current = theme;
      gsap.fromTo(panelRef.current,
        { scale: 0.97 },
        { scale: 1, duration: 0.24, ease: 'back.out(2)', clearProps: 'transform' }
      );
    }
  }, { dependencies: [theme], scope: rootRef });

  const dockClass = isNeu
    ? 'bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-full px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 sm:gap-4 whitespace-nowrap'
    : 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/60 rounded-full px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 sm:gap-4 whitespace-nowrap text-zinc-900 dark:text-zinc-100';

  const dividerClass = isNeu ? 'w-px h-6 bg-zinc-300/80 dark:bg-zinc-800 shrink-0' : 'w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0';

  const toggleBtnClass = cn(
    "flex items-center justify-center rounded-full shadow-lg transition-all duration-300 cursor-pointer shrink-0 select-none",
    isNeu
      ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white active:shadow-neu-pressed"
      : "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95",
    isVisible ? "w-12 h-12 p-0" : "px-6 py-3 gap-2.5"
  );

  const handleToggleVisible = () => {
    if (isVisible) {
      setIsVisible(false);
      setPanelView('canvas');
    } else {
      setIsVisible(true);
    }
  };

  return (
    <div ref={rootRef} className={`flex items-center ${isVisible ? 'gap-3.5' : 'gap-0'}`}>
      <div
        ref={wrapperRef}
        className={`p-6 -m-6 overflow-hidden flex items-center ${isVisible ? 'max-w-[1000px]' : 'max-w-0 pointer-events-none'}`}
      >
        <div ref={panelRef} className={dockClass}>
          {/* File Status (Most left part of control panel) */}
          <div className="flex items-center gap-1.5 select-none shrink-0">
            {fileStatus === 'failed' ? (
              <div
                className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 cursor-default"
                title={fileErrorMessage || statusLabel}
              >
                <AlertCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-xs font-bold leading-tight">{statusLabel}</span>
                  {timestampStr && (
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal leading-tight mt-0.5">
                      {timestampStr}
                    </span>
                  )}
                </div>
              </div>
            ) : fileStatus === 'saving' ? (
              <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-xs font-bold leading-tight">{statusLabel}</span>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 cursor-default"
                title={timestampStr ? `${statusLabel} (${timestampStr})` : statusLabel}
              >
                <Check className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-xs font-bold leading-tight">{statusLabel}</span>
                  {timestampStr && (
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal leading-tight mt-0.5">
                      {timestampStr}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={dividerClass} />

          {/* Animated Dynamic Subview */}
          <div ref={contentRef} className="flex items-center">
            {panelView === 'canvas' ? (
              <ControlPanelCanvas
                isNeu={isNeu}
                canvasMode={canvasMode}
                onCanvasModeChange={onCanvasModeChange}
              />
            ) : (
              <ControlPanelSettings
                language={language}
                setLanguage={setLanguage}
                accent={accent}
                setAccent={setAccent}
                mode={mode}
                setMode={setMode}
                canToggleMode={canToggleMode}
                theme={theme}
                setTheme={setTheme}
                terms={terms}
                isNeu={isNeu}
                accents={ACCENTS[language]}
              />
            )}
          </div>

          <div className={dividerClass} />

          {/* Persistent Settings Toggle Button */}
          <button
            type="button"
            onClick={() => setPanelView(prev => prev === 'settings' ? 'canvas' : 'settings')}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer",
              isNeu
                ? (panelView === 'settings'
                    ? "shadow-neu-pressed text-indigo-600 dark:text-indigo-400 bg-[#e6e9ef] dark:bg-[#181b20]"
                    : "shadow-neu-raised-sm hover:shadow-neu-raised text-zinc-700 dark:text-zinc-300 bg-[#e6e9ef] dark:bg-[#1c2027]")
                : (panelView === 'settings'
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300")
            )}
            title={panelView === 'settings' ? 'Tutup Pengaturan' : (terms.settings || 'Pengaturan')}
          >
            <Settings2 className={cn("w-4 h-4 transition-transform duration-300", panelView === 'settings' && "rotate-90 text-indigo-600 dark:text-indigo-400")} />
            <span>{terms.settings || 'Pengaturan'}</span>
          </button>
        </div>
      </div>

      {/* Separate Circular Close / Expand Toggle Button */}
      <button
        type="button"
        onClick={handleToggleVisible}
        className={toggleBtnClass}
        title={isVisible ? "Tutup panel kontrol" : "Buka panel kontrol"}
        aria-label={isVisible ? "Tutup panel kontrol" : "Buka panel kontrol"}
      >
        {isVisible ? (
          <X size={20} />
        ) : (
          <>
            <Settings2 size={20} />
            <span className={`text-sm sm:text-base font-semibold ${isNeu ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
              {terms.control_panel}
            </span>
          </>
        )}
      </button>
    </div>
  );
}

export default ControlPanel;
