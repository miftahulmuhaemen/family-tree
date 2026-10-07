import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

export type SidebarTabType = 'detail' | 'members' | 'gedcom' | 'yaml';

export interface SidebarTabsProps {
  activeTab: SidebarTabType;
  setActiveTab: (tab: SidebarTabType) => void;
  hasSelectedPerson: boolean;
  peopleCount: number;
  terms: any;
  isReadOnly?: boolean;
}

export function SidebarTabs({
  activeTab,
  setActiveTab,
  hasSelectedPerson,
  peopleCount,
  terms,
  isReadOnly = false
}: SidebarTabsProps) {
  const isNeu = useIsNeumorphic();
  const containerRef = useRef<HTMLDivElement>(null);
  const isCodeActive = activeTab === 'gedcom' || activeTab === 'yaml';

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleTabClick = contextSafe((tab: SidebarTabType, e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.timeline()
      .to(e.currentTarget, { scale: 0.95, duration: 0.08 })
      .to(e.currentTarget, { scale: 1, duration: 0.14, ease: 'back.out(2)' });
    setActiveTab(tab);
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex gap-1.5 transition-all select-none",
        isNeu
          ? "shadow-neu-pressed-sm rounded-xl p-1 bg-[#e6e9ef] dark:bg-[#181b20] m-3 mb-1"
          : "border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2"
      )}
    >
      {hasSelectedPerson && (
        <button
          type="button"
          onClick={(e) => handleTabClick('detail', e)}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs transition-all text-center cursor-pointer",
            isNeu
              ? activeTab === 'detail'
                ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] text-indigo-600 dark:text-indigo-400 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
              : activeTab === 'detail'
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
          )}
        >
          {terms.detail}
        </button>
      )}
      <button
        type="button"
        onClick={(e) => handleTabClick('members', e)}
        className={cn(
          "flex-1 py-1.5 px-2 rounded-lg text-xs transition-all text-center cursor-pointer",
          isNeu
            ? activeTab === 'members'
              ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] text-indigo-600 dark:text-indigo-400 font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
            : activeTab === 'members'
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
        )}
      >
        {terms.members} ({peopleCount})
      </button>
      {!isReadOnly && (
        <button
          type="button"
          onClick={(e) => handleTabClick('gedcom', e)}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs transition-all text-center cursor-pointer",
            isNeu
              ? isCodeActive
                ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] text-indigo-600 dark:text-indigo-400 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
              : isCodeActive
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
          )}
        >
          {terms.raw_code}
        </button>
      )}
    </div>
  );
}

export default SidebarTabs;
