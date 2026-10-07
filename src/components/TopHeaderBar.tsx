import { TERMS, type Language } from '@/utils/i18n';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface TopHeaderBarProps {
  language?: Language;
}

export function TopHeaderBar({ language = 'id' }: TopHeaderBarProps) {
  const terms = TERMS[language];
  const isNeu = useIsNeumorphic();
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'support@familytree.com';

  return (
    <header
      className={cn(
        "w-full h-8 px-4 flex items-center justify-center text-xs select-none border-b shrink-0 z-20 transition-colors",
        isNeu
          ? "bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5 text-zinc-700 dark:text-zinc-300 shadow-xs"
          : "bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
      )}
    >
      <div className="flex items-center justify-center gap-2 truncate text-center min-w-0">
        <span className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
          {terms.welcome_title}
        </span>
        <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline shrink-0">•</span>
        <span className="text-zinc-600 dark:text-zinc-400 truncate hidden sm:inline">
          {terms.welcome_message}
        </span>
        <span className="text-zinc-300 dark:text-zinc-700 hidden md:inline shrink-0">•</span>
        <span className="text-zinc-500 hidden md:inline shrink-0">{terms.questions_email}</span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-200 hidden md:inline shrink-0">
          {supportEmail}
        </span>
      </div>
    </header>
  );
}

export default TopHeaderBar;
