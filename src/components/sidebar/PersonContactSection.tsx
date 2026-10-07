import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';
import type { PhoneNumber, Address } from '@/types/family';

export interface PersonContactSectionProps {
  phoneNumbers?: PhoneNumber[];
  addresses?: Address[];
  phoneLabel: string;
  locationLabel: string;
  viewMapsLabel: string;
}

export function PersonContactSection({
  phoneNumbers,
  addresses,
  phoneLabel,
  locationLabel,
  viewMapsLabel
}: PersonContactSectionProps) {
  const isNeu = useIsNeumorphic();
  const hasPhones = phoneNumbers && phoneNumbers.length > 0;
  const hasAddresses = addresses && addresses.length > 0;

  if (!hasPhones && !hasAddresses) return null;

  return (
    <>
      {hasPhones && (
        <div className={cn(
          "space-y-2 transition-all",
          isNeu
            ? "shadow-neu-raised-sm rounded-xl p-4 bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5"
            : ""
        )}>
          <h4 className={cn(
            "text-[11px] font-bold uppercase tracking-wider pb-1",
            isNeu
              ? "text-zinc-500 border-b border-white/40 dark:border-white/5"
              : "text-zinc-500 border-b border-zinc-200 dark:border-zinc-800"
          )}>
            {phoneLabel}
          </h4>
          <div className="space-y-1.5">
            {phoneNumbers.map((phone, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 font-medium">{phoneLabel}:</span>
                {phone.is_whatsapp_number ? (
                  <a
                    href={`https://wa.me/${phone.number.replace(/^0/, '62').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold flex items-center gap-1 hover:opacity-80 text-zinc-900 dark:text-zinc-100"
                  >
                    {phone.number}
                    <span className={cn(
                      "text-[10px] px-1 py-0.2 rounded border font-semibold",
                      isNeu
                        ? "shadow-neu-pressed-sm bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-600 dark:text-zinc-400 border-white/40 dark:border-white/5"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                    )}>
                      (WA)
                    </span>
                  </a>
                ) : (
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">{phone.number}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasAddresses && (
        <div className={cn(
          "space-y-2 transition-all",
          isNeu
            ? "shadow-neu-raised-sm rounded-xl p-4 bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5"
            : ""
        )}>
          <h4 className={cn(
            "text-[11px] font-bold uppercase tracking-wider pb-1",
            isNeu
              ? "text-zinc-500 border-b border-white/40 dark:border-white/5"
              : "text-zinc-500 border-b border-zinc-200 dark:border-zinc-800"
          )}>
            {locationLabel}
          </h4>
          <div className="space-y-1.5">
            {addresses.map((addr, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 text-xs">
                <span className="text-zinc-900 dark:text-zinc-100 font-medium">{addr.address}</span>
                {addr.gmap_link && (
                  <a
                    href={addr.gmap_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {viewMapsLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
