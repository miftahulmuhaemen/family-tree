import { Link } from 'react-router-dom';
import { Shield, Database } from 'lucide-react';
import type { LandingContent } from '../../constants/landingTranslations';

interface LandingFooterProps {
  t: LandingContent;
}

export function LandingFooter({ t }: LandingFooterProps) {
  return (
    <footer className="border-t border-border/60 bg-card/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Direct Action Container */}
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center max-w-3xl mx-auto mb-16 shadow-sm">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              {t.footer.ctaTitle}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {t.footer.ctaDescription}
            </p>
            <Link
              to="/app"
              className="h-11 px-7 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 inline-flex items-center justify-center transition-colors shadow-sm"
            >
              <span>{t.footer.ctaButton}</span>
            </Link>
          </div>
        </div>

        {/* Footer Meta Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/60 text-xs text-muted-foreground font-mono">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{t.footer.gedcomBadge}</span>
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.footer.privacyBadge}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
