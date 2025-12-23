import { Copy, X, Check, ShieldAlert, Link } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ShareSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    id: string;
    token: string;
    url: string;
  } | null;
}

export function ShareSuccessModal({ isOpen, onClose, shareData }: ShareSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shareData) return null;

  const handleCopy = async () => {
    const textToCopy = `Family Tree Config Shared!\n\nLink: ${shareData.url}\nID: ${shareData.id}\nEdit Token: ${shareData.token}\n\nKEEP THIS TOKEN SAFE! You need it to edit this file in the future.`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Configuration Shared
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Important Warning */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-sm text-amber-800 dark:text-amber-200">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              You must save the <strong>Edit Token</strong> below. Without it, you will not be able to make changes to this configuration later.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Share Link */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" /> Share Link
              </label>
              <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 break-all text-xs font-mono text-gray-600 dark:text-gray-300">
                {shareData.url}
              </div>
            </div>

            {/* Edit Token */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Edit Token
              </label>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between group">
                <code className="text-sm font-mono font-bold text-amber-600 dark:text-amber-500 tracking-wide select-all">
                  {shareData.token}
                </code>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCopy}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all text-white shadow-md active:scale-95",
                copied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Details to Clipboard"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
