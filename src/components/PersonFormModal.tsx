import { useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Person } from '@/types/family';
import { TERMS, type Language } from '@/utils/i18n';
import { usePersonForm } from '@/hooks/usePersonForm';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { ContactFieldsGroup } from './modals/ContactFieldsGroup';
import { AddressFieldsGroup } from './modals/AddressFieldsGroup';

gsap.registerPlugin(useGSAP);

export interface PersonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  person?: Person | null;
  onSave: (person: Person) => void;
  language?: Language;
}

export function PersonFormModal({
  isOpen, onClose, person, onSave, language = 'id'
}: PersonFormModalProps) {
  const terms = TERMS[language];
  const isNeu = useIsNeumorphic();
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.24, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const {
    name, setName, gender, setGender, birthDate, setBirthDate,
    isDeceased, setIsDeceased, deceasedDate, setDeceasedDate,
    deceasedPlace, setDeceasedPlace, shortBio, setShortBio,
    phoneNumbers, addPhoneNumber, updatePhoneNumber, removePhoneNumber,
    addresses, addAddress, updateAddress, removeAddress,
    buildPersonPayload
  } = usePersonForm({ person, isOpen });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPersonPayload();
    if (payload) {
      onSave(payload);
      onClose();
    }
  };

  const inputCls = isNeu
    ? "shadow-neu-pressed rounded-xl border border-white/40 dark:border-white/5 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
    : "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500";

  const genderBtnCls = (active: boolean, isMale: boolean) => cn(
    "py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
    active
      ? isNeu
        ? isMale ? "shadow-neu-pressed bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-400/30" : "shadow-neu-pressed bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-400/30"
        : isMale ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : "border-pink-500 bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300"
      : isNeu
        ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-600 dark:text-zinc-400 border-white/50 dark:border-white/5"
        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-3xl"
            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
        )}
      >
        {/* Modal Header */}
        <div className={cn("flex items-center justify-between p-4 border-b", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")}>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            {person ? terms.edit_person : terms.add_person}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "p-1.5 rounded-xl transition-all cursor-pointer",
              isNeu
                ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-white/60 dark:border-white/5"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {terms.full_name} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Raden Soedirman"
              className={cn("w-full px-3 py-1.5 text-xs", inputCls)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{terms.gender}</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setGender('male')} className={genderBtnCls(gender === 'male', true)}>
                {terms.male}
              </button>
              <button type="button" onClick={() => setGender('female')} className={genderBtnCls(gender === 'female', false)}>
                {terms.female}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{terms.birth_date}</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={cn("w-full px-3 py-1.5 text-xs", inputCls)}
            />
          </div>

          {/* Deceased Toggle */}
          <div className={cn("space-y-2 pt-2 border-t", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{terms.deceased}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isDeceased} onChange={(e) => setIsDeceased(e.target.checked)} className="sr-only peer" />
                <div className={cn(
                  "w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all",
                  isNeu ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] peer-checked:bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-700 peer-checked:bg-blue-600"
                )} />
              </label>
            </div>

            {isDeceased && (
              <div className={cn("space-y-2 p-3 rounded-xl border animate-in fade-in duration-150", isNeu ? "shadow-neu-pressed-sm bg-[#e6e9ef]/60 dark:bg-[#181b20]/60 border-white/40 dark:border-white/5" : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800")}>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">{terms.date_of_death}</label>
                  <input type="date" value={deceasedDate} onChange={(e) => setDeceasedDate(e.target.value)} className={cn("w-full px-3 py-1 text-xs", inputCls)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">{terms.burial_place}</label>
                  <input type="text" value={deceasedPlace} onChange={(e) => setDeceasedPlace(e.target.value)} placeholder="e.g. TPU Jeruk Purut" className={cn("w-full px-3 py-1 text-xs", inputCls)} />
                </div>
              </div>
            )}
          </div>

          <div className={cn("space-y-1 pt-2 border-t", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")}>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{terms.short_bio}</label>
            <textarea
              rows={2}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="Catatan ringkas atau riwayat singkat..."
              className={cn("w-full px-3 py-1.5 text-xs", inputCls)}
            />
          </div>

          <ContactFieldsGroup
            phoneNumbers={phoneNumbers}
            onAdd={addPhoneNumber}
            onUpdate={updatePhoneNumber}
            onRemove={removePhoneNumber}
            terms={terms}
          />

          <AddressFieldsGroup
            addresses={addresses}
            onAdd={addAddress}
            onUpdate={updateAddress}
            onRemove={removeAddress}
            terms={terms}
          />

          {/* Submit Actions */}
          <div className={cn("flex items-center justify-end gap-2 pt-3 border-t", isNeu ? "border-white/40 dark:border-white/5" : "border-zinc-100 dark:border-zinc-800")}>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
                isNeu
                  ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] hover:shadow-neu-raised active:shadow-neu-pressed text-zinc-600 dark:text-zinc-400 border border-white/50 dark:border-white/5"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {terms.cancel}
            </button>
            <button
              type="submit"
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
                isNeu
                  ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] hover:shadow-neu-raised active:shadow-neu-pressed text-indigo-600 dark:text-indigo-400 border border-white/60 dark:border-white/5 font-bold"
                  : "text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
              )}
            >
              {terms.save_changes}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
