import { CheckCircle, AlertCircle, Lock, Save, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarFooterProps {
  isValid: boolean;
  errorMessage?: string;
  lastSaved: Date | null;
  onShare: () => void;
  isSharing: boolean;
  isLocked: boolean;
  currentId: string | null;
  terms: any;
}

export function SidebarFooter({
  isValid,
  errorMessage,
  lastSaved,
  onShare,
  isSharing,
  isLocked,
  currentId,
  terms
}: SidebarFooterProps) {
  return (
    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between gap-2 min-h-[18px]">
        <div className="flex items-center gap-2 text-xs flex-1">
          {isValid ? (
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium">{terms.valid_config}</span>
            </div>
          ) : (
            <div className="flex items-start gap-1.5 text-zinc-700 dark:text-zinc-300">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-zinc-500" />
              <span className="text-[11px] break-all">{errorMessage || terms.invalid_config}</span>
            </div>
          )}
        </div>
        
        {lastSaved && (
          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 text-right shrink-0">
            {terms.last_saved} {lastSaved.toLocaleDateString()}
          </div>
        )}
      </div>

      <button
        onClick={onShare}
        disabled={!isValid || isSharing || isLocked}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-xs transition-all shadow-sm",
          (isValid && !isSharing && !isLocked)
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
        )}
        title={isLocked ? terms.enter_token : ""}
      >
        {isSharing ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isLocked ? (
          <Lock className="w-3.5 h-3.5" />
        ) : currentId ? (
          <Save className="w-3.5 h-3.5" />
        ) : (
          <Share2 className="w-3.5 h-3.5" />
        )}
        
        {isSharing ? (currentId ? terms.saving : terms.generating_link) 
          : isLocked ? terms.locked_readonly
          : currentId ? terms.save_config : terms.share_config}
      </button>
    </div>
  );
}
