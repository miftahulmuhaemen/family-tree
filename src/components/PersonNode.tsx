import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NodeActionMenu } from './tree/NodeActionMenu';

export type Address = {
  address: string;
  gmap_link: string;
};

export type PhoneNumber = {
  number: string;
  is_whatsapp_number: boolean;
};

export type DeceasedInfo = {
  status: boolean;
  date?: string;
  place?: string;
};

export type PersonData = {
  id: string;
  label: string; // name
  name: string; // full name
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
  onAddRelative?: (targetPerson: any, type: 'spouse' | 'child' | 'parent' | 'foster_child') => void;
  onEditPerson?: (person: any) => void;
  onDeletePerson?: (personId: string) => void;
  onOpenDetail?: (personId: string) => void;
};

export type PersonNode = Node<PersonData>;

export default function PersonNode({ data, selected }: NodeProps<PersonNode>) {
  const { 
    label, 
    gender, 
    relationshipLabel, 
    birthDate, 
    deceased, 
    hasFather = false, 
    hasMother = false,
    onAddRelative,
    onDeletePerson,
    onOpenDetail
  } = data;

  const isDeceased = typeof deceased === 'boolean' ? deceased : deceased?.status;

  const getAge = (birthDateString?: string) => {
    if (!birthDateString) return null;
    const today = new Date();
    const bDate = new Date(birthDateString);
    let age = today.getFullYear() - bDate.getFullYear();
    const m = today.getMonth() - bDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
        age--;
    }
    return age;
  };

  const age = getAge(birthDate);

  const parentBtnLabel = hasFather && !hasMother ? '+ Ibu' : hasMother && !hasFather ? '+ Ayah' : '+ Ortu';

  return (
    <div className="relative w-64 group">
      {/* Top Handle (Parent connection) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-zinc-400 w-3 h-3 !top-0 !left-1/2 !-translate-x-1/2 hover:scale-150 transition-transform" 
      />

      {/* Left & Right Handles (Spouse connections) */}
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        className="!bg-zinc-400 w-2.5 h-2.5 !left-0 !top-1/2 !-translate-y-1/2 hover:scale-150 transition-transform"
      />
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        className="!bg-zinc-400 w-2.5 h-2.5 !right-0 !top-1/2 !-translate-y-1/2 hover:scale-150 transition-transform"
      />

      {/* Floating Action Button: Top (+ Ortu) */}
      {onAddRelative && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:scale-105">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddRelative(data, 'parent');
            }}
            className="bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 transition-colors"
            title={hasFather && !hasMother ? "Tambah Ibu" : hasMother && !hasFather ? "Tambah Ayah" : "Tambah Orang Tua"}
          >
            <span>{parentBtnLabel}</span>
          </button>
        </div>
      )}

      {/* Floating Action Button: Right (+ Pasangan) */}
      {onAddRelative && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:scale-105">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddRelative(data, 'spouse');
            }}
            className="bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap border border-zinc-200 dark:border-zinc-700 transition-colors"
            title="Tambah Pasangan atau Mantan"
          >
            <span>+ Pasangan</span>
          </button>
        </div>
      )}

      {/* Floating Action Button: Bottom (+ Anak Angkat) */}
      {onAddRelative && (
        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-30 transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:scale-105">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddRelative(data, 'foster_child');
            }}
            className="bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 transition-colors whitespace-nowrap"
            title="Tambah Anak Angkat / Asuh"
          >
            <span>+ Anak Angkat</span>
          </button>
        </div>
      )}

      {/* Main Card */}
      <Card 
        className={cn(
          "w-full h-[120px] transition-all duration-200 ease-in-out border-2 flex flex-col justify-center items-center shadow-sm hover:shadow-md cursor-pointer relative bg-white dark:bg-zinc-900",
          gender === 'male' 
            ? "border-blue-500" 
            : "border-pink-400",
            
          selected 
            ? "ring-4 ring-blue-600 shadow-xl scale-105 z-20" 
            : "hover:scale-102",
            
          isDeceased && "opacity-80 grayscale bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600"
        )}
      >
        <CardHeader className="p-0 text-center w-full px-2">
           {relationshipLabel && (
            <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-0.5">
              {relationshipLabel}
            </div>
          )}
          <CardTitle 
            className="text-base font-bold truncate leading-tight text-zinc-900 dark:text-zinc-100 px-2" 
            title={label}
          >
            {label} 
          </CardTitle>
          {isDeceased && <span className="text-xs text-zinc-500 font-normal block -mt-0.5">(Alm.)</span>}
        </CardHeader>
        
        <CardContent className="p-0 pt-1 text-center text-xs w-full">
            <div className="text-zinc-600 dark:text-zinc-400 font-medium">
                {isDeceased ? (
                    <span className="text-zinc-500 text-xs">Meninggal Dunia</span>
                ) : (
                    age !== null ? (
                        <span className="text-xs font-semibold">{age} Tahun</span>
                    ) : (
                        <span className="italic text-xs text-zinc-400">Umur tidak diketahui</span>
                    )
                )}
            </div>
        </CardContent>
      </Card>

      {/* Action menu popover (Detail & Delete) */}
      <NodeActionMenu
        personName={data.name || label}
        onOpenDetail={onOpenDetail ? () => onOpenDetail(data.id) : undefined}
        onDelete={onDeletePerson ? () => onDeletePerson(data.id) : undefined}
      />

      {/* Bottom Handle (Child connection) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-zinc-400 w-3 h-3 !bottom-0 !left-1/2 !-translate-x-1/2 hover:scale-150 transition-transform" 
      />
    </div>
  );
}
