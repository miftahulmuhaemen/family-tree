import { useState, useEffect, useRef } from 'react';
import { Settings2, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TERMS, type Language } from '@/utils/i18n';
import { type Theme } from '@/hooks/useTheme';

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
}

const ACCENTS = {
  id: ['Indonesian'],
  en: ['English America'],
} as const;

export function ControlPanel({
  language, setLanguage, accent, setAccent,
  mode = 'editor', setMode, canToggleMode = true,
  theme = 'default', setTheme,
}: ControlPanelProps) {
  const [isVisible, setIsVisible] = useState(true);
  const terms = TERMS[language];
  const isNeu = theme === 'neumorphism';

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstVisible = useRef(true);
  const prevTheme = useRef(theme);

  useEffect(() => {
    const validAccents = ACCENTS[language] as readonly string[];
    if (!validAccents.includes(accent)) setAccent(validAccents[0]);
  }, [language, accent, setAccent]);

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
          maxWidth: 1000, opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform',
          onComplete: () => {
            if (wrapperRef.current) wrapperRef.current.style.overflow = 'visible';
          }
        }
      );
    } else {
      wrapperRef.current.style.overflow = 'hidden';
      gsap.to(wrapperRef.current, {
        maxWidth: 0, opacity: 0, scale: 0.95, duration: 0.22, ease: 'power2.in',
      });
    }
  }, { dependencies: [isVisible], scope: rootRef });

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
    ? 'bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-full px-3 py-2.5 sm:px-5 flex items-center gap-2 sm:gap-4 whitespace-nowrap'
    : 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-lg border border-zinc-200/80 dark:border-zinc-800/60 rounded-full px-3 py-2.5 sm:px-5 flex items-center gap-2 sm:gap-4 whitespace-nowrap text-zinc-900 dark:text-zinc-100';

  const dividerClass = isNeu ? 'w-px h-4 bg-zinc-300/80 dark:bg-zinc-800 shrink-0' : 'w-px h-4 bg-zinc-200 dark:bg-zinc-800 shrink-0';
  const labelClass = 'hidden sm:block text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase';
  const selectClass = isNeu
    ? 'bg-[#e6e9ef] dark:bg-[#181b20] shadow-neu-pressed-sm border border-white/40 dark:border-white/5 rounded-full px-3 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:ring-1 focus:ring-indigo-500/50 outline-none cursor-pointer transition-colors appearance-none'
    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-3 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-300 focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 outline-none cursor-pointer hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors appearance-none';

  const toggleBtnClass = isNeu
    ? `bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:shadow-neu-pressed flex-shrink-0 items-center gap-2 ${isVisible ? 'hidden sm:flex p-2.5' : 'flex px-8 py-3'}`
    : `bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-lg border border-zinc-200/80 dark:border-zinc-800/60 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all active:scale-95 flex-shrink-0 items-center gap-2 ${isVisible ? 'hidden sm:flex p-2.5' : 'flex px-8 py-3'}`;

  const optionClass = 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200';

  return (
    <div
      ref={rootRef}
      className={`flex items-center animate-in slide-in-from-bottom-4 fade-in duration-500 sm:scale-100 origin-bottom sm:origin-center ${isVisible ? 'gap-3' : 'gap-0'}`}
    >
      <div ref={wrapperRef} className={`p-6 -m-6 overflow-hidden origin-right flex items-center ${isVisible ? 'max-w-[1000px]' : 'max-w-0 pointer-events-none'}`}>
        <div ref={panelRef} className={dockClass}>
          <div className="hidden sm:flex text-zinc-500 dark:text-zinc-400 items-center gap-2"><Settings2 size={16} /></div>
          <div className={`hidden sm:block ${dividerClass}`} />

          {canToggleMode && setMode && (
            <>
              <div className="flex items-center gap-2">
                <span className={labelClass}>{terms.mode_label}</span>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as ViewMode)}
                  className={selectClass}
                  style={{ textAlignLast: 'center' }}
                  aria-label={terms.mode_label}
                >
                  <option value="editor" className={optionClass}>{terms.mode_editor}</option>
                  <option value="public" className={optionClass}>{terms.mode_public}</option>
                </select>
              </div>
              <div className={dividerClass} />
            </>
          )}

          <div className="flex items-center gap-2">
            <span className={labelClass}>{terms.theme_label}</span>
            <select
              value={theme}
              onChange={(e) => setTheme?.(e.target.value as Theme)}
              className={selectClass}
              style={{ textAlignLast: 'center' }}
              aria-label={terms.theme_label}
            >
              <option value="default" className={optionClass}>{terms.theme_default}</option>
              <option value="neumorphism" className={optionClass}>{terms.theme_neu}</option>
            </select>
          </div>
          <div className={dividerClass} />

          <div className="flex items-center gap-2">
            <span className={labelClass}>{terms.lang_label}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className={selectClass}
              style={{ textAlignLast: 'center' }}
              aria-label={terms.lang_label}
            >
              <option value="id" className={optionClass}>ID</option>
              <option value="en" className={optionClass}>EN</option>
            </select>
          </div>
          <div className={dividerClass} />

          <div className="flex items-center gap-2">
            <span className={labelClass}>{terms.accent_label}</span>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className={selectClass}
              style={{ textAlignLast: 'center' }}
              aria-label={terms.accent_label}
            >
              {(ACCENTS[language] as readonly string[]).map((acc) => (
                <option key={acc} value={acc} className={optionClass}>{acc}</option>
              ))}
            </select>
          </div>

          <div className={`sm:hidden ${dividerClass}`} />
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className={`sm:hidden p-1 transition-colors ${isNeu ? 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className={toggleBtnClass}
        aria-label={isVisible ? 'Hide Control Panel' : 'Show Control Panel'}
      >
        {isVisible ? <X size={20} /> : (
          <>
            <Settings2 size={18} />
            <span className={`text-sm font-semibold ${isNeu ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
              {terms.control_panel}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
