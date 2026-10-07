import { useRef } from 'react';
import type { NodeProps, Node } from '@xyflow/react';
import { Plus } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import type { Person } from '@/types/family';
import { useIsNeumorphic } from '@/hooks/useTheme';

gsap.registerPlugin(useGSAP);

export type RelationshipActionData = {
  parent1: Person;
  parent2: Person;
  onAddChild?: (parent1: Person, parent2: Person) => void;
  [key: string]: unknown;
};

export type RelationshipActionNodeType = Node<RelationshipActionData>;

export function RelationshipActionNode({ data }: NodeProps<RelationshipActionNodeType>) {
  const isNeu = useIsNeumorphic();
  const nodeRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onEnter = () => gsap.to(btn, { y: -1, duration: 0.15, ease: 'power2.out' });
    const onLeave = () => gsap.to(btn, { y: 0, duration: 0.15, ease: 'power2.out' });

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, { scope: nodeRef });

  if (!data?.onAddChild) return null;

  const handleClick = contextSafe((e: React.MouseEvent) => {
    e.stopPropagation();
    if (btnRef.current) {
      gsap.timeline()
        .to(btnRef.current, { scale: 0.92, duration: 0.08 })
        .to(btnRef.current, { scale: 1, duration: 0.14, ease: 'back.out(2)' });
    }
    data.onAddChild?.(data.parent1, data.parent2);
  });

  return (
    <div ref={nodeRef} className="relative z-30 flex items-center justify-center pointer-events-auto select-none">
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap z-30 transition-all",
          isNeu ? (
            "shadow-neu-raised bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5 text-zinc-700 dark:text-zinc-200 hover:shadow-neu-raised active:shadow-neu-pressed"
          ) : (
            "bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs active:scale-95"
          )
        )}
        title={`Tambah Anak (${data.parent1.name} & ${data.parent2.name})`}
      >
        <Plus className={cn("w-3.5 h-3.5", isNeu ? "text-indigo-600 dark:text-indigo-400" : "text-blue-600 dark:text-blue-400")} />
        <span>Anak</span>
      </button>
    </div>
  );
}

export default RelationshipActionNode;
