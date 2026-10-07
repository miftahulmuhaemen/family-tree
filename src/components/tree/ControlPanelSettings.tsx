import { type Language } from '@/utils/i18n';
import { type Theme } from '@/hooks/useTheme';
import { type ViewMode } from '@/components/ControlPanel';

export interface ControlPanelSettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  accent: string;
  setAccent: (accent: string) => void;
  mode?: ViewMode;
  setMode?: (mode: ViewMode) => void;
  canToggleMode?: boolean;
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
  terms: any;
  isNeu: boolean;
  accents: readonly string[];
}

export function ControlPanelSettings({
  language,
  setLanguage,
  accent,
  setAccent,
  mode = 'editor',
  setMode,
  canToggleMode = true,
  theme = 'default',
  setTheme,
  terms,
  isNeu,
  accents,
}: ControlPanelSettingsProps) {
  const labelClass = 'hidden sm:block text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase';
  const dividerClass = isNeu
    ? 'w-px h-4 bg-zinc-300/80 dark:bg-zinc-800 shrink-0'
    : 'w-px h-4 bg-zinc-200 dark:bg-zinc-800 shrink-0';
  const optionClass = 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200';
  const selectClass = isNeu
    ? 'bg-[#e6e9ef] dark:bg-[#181b20] shadow-neu-pressed-sm border border-white/40 dark:border-white/5 rounded-full px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:ring-1 focus:ring-indigo-500/50 outline-none cursor-pointer transition-colors appearance-none'
    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-2.5 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-300 focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 outline-none cursor-pointer hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors appearance-none';

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {canToggleMode && setMode && (
        <>
          <div className="flex items-center gap-1.5">
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

      <div className="flex items-center gap-1.5">
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

      <div className="flex items-center gap-1.5">
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

      <div className="flex items-center gap-1.5">
        <span className={labelClass}>{terms.accent_label}</span>
        <select
          value={accent}
          onChange={(e) => setAccent(e.target.value)}
          className={selectClass}
          style={{ textAlignLast: 'center' }}
          aria-label={terms.accent_label}
        >
          {accents.map((acc) => (
            <option key={acc} value={acc} className={optionClass}>{acc}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
