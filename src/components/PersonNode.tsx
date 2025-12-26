import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from 'lucide-react';

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
  label: string; // name
  name: string; // full name (needed for drawer)
  gender: 'male' | 'female';
  birthDate?: string;
  address?: Address[];
  phone_number?: PhoneNumber[];
  short_bio?: string;
  relationshipLabel?: string;
  deceased?: boolean | DeceasedInfo;
  additionals?: Record<string, string>;
};

export type PersonNode = Node<PersonData>;

export default function PersonNode({ data, selected }: NodeProps<PersonNode>) {
  const { label, gender, relationshipLabel, birthDate, deceased } = data;

  const isDeceased = typeof deceased === 'boolean' ? deceased : deceased?.status;

  const getAge = (birthDateString?: string) => {
    // ... (unchanged)
    if (!birthDateString) return null;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const age = getAge(birthDate);

  return (
    <div className="relative w-64 group">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-muted-foreground w-3 h-3 !top-0 !left-1/2 !-translate-x-1/2" 
      />
      
      <Card 
        className={cn(
          "w-full h-[120px] transition-all duration-300 ease-in-out border-2 flex flex-col justify-center items-center shadow-md hover:shadow-lg cursor-pointer",
          // Base styles & Colors
          gender === 'male' 
            ? "bg-blue-100 border-blue-300" 
            : "bg-pink-100 border-pink-300",
            
          // Selection styles: Scale and Shadow only (No ring)
          selected 
            ? "shadow-2xl scale-110 z-20" 
            : "hover:scale-105", // Only scale on hover if not selected
            
           // Deceased styling override
          isDeceased && "opacity-90 grayscale bg-gray-100 border-gray-300"
        )}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Info size={16} className="text-gray-500/70" />
        </div>

        <CardHeader className="p-0 text-center w-full">
           {relationshipLabel && (
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-0.5">
              {relationshipLabel}
            </div>
          )}
          <CardTitle 
            className={cn("text-lg font-bold truncate leading-tight text-gray-900 px-2", isDeceased && "text-gray-600")} 
            title={label}
          >
            {label} 
          </CardTitle>
          {isDeceased && <span className="text-xs text-gray-500 font-normal block -mt-0.5">(Alm.)</span>}
        </CardHeader>
        
        <CardContent className="p-0 pt-1 text-center text-sm w-full">
            <div className="text-gray-700 font-medium">
                {isDeceased ? (
                    <span className="text-gray-600 text-xs">Meninggal Dunia</span>
                ) : (
                    age !== null ? (
                        <span>{age} Tahun</span>
                    ) : (
                        <span className="italic text-xs">Umur tidak diketahui</span>
                    )
                )}
            </div>
        </CardContent>
      </Card>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-muted-foreground w-3 h-3 !bottom-0 !left-1/2 !-translate-x-1/2" 
      />
    </div>
  );
}
