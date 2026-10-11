import { Plus, Minus } from 'lucide-react';
import { FeatureAssetPlaceholder } from './FeatureAssetPlaceholder';

export interface FeatureAccordionItemProps {
  id: string;
  number: string;
  title: string;
  description: string;
  assetLabel: string;
  assetUrl?: string;
  statusBadge?: string;
  statusNotice?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FeatureAccordionItem({
  id,
  number,
  title,
  description,
  assetLabel,
  assetUrl,
  statusBadge,
  statusNotice,
  isOpen,
  onToggle,
}: FeatureAccordionItemProps) {
  return (
    <div className="border-b border-border transition-colors">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`feature-panel-${id}`}
        className="w-full py-3.5 sm:py-4 flex items-center justify-between text-left group transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 pr-4">
          <span className="font-sans text-sm sm:text-base font-bold text-black dark:text-white shrink-0">
            {number}
          </span>
          <h3 className="font-sans text-sm sm:text-base font-bold tracking-tight text-black dark:text-white transition-colors uppercase">
            {title}
          </h3>
        </div>

        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center shrink-0 text-black dark:text-white group-hover:border-black/50 dark:group-hover:border-white/50 transition-all">
          {isOpen ? (
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 text-black dark:text-white" />
          ) : (
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 text-black dark:text-white" />
          )}
        </div>
      </button>

      {/* Fluid animated collapsible container */}
      <div
        id={`feature-panel-${id}`}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-1 pb-4 sm:pb-5 space-y-3 sm:space-y-4">
            <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed font-normal text-black dark:text-white">
              {description}
            </p>
            {assetUrl ? (
              <FeatureAssetPlaceholder id={id} label={assetLabel} number={number} assetUrl={assetUrl} />
            ) : statusNotice ? (
              <div className="w-full py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl border border-dashed border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 select-none data-[theme=neumorphism]:shadow-[var(--neu-pressed-sm)] data-[theme=neumorphism]:bg-[var(--neu-surface)] data-[theme=neumorphism]:border-[var(--neu-border)]">
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-sans text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                    {statusBadge || 'In Development'}
                  </span>
                </div>
                <p className="font-sans text-sm sm:text-base font-normal text-black dark:text-white">
                  {statusNotice}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
