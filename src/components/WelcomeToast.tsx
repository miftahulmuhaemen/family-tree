import { useState, useEffect } from 'react';
import { X, Smile } from 'lucide-react';
import { TERMS, type Language } from '@/utils/i18n';

interface WelcomeToastProps {
  language?: Language;
}

export function WelcomeToast({ language = 'id' }: WelcomeToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const terms = TERMS[language];
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;

  useEffect(() => {
    // Short delay to allow initial load animation to settle
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-[70px] left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-zinc-950/90 backdrop-blur-md text-white px-3 py-2 sm:px-6 rounded-full shadow-2xl border border-zinc-800/60 flex items-center gap-3 sm:gap-4 w-[75vw] sm:w-auto sm:max-w-xl transition-all">
        <div className="hidden sm:block p-2 bg-blue-500/20 rounded-full shrink-0">
          <Smile className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
           <h3 className="hidden sm:block font-semibold text-sm sm:text-base">{terms.welcome_title}</h3>
           {supportEmail && (
             <p className="text-sm font-semibold text-white sm:text-xs sm:text-zinc-400 sm:font-normal mt-0 sm:mt-0.5">
               {terms.questions_email}{' '}
               <a 
                 href={`mailto:${supportEmail}`}
                 className="text-white underline decoration-white/30 sm:text-blue-400 sm:hover:text-blue-300 sm:decoration-transparent sm:underline-offset-2 transition-colors"
               >
                 {supportEmail}
               </a>
             </p>
           )}
        </div>
        <button 
          onClick={handleClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      </div>
    </div>
  );
}
