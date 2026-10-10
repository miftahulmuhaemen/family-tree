import { useIsNeumorphic } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

export interface LandingHeaderBarProps {
  locale?: 'en' | 'id';
}

export function LandingHeaderBar({ locale = 'en' }: LandingHeaderBarProps) {
  const isNeu = useIsNeumorphic();
  const isId = locale === 'id';

  const title = isId ? 'Selamat Datang di Sanak Keluarga!' : 'Welcome to Sanak Keluarga!';
  const message = isId
    ? 'Tolong dukung dengan menggunakannya dan rekomendasikan ke keluarga Anda.'
    : 'Please support by using it and recommend it to your family.';

  return (
    <header
      className={cn(
        'w-full h-8 px-4 flex items-center justify-center text-xs select-none border-b shrink-0 z-30 transition-colors sticky top-0',
        isNeu
          ? 'bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5 text-foreground shadow-xs'
          : 'bg-background/95 dark:bg-background/95 backdrop-blur-sm border-border text-foreground'
      )}
    >
      <div className="flex items-center justify-center gap-2 truncate text-center min-w-0 font-sans">
        <span className="font-bold text-foreground shrink-0">
          {title}
        </span>
        <span className="text-foreground/40 shrink-0 select-none">•</span>
        <span className="text-foreground truncate font-normal">
          {message}
        </span>
      </div>
    </header>
  );
}

export default LandingHeaderBar;
