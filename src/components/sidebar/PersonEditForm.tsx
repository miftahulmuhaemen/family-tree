import type { Person } from '@/types/family';
import { usePersonForm } from '@/hooks/usePersonForm';
import { ContactFieldsGroup } from '@/components/modals/ContactFieldsGroup';
import { AddressFieldsGroup } from '@/components/modals/AddressFieldsGroup';

export interface PersonEditFormProps {
  person: Person;
  onSave: (person: Person) => void;
  onCancel: () => void;
  terms: any;
}

export function PersonEditForm({
  person,
  onSave,
  onCancel,
  terms
}: PersonEditFormProps) {
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
  } = usePersonForm({ person, isOpen: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPersonPayload();
    if (payload) {
      onSave(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          Edit Profil Anggota
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium"
        >
          {terms.cancel}
        </button>
      </div>

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
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Gender */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.gender}
        </label>
        <div className="flex gap-2">
          <label className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="radio"
              name="sidebar-gender"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
              className="text-blue-600 focus:ring-blue-500"
            />
            {terms.male}
          </label>
          <label className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="radio"
              name="sidebar-gender"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
              className="text-blue-600 focus:ring-blue-500"
            />
            {terms.female}
          </label>
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

      {/* Deceased Status */}
      <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800">
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
            <div className="w-8 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        {isDeceased && (
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">Tanggal Meninggal</label>
              <input
                type="date"
                value={deceasedDate}
                onChange={(e) => setDeceasedDate(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">Tempat Pemakaman</label>
              <input
                type="text"
                value={deceasedPlace}
                onChange={(e) => setDeceasedPlace(e.target.value)}
                placeholder="e.g. TPU Karet Bivak"
                className="w-full px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Short Bio */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.short_bio}
        </label>
        <textarea
          rows={2}
          value={shortBio}
          onChange={(e) => setShortBio(e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Phone Numbers */}
      <ContactFieldsGroup
        phoneNumbers={phoneNumbers}
        onAdd={addPhoneNumber}
        onUpdate={updatePhoneNumber}
        onRemove={removePhoneNumber}
        terms={terms}
      />

      {/* Addresses */}
      <AddressFieldsGroup
        addresses={addresses}
        onAdd={addAddress}
        onUpdate={updateAddress}
        onRemove={removeAddress}
        terms={terms}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
        >
          {terms.cancel}
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}
