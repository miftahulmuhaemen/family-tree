import { useRef } from 'react';
import { Bell } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

export type SidebarTabType = 'detail' | 'members' | 'gedcom' | 'yaml' | 'notifications';

export interface SidebarTabsProps {
  activeTab: SidebarTabType;
  setActiveTab: (tab: SidebarTabType) => void;
  hasSelectedPerson: boolean;
  peopleCount: number;
  terms: any;
  isReadOnly?: boolean;
  unseenCount?: number;
}

export function SidebarTabs({
  activeTab,
  setActiveTab,
  hasSelectedPerson,
  peopleCount,
  terms,
  isReadOnly = false,
  unseenCount = 0
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
        "flex gap-1.5 transition-all select-none items-center",
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
                ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-900 dark:text-zinc-100 font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
              : activeTab === 'detail'
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold"
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
              ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-900 dark:text-zinc-100 font-bold"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
            : activeTab === 'members'
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold"
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
                ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-900 dark:text-zinc-100 font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
              : isCodeActive
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
          )}
        >
          {terms.raw_code}
        </button>
      )}

      {/* Notifications Tab (Icon only, no button container appearance, reacts to hover & click) */}
      <button
        type="button"
        onClick={(e) => handleTabClick('notifications', e)}
        className={cn(
          "relative p-1.5 bg-transparent border-0 shadow-none cursor-pointer shrink-0 transition-all duration-200 flex items-center justify-center select-none outline-none",
          "hover:scale-115 active:scale-95",
          activeTab === 'notifications' ? "opacity-100 scale-105" : "opacity-75 hover:opacity-100"
        )}
        title={terms?.notifications || "Notifikasi"}
        aria-label={terms?.notifications || "Notifikasi"}
      >
        <Bell className="w-4 h-4 text-blue-500 fill-blue-500 transition-all" />
        {unseenCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-1 rounded-full text-[9px] font-bold bg-blue-500 text-white flex items-center justify-center leading-none shadow-xs">
            {unseenCount > 99 ? '99+' : unseenCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default SidebarTabs;
