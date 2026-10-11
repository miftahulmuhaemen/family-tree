import { Check, Database, Cpu, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsNeumorphic } from '../../hooks/useTheme';

export function PrivacyPolicyContent() {
  const isNeu = useIsNeumorphic();

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Core Commitment */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">1. Core Privacy Architecture</h2>
        <p className="text-base text-foreground leading-relaxed">
          Sanak Studio operates under a strict client-only architecture. All genealogy computations, relationship algorithms, GEDCOM parsing, and visual layout rendering run exclusively inside your web browser. No family records, biographical information, or photos are sent to or stored on our servers.
        </p>
      </section>

      {/* 2. Zero Telemetry */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">2. Zero Analytics and Tracking</h2>
        <p className="text-base text-foreground leading-relaxed">
          We believe genealogical research is deeply personal and sensitive. We do not track, profile, or monetize your activity.
        </p>
        <div
          className={cn(
            'p-4 rounded-xl space-y-3',
            isNeu
              ? 'shadow-neu-raised-sm bg-[var(--neu-surface)] border border-[var(--neu-border)]'
              : 'border border-border bg-card'
          )}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-foreground font-medium">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Zero third-party analytics or tracker scripts</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Zero advertising pixels or cross-site fingerprinting</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Zero session recording or keystroke logging</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Zero marketing cookies or behavioral ad tracking</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. Local Storage and Client Persistence */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">3. Local Data Storage & Cookies</h2>
        <p className="text-base text-foreground leading-relaxed">
          The application uses standard browser storage APIs strictly for local functionality:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className={cn(
              'p-4 rounded-xl space-y-2',
              isNeu
                ? 'shadow-neu-raised-sm bg-[var(--neu-surface)] border border-[var(--neu-border)]'
                : 'border border-border bg-card'
            )}
          >
            <div className="flex items-center gap-2 text-foreground font-semibold text-base">
              <Database className="w-5 h-5 text-primary" />
              <span>IndexedDB</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Stores family tree graphs, persons, and relationships locally on your machine for fast offline access.
            </p>
          </div>
          <div
            className={cn(
              'p-4 rounded-xl space-y-2',
              isNeu
                ? 'shadow-neu-raised-sm bg-[var(--neu-surface)] border border-[var(--neu-border)]'
                : 'border border-border bg-card'
            )}
          >
            <div className="flex items-center gap-2 text-foreground font-semibold text-base">
              <Cpu className="w-5 h-5 text-primary" />
              <span>LocalStorage</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Persists your interface preferences including dark mode, active theme, and canvas zoom settings.
            </p>
          </div>
          <div
            className={cn(
              'p-4 rounded-xl space-y-2',
              isNeu
                ? 'shadow-neu-raised-sm bg-[var(--neu-surface)] border border-[var(--neu-border)]'
                : 'border border-border bg-card'
            )}
          >
            <div className="flex items-center gap-2 text-foreground font-semibold text-base">
              <Lock className="w-5 h-5 text-primary" />
              <span>Zero Cookies</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              We do not issue HTTP tracking cookies or authentication cookies from remote origins.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Google Drive Cloud Integration */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">4. Google Drive Integration (Optional)</h2>
        <p className="text-base text-foreground leading-relaxed">
          If you choose to synchronize family tree files with Google Drive, the connection is authenticated directly between your browser and Google APIs via official OAuth tokens. We do not operate a proxy backend, intermediary relay, or cloud mirror. Tokens and file transfers remain solely between your browser and your private Google account.
        </p>
      </section>

      {/* 5. Data Ownership and Deletion */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">5. Data Ownership, Portability & Deletion</h2>
        <p className="text-base text-foreground leading-relaxed">
          You retain 100% intellectual property and ownership over all data you enter. You can export complete trees at any time in industry-standard GEDCOM 5.5.1, YAML, or JSON formats. To completely delete your data, clear your browser storage or delete the tree file from the application interface. No remote traces remain because no remote copies were ever created.
        </p>
      </section>

      {/* 6. Open Source Governance */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">6. Open Source Verification</h2>
        <p className="text-base text-foreground leading-relaxed">
          Sanak Studio is free and open source software. All source code is publicly inspectable and auditable on GitHub to verify our zero-telemetry and client-first security guarantees.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicyContent;
