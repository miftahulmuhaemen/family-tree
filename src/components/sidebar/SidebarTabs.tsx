import { cn } from '@/lib/utils';

export type SidebarTabType = 'detail' | 'members' | 'yaml';

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
  return (
    <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 gap-1.5">
      {hasSelectedPerson && (
        <button
          onClick={() => setActiveTab('detail')}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all",
            activeTab === 'detail'
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          )}
        >
          {terms.detail}
        </button>
      )}
      <button
        onClick={() => setActiveTab('members')}
        className={cn(
          "flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all",
          activeTab === 'members'
            ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        )}
      >
        {terms.members} ({peopleCount})
      </button>
      {!isReadOnly && (
        <button
          onClick={() => setActiveTab('yaml')}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all",
            activeTab === 'yaml'
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          )}
        >
          {terms.raw_code}
        </button>
      )}
    </div>
  );
}

export default SidebarTabs;
