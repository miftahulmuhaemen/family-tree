import { X } from 'lucide-react';
import type { Person } from '@/types/family';
import { TERMS } from '@/utils/i18n';
import type { Language } from '@/utils/i18n';
import { usePersonForm } from '@/hooks/usePersonForm';
import { ContactFieldsGroup } from './modals/ContactFieldsGroup';
import { AddressFieldsGroup } from './modals/AddressFieldsGroup';

export interface PersonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  person?: Person | null;
  onSave: (person: Person) => void;
  language?: Language;
}

export function PersonFormModal({
  isOpen,
  onClose,
  person,
  onSave,
  language = 'id'
}: PersonFormModalProps) {
  const terms = TERMS[language];

  const {
    name,
    setName,
    gender,
    setGender,
    birthDate,
    setBirthDate,
    isDeceased,
    setIsDeceased,
    deceasedDate,
    setDeceasedDate,
    deceasedPlace,
    setDeceasedPlace,
    shortBio,
    setShortBio,
    phoneNumbers,
    addPhoneNumber,
    updatePhoneNumber,
    removePhoneNumber,
    addresses,
    addAddress,
    updateAddress,
    removeAddress,
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            {person ? terms.edit_person : terms.add_person}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name */}
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
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {terms.gender}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  gender === 'male' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' 
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {terms.male}
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  gender === 'female' 
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' 
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {terms.female}
              </button>
            </div>
          </div>

          {/* Birth Date */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {terms.birth_date}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Deceased Toggle */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {terms.deceased}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {isDeceased && (
              <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    {terms.date_of_death}
                  </label>
                  <input
                    type="date"
                    value={deceasedDate}
                    onChange={(e) => setDeceasedDate(e.target.value)}
                    className="w-full px-3 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    {terms.burial_place}
                  </label>
                  <input
                    type="text"
                    value={deceasedPlace}
                    onChange={(e) => setDeceasedPlace(e.target.value)}
                    placeholder="e.g. TPU Jeruk Purut"
                    className="w-full px-3 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Short Bio */}
          <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {terms.short_bio}
            </label>
            <textarea
              rows={2}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="Catatan ringkas atau riwayat singkat..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Contact Fields */}
          <ContactFieldsGroup
            phoneNumbers={phoneNumbers}
            onAdd={addPhoneNumber}
            onUpdate={updatePhoneNumber}
            onRemove={removePhoneNumber}
            terms={terms}
          />

          {/* Address Fields */}
          <AddressFieldsGroup
            addresses={addresses}
            onAdd={addAddress}
            onUpdate={updateAddress}
            onRemove={removeAddress}
            terms={terms}
          />

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              {terms.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              {terms.save_changes}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
