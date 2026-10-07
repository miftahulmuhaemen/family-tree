import { useState } from 'react';
import { 
  FolderDown, 
  Loader2, 
  Lock, 
  Key, 
  Copy, 
  Sun, 
  Moon, 
  ChevronLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarHeaderProps {
  currentId: string | null;
  editToken: string | null;
  onUnlock: (token: string) => void;
  onLoad: (id: string, token?: string) => Promise<void>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onCollapse: () => void;
  terms: any;
  isReadOnly?: boolean;
}

export function SidebarHeader({
  currentId,
  editToken,
  onUnlock,
  onLoad,
  isDarkMode,
  toggleDarkMode,
  onCollapse,
  terms,
  isReadOnly = false
}: SidebarHeaderProps) {
  const [showLoadInput, setShowLoadInput] = useState(false);
  const [loadIdInput, setLoadIdInput] = useState('');
  const [isLoadingId, setIsLoadingId] = useState(false);

  const [showUnlockInput, setShowUnlockInput] = useState(false);
  const [unlockTokenInput, setUnlockTokenInput] = useState('');

  const copyToken = () => {
    if (editToken) {
      navigator.clipboard.writeText(editToken);
      alert("Edit Token disalin ke clipboard!");
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockTokenInput.trim()) {
      onUnlock(unlockTokenInput.trim());
      setShowUnlockInput(false);
      setUnlockTokenInput('');
    }
  };

  const handleLoadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadIdInput.trim()) return;
    setIsLoadingId(true);
    try {
      await onLoad(loadIdInput.trim());
      setShowLoadInput(false);
      setLoadIdInput('');
    } catch (err: any) {
      alert("Gagal memuat ID: " + err.message);
    } finally {
      setIsLoadingId(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 relative z-20">
      <div className="flex flex-col overflow-hidden mr-2">
        <h2 className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
          {isReadOnly ? (terms.family_detail || "Detail Keluarga") : terms.configuration}
        </h2>
        {!isReadOnly && currentId && (
          <div className="flex items-center gap-2 text-xs font-mono mt-0.5 max-w-full">
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 min-w-0" title={currentId}>
              <span className="shrink-0">{terms.id}</span>
              <span className="truncate max-w-[110px]">{currentId}</span>
            </div>
            
            {editToken ? (
              <button 
                onClick={copyToken}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-0.5 text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded"
                title="Click to copy Edit Token"
              >
                <Key className="w-2.5 h-2.5" />
                <span>Token</span>
                <Copy className="w-2.5 h-2.5 ml-0.5" />
              </button>
            ) : (
              <button 
                onClick={() => setShowUnlockInput(!showUnlockInput)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 flex items-center gap-0.5 text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>{terms.locked}</span>
              </button>
            )}
          </div>
        )}

        {/* Unlock Input Popover */}
        {!isReadOnly && showUnlockInput && (
          <div className="absolute top-14 left-4 right-4 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 p-3 z-50">
            <form onSubmit={handleUnlockSubmit} className="flex gap-2">
              <input 
                type="text" 
                value={unlockTokenInput}
                onChange={(e) => setUnlockTokenInput(e.target.value)}
                placeholder={terms.enter_token}
                className="flex-1 px-2 py-1 text-xs border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                autoFocus
              />
              <button 
                type="submit"
                className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {terms.unlock}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Load Button */}
        {!isReadOnly && (
          <div className="relative">
            <button
              onClick={() => setShowLoadInput(!showLoadInput)}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                showLoadInput ? "bg-blue-100 text-blue-600" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              )}
              title={terms.load_config}
            >
              <FolderDown className="w-4 h-4" />
            </button>

            {/* Load Popover */}
            {showLoadInput && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 p-3 z-50">
                <form onSubmit={handleLoadSubmit} className="flex gap-2">
                  <input 
                    type="text" 
                    value={loadIdInput}
                    onChange={(e) => setLoadIdInput(e.target.value)}
                    placeholder={terms.enter_id}
                    className="flex-1 px-2 py-1 text-xs border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    disabled={isLoadingId}
                    className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoadingId ? <Loader2 className="w-3 h-3 animate-spin"/> : terms.sync}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        <button
          onClick={toggleDarkMode}
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          title={terms.toggle_dark_mode}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-zinc-300" /> : <Moon className="w-4 h-4 text-zinc-500" />}
        </button>
        <button
          onClick={onCollapse}
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          title={terms.minimize}
        >
          <ChevronLeft className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  );
}

export default SidebarHeader;
