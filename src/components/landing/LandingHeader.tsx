import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Globe, GitBranch } from 'lucide-react';
import type { LandingContent } from '../../constants/landingTranslations';

interface LandingHeaderProps {
  locale: 'en' | 'id';
  onToggleLocale: () => void;
  t: LandingContent;
}

export function LandingHeader({ locale, onToggleLocale, t }: LandingHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(isDarkClass);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-foreground group-hover:border-primary transition-colors">
            <GitBranch className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-foreground">
              {t.nav.brand}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {t.nav.tagline}
            </span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLocale}
            className="h-8 px-2.5 rounded-lg border border-border bg-card/60 hover:bg-accent text-xs font-mono text-foreground flex items-center gap-1.5 transition-colors"
            title={`Switch to ${locale === 'en' ? 'Bahasa Indonesia' : 'English'}`}
          >
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="uppercase">{locale}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg border border-border bg-card/60 hover:bg-accent text-foreground flex items-center justify-center transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>

          {/* Primary App CTA */}
          <Link
            to="/app"
            className="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 flex items-center transition-colors shadow-sm ml-1"
          >
            <span>{t.nav.openApp}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
