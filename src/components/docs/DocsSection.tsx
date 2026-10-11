import { useState, useCallback, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { DocSectionId } from '../../types/docs';

export interface DocsSectionProps {
  id: DocSectionId;
  title: string;
  children: ReactNode;
}

export function DocsSection({ id, title, children }: DocsSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#${id}`
      : `#${id}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Clipboard write failed or blocked
    }
  }, [id]);

  return (
    <section id={id} className="scroll-mt-24 py-8 border-b border-border/40 last:border-b-0">
      <div className="space-y-4">
        <div className="flex items-center gap-2 group">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={`Copy link to ${title}`}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground inline-flex items-center justify-center text-sm"
            title={copied ? 'Link copied' : 'Copy section link'}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <span className="text-base font-semibold leading-none select-none">#</span>
            )}
          </button>
          {copied && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              Copied
            </span>
          )}
        </div>
        <div className="text-foreground leading-relaxed text-base">
          {children}
        </div>
      </div>
    </section>
  );
}

export default DocsSection;
