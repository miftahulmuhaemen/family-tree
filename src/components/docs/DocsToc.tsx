import {
  getSubItemsForMajor,
  type DocMajorSectionId,
  type DocSectionId,
} from '../../types/docs';
import { cn } from '../../lib/utils';

export interface DocsTocProps {
  activeMajorId: DocMajorSectionId;
  activeSubId: DocSectionId;
  onSelectSubSection: (id: DocSectionId) => void;
}

export function DocsToc({
  activeMajorId,
  activeSubId,
  onSelectSubSection,
}: DocsTocProps) {
  const subItems = getSubItemsForMajor(activeMajorId);

  const handleClick = (id: DocSectionId) => {
    onSelectSubSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (subItems.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-56 shrink-0 py-6 pl-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-border/40">
      <div className="text-xs uppercase tracking-wider text-foreground font-semibold mb-3">
        On This Page
      </div>
      <nav aria-label="Table of contents sub-navigation">
        <ul className="space-y-1.5 text-sm">
          {subItems.map((item) => {
            const isActive = activeSubId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    'text-left transition-colors block w-full py-1 text-sm rounded cursor-pointer leading-snug',
                    isActive
                      ? 'text-primary font-bold pl-2 border-l-2 border-primary'
                      : 'text-foreground/80 hover:text-foreground font-medium pl-2 border-l-2 border-transparent'
                  )}
                  title={item.title}
                >
                  {item.title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default DocsToc;
