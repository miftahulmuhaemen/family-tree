import { Plus, Trash2, MessageCircle } from 'lucide-react';
import type { PhoneNumber } from '@/types/family';

export interface ContactFieldsGroupProps {
  phoneNumbers: PhoneNumber[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof PhoneNumber, value: any) => void;
  onRemove: (index: number) => void;
  terms: any;
}

export function ContactFieldsGroup({
  phoneNumbers,
  onAdd,
  onUpdate,
  onRemove,
  terms
}: ContactFieldsGroupProps) {
  return (
    <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.phone_numbers}
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
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
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => onUpdate(idx, 'is_whatsapp_number', !phone.is_whatsapp_number)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              phone.is_whatsapp_number 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
            title="Tandai nomor WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold">WA</span>
          </button>
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
