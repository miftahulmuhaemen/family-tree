import { useRef } from 'react';
import type { NodeProps, Node } from '@xyflow/react';
import { Plus } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from "@/lib/utils";
import { TERMS, type Language } from '@/utils/i18n';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

export type NewMemberData = {
  onAddPerson?: () => void;
  language?: Language;
  isDarkMode?: boolean;
  [key: string]: unknown;
};

export type NewMemberNodeType = Node<NewMemberData>;

export function NewMemberNode({ data }: NodeProps<NewMemberNodeType>) {
  const { onAddPerson, language = 'en' } = data || {};
  const terms = TERMS[language as Language] || TERMS.en;
  const isNeu = useIsNeumorphic();
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;
    const onEnter = () => gsap.to(card, { y: -2, scale: 1.02, duration: 0.18, ease: 'power2.out' });
    const onLeave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.18, ease: 'power2.out', clearProps: 'transform' });

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, { scope: cardRef });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      gsap.timeline()
        .to(cardRef.current, { scale: 0.96, duration: 0.08 })
        .to(cardRef.current, { scale: 1, duration: 0.14, ease: 'back.out(2)', clearProps: 'transform' })
        .call(() => onAddPerson?.());
    } else {
      onAddPerson?.();
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onAddPerson?.();
        }
      }}
      className={cn(
        "w-[256px] h-[120px] transition-all duration-200 flex items-center px-4 gap-3.5 cursor-pointer select-none",
        isNeu
          ? "border border-white/60 dark:border-white/5 rounded-2xl shadow-neu-raised hover:shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027]"
          : "border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850/80 shadow-xs hover:shadow-md"
      )}
      title={terms.add_first_member || "Tambah Anggota"}
      aria-label={terms.add_first_member || "Tambah Anggota"}
    >
      <div
        className={cn(
          "w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-bold transition-all",
          isNeu
            ? "shadow-neu-pressed-sm bg-[#dde1e9] dark:bg-[#16181d] text-zinc-700 dark:text-zinc-200"
            : "border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
        )}
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
          {terms.add_first_member || "Tambah Anggota"}
        </div>
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5 line-clamp-2">
          {terms.add_first_member_desc || "Klik untuk membuat pohon keluarga"}
        </div>
      </div>
    </div>
  );
}

export default NewMemberNode;
