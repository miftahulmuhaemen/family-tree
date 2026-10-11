import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { DocsHeader } from '../docs/DocsHeader';
import { cn } from '../../lib/utils';
import { useIsNeumorphic } from '../../hooks/useTheme';

export interface LegalPageLayoutProps {
  activeTab: 'policy' | 'tos';
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({
  activeTab,
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const isNeu = useIsNeumorphic();

  return (
    <div
      className={cn(
        'min-h-screen text-foreground flex flex-col font-sans',
        isNeu ? 'bg-[var(--neu-base)]' : 'bg-background'
      )}
    >
      <DocsHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        {/* Navigation Breadcrumb back to /docs */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/docs"
            className={cn(
              'inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer',
              isNeu && 'px-3 py-1.5 rounded-lg shadow-neu-raised hover:shadow-neu-pressed-sm'
            )}
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span>Back to Documentation</span>
          </Link>
          <span className="text-sm font-medium text-foreground">
            Effective: {lastUpdated}
          </span>
        </div>

        {/* Page Switcher Tabs */}
        <div
          className={cn(
            'flex mb-8',
            isNeu
              ? 'p-1.5 rounded-xl shadow-neu-pressed-sm bg-[var(--neu-surface)] gap-2'
              : 'border-b border-border'
          )}
        >
          <Link
            to="/policy"
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer',
              isNeu
                ? activeTab === 'policy'
                  ? 'shadow-neu-raised rounded-lg text-foreground bg-[var(--neu-surface)]'
                  : 'text-foreground hover:text-primary rounded-lg'
                : activeTab === 'policy'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'border-b-2 border-transparent text-foreground hover:text-primary hover:border-border'
            )}
          >
            <Shield className="w-4 h-4 text-primary" />
            <span>Privacy Policy</span>
          </Link>

          <Link
            to="/tos"
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer',
              isNeu
                ? activeTab === 'tos'
                  ? 'shadow-neu-raised rounded-lg text-foreground bg-[var(--neu-surface)]'
                  : 'text-foreground hover:text-primary rounded-lg'
                : activeTab === 'tos'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'border-b-2 border-transparent text-foreground hover:text-primary hover:border-border'
            )}
          >
            <FileText className="w-4 h-4 text-primary" />
            <span>Terms of Service</span>
          </Link>
        </div>

        {/* Header Block */}
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-base text-foreground leading-relaxed">
            {subtitle}
          </p>
        </header>

        {/* Legal Content */}
        <div className="space-y-8">
          {children}
        </div>

        {/* Footer Note */}
        <footer
          className={cn(
            'mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground',
            isNeu ? 'border-t border-[var(--neu-border)]' : 'border-t border-border'
          )}
        >
          <p>
            Sanak Keluarga Studio is open source software distributed under the MIT License.
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <Link to="/docs" className="text-foreground hover:text-primary transition-colors">
              Docs
            </Link>
            <Link to="/policy" className="text-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/tos" className="text-foreground hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default LegalPageLayout;
