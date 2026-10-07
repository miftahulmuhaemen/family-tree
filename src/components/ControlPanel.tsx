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

function SegmentedSwitch<T extends string>({
  options, value, onChange, isNeu,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  isNeu: boolean;
}) {
  const switchRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<T, HTMLButtonElement>>(new Map());
  const isFirstRun = useRef(true);

  useGSAP(() => {
    const activeBtn = buttonRefs.current.get(value);
    if (!activeBtn || !thumbRef.current) return;
    const { offsetLeft: targetX, offsetWidth: targetWidth } = activeBtn;
    if (targetWidth === 0) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      gsap.set(thumbRef.current, { x: targetX, width: targetWidth, opacity: 1 });
    } else {
      gsap.to(thumbRef.current, { x: targetX, width: targetWidth, duration: 0.25, ease: 'power2.out' });
    }
  }, { dependencies: [value, isNeu], scope: switchRef });

  return (
    <div
      ref={switchRef}
      className={`relative flex items-center rounded-full p-0.5 transition-colors ${
        isNeu
          ? 'bg-[#e6e9ef] dark:bg-[#181b20] shadow-neu-pressed-sm border border-white/40 dark:border-white/5'
          : 'bg-zinc-900 border border-zinc-800'
      }`}
    >
      <div
        ref={thumbRef}
        className={`absolute top-0.5 bottom-0.5 rounded-full pointer-events-none opacity-0 ${
          isNeu
            ? 'bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised-sm border border-white/60 dark:border-white/5'
            : 'bg-zinc-800 shadow-sm'
        }`}
        style={{ left: 0 }}
      />
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              if (el) buttonRefs.current.set(opt.value, el);
              else buttonRefs.current.delete(opt.value);
            }}
            type="button"
            onClick={() => !isActive && onChange(opt.value)}
            className={`relative z-10 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              isActive
                ? isNeu ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-zinc-100'
                : isNeu ? 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ControlPanel({
  language,
  setLanguage,
  accent,
  setAccent,
  mode = 'editor',
  setMode,
  canToggleMode = true,
  theme = 'default',
  setTheme,
}: ControlPanelProps) {
  const [isVisible, setIsVisible] = useState(true);
  const terms = TERMS[language];
  const isNeu = theme === 'neumorphism';

  const rootRef = useRef<HTMLDivElement>(null);
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
      return;
    }
    if (isVisible && panelRef.current) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, scale: 0.94, x: 16 },
        { opacity: 1, scale: 1, x: 0, duration: 0.28, ease: 'back.out(1.5)', clearProps: 'transform' }
      );
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
    : 'bg-zinc-950/90 backdrop-blur-md shadow-2xl border border-zinc-800/60 rounded-full px-3 py-2.5 sm:px-5 flex items-center gap-2 sm:gap-4 whitespace-nowrap';

  const dividerClass = isNeu ? 'w-px h-4 bg-zinc-300/80 dark:bg-zinc-800 shrink-0' : 'w-px h-4 bg-zinc-800 shrink-0';
  const labelClass = 'hidden sm:block text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase';
  const iconClass = 'hidden sm:flex text-zinc-500 dark:text-zinc-400 items-center gap-2';
  const accentSelectClass = isNeu
    ? 'bg-[#e6e9ef] dark:bg-[#181b20] shadow-neu-pressed-sm border border-white/40 dark:border-white/5 rounded-full px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:ring-1 focus:ring-indigo-500/50 outline-none cursor-pointer transition-colors appearance-none'
    : 'bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-xs font-medium text-zinc-300 focus:ring-1 focus:ring-zinc-700 outline-none cursor-pointer hover:bg-zinc-800 transition-colors appearance-none';

  const toggleBtnClass = isNeu
    ? `bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:shadow-neu-pressed flex-shrink-0 items-center gap-2 ${isVisible ? 'hidden sm:flex p-2.5' : 'flex px-8 py-3'}`
    : `bg-zinc-950/90 backdrop-blur-md shadow-xl border border-zinc-800/60 rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 flex-shrink-0 items-center gap-2 ${isVisible ? 'hidden sm:flex p-2.5' : 'flex px-8 py-3'}`;

  return (
    <div
      ref={rootRef}
      className={`flex items-center animate-in slide-in-from-bottom-4 fade-in duration-500 sm:scale-100 origin-bottom sm:origin-center ${isVisible ? 'gap-3' : 'gap-0'}`}
    >
      <div className={`overflow-hidden transition-[width] duration-300 ease-in-out origin-right flex items-center ${isVisible ? 'w-auto' : 'w-0 pointer-events-none'}`}>
        <div ref={panelRef} className={dockClass}>
          <div className={iconClass}><Settings2 size={16} /></div>
          <div className={`hidden sm:block ${dividerClass}`} />

          {canToggleMode && setMode && (
            <>
              <div className="flex items-center gap-2">
                <span className={labelClass}>{terms.mode_label}</span>
                <SegmentedSwitch
                  options={[{ value: 'editor' as ViewMode, label: terms.mode_editor }, { value: 'public' as ViewMode, label: terms.mode_public }]}
                  value={mode} onChange={setMode} isNeu={isNeu}
                />
              </div>
              <div className={dividerClass} />
            </>
          )}

          <div className="flex items-center gap-2">
            <span className={labelClass}>{terms.theme_label}</span>
            <SegmentedSwitch
              options={[{ value: 'default' as Theme, label: terms.theme_default }, { value: 'neumorphism' as Theme, label: terms.theme_neu }]}
              value={theme} onChange={(t) => setTheme?.(t)} isNeu={isNeu}
            />
          </div>
          <div className={dividerClass} />

          <div className="flex items-center gap-2">
            <span className={labelClass}>{terms.lang_label}</span>
            <SegmentedSwitch
              options={[{ value: 'id' as Language, label: 'ID' }, { value: 'en' as Language, label: 'EN' }]}
              value={language} onChange={setLanguage} isNeu={isNeu}
            />
          </div>
          <div className={dividerClass} />

          <div className="flex items-center gap-2">
            <span className={labelClass}>{terms.accent_label}</span>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className={accentSelectClass}
              style={{ textAlignLast: 'center' }}
            >
              {(ACCENTS[language] as readonly string[]).map((acc) => (
                <option key={acc} value={acc}>{acc}</option>
              ))}
            </select>
          </div>

          <div className={`sm:hidden ${dividerClass}`} />
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className={`sm:hidden p-1 transition-colors ${isNeu ? 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white' : 'text-zinc-400 hover:text-white'}`}
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
            <span className={`text-sm font-semibold ${isNeu ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-200'}`}>
              {terms.control_panel}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
