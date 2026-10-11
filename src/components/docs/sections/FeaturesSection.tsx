import {
  Code2,
  FileText,
  GitBranch,
  GitFork,
  HardDrive,
  ShieldCheck,
  SunMoon,
  ArrowUpRight,
} from 'lucide-react';
import { DocsSection } from '../DocsSection';
import type { DocSectionId } from '../../../types/docs';

export interface FeaturesSectionProps {
  onNavigate?: (id: DocSectionId) => void;
}

interface FeatureAnchor {
  label: string;
  targetId: DocSectionId;
}

const FEATURE_ANCHORS: FeatureAnchor[] = [
  { label: 'Secure your family tree data', targetId: 'security-privacy' },
  { label: 'Store records wherever you want', targetId: 'byo-storage' },
  { label: 'Import and export industry standard GEDCOM', targetId: 'portability' },
  { label: 'Dual editing: visual graph and live code', targetId: 'sidebar-tools' },
  { label: 'Automated layout with orthogonal generational connectors', targetId: 'canvas-controls' },
  { label: 'Kinship calculation engine', targetId: 'node-relationships' },
  { label: 'High contrast light and dark modes', targetId: 'canvas-controls' },
];

interface FeatureCard {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: 'Secure your family tree data',
    icon: ShieldCheck,
    description:
      'All calculations and storage operations execute directly in your browser. No personal records leave your machine unless you explicitly connect external storage.',
  },
  {
    title: 'Store records wherever you want',
    icon: HardDrive,
    description:
      'Save data locally via browser persistence, export backups as files to your local drive, or link your private Google Drive for cross-device sync.',
  },
  {
    title: 'Import and export industry standard GEDCOM',
    icon: FileText,
    description:
      'Full compatibility with GEDCOM 5.5.1 files. Transfer trees between desktop apps and Sanak Studio with structural validation and syntax error checking.',
  },
  {
    title: 'Dual editing: visual graph and live code',
    icon: Code2,
    description:
      'Switch smoothly between direct drag-and-drop node editing on the canvas and raw YAML or GEDCOM source code buffers with instant two-way synchronization.',
  },
  {
    title: 'Automated layout with orthogonal connectors',
    icon: GitBranch,
    description:
      'Structured generational hierarchies with clean right-angle relationship lines, distinct spouse connections, and automated node alignment.',
  },
  {
    title: 'Kinship calculation engine',
    icon: GitFork,
    description:
      'Built-in relationship engine calculates precise biological and marital connections between any selected pair of individuals in the family tree.',
  },
  {
    title: 'High contrast light and dark modes',
    icon: SunMoon,
    description:
      'Crisp high-contrast visual themes designed for extended editing sessions, supporting system theme detection and manual switching.',
  },
];

export function FeaturesSection({ onNavigate }: FeaturesSectionProps) {
  const handleScroll = (id: DocSectionId) => {
    onNavigate?.(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <DocsSection id="features" title="Features Overview">
      <div className="space-y-6">
        <p className="text-foreground leading-relaxed text-base">
          Sanak Studio combines the flexibility of interactive diagramming with the precision of
          code-based data modeling. Below is an overview of core capabilities designed for modern,
          privacy-conscious family history documentation.
        </p>

        {/* Quick Jump Index */}
        <div id="features-jump" className="border border-border rounded-lg p-4 bg-card space-y-3">
          <div className="text-sm uppercase tracking-wider text-foreground font-semibold">
            Quick Jump Index
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {FEATURE_ANCHORS.map((anchor) => (
              <li key={anchor.label}>
                <button
                  type="button"
                  onClick={() => handleScroll(anchor.targetId)}
                  className="text-left text-foreground hover:underline transition-colors flex items-center gap-2 group w-full cursor-pointer font-medium"
                >
                  <span className="text-primary font-bold select-none">&gt;</span>
                  <span className="truncate">{anchor.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Feature Cards Grid */}
        <div id="features-cards" className="space-y-3 pt-2">
          <div className="text-sm uppercase tracking-wider text-foreground font-semibold">
            Feature Breakdown
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="border border-border p-4 rounded-lg bg-card hover:bg-card/90 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary shrink-0" />
                      <h3 className="font-semibold text-base text-foreground">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DocsSection>
  );
}

export default FeaturesSection;
