import { useRef } from 'react';
import { Cloud, Upload, Sparkles, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { TERMS, type Language } from '@/utils/i18n';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

export interface LoadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoogleDrive: () => void;
  onSelectLocalFile: (content: string, fileName: string) => void;
  onLoadExample?: () => void;
  language?: Language;
}

export function LoadFileModal({
  isOpen,
  onClose,
  onSelectGoogleDrive,
  onSelectLocalFile,
  onLoadExample,
  language = 'id'
}: LoadFileModalProps) {
  const terms = TERMS[language];
  const isNeu = useIsNeumorphic();
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.22, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDriveClick = () => {
    onClose();
    onSelectGoogleDrive();
  };

  const handleLocalClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onSelectLocalFile(content, file.name);
        onClose();
      }
    };
    reader.readAsText(file);

    // Reset input value so same file can be reloaded if needed
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-md overflow-hidden shadow-2xl transition-all",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-2xl"
            : "bg-white dark:bg-[#1e1e1e] rounded-xl border border-zinc-200 dark:border-zinc-800"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800"
        )}>
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {terms.load_file_modal_title || "Muat Berkas Silsilah"}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {terms.load_file_modal_desc || "Pilih sumber untuk memuat data silsilah"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-white/60 dark:border-white/5"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".ged,.gedcom"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Source Selection Options */}
        <div className="p-4 space-y-3">
          {/* Option 1: Google Drive */}
          <button
            type="button"
            onClick={handleDriveClick}
            className={cn(
              "w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3.5 cursor-pointer group",
              isNeu
                ? "shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5 hover:border-zinc-400/40"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 bg-white dark:bg-zinc-900/60"
            )}
          >
            <div className={cn(
              "p-2.5 rounded-md shrink-0 transition-colors",
              isNeu
                ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-700 dark:text-zinc-300"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900"
            )}>
              <Cloud className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 transition-colors">
                {terms.load_from_drive || "Google Drive"}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {terms.load_from_drive_desc || "Buka berkas .ged yang tersimpan di Google Drive"}
              </div>
            </div>
          </button>

          {/* Option 2: Local File (.ged) */}
          <button
            type="button"
            onClick={handleLocalClick}
            className={cn(
              "w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3.5 cursor-pointer group",
              isNeu
                ? "shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5 hover:border-zinc-400/40"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 bg-white dark:bg-zinc-900/60"
            )}
          >
            <div className={cn(
              "p-2.5 rounded-md shrink-0 transition-colors",
              isNeu
                ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-700 dark:text-zinc-300"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900"
            )}>
              <Upload className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 transition-colors">
                {terms.load_from_local || "Berkas Lokal (.ged)"}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {terms.load_from_local_desc || "Unggah berkas GEDCOM dari perangkat Anda"}
              </div>
            </div>
          </button>

          {/* Option 3: Built-in Sample Tree */}
          {onLoadExample && (
            <button
              type="button"
              onClick={() => {
                onLoadExample();
                onClose();
              }}
              className={cn(
                "w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3.5 cursor-pointer group",
                isNeu
                  ? "shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5 hover:border-zinc-400/40"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 bg-white dark:bg-zinc-900/60"
              )}
            >
              <div className={cn(
                "p-2.5 rounded-md shrink-0 transition-colors",
                isNeu
                  ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-700 dark:text-zinc-300"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900"
              )}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 transition-colors">
                  {terms.load_example || "Contoh Silsilah Keluarga"}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  {terms.load_example_desc || "Muat contoh data silsilah keluarga bawaan"}
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className={cn(
          "px-4 py-3 flex justify-end border-t",
          isNeu ? "border-white/40 dark:border-white/5 bg-[#e6e9ef]/50 dark:bg-[#181b20]/50" : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40"
        )}>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-600 dark:text-zinc-300 border border-white/60 dark:border-white/5"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            )}
          >
            {terms.cancel || "Batal"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoadFileModal;
