import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Share2, AlertCircle, CheckCircle, Moon, Sun, Save, FolderDown, Loader2, Lock, Unlock, Key, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import { TERMS } from '@/utils/i18n';
import type { Language } from '@/utils/i18n';

interface EditorSidebarProps {
  yaml: string;
  onYamlChange: (value: string) => void;
  isValid: boolean;
  errorMessage?: string;
  onShare: () => void;
  isSharing: boolean;
  isReadOnly?: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentId: string | null;
  onLoad: (id: string, token?: string) => Promise<void>;
  editToken: string | null;
  onUnlock: (token: string) => void;
  lastSaved: Date | null;
  language?: Language;
}

export function EditorSidebar({
  yaml,
  onYamlChange,
  isValid,
  errorMessage,
  onShare,
  isSharing,
  isReadOnly,
  isDarkMode,
  toggleDarkMode,
  currentId,
  onLoad,
  editToken,
  onUnlock,
  lastSaved,
  language = 'id'
}: EditorSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Initial width should not exceed screen width
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return 400;
    return Math.min(400, window.innerWidth);
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const terms = TERMS[language];

  // Load Popover Logic
  const [showLoadInput, setShowLoadInput] = useState(false);
  const [loadIdInput, setLoadIdInput] = useState('');
  const [isLoadingId, setIsLoadingId] = useState(false);

  // Unlock Popover Logic
  const [showUnlockInput, setShowUnlockInput] = useState(false);
  const [unlockTokenInput, setUnlockTokenInput] = useState('');


  // Resize Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      // Min: 300, Max: 800 but never more than screen width
      const maxWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
      if (newWidth >= 300 && newWidth <= 800 && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto'; // Re-enable text selection
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while resizing
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleLoadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadIdInput.trim()) return;
    
    setIsLoadingId(true);
    try {
      await onLoad(loadIdInput.trim());
      setShowLoadInput(false);
      setLoadIdInput('');
    } catch (err) {
      alert("Failed to load ID. Please check if it exists.");
    } finally {
      setIsLoadingId(false);
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockTokenInput.trim()) return;
    onUnlock(unlockTokenInput.trim());
    setShowUnlockInput(false);
    setUnlockTokenInput('');
  };

  const copyToken = async () => {
    if (editToken) {
      await navigator.clipboard.writeText(editToken);
      alert("Edit Token copied to clipboard! Keep this safe.");
    }
  };


  // If read-only, don't render anything
  if (isReadOnly) return null;

  const isLocked = Boolean(currentId && !editToken);

  return (
    <>
      {/* Toggle Button (Visible when collapsed) */}
      <div 
        className={cn(
          "fixed top-4 left-4 z-40 transition-all duration-300",
          isCollapsed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none",
          isDarkMode && "dark"
        )}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-lg p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={terms.open_editor}
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        style={{ width: isCollapsed ? 0 : width, maxWidth: '100vw' }}
        className={cn(
          "fixed top-0 left-0 h-full bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-700 shadow-xl z-[70] transition-[transform] duration-300 flex flex-col overflow-hidden",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          isDarkMode && "dark"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] relative z-20">
          <div className="flex flex-col overflow-hidden mr-2">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 whitespace-nowrap">{terms.configuration}</h2>
            {currentId && (
              <div className="flex items-center gap-2 text-xs font-mono mt-0.5 max-w-full">
                 <div className="flex items-center gap-1 text-green-600 dark:text-green-400 min-w-0" title={currentId}>
                    <span className="shrink-0">{terms.id}</span>
                    <span className="truncate max-w-[120px]">{currentId}</span>
                 </div>
                 {editToken ? (
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 cursor-pointer" onClick={copyToken} title="Click to copy Edit Token">
                       <Unlock className="w-3 h-3" />
                       <span className="truncate max-w-[80px]">{terms.unlocked}</span>
                       <Copy className="w-2.5 h-2.5 opacity-50"/>
                    </div>
                 ) : (
                    <div className="flex items-center gap-1 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" onClick={() => setShowUnlockInput(!showUnlockInput)}>
                       <Lock className="w-3 h-3" />
                       <span>{terms.locked}</span>
                    </div>
                 )}
              </div>
            )}
             
             {/* Unlock Popover */}
             {showUnlockInput && (
                  <div className="absolute top-14 left-4 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-50">
                     <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <Key className="w-3 h-3" />
                        <span>{terms.enter_token}</span>
                     </div>
                     <form onSubmit={handleUnlockSubmit} className="flex gap-2">
                        <input 
                           type="password" 
                           value={unlockTokenInput}
                           onChange={(e) => setUnlockTokenInput(e.target.value)}
                           placeholder="Token..."
                           className="flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                           autoFocus
                        />
                        <button 
                          type="submit"
                          className="px-2 py-1 text-xs font-medium bg-amber-600 text-white rounded hover:bg-amber-700"
                        >
                          {terms.unlock}
                        </button>
                     </form>
                  </div>
              )}
          </div>

          <div className="flex items-center gap-1">
             {/* Load Button */}
             <div className="relative">
                <button
                  onClick={() => setShowLoadInput(!showLoadInput)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    showLoadInput ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}
                  title={terms.load_config}
                >
                  <FolderDown className="w-5 h-5" />
                </button>

                {/* Load Popover */}
                {showLoadInput && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-50">
                     <form onSubmit={handleLoadSubmit} className="flex gap-2">
                        <input 
                           type="text" 
                           value={loadIdInput}
                           onChange={(e) => setLoadIdInput(e.target.value)}
                           placeholder="Enter ID..."
                           className="flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

             <button
              onClick={toggleDarkMode}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={terms.toggle_dark_mode}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={terms.minimize}
            >
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Editor Area (Monaco) */}
        <div className="flex-1 relative overflow-hidden">
          <Editor
            height="100%"
            language="yaml"
            theme={isDarkMode ? "vs-dark" : "light"}
            value={yaml}
            onChange={(value) => onYamlChange(value || '')}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: isLocked // Disable typing if locked
            }}
          />
        </div>

        {/* Status Bar */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#1e1e1e] space-y-4">
          
          {/* Validation Status & Last Saved */}
          <div className="flex items-center justify-between gap-2 min-h-[20px]">
            <div className="flex items-center gap-2 text-sm flex-1">
              {isValid ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap font-medium">{terms.valid_config}</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in slide-in-from-bottom-2 fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-xs break-all leading-tight">{errorMessage || terms.invalid_config}</span>
                </div>
              )}
            </div>
            
            {/* Last Saved Info */}
            {lastSaved && (
              <div className="text-xs text-gray-400 dark:text-gray-500 text-right shrink-0">
                {terms.last_saved} {lastSaved.toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Share/Save Button */}
          <button
            onClick={onShare}
            disabled={!isValid || isSharing || isLocked}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all whitespace-nowrap",
              (isValid && !isSharing && !isLocked)
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            )}
            title={isLocked ? terms.enter_token : ""}
          >
             {isSharing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLocked ? (
              <Lock className="w-4 h-4" />
            ) : currentId ? (
              <Save className="w-4 h-4" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            
            {isSharing ? (currentId ? terms.saving : terms.generating_link) 
              : isLocked ? terms.locked_readonly
              : currentId ? terms.save_config : terms.share_config}
          </button>
        </div>

        {/* Drag Handle */}
        {!isCollapsed && (
          <div
            className="absolute right-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50 group"
            onMouseDown={() => setIsResizing(true)}
          >
             {/* Visual indicator on hover */}
             <div className="absolute right-0 top-0 w-1 h-full bg-transparent group-hover:bg-blue-400/30 transition-colors" />
          </div>
        )}
      </div>
    </>
  );
}
