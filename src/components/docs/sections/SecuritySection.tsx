import {
  Cpu,
  ServerOff,
  Database,
  HardDrive,
  CloudOff,
  EyeOff,
  Check,
  FileCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DocsSection } from '../DocsSection';

export function SecuritySection() {
  return (
    <>
      {/* 1. Architecture Overview */}
      <DocsSection id="security-privacy" title="Security & Privacy">
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed text-base">
            Sanak Studio follows a client-only architecture where all operations execute strictly inside your local
            browser runtime. Your family records, relationships, and private notes never pass through intermediate
            application servers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Cpu className="w-5 h-5 text-primary" />
                <span>Local CPU Computation</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Graph layout computations, relationship queries, and GEDCOM parsing execute in-browser using WebAssembly
                and client JavaScript. No server-side processing pipeline exists.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <ServerOff className="w-5 h-5 text-primary" />
                <span>Zero Backend Ingestion</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                There is no central database collecting user trees. Your data remains sandboxed within your browser
                process memory until you choose to save or export it.
              </p>
            </div>
          </div>
        </div>
      </DocsSection>

      {/* 2. Bring Your Own Storage */}
      <DocsSection id="byo-storage" title="Bring Your Own Storage">
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed text-base">
            Commercial genealogy platforms lock your data behind proprietary databases and recurring subscriptions.
            Sanak Studio uses a bring-your-own-storage model to guarantee full ownership of your research.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Database className="w-5 h-5 text-primary" />
                <span>Browser IndexedDB</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Fast offline persistence stored directly in local browser storage, keeping changes available across
                sessions without network access.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <HardDrive className="w-5 h-5 text-primary" />
                <span>Local Files</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Export and save directly to your computer as raw GEDCOM 5.5.1, YAML, or JSON files. You maintain complete
                control over backups.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <CloudOff className="w-5 h-5 text-primary" />
                <span>Private Cloud Sync</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Direct OAuth integration with your personal Google Drive account. Files sync straight between browser and
                cloud storage without third-party proxies.
              </p>
            </div>
          </div>
        </div>
      </DocsSection>

      {/* 3. Zero Analytics */}
      <DocsSection id="zero-analytics" title="Zero Tracking & Analytics">
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed text-base">
            Genealogical records contain sensitive personal identifiable information regarding living relatives,
            birth dates, and locations. Sanak Studio implements strict zero-telemetry engineering.
          </p>

          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-base">
              <EyeOff className="w-5 h-5 text-primary" />
              <span>Zero Tracking Guarantees</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-foreground font-medium">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>No Google Analytics or third-party telemetry scripts</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>No marketing pixels, ad networks, or user fingerprinting</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>No session recording or keystroke logging services</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>No tracking cookies or behavioral profile aggregation</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap gap-4 text-sm font-semibold">
            <Link to="/policy" className="inline-flex items-center gap-1.5 text-primary hover:underline">
              <span>View Official Privacy Policy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/tos" className="inline-flex items-center gap-1.5 text-primary hover:underline">
              <span>View Terms of Service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </DocsSection>

      {/* 4. Long-Term Portability */}
      <DocsSection id="portability" title="Data Portability & Formats">
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed text-base">
            Genealogy research should endure for generations, outliving individual software applications and commercial
            vendors. Sanak Studio is built entirely on open, portable file formats.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <FileCheck className="w-5 h-5 text-primary" />
                <span>GEDCOM 5.5.1 Standard</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Export industry-standard GEDCOM files accepted by desktop software (Gramps, RootsMagic) and major
                genealogy archives worldwide.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Human-Readable YAML</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Store trees in plain-text YAML for git version control, line-by-line diffing, and permanent readability
                in any standard text editor.
              </p>
            </div>
          </div>
        </div>
      </DocsSection>
    </>
  );
}

export default SecuritySection;
