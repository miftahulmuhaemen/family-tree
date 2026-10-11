import { Shield, EyeOff, FileText } from 'lucide-react';
import { DocsSection } from '../DocsSection';

interface CorePillar {
  title: string;
  icon: typeof Shield;
  description: string;
}

const CORE_PILLARS: CorePillar[] = [
  {
    title: '100% Client Ownership',
    icon: Shield,
    description:
      'Every person, date, note, and relationship you enter remains in your hands. Data resides directly on your device or in personal storage you explicitly connect. No lock-in, no mandatory cloud accounts, and no paywalls to view your ancestors.',
  },
  {
    title: 'Zero Tracking and Zero Ads',
    icon: EyeOff,
    description:
      'Sanak Studio contains no marketing trackers, no behavioral telemetry, no third-party analytics cookies, and no advertising networks. Your family records and living relatives details are never harvested, monitored, or monetized.',
  },
  {
    title: 'Open Standards',
    icon: FileText,
    description:
      'Direct interoperability with industry standard GEDCOM 5.5.1 and human-readable YAML. You can import records from legacy tools, inspect raw tags, edit in real time, and export without format lock-in.',
  },
];

export function AboutSection() {
  return (
    <DocsSection id="about" title="About Sanak Studio">
      <div className="space-y-6">
        <div className="space-y-3 text-foreground leading-relaxed text-base">
          <p>
            Family records belong to families, not corporate platforms or subscription paywalls.
            For decades, commercial genealogy services have turned public archival data into
            closed walled gardens, requiring monthly fees to access information that families
            themselves helped transcribe and contribute.
          </p>
          <p>
            When subscriptions lapse, families risk losing easy access to their trees or find their
            exports degraded. Sanak Studio was built to counter this dynamic: a standalone,
            client-first workspace where genealogical research remains permanent, private, and
            fully under your control.
          </p>
        </div>

        <div id="about-principles" className="space-y-3 pt-2">
          <div className="text-sm uppercase tracking-wider text-foreground font-semibold">
            Core Principles
          </div>
          <div className="grid grid-cols-1 gap-3">
            {CORE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-4 rounded-lg border border-border bg-card space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-base text-foreground">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DocsSection>
  );
}

export default AboutSection;
