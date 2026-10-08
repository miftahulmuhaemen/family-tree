import { Plus, Trash2 } from 'lucide-react';
import type { Address } from '@/types/family';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface AddressFieldsGroupProps {
  addresses: Address[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Address, value: string) => void;
  onRemove: (index: number) => void;
  terms: any;
}

export function AddressFieldsGroup({
  addresses, onAdd, onUpdate, onRemove, terms
}: AddressFieldsGroupProps) {
  const isNeu = useIsNeumorphic();

  const inputCls = isNeu
    ? "shadow-neu-pressed rounded-xl border border-white/40 dark:border-white/5 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
    : "rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600";

  return (
    <div className={cn("space-y-3 pt-2 border-t", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.addresses}
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

      {addresses.map((addr, idx) => (
        <div
          key={idx}
          className={cn(
            "space-y-1.5 p-2 rounded-xl border",
            isNeu
              ? "shadow-neu-pressed-sm bg-[#e6e9ef]/50 dark:bg-[#181b20]/50 border-white/30 dark:border-white/5"
              : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          )}
        >
          <div className="flex items-start gap-2">
            <textarea
              rows={2}
              value={addr.address}
              onChange={(e) => onUpdate(idx, 'address', e.target.value)}
              placeholder="Alamat lengkap (nama jalan, kota, kodepos)..."
              className={cn("flex-1 px-3 py-1.5 text-xs", inputCls)}
            />
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="url"
            value={addr.gmap_link}
            onChange={(e) => onUpdate(idx, 'gmap_link', e.target.value)}
            placeholder="Tautan Google Maps (opsional: https://maps.app.goo.gl/...)"
            className={cn("w-full px-3 py-1.5 text-xs", inputCls)}
          />
        </div>
      ))}
    </div>
  );
}
