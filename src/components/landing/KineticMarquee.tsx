export interface KineticMarqueeProps {
  items?: string[];
  reverse?: boolean;
}

const DEFAULT_ITEMS = [
  'GEDCOM 5.5.1 COMPLIANT',
  '100% CLIENT STORAGE',
  'ZERO SERVER TELEMETRY',
  'OFFLINE-FIRST ARCHITECTURE',
  'UNIVERSAL GENEALOGY EXPORT',
  'SOVEREIGN FAMILY DATA',
];

export function KineticMarquee({ items = DEFAULT_ITEMS, reverse = false }: KineticMarqueeProps) {
  const content = items.join(' — ');

  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden bg-background/50 py-3 select-none backdrop-blur-xs"
    >
      <div
        className={`flex whitespace-nowrap font-sans font-bold text-xs md:text-sm tracking-widest uppercase ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        <span className="mx-4">{content} — </span>
        <span className="mx-4">{content} — </span>
      </div>
    </div>
  );
}
