import { ArrowRight, BookOpen, Layers, ShieldCheck, Terminal, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DocsSection } from '../DocsSection';
import type { DocSectionId } from '../../../types/docs';

export interface HomeSectionProps {
  onNavigate?: (id: DocSectionId) => void;
}

interface NavCardItem {
  id: DocSectionId;
  title: string;
  desc: string;
  icon: typeof BookOpen;
}

const NAV_CARDS: NavCardItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    desc: 'Quickstart workflow, canvas controls, node creation, and editor tools.',
    icon: Terminal,
  },
  {
    id: 'features',
    title: 'Features Overview',
    desc: 'Detailed breakdown of tree layouts, code editors, and kinship math.',
    icon: Layers,
  },
  {
    id: 'about',
    title: 'About Sanak',
    desc: 'The philosophy behind client ownership, zero tracking, and open standards.',
    icon: BookOpen,
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy',
    desc: 'Local storage boundaries, zero telemetry, and verifiable data privacy.',
    icon: ShieldCheck,
  },
];

export function HomeSection({ onNavigate }: HomeSectionProps) {
  const handleScroll = (id: DocSectionId) => {
    onNavigate?.(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <DocsSection id="home" title="Documentation Home">
      <div className="space-y-6">
        <p className="text-base text-foreground leading-relaxed">
          Sanak Studio is an open-source, client-first genealogy editor designed for private family
          tree management. Work directly in your browser with interactive node graphs, bi-directional
          code editing, and native GEDCOM 5.5.1 support without account paywalls or cloud lock-in.
        </p>

        {/* Quick Navigation Cards */}
        <div id="home-navigation" className="space-y-3 pt-2">
          <div className="text-sm uppercase tracking-wider text-foreground font-semibold">
            Topics & Navigation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NAV_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleScroll(card.id)}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-card/90 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        {card.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legal & Policies Cards */}
        <div id="home-legal" className="space-y-3 pt-2">
          <div className="text-sm uppercase tracking-wider text-foreground font-semibold">
            Legal & Privacy
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/policy"
              className="p-4 rounded-lg border border-border bg-card hover:bg-card/90 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    <Scale className="w-5 h-5 text-primary" />
                    Privacy Policy
                  </span>
                  <ArrowRight className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Official statement on client-side sandboxing, zero data ingestion, and zero third-party telemetry.
                </p>
              </div>
            </Link>
            <Link
              to="/tos"
              className="p-4 rounded-lg border border-border bg-card hover:bg-card/90 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Terms of Service
                  </span>
                  <ArrowRight className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Open-source software usage terms, MIT licensing, and user data ownership agreements.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DocsSection>
  );
}

export default HomeSection;
