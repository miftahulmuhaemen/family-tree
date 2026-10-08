import { Plus, Trash2, MessageCircle } from 'lucide-react';
import type { PhoneNumber } from '@/types/family';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface ContactFieldsGroupProps {
  phoneNumbers: PhoneNumber[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof PhoneNumber, value: any) => void;
  onRemove: (index: number) => void;
  terms: any;
}

export function ContactFieldsGroup({
  phoneNumbers, onAdd, onUpdate, onRemove, terms
}: ContactFieldsGroupProps) {
  const isNeu = useIsNeumorphic();

  const inputCls = isNeu
    ? "shadow-neu-pressed rounded-xl border border-white/40 dark:border-white/5 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
    : "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600";

  return (
    <div className={cn("space-y-3 pt-2 border-t", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.phone_numbers}
        </label>
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            "px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all",
            isNeu
              ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-700 dark:text-zinc-200 border border-white/60 dark:border-white/5 hover:text-zinc-900 dark:hover:text-zinc-100"
              : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-2xs hover:text-zinc-900 dark:hover:text-zinc-100"
          )}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>

      {phoneNumbers.map((phone, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="tel"
            value={phone.number}
            onChange={(e) => onUpdate(idx, 'number', e.target.value)}
            placeholder="08123456789"
            className={cn("flex-1 px-3 py-1.5 text-xs", inputCls)}
          />
          <button
            type="button"
            onClick={() => onUpdate(idx, 'is_whatsapp_number', !phone.is_whatsapp_number)}
            className={cn(
              "p-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer",
              phone.is_whatsapp_number
                ? isNeu
                  ? "shadow-neu-pressed bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-400/30"
                  : "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : isNeu
                  ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-400 border-white/50 dark:border-white/5"
                  : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
            )}
            title="Tandai nomor WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold">WA</span>
          </button>
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
