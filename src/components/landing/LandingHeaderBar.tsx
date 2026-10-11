import { Link } from 'react-router-dom';
import { useIsNeumorphic } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

export interface LandingHeaderBarProps {
  locale?: 'en' | 'id';
  onToggleLocale?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function LandingHeaderBar({
  locale = 'en',
  onToggleLocale,
  isDarkMode = false,
  onToggleTheme,
}: LandingHeaderBarProps) {
  const isNeu = useIsNeumorphic();
  const isId = locale === 'id';

  const title = isId ? 'Selamat Datang di Sanak Keluarga!' : 'Welcome to Sanak Keluarga!';
  const message = isId
    ? 'Tolong dukung dengan menggunakannya dan rekomendasikan ke keluarga Anda.'
    : 'Please support by using it and recommend it to your family.';

  const marqueeItem = (
    <span className="inline-flex items-center gap-2 mx-4 shrink-0 font-sans text-xs">
      <span className="font-bold text-foreground">{title}</span>
      <span className="text-foreground/40 select-none">•</span>
      <span className="text-foreground font-normal">{message}</span>
    </span>
  );

  return (
    <div className="sticky top-0 z-30 w-full flex flex-col select-none shrink-0 transition-colors">
      {/* Primary Header: Announcement Bar */}
      <header
        className={cn(
          'w-full h-8 px-4 flex items-center justify-center text-xs select-none border-b shrink-0 transition-colors overflow-hidden',
          isNeu
            ? 'bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5 text-foreground shadow-xs'
            : 'bg-background/95 dark:bg-background/95 backdrop-blur-sm border-border text-foreground'
        )}
      >
        {/* Desktop View: Clean Centered Announcement */}
        <div className="hidden md:flex items-center justify-center gap-2 truncate text-center min-w-0 font-sans">
          <span className="font-bold text-foreground shrink-0">
            {title}
          </span>
          <span className="text-foreground/40 shrink-0 select-none">•</span>
          <span className="text-foreground truncate font-normal">
            {message}
          </span>
        </div>

        {/* Mobile View: Continuous Marquee Animation */}
        <div className="md:hidden w-full overflow-hidden whitespace-nowrap flex items-center">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="flex shrink-0">
              {marqueeItem}
              {marqueeItem}
            </span>
            <span className="flex shrink-0" aria-hidden="true">
              {marqueeItem}
              {marqueeItem}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile-Only Sub-Header Menu: Quick Actions (LANG, THEME, GITHUB, DOCS) */}
      <nav
        aria-label="Mobile navigation menu"
        className={cn(
          'md:hidden w-full h-11 px-2 border-b flex items-center justify-between transition-colors',
          isNeu
            ? 'bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5 shadow-xs'
            : 'bg-background/95 dark:bg-background/95 backdrop-blur-sm border-border'
        )}
      >
        <div className="grid grid-cols-4 w-full h-full items-stretch divide-x divide-border/40">
          <button
            type="button"
            onClick={onToggleLocale}
            className="flex items-center justify-center font-sans font-bold text-sm tracking-tight text-black dark:text-white hover:opacity-80 active:scale-95 transition-all select-none uppercase px-1"
          >
            LANG {locale === 'id' ? 'ID' : 'EN'}
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center justify-center font-sans font-bold text-sm tracking-tight text-black dark:text-white hover:opacity-80 active:scale-95 transition-all select-none uppercase px-1"
          >
            {isDarkMode ? 'LIGHT' : 'DARK'}
          </button>
          <a
            href="https://github.com/miftahulmuhaemen/family-tree"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center font-sans font-bold text-sm tracking-tight text-black dark:text-white hover:opacity-80 active:scale-95 transition-all select-none uppercase px-1"
          >
            GITHUB
          </a>
          <Link
            to="/docs"
            className="flex items-center justify-center font-sans font-bold text-sm tracking-tight text-black dark:text-white hover:opacity-80 active:scale-95 transition-all select-none uppercase px-1"
          >
            DOCS
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default LandingHeaderBar;
