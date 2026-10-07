import type { NodeProps, Node } from '@xyflow/react';
import { Plus } from 'lucide-react';
import type { Person } from '@/types/family';

export type RelationshipActionData = {
  parent1: Person;
  parent2: Person;
  onAddChild?: (parent1: Person, parent2: Person) => void;
  [key: string]: unknown;
};

export type RelationshipActionNodeType = Node<RelationshipActionData>;

export function RelationshipActionNode({ data }: NodeProps<RelationshipActionNodeType>) {
  if (!data?.onAddChild) return null;

  return (
    <div className="relative z-30 flex items-center justify-center pointer-events-auto">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          data.onAddChild?.(data.parent1, data.parent2);
        }}
        className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold shadow-xs flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap z-30"
        title={`Tambah Anak (${data.parent1.name} & ${data.parent2.name})`}
      >
        <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Anak</span>
      </button>
    </div>
  );
}

export default RelationshipActionNode;
