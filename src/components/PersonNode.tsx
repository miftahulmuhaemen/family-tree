import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Address = {
  address: string;
  gmap_link: string;
};

export type PhoneNumber = {
  number: string;
  is_whatsapp_number: boolean;
};

export type PersonData = {
  label: string;
  gender: 'male' | 'female';
  birthDate?: string;
  photo_link?: string;
  address?: Address[];
  phone_number?: PhoneNumber;
  short_bio?: string;
  relationshipLabel?: string;
  deceased?: boolean;
};

export type PersonNode = Node<PersonData>;

export default function PersonNode({ data }: NodeProps<PersonNode>) {
  const { label, gender, relationshipLabel, photo_link, address, phone_number, short_bio, birthDate, deceased } = data;

  const getAge = (birthDateString?: string) => {
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
    <div className="relative w-64">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-muted-foreground w-3 h-3 !top-0 !left-1/2 !-translate-x-1/2" 
      />
      
      <Card 
        className={cn(
          "w-full shadow-md border-2 h-[280px]",
          gender === 'male' ? "border-blue-200 bg-blue-50/50" : "border-pink-200 bg-pink-50/50",
          relationshipLabel ? "ring-2 ring-primary ring-offset-2" : "",
          deceased && "grayscale opacity-90 border-gray-300 bg-gray-50"
        )}
      >
        <CardHeader className="p-3 pb-0">
           {relationshipLabel && (
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
              {relationshipLabel}
            </div>
          )}
          <CardTitle className="text-sm font-semibold text-center truncate" title={label}>
            {label} 
            {deceased && <span className="ml-1 text-xs text-muted-foreground font-normal">(Alm.)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-2 text-center text-xs space-y-2">
            {photo_link ? (
                 <img src={photo_link} alt={label} className={cn(
                     "w-16 h-16 rounded-full mx-auto object-cover border border-muted",
                     deceased && "grayscale"
                 )} />
            ) : (
                <div className="w-16 h-16 rounded-full mx-auto bg-muted flex items-center justify-center text-muted-foreground">
                    No Photo
                </div>
            )}
            
            <div className="text-muted-foreground capitalize font-medium">
                {deceased ? 'Meninggal Dunia' : (age !== null ? `Kelahiran ${new Date(birthDate!).getFullYear()}, Umur ${age} Tahun` : 'Umur tidak diketahui')}
            </div>

            {short_bio ? (
              <div className="text-muted-foreground line-clamp-2 italic min-h-[2.5rem]" title={short_bio}>
                "{short_bio}"
              </div>
            ) : (
              <div className="text-muted-foreground italic min-h-[2.5rem]">Tidak ada</div>
            )}

            <div className="flex items-center justify-center gap-1">
              {phone_number && phone_number.number ? (
                phone_number.is_whatsapp_number ? (
                  <a 
                    href={`https://wa.me/${phone_number.number.replace(/^0/, '62').replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-600 hover:underline font-semibold"
                    title="Chat via WhatsApp"
                  >
                    📞 <span className="underline decoration-dotted">{phone_number.number}</span> (WA)
                  </a>
                ) : (
                  <span>📞 {phone_number.number}</span>
                )
              ) : (
                <span className="text-muted-foreground">📞 Tidak ada</span>
              )}
            </div>

            <div className="space-y-1">
              {address && address.length > 0 ? (
                address.map((addr, idx) => (
                  <div key={idx} className="truncate">
                    <a href={addr.gmap_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center justify-center gap-1">
                      📍 <span className="truncate max-w-[150px]">{addr.address}</span>
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground flex items-center justify-center gap-1">
                  📍 Tidak ada
                </div>
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
