import type { ElementType } from 'react';
import { BookOpen, Layers, ShieldCheck, X, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DOC_CATEGORIES, type DocMajorSectionId } from '../../types/docs';
import { cn } from '../../lib/utils';

export interface DocsSidebarProps {
  activeMajorId: DocMajorSectionId;
  onSelectMajorSection: (id: DocMajorSectionId) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORY_ICONS: Record<string, ElementType> = {
  Overview: BookOpen,
  Capabilities: Layers,
  'Guides & Security': ShieldCheck,
};

export function DocsSidebar({
  activeMajorId,
  onSelectMajorSection,
  mobileOpen = false,
  onCloseMobile,
}: DocsSidebarProps) {
  const handleItemClick = (id: DocMajorSectionId) => {
    onSelectMajorSection(id);
    onCloseMobile?.();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navContent = (
    <div className="space-y-6">
      {DOC_CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category.title] ?? BookOpen;
        return (
          <div key={category.title}>
            <div className="flex items-center gap-2 mb-2 px-3">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground tracking-wider uppercase font-semibold">
                {category.title}
              </span>
            </div>
            <div className="space-y-0.5">
              {category.items.map((item) => {
                const isActive = activeMajorId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      'w-full text-left block px-3 py-2 text-sm rounded-r-md transition-colors border-l-2 cursor-pointer',
                      isActive
                        ? 'border-primary bg-accent text-foreground font-semibold shadow-xs'
                        : 'border-transparent text-foreground/80 hover:text-foreground hover:bg-accent/60 font-medium'
                    )}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-2 px-3">
          <Scale className="w-4 h-4 text-primary" />
          <span className="text-xs text-foreground tracking-wider uppercase font-semibold">
            Legal & Policies
          </span>
        </div>
        <div className="space-y-0.5">
          <Link
            to="/policy"
            onClick={onCloseMobile}
            className="w-full text-left block px-3 py-2 text-sm rounded-r-md transition-colors border-l-2 border-transparent text-foreground hover:text-foreground hover:bg-accent/60 font-medium cursor-pointer"
          >
            Privacy Policy
          </Link>
          <Link
            to="/tos"
            onClick={onCloseMobile}
            className="w-full text-left block px-3 py-2 text-sm rounded-r-md transition-colors border-l-2 border-transparent text-foreground hover:text-foreground hover:bg-accent/60 font-medium cursor-pointer"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 py-6 pr-4 hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav aria-label="Documentation sidebar">{navContent}</nav>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-background border-r border-border p-6 shadow-xl flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
              <span className="text-sm uppercase tracking-wider text-foreground font-semibold">
                Documentation
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-foreground hover:bg-accent transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto" aria-label="Mobile documentation navigation">
              {navContent}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default DocsSidebar;
