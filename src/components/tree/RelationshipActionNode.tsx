import { useState, useRef, useEffect } from 'react';
import type { NodeProps, Node } from '@xyflow/react';
import { Plus, Heart, HeartCrack, Users, ChevronDown, Check } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import type { Person } from '@/types/family';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { TERMS, type Language } from '@/utils/i18n';

gsap.registerPlugin(useGSAP);

export type RelationshipActionData = {
  parent1: Person;
  parent2: Person;
  relationshipType?: 'married' | 'divorced' | 'not_married';
  language?: Language;
  onAddChild?: (parent1: Person, parent2: Person) => void;
  onChangeRelationshipStatus?: (parent1Id: string, parent2Id: string, type: 'married' | 'divorced' | 'not_married') => void;
  [key: string]: unknown;
};

export type RelationshipActionNodeType = Node<RelationshipActionData>;

export function RelationshipActionNode({ data }: NodeProps<RelationshipActionNodeType>) {
  const isNeu = useIsNeumorphic();
  const nodeRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { contextSafe } = useGSAP(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onEnter = () => gsap.to(btn, { y: -1, duration: 0.15, ease: 'power2.out' });
    const onLeave = () => gsap.to(btn, { y: 0, duration: 0.15, ease: 'power2.out', clearProps: 'transform' });

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, { scope: nodeRef });

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as unknown as globalThis.Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const lang = (data.language as Language) || 'en';
  const t = TERMS[lang] || TERMS.en;

  const statusConfig: Record<
    'married' | 'divorced' | 'not_married',
    { label: string; icon: typeof Heart; iconClass: string }
  > = {
    married: {
      label: t.married,
      icon: Heart,
      iconClass: 'text-rose-500 dark:text-rose-400',
    },
    divorced: {
      label: t.divorced,
      icon: HeartCrack,
      iconClass: 'text-amber-500 dark:text-amber-400',
    },
    not_married: {
      label: t.not_married,
      icon: Users,
      iconClass: 'text-zinc-500 dark:text-zinc-400',
    },
  };

  const statusOptions = [
    { type: 'married' as const, label: t.married, icon: Heart, iconClass: 'text-rose-500 dark:text-rose-400' },
    { type: 'divorced' as const, label: t.divorced, icon: HeartCrack, iconClass: 'text-amber-500 dark:text-amber-400' },
    { type: 'not_married' as const, label: t.not_married, icon: Users, iconClass: 'text-zinc-500 dark:text-zinc-400' },
  ];

  if (!data?.onAddChild && !data?.onChangeRelationshipStatus) return null;

  const currentType = data.relationshipType || 'married';
  const statusMeta = statusConfig[currentType] || statusConfig.married;
  const StatusIcon = statusMeta.icon;

  const handleAddChildClick = contextSafe((e: React.MouseEvent) => {
    e.stopPropagation();
    if (btnRef.current) {
      gsap.timeline()
        .to(btnRef.current, { scale: 0.92, duration: 0.08 })
        .to(btnRef.current, { scale: 1, duration: 0.14, ease: 'back.out(2)', clearProps: 'transform' });
    }
    data.onAddChild?.(data.parent1, data.parent2);
  });

  const handleSelectStatus = (newType: 'married' | 'divorced' | 'not_married', e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (newType !== currentType) {
      data.onChangeRelationshipStatus?.(data.parent1.id, data.parent2.id, newType);
    }
  };

  return (
    <div ref={nodeRef} className="relative z-30 flex items-center justify-center pointer-events-auto select-none nopan nodrag">
      <div
        className={cn(
          "flex items-center rounded-full text-xs font-semibold z-30 transition-all p-0.5",
          isNeu ? (
            "shadow-neu-raised bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5 text-zinc-700 dark:text-zinc-200"
          ) : (
            "bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-xs"
          )
        )}
      >
        {data.onAddChild && (
          <button
            ref={btnRef}
            type="button"
            onClick={handleAddChildClick}
            className={cn(
              "px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer whitespace-nowrap transition-all",
              isNeu
                ? "hover:bg-black/5 dark:hover:bg-white/5 active:shadow-neu-pressed font-bold"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-95 font-bold"
            )}
            title={`${t.add_child} (${data.parent1.name} & ${data.parent2.name})`}
          >
            <Plus className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>{t.btn_child.replace(/^\+\s*/, '')}</span>
          </button>
        )}

        {data.onAddChild && data.onChangeRelationshipStatus && (
          <div className={cn("w-px h-3.5 my-auto", isNeu ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-700")} />
        )}

        {data.onChangeRelationshipStatus && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen((prev) => !prev); }}
            className={cn(
              "px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer whitespace-nowrap transition-all",
              isNeu
                ? "hover:bg-black/5 dark:hover:bg-white/5 active:shadow-neu-pressed"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
            )}
            title={`${t.relationship_status} (${statusMeta.label})`}
          >
            <StatusIcon className={cn("w-3.5 h-3.5", statusMeta.iconClass)} />
            <span className="text-[11px] font-medium">{statusMeta.label}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400 opacity-70" />
          </button>
        )}
      </div>

      {isMenuOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 left-1/2 -translate-x-1/2 w-44 p-1.5 rounded-xl z-50 shadow-xl border animate-in fade-in zoom-in-95 duration-150 nopan nodrag",
            isNeu
              ? "bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5 shadow-neu-raised"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 py-1">
            {t.relationship_status}
          </div>
          <div className="space-y-0.5">
            {statusOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = opt.type === currentType;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={(e) => handleSelectStatus(opt.type, e)}
                  className={cn(
                    "w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-all",
                    isNeu
                      ? (isSelected
                          ? "shadow-neu-pressed bg-[#dde1e9] dark:bg-[#16181d] text-zinc-900 dark:text-zinc-100 font-bold"
                          : "hover:shadow-neu-raised-sm active:shadow-neu-pressed text-zinc-700 dark:text-zinc-300")
                      : (isSelected
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300")
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className={cn("w-3.5 h-3.5", opt.iconClass)} />
                    <span>{opt.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default RelationshipActionNode;
