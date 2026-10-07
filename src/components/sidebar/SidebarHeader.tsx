import { useState } from 'react';
import { FolderDown, Loader2, Lock, Key, Copy, Sun, Moon, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';

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
  const isNeu = useIsNeumorphic();
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

  const neuBtn = "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/60 dark:border-white/5";
  const popoverCls = isNeu ? "shadow-neu-raised bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5" : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700";
  const popoverInputCls = isNeu ? "shadow-neu-pressed bg-transparent border border-white/40 dark:border-white/5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500" : "border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white";
  const popoverBtnCls = isNeu ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className={cn(
      "flex items-center justify-between p-4 relative z-20 transition-all",
      isNeu ? "bg-[#e6e9ef] dark:bg-[#1c2027] border-b border-white/60 dark:border-white/5 shadow-neu-raised-sm" : "border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
    )}>
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
                type="button" 
                onClick={copyToken}
                className={cn("flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded transition-all cursor-pointer", isNeu ? neuBtn : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800")}
                title="Click to copy Edit Token"
              >
                <Key className="w-2.5 h-2.5" /><span>Token</span><Copy className="w-2.5 h-2.5 ml-0.5" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setShowUnlockInput(!showUnlockInput)}
                className={cn("flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded transition-all cursor-pointer", isNeu ? neuBtn : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700")}
              >
                <Lock className="w-2.5 h-2.5" /><span>{terms.locked}</span>
              </button>
            )}
          </div>
        )}

        {/* Unlock Input Popover */}
        {!isReadOnly && showUnlockInput && (
          <div className={cn("absolute top-14 left-4 right-4 rounded-xl shadow-xl p-3 z-50 transition-all", popoverCls)}>
            <form onSubmit={handleUnlockSubmit} className="flex gap-2">
              <input 
                type="text" 
                value={unlockTokenInput}
                onChange={(e) => setUnlockTokenInput(e.target.value)}
                placeholder={terms.enter_token}
                className={cn("flex-1 px-2.5 py-1 text-xs rounded-lg transition-all focus:outline-none", popoverInputCls)}
                autoFocus
              />
              <button type="submit" className={cn("px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer", popoverBtnCls)}>
                {terms.unlock}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {!isReadOnly && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLoadInput(!showLoadInput)}
              className={cn("p-1.5 rounded-lg transition-all cursor-pointer", isNeu ? (showLoadInput ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] text-indigo-600 dark:text-indigo-400 border border-transparent" : neuBtn) : (showLoadInput ? "bg-blue-100 text-blue-600" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"))}
              title={terms.load_config}
            >
              <FolderDown className="w-4 h-4" />
            </button>
            {showLoadInput && (
              <div className={cn("absolute top-full right-0 mt-2 w-64 rounded-xl shadow-xl p-3 z-50 transition-all", popoverCls)}>
                <form onSubmit={handleLoadSubmit} className="flex gap-2">
                  <input 
                    type="text" 
                    value={loadIdInput}
                    onChange={(e) => setLoadIdInput(e.target.value)}
                    placeholder={terms.enter_id}
                    className={cn("flex-1 px-2.5 py-1 text-xs rounded-lg transition-all focus:outline-none", popoverInputCls)}
                    autoFocus
                  />
                  <button type="submit" disabled={isLoadingId} className={cn("px-3 py-1 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 cursor-pointer", popoverBtnCls)}>
                    {isLoadingId ? <Loader2 className="w-3 h-3 animate-spin"/> : terms.sync}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={toggleDarkMode}
          className={cn("p-1.5 rounded-lg transition-all cursor-pointer", isNeu ? neuBtn : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}
          title={terms.toggle_dark_mode}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
        </button>
        <button
          type="button"
          onClick={onCollapse}
          className={cn("p-1.5 rounded-lg transition-all cursor-pointer", isNeu ? neuBtn : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400")}
          title={terms.minimize}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default SidebarHeader;
