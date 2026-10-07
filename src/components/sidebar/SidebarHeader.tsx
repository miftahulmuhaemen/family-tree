import { useState, useRef, useEffect } from 'react';
import { 
  FileText, FolderOpen, Loader2, Plus,
  Sun, Moon, Share2, Save, AlertCircle, ChevronDown
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

export interface SidebarHeaderProps {
  fileName?: string;
  currentId?: string | null;
  onOpenLoadModal?: () => void;
  onOpenPicker?: () => void;
  onNewTree?: () => void;
  onShare?: () => void;
  isSharing?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  lastSaved?: Date | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onCollapse?: () => void;
  terms: any;
  isReadOnly?: boolean;
}

export function SidebarHeader({
  fileName,
  currentId,
  onOpenLoadModal,
  onOpenPicker,
  onNewTree,
  onShare,
  isSharing = false,
  isValid = true,
  errorMessage,
  isDarkMode,
  toggleDarkMode,
  terms,
  isReadOnly = false
}: SidebarHeaderProps) {
  const isNeu = useIsNeumorphic();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Entrance animation for popover menu
  useGSAP(() => {
    if (isMenuOpen && popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 0, scale: 0.92, y: -6 },
        { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: 'power2.out' }
      );
    }
  }, [isMenuOpen]);

  const handleOpenLoad = () => {
    setIsMenuOpen(false);
    if (onOpenLoadModal) {
      onOpenLoadModal();
    } else if (onOpenPicker) {
      onOpenPicker();
    }
  };

  const handleShareClick = () => {
    setIsMenuOpen(false);
    if (onShare) {
      onShare();
    }
  };

  const handleToggleTheme = () => {
    toggleDarkMode();
  };

  return (
    <div className={cn(
      "h-16 px-4 flex items-center justify-between gap-3 relative z-30 transition-all select-none",
      isNeu
        ? "bg-[#e6e9ef] dark:bg-[#1c2027] border-b border-white/60 dark:border-white/5 shadow-neu-raised-sm"
        : "border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
    )}>
      {/* Left Anchor: filename [status] in a single dynamic unit */}
      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
        <FileText className="w-4 h-4 shrink-0 text-zinc-600 dark:text-zinc-400" />
        <span
          className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate"
          title={fileName || 'family.ged'}
        >
          {fileName || 'family.ged'}
        </span>
        <span className={cn(
          "text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 tracking-wide border",
          isNeu
            ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-800 dark:text-zinc-200 border-white/50 dark:border-white/5"
            : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
        )}>
          {isReadOnly ? (terms.viewer || "Viewer Only") : (terms.editor || "Editor")}
        </span>
        {!isValid && (
          <div className="flex items-center text-amber-500 shrink-0" title={errorMessage || terms.invalid_config}>
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Right Anchor: Clean White 'File' Button with Popover */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
            isNeu
              ? isMenuOpen
                ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-900 dark:text-zinc-100 border border-transparent"
                : "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-700 dark:text-zinc-200 border border-white/60 dark:border-white/5 hover:text-zinc-900 dark:hover:text-zinc-100"
              : isMenuOpen
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-xs"
                : "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:text-zinc-900 dark:hover:text-zinc-100"
          )}
          title={terms.file_menu || "Berkas"}
          aria-expanded={isMenuOpen}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>{terms.file_menu || "Berkas"}</span>
          <ChevronDown className={cn("w-3 h-3 text-zinc-400 transition-transform duration-200", isMenuOpen && "rotate-180")} />
        </button>

        {/* Popover Menu */}
        {isMenuOpen && (
          <div
            ref={popupRef}
            className={cn(
              "absolute right-0 top-full mt-2 w-56 rounded-lg p-1.5 z-50 transition-all",
              isNeu
                ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5"
                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl"
            )}
          >
            {/* 1. New + Button */}
            {onNewTree && (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNewTree();
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors text-left cursor-pointer",
                  isNeu
                    ? "hover:bg-[#d9dce2] dark:hover:bg-[#232832] text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <Plus className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0 stroke-[2.5]" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{terms.new_file || "Baru +"}</div>
                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal truncate">
                    {terms.new_file_desc || "Mulai silsilah baru yang kosong"}
                  </div>
                </div>
              </button>
            )}

            {/* 2. Load Button */}
            <button
              type="button"
              onClick={handleOpenLoad}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors text-left cursor-pointer",
                isNeu
                  ? "hover:bg-[#d9dce2] dark:hover:bg-[#232832] text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <FolderOpen className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div>{terms.load_file || "Muat Berkas..."}</div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal truncate">Google Drive / Lokal</div>
              </div>
            </button>

            {/* 2. Save / Share Button */}
            {onShare && (
              <button
                type="button"
                onClick={handleShareClick}
                disabled={!isValid || isSharing}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors text-left cursor-pointer",
                  !isValid || isSharing
                    ? "opacity-50 cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                    : isNeu
                      ? "hover:bg-[#d9dce2] dark:hover:bg-[#232832] text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-600 dark:text-zinc-400 shrink-0" />
                ) : currentId ? (
                  <Save className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Share2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="truncate">
                    {isSharing
                      ? terms.saving
                      : currentId
                        ? (terms.save_changes_drive || "Simpan Perubahan")
                        : (terms.share_drive || "Bagikan Berkas")}
                  </div>
                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal truncate">
                    {currentId ? "Perbarui di Google Drive" : "Simpan & buat tautan"}
                  </div>
                </div>
              </button>
            )}

            <div className={cn("my-1 border-t", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")} />

            {/* 3. Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left cursor-pointer",
                isNeu
                  ? "hover:bg-[#d9dce2] dark:hover:bg-[#232832] text-zinc-700 dark:text-zinc-200"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
              )}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div>{isDarkMode ? (terms.light_mode || "Mode Terang") : (terms.dark_mode || "Mode Gelap")}</div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">Ganti tema tampilan</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarHeader;
