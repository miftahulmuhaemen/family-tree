import { X } from "lucide-react";
import type { PersonData } from "./PersonNode";
import { cn } from "@/lib/utils";
import { TERMS } from '@/utils/i18n';
import type { Language } from '@/utils/i18n';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  person: PersonData | null;
  language?: Language;
}

export default function DetailDrawer({ isOpen, onClose, person, language = 'id' }: DetailDrawerProps) {
  if (!person) return null;

  const terms = TERMS[language];
  const { name, gender, birthDate, address, phone_number, short_bio, deceased, additionals } = person;

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

  // Helper to determine deceased status
  const isDeceased = typeof deceased === 'boolean' ? deceased : deceased?.status;
  const deceasedDate = typeof deceased === 'object' ? deceased.date : null;
  const deceasedPlace = typeof deceased === 'object' ? deceased.place : null;

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-[60] w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-full flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{terms.family_detail}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4 mb-6">

           <div className="text-center">
             <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
             <div className="flex flex-col items-center gap-2 mt-1">
                <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      isDeceased ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-600"
                    )}>
                      {isDeceased ? terms.deceased : terms.alive}
                    </span>
                    {!isDeceased && age !== null && (
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                        {age} {terms.years}
                      </span>
                    )}
                </div>
                
                {isDeceased && (deceasedDate || deceasedPlace) && (
                    <div className="text-sm text-gray-500 italic mt-1">
                        {deceasedDate && <span>{deceasedDate}</span>}
                        {deceasedDate && deceasedPlace && <span> • </span>}
                        {deceasedPlace && <span>{deceasedPlace}</span>}
                    </div>
                )}
             </div>
           </div>
        </div>

        <div className="space-y-6 flex-1">
           {/* Bio */}
           <div className="bg-gray-50 p-4 rounded-lg">
             <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{terms.short_bio}</h4>
             <p className="text-gray-700 italic">
               {short_bio ? `"${short_bio}"` : terms.no_bio}
             </p>
           </div>

           {/* Contact */}
           <div className="space-y-3">
             <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-1">{terms.contact}</h4>
             
             {phone_number && phone_number.length > 0 ? (
               <div className="space-y-3">
                   {phone_number.map((phone, idx) => (
                       <div key={idx} className="flex items-center gap-3">
                         <span className="text-3xl">📞</span> 
                         <div>
                           {phone.is_whatsapp_number ? (
                              <a 
                                href={`https://wa.me/${phone.number.replace(/^0/, '62').replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-green-600 hover:underline font-medium text-lg"
                              >
                                {phone.number} (WhatsApp)
                              </a>
                           ) : (
                              <span className="text-gray-900 font-medium text-lg">{phone.number}</span>
                           )}
                         </div>
                       </div>
                   ))}
               </div>
             ) : (
               <p className="text-gray-500 italic">{terms.no_phone}</p>
             )}
           </div>

           {/* Address */}
           <div className="space-y-3">
             <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-1">{terms.location}</h4>
             
             {address && address.length > 0 ? (
               address.map((addr, idx) => (
                 <div key={idx} className="flex items-start gap-3 mb-2">
                    <span className="text-2xl mt-1">📍</span>
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium leading-tight">
                         {addr.address}
                      </span>
                      <a 
                        href={addr.gmap_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm hover:underline mt-1"
                      >
                         {terms.view_maps}
                      </a>
                    </div>
                 </div>
               ))
             ) : (
               <p className="text-gray-500 italic">{terms.no_address}</p>
             )}
           </div>
           
           {/* Additional Info */}
           <div className="space-y-2 text-sm text-gray-500 pt-4 border-t">
              <div className="flex justify-between">
                <span>{terms.birth_date}:</span>
                <span className="font-medium text-gray-900">
                  {birthDate ? new Date(birthDate).toLocaleDateString(language === 'id' ? "id-ID" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                 <span>{terms.gender}:</span>
                 <span className="font-medium text-gray-900 capitalize">{gender === 'male' ? terms.male : terms.female}</span>
              </div>

               {/* Dynamic Additionals */}
              {additionals && Object.entries(additionals).map(([key, value]) => (
                  <div key={key} className="flex flex-col pt-2 border-t border-gray-100 mt-2">
                      <span className="text-gray-500 capitalize mb-1">{key}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                  </div>
              ))}
           </div>

        </div>
      </div>
    </div>
  );
}
