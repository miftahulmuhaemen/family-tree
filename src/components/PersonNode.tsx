import { useRef } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from "@/lib/utils";
import { NodeActionMenu } from './tree/NodeActionMenu';
import type { Address, PhoneNumber, DeceasedInfo } from '@/types/family';
import { TERMS, type Language } from '@/utils/i18n';

gsap.registerPlugin(useGSAP);

export type { Address, PhoneNumber, DeceasedInfo };

export type PersonData = {
  id: string;
  label: string;
  name: string;
  gender: 'male' | 'female';
  birthDate?: string;
  address?: Address[];
  phone_number?: PhoneNumber[];
  short_bio?: string;
  relationshipLabel?: string;
  deceased?: boolean | DeceasedInfo;
  additionals?: Record<string, string>;
  parentCount?: number;
  hasFather?: boolean;
  hasMother?: boolean;
  language?: Language;
  onAddRelative?: (targetPerson: any, type: 'spouse' | 'child' | 'parent' | 'foster_child') => void;
  onEditPerson?: (person: any) => void;
  onDeletePerson?: (personId: string) => void;
  onOpenDetail?: (personId: string) => void;
};

export type PersonNode = Node<PersonData>;

import { useIsNeumorphic } from '@/hooks/useTheme';

export default function PersonNode({ data, selected }: NodeProps<PersonNode>) {
  const { 
    label, gender, relationshipLabel, birthDate, deceased, 
    hasFather = false, hasMother = false, onAddRelative, onDeletePerson, onOpenDetail,
    language = 'en'
  } = data;
  const t = TERMS[language as Language] || TERMS.en;

  const isDeceased = typeof deceased === 'boolean' ? deceased : deceased?.status;
  const isNeu = useIsNeumorphic();
  const nodeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;
    const onEnter = () => gsap.to(card, { y: -2, duration: 0.18, ease: 'power2.out' });
    const onLeave = () => gsap.to(card, { y: 0, duration: 0.18, ease: 'power2.out', clearProps: 'transform' });
    const onClick = () => gsap.timeline()
      .to(card, { scale: 0.98, duration: 0.08 })
      .to(card, { scale: 1, duration: 0.14, ease: 'back.out(2)', clearProps: 'transform' });

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('click', onClick);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      card.removeEventListener('click', onClick);
    };
  }, { scope: nodeRef });

  const getAge = (bDateStr?: string) => {
    if (!bDateStr) return null;
    const today = new Date();
    const bDate = new Date(bDateStr);
    let a = today.getFullYear() - bDate.getFullYear();
    const m = today.getMonth() - bDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) a--;
    return a;
  };

  const age = getAge(birthDate);
  const parentBtnLabel = hasFather && !hasMother ? t.btn_mother : hasMother && !hasFather ? t.btn_father : t.btn_parent;
  const parentBtnTitle = hasFather && !hasMother ? t.add_mother : hasMother && !hasFather ? t.add_father : t.add_parent;
  const initial = (label || '').trim().charAt(0).toUpperCase() || '?';
  const cleanLabel = (label || '').trim();
  const isLongName = cleanLabel.length > 18;
  const isVeryLongName = cleanLabel.length > 30;
  const nameFontSizeClass = isVeryLongName
    ? "text-[11px] leading-snug"
    : isLongName
      ? "text-xs leading-snug"
      : "text-sm leading-snug";

  const actionBtnClass = isNeu
    ? "bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-700 dark:text-zinc-200 shadow-neu-raised-sm border border-white/60 dark:border-white/5 hover:shadow-neu-raised active:shadow-neu-pressed text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all"
    : "bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 transition-colors";

  return (
    <div ref={nodeRef} className="relative w-64 group select-none">

      {onAddRelative && (
        <>
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:scale-105">
            <button type="button" onClick={(e) => { e.stopPropagation(); onAddRelative(data, 'parent'); }} className={actionBtnClass} title={parentBtnTitle}>
              <span>{parentBtnLabel}</span>
            </button>
          </div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:scale-105">
            <button type="button" onClick={(e) => { e.stopPropagation(); onAddRelative(data, 'spouse'); }} className={cn(actionBtnClass, "whitespace-nowrap")} title={t.add_spouse}>
              <span>{t.btn_spouse}</span>
            </button>
          </div>
          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-30 transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:scale-105">
            <button type="button" onClick={(e) => { e.stopPropagation(); onAddRelative(data, 'foster_child'); }} className={cn(actionBtnClass, "whitespace-nowrap")} title={t.add_foster_child}>
              <span>{t.btn_foster_child}</span>
            </button>
          </div>
        </>
      )}

      <div 
        ref={cardRef}
        className={cn(
          "w-full h-[120px] transition-colors duration-200 ease-in-out flex items-center px-4 gap-3.5 cursor-pointer relative",
          isNeu ? (
            cn(
              "border border-white/60 dark:border-white/5 rounded-2xl shadow-neu-raised bg-[#e6e9ef] dark:bg-[#1c2027]",
              isDeceased && "shadow-neu-pressed bg-[#dde1e9] dark:bg-[#16181d] text-zinc-500",
              selected && (
                isDeceased
                  ? "shadow-neu-pressed ring-2 ring-zinc-400 dark:ring-zinc-500 z-20"
                  : gender === 'female'
                    ? "shadow-neu-pressed ring-2 ring-rose-400 dark:ring-rose-500 z-20"
                    : "shadow-neu-pressed ring-2 ring-sky-400 dark:ring-sky-500 z-20"
              )
            )
          ) : (
            cn(
              "border-2 rounded-xl shadow-sm hover:shadow-md bg-white dark:bg-zinc-900",
              gender === 'male' ? "border-blue-500" : "border-pink-400",
              isDeceased && "grayscale bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600",
              selected && (
                isDeceased
                  ? "ring-4 ring-zinc-400 dark:ring-zinc-500 shadow-xl z-20"
                  : gender === 'female'
                    ? "ring-4 ring-pink-400 dark:ring-pink-500 shadow-xl z-20"
                    : "ring-4 ring-blue-500 dark:ring-blue-600 shadow-xl z-20"
              )
            )
          )
        )}
      >
        <div 
          className={cn(
            "w-11 h-11 shrink-0 flex items-center justify-center font-bold text-sm transition-all select-none",
            isNeu ? (
              cn(
                "shadow-neu-pressed-sm rounded-full",
                isDeceased 
                  ? "shadow-neu-pressed text-zinc-500 bg-[#dde1e9] dark:bg-[#16181d]" 
                  : gender === 'male'
                    ? "text-[#2563eb] dark:text-[#38bdf8] bg-[#dbeafe] dark:bg-[rgba(56,189,248,0.12)]"
                    : "text-[#e11d48] dark:text-[#fb7185] bg-[#ffe4e6] dark:bg-[rgba(251,113,133,0.12)]"
              )
            ) : (
              cn(
                "rounded-full border",
                isDeceased
                  ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
                  : gender === 'male'
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-900/60"
                    : "bg-pink-50 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300 border-pink-200 dark:border-pink-900/60"
              )
            )
          )}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {relationshipLabel && (
            <div className={cn("text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate", isNeu ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-600 dark:text-zinc-400")}>
              {relationshipLabel}
            </div>
          )}
          <div className="relative group/name max-w-full">
            <div
              className={cn(
                "font-bold line-clamp-2 break-words transition-colors",
                nameFontSizeClass,
                isNeu ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-900 dark:text-zinc-100"
              )}
            >
              {cleanLabel}
            </div>
            {isLongName && (
              <div
                role="tooltip"
                className={cn(
                  "pointer-events-none absolute left-0 bottom-full mb-1.5 z-50 whitespace-normal min-w-max max-w-[220px] px-2.5 py-1.5 text-xs font-semibold rounded-xl opacity-0 scale-95 -translate-y-1 group-hover/name:opacity-100 group-hover/name:scale-100 group-hover/name:translate-y-0 transition-all duration-150 ease-out shadow-xl",
                  isNeu
                    ? "bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-800 dark:text-zinc-100 shadow-neu-raised border border-white/60 dark:border-white/5"
                    : "bg-zinc-900/95 dark:bg-zinc-800/95 text-white dark:text-zinc-100 border border-zinc-700/60"
                )}
              >
                {cleanLabel}
                <div
                  className={cn(
                    "absolute -bottom-1 left-4 w-2 h-2 rotate-45",
                    isNeu
                      ? "bg-[#e6e9ef] dark:bg-[#1c2027] border-r border-b border-white/60 dark:border-white/5"
                      : "bg-zinc-900/95 dark:bg-zinc-800/95 border-r border-b border-zinc-700/60"
                  )}
                />
              </div>
            )}
          </div>
          <div className={cn("text-xs mt-0.5 font-medium truncate", isNeu ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-600 dark:text-zinc-400")}>
            {isDeceased ? (
              <span className="text-zinc-500 text-xs">({t.deceased_badge}) {t.deceased_status}</span>
            ) : (
              age !== null ? (
                <span className="text-xs font-semibold">{age} {t.years}</span>
              ) : (
                <span className="italic text-xs text-zinc-400">{t.unknown_age}</span>
              )
            )}
          </div>
        </div>
      </div>

      <NodeActionMenu
        personName={data.name || label}
        gender={gender}
        isDeceased={Boolean(isDeceased)}
        language={language}
        onOpenDetail={onOpenDetail ? () => onOpenDetail(data.id) : undefined}
        onDelete={onDeletePerson ? () => onDeletePerson(data.id) : undefined}
      />
    </div>
  );
}
