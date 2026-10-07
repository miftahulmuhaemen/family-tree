export interface NewRelativeFieldsGroupProps {
  name: string;
  setName: (name: string) => void;
  gender: 'male' | 'female';
  setGender: (gender: 'male' | 'female') => void;
  birthDate: string;
  setBirthDate: (date: string) => void;
  terms: any;
}

export function NewRelativeFieldsGroup({
  name,
  setName,
  gender,
  setGender,
  birthDate,
  setBirthDate,
  terms
}: NewRelativeFieldsGroupProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.full_name} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Nama Anggota"
          className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.gender}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
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
            className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
              gender === 'female' 
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' 
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {terms.female}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.birth_date}
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </>
  );
}
