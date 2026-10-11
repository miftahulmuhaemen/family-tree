import { Link } from 'react-router-dom';
import { Github, Menu, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

import sanakIcon from '../../assets/sanak_icon.svg';

export interface DocsHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function DocsHeader({ onToggleMobileMenu }: DocsHeaderProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={sanakIcon}
              alt="Sanak Keluarga Studio"
              className="w-8 h-8 rounded-full shadow-sm shrink-0"
            />
            <span className="font-semibold text-sm tracking-tight text-foreground">
              Sanak Keluarga Studio
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/app"
              className="text-foreground hover:text-primary transition-colors"
            >
              Studio
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/miftahulmuhaemen/family-tree"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-border bg-card/60 hover:bg-accent text-foreground flex items-center justify-center transition-colors"
              aria-label="GitHub repository"
            >
              <Github className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </a>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-lg border border-border bg-card/60 hover:bg-accent text-foreground flex items-center justify-center transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DocsHeader;
