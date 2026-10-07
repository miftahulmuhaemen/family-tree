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
  const hasPhones = phoneNumbers && phoneNumbers.length > 0;
  const hasAddresses = addresses && addresses.length > 0;

  if (!hasPhones && !hasAddresses) return null;

  return (
    <>
      {hasPhones && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1">
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
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
                  >
                    {phone.number}
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.2 rounded text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
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
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1">
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
                    className="text-blue-500 hover:text-blue-600 text-[11px] hover:underline"
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
