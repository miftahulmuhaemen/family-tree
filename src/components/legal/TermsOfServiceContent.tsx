import { Award, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsNeumorphic } from '../../hooks/useTheme';

export function TermsOfServiceContent() {
  const isNeu = useIsNeumorphic();

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Acceptance */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
        <p className="text-base text-foreground leading-relaxed">
          By accessing or using Sanak Studio in your browser, you agree to these Terms of Service. If you do not agree with any part of these terms, you should discontinue using the application.
        </p>
      </section>

      {/* 2. Open Source License */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">2. Open Source License (MIT)</h2>
        <p className="text-base text-foreground leading-relaxed">
          Sanak Studio is provided under the terms of the open source MIT License. You are free to view, fork, run, modify, and distribute the software subject to the copyright notice and permission notice contained in the software repository.
        </p>
        <div
          className={cn(
            'p-4 rounded-xl space-y-2',
            isNeu
              ? 'shadow-neu-raised-sm bg-[var(--neu-surface)] border border-[var(--neu-border)]'
              : 'border border-border bg-card'
          )}
        >
          <div className="flex items-center gap-2 text-foreground font-semibold text-base">
            <Award className="w-5 h-5 text-primary" />
            <span>Permissive MIT Terms</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies.
          </p>
        </div>
      </section>

      {/* 3. User Responsibilities */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">3. User Responsibilities & Privacy of Living Persons</h2>
        <p className="text-base text-foreground leading-relaxed">
          Genealogy research often involves sensitive details about living individuals. When documenting, importing, or sharing family trees:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-base text-foreground leading-relaxed">
          <li>You are solely responsible for ensuring you have appropriate consent or legal authority to record personal data of living relatives.</li>
          <li>You are responsible for safely managing and safeguarding your exported GEDCOM, YAML, or backup files.</li>
          <li>You agree not to use the software for unlawful surveillance, harassment, or non-consensual dissemination of private records.</li>
        </ul>
      </section>

      {/* 4. Content Ownership */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">4. User Content Ownership</h2>
        <p className="text-base text-foreground leading-relaxed">
          You retain full, exclusive ownership of all genealogical data, biographies, notes, and family trees you create or import. Sanak Studio asserts no intellectual property claims, licenses, or rights over your family research.
        </p>
      </section>

      {/* 5. Third-Party Services */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">5. Third-Party Integrations</h2>
        <p className="text-base text-foreground leading-relaxed">
          If you use optional integrations such as Google Drive for cloud backups, your usage of those services is governed by Google&apos;s applicable terms and policies. Sanak Studio is not responsible for third-party service availability or terms changes.
        </p>
      </section>

      {/* 6. Disclaimer of Warranty */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">6. Disclaimer of Warranty</h2>
        <div
          className={cn(
            'p-4 rounded-xl space-y-2',
            isNeu
              ? 'shadow-neu-raised-sm bg-[var(--neu-surface)] border border-[var(--neu-border)]'
              : 'border border-border bg-card'
          )}
        >
          <div className="flex items-center gap-2 text-foreground font-semibold text-base">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Provided &quot;AS IS&quot;</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            The software is provided &quot;as is&quot;, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement.
          </p>
        </div>
      </section>

      {/* 7. Limitation of Liability */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">7. Limitation of Liability</h2>
        <p className="text-base text-foreground leading-relaxed">
          In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.
        </p>
      </section>

      {/* 8. Modifications */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">8. Changes to Terms</h2>
        <p className="text-base text-foreground leading-relaxed">
          Any modifications to these terms will be reflected directly in this document and versioned in the project&apos;s git history. Continued use of the application following updates constitutes acceptance of the modified terms.
        </p>
      </section>
    </div>
  );
}

export default TermsOfServiceContent;
