import { useRef, useState } from 'react';
import { Copy, X, Check, ShieldAlert, Link as LinkIcon, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { TERMS, type Language } from '@/utils/i18n';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

export interface ShareSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    id: string;
    token?: string;
    url: string;
  } | null;
  language?: Language;
}

export function ShareSuccessModal({ isOpen, onClose, shareData, language = 'id' }: ShareSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const terms = TERMS[language];
  const isNeu = useIsNeumorphic();
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.24, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  if (!isOpen || !shareData) return null;

  const handleCopy = async () => {
    const textToCopy = shareData.token 
      ? `Family Tree Config Shared!\n\n${terms.share_link}: ${shareData.url}\n${terms.id} ${shareData.id}\n${terms.edit_token}: ${shareData.token}\n\n${terms.save_token_warning}`
      : shareData.url;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const driveFileUrl = `https://drive.google.com/file/d/${encodeURIComponent(shareData.id)}/view`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={cn(
          "w-full max-w-md overflow-hidden shadow-2xl",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-2xl"
            : "bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          isNeu
            ? "border-white/40 dark:border-white/5 bg-transparent"
            : "border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
        )}>
          <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Check className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            {terms.config_shared}
          </h3>
          <button 
            onClick={onClose}
            className={cn(
              "p-1.5 rounded-md transition-all cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-white/60 dark:border-white/5"
                : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Optional Legacy Token Warning */}
          {shareData.token && (
            <div className={cn(
              "flex items-start gap-3 p-3 text-sm",
              isNeu
                ? "shadow-neu-pressed-sm rounded-lg border border-white/30 dark:border-white/5 bg-[#e6e9ef]/60 dark:bg-[#181b20]/60 text-zinc-700 dark:text-zinc-300"
                : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300"
            )}>
              <ShieldAlert className={cn("w-5 h-5 shrink-0 mt-0.5", isNeu ? "text-indigo-500" : "text-zinc-500")} />
              <p>{terms.save_token_warning}</p>
            </div>
          )}

          <div className="space-y-3">
            {/* Share Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" /> {terms.share_link}
              </label>
              <div className={cn(
                "p-2.5 break-all text-xs font-mono",
                isNeu
                  ? "shadow-neu-pressed rounded-lg border border-white/40 dark:border-white/5 bg-transparent text-zinc-700 dark:text-zinc-300"
                  : "bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              )}>
                {shareData.url}
              </div>
            </div>

            {/* Legacy Edit Token if present */}
            {shareData.token && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> {terms.edit_token}
                </label>
                <div className={cn(
                  "p-2.5 flex items-center justify-between group",
                  isNeu
                    ? "shadow-neu-pressed rounded-lg border border-white/40 dark:border-white/5 bg-transparent"
                    : "bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                )}>
                  <code className="text-xs font-mono font-bold tracking-wide select-all text-zinc-900 dark:text-zinc-100">
                    {shareData.token}
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleCopy}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-xs transition-all cursor-pointer rounded-lg",
                isNeu
                  ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] hover:shadow-neu-raised active:shadow-neu-pressed text-zinc-900 dark:text-zinc-100 border border-white/60 dark:border-white/5 font-bold"
                  : "text-zinc-900 dark:text-zinc-100 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 shadow-xs font-bold"
              )}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? terms.copied : terms.copy_details}
            </button>

            <a
              href={driveFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2 px-4 font-medium text-xs transition-all cursor-pointer rounded-lg",
                isNeu
                  ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-700 dark:text-zinc-300 border border-white/60 dark:border-white/5 hover:brightness-105"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
              )}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{terms.open_in_drive || "Buka di Google Drive"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareSuccessModal;
