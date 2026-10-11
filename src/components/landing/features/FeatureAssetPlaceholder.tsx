import {
  FileCode2,
  GitBranch,
  Code2,
  HardDrive,
  Share2,
  GitFork,
  UserCheck,
  Languages,
} from 'lucide-react';

export interface FeatureAssetPlaceholderProps {
  id: string;
  label: string;
  number: string;
  assetUrl?: string;
}

export function FeatureAssetPlaceholder({ id, label, number, assetUrl }: FeatureAssetPlaceholderProps) {
  if (assetUrl) {
    return (
      <div className="w-full aspect-[1340/720] rounded-xl border border-border bg-muted/20 relative overflow-hidden shadow-sm transition-all hover:border-black/30 dark:hover:border-white/30">
        <img
          src={assetUrl}
          alt={`${number} ${label}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover block"
        />
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[9px] sm:text-[10px] font-sans font-bold text-black dark:text-white px-2 py-0.5 rounded border border-black/20 dark:border-white/20 bg-background/90 backdrop-blur-sm select-none">
          {number} {label}
        </div>
      </div>
    );
  }
  const getIcon = () => {
    const iconClass = "w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2";
    switch (id) {
      case 'gedcom-standard':
        return <FileCode2 className={`${iconClass} text-blue-500`} />;
      case 'visual-canvas':
        return <GitBranch className={`${iconClass} text-emerald-500`} />;
      case 'monaco-editor':
        return <Code2 className={`${iconClass} text-indigo-500`} />;
      case 'device-storage':
        return <HardDrive className={`${iconClass} text-amber-500`} />;
      case 'gdrive-sync':
        return <Share2 className={`${iconClass} text-sky-500`} />;
      case 'kinship-finder':
        return <GitFork className={`${iconClass} text-violet-500`} />;
      case 'rich-profiles':
        return <UserCheck className={`${iconClass} text-rose-500`} />;
      case 'customary-titles':
        return <Languages className={`${iconClass} text-teal-500`} />;
      default:
        return <FileCode2 className={`${iconClass} text-black dark:text-white`} />;
    }
  };

  return (
    <div className="w-full aspect-[21/9] min-h-[110px] rounded-xl border border-border bg-muted/30 relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none shadow-sm transition-all hover:border-black/20 dark:hover:border-white/20">
      {/* Background architectural pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent pointer-events-none" />

      {/* Feature graphic cue */}
      <div className="relative z-10 flex flex-col items-center">
        {getIcon()}
        <span className="font-sans text-[11px] sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-0.5 sm:mb-1">
          {number} Asset Placeholder
        </span>
        <h4 className="font-sans text-xs sm:text-sm font-bold text-black dark:text-white max-w-md">
          {label}
        </h4>
      </div>

      {/* Subtle corner badge */}
      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[9px] sm:text-[10px] font-sans font-bold text-black dark:text-white px-1.5 py-0.5 rounded border border-black/20 dark:border-white/20 bg-background/80">
        IMAGE_ASSET_SLOT
      </div>
    </div>
  );
}
