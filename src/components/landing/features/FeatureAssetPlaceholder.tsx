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

interface FeatureAssetPlaceholderProps {
  id: string;
  label: string;
  number: string;
}

export function FeatureAssetPlaceholder({ id, label, number }: FeatureAssetPlaceholderProps) {
  const getIcon = () => {
    switch (id) {
      case 'gedcom-standard':
        return <FileCode2 className="w-8 h-8 text-blue-500 mb-2" />;
      case 'visual-canvas':
        return <GitBranch className="w-8 h-8 text-emerald-500 mb-2" />;
      case 'monaco-editor':
        return <Code2 className="w-8 h-8 text-indigo-500 mb-2" />;
      case 'device-storage':
        return <HardDrive className="w-8 h-8 text-amber-500 mb-2" />;
      case 'gdrive-sync':
        return <Share2 className="w-8 h-8 text-sky-500 mb-2" />;
      case 'kinship-finder':
        return <GitFork className="w-8 h-8 text-violet-500 mb-2" />;
      case 'rich-profiles':
        return <UserCheck className="w-8 h-8 text-rose-500 mb-2" />;
      case 'customary-titles':
        return <Languages className="w-8 h-8 text-teal-500 mb-2" />;
      default:
        return <FileCode2 className="w-8 h-8 text-black dark:text-white mb-2" />;
    }
  };

  return (
    <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl border border-border bg-muted/30 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none shadow-sm transition-all hover:border-black/20 dark:hover:border-white/20">
      {/* Background architectural pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent pointer-events-none" />

      {/* Feature graphic cue */}
      <div className="relative z-10 flex flex-col items-center">
        {getIcon()}
        <span className="font-sans text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-1">
          {number} Asset Placeholder
        </span>
        <h4 className="font-sans text-xs sm:text-sm font-bold text-black dark:text-white max-w-md">
          {label}
        </h4>
      </div>

      {/* Subtle corner badge */}
      <div className="absolute bottom-3 right-3 text-[10px] font-sans font-bold text-black dark:text-white px-2 py-0.5 rounded border border-black/20 dark:border-white/20 bg-background/80">
        IMAGE_ASSET_SLOT
      </div>
    </div>
  );
}
