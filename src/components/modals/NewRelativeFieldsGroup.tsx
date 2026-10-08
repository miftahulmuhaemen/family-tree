import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

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
  name, setName, gender, setGender, birthDate, setBirthDate, terms
}: NewRelativeFieldsGroupProps) {
  const isNeu = useIsNeumorphic();

  const inputCls = isNeu
    ? "shadow-neu-pressed rounded-xl border border-white/40 dark:border-white/5 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
    : "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600";

  const genderBtnCls = (active: boolean) => cn(
    "py-2 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer",
    active
      ? isNeu
        ? "shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#181b20] text-zinc-900 dark:text-zinc-100 font-bold border-transparent"
        : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs"
      : isNeu
        ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-600 dark:text-zinc-400 border-white/50 dark:border-white/5"
        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
  );

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
          className={cn("w-full px-3 py-2 text-sm", inputCls)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {terms.gender}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setGender('male')} className={genderBtnCls(gender === 'male')}>
            {terms.male}
          </button>
          <button type="button" onClick={() => setGender('female')} className={genderBtnCls(gender === 'female')}>
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
          className={cn("w-full px-3 py-2 text-sm", inputCls)}
        />
      </div>
    </>
  );
}
