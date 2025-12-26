import { useState, useEffect } from 'react';
import { Settings2, X } from 'lucide-react';
import { TERMS, type Language } from '@/utils/i18n';

interface ControlPanelProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  accent: string;
  setAccent: (accent: string) => void;
}

const ACCENTS = {
  id: ['Indonesian'],
  en: ['English America'],
} as const;

export function ControlPanel({ 
  language, 
  setLanguage, 
  accent, 
  setAccent 
}: ControlPanelProps) {
  const [isVisible, setIsVisible] = useState(true);
  const terms = TERMS[language];

  // Auto-set default accent when language changes
  useEffect(() => {
    // Only reset if current accent is invalid for the new language
    const validAccents = ACCENTS[language] as readonly string[];
    if (!validAccents.includes(accent)) {
      setAccent(validAccents[0]);
    }
  }, [language, accent, setAccent]);

  return (
    <div className={`fixed bottom-20 sm:bottom-[70px] left-1/2 -translate-x-1/2 z-50 flex items-center animate-in slide-in-from-bottom-4 fade-in duration-500 sm:scale-100 origin-bottom sm:origin-center ${isVisible ? 'gap-3' : 'gap-0'}`}>
      
      {/* Main Panel (Collapsible) */}
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out origin-right flex items-center
          ${isVisible ? 'w-auto opacity-100 scale-100' : 'w-0 opacity-0 scale-95'}
        `}
      >
        <div className="bg-zinc-950/90 backdrop-blur-md shadow-2xl border border-zinc-800/60 rounded-full px-3 py-2.5 sm:px-5 flex items-center gap-2 sm:gap-4 whitespace-nowrap">
          {/* Label Icon */}
          <div className="hidden sm:flex text-zinc-500 items-center gap-2">
            <Settings2 size={16} />
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block w-px h-4 bg-zinc-800 shrink-0"></div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
              <span className="hidden sm:block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  {terms.lang_label}
              </span>
              <div className="flex bg-zinc-900 rounded-full p-0.5 border border-zinc-800">
                  <button
                    onClick={() => setLanguage('id')}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                        language === 'id'
                        ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                  ID
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                        language === 'en'
                        ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                  EN
                  </button>
              </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-4 bg-zinc-800 shrink-0"></div>

          {/* Accent Select */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  {terms.accent_label}
              </span>
              <select
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-xs font-medium text-zinc-300 focus:ring-1 focus:ring-zinc-700 outline-none cursor-pointer hover:bg-zinc-800 transition-colors appearance-none"
                  style={{ textAlignLast: 'center' }}
              >
                  {(ACCENTS[language] as readonly string[]).map((acc) => (
                  <option key={acc} value={acc}>
                      {acc}
                  </option>
                  ))}
              </select>
          </div>

          {/* Mobile Close Button */}
          <div className="sm:hidden w-px h-4 bg-zinc-800 shrink-0" />
          <button 
             onClick={() => setIsVisible(false)}
             className="sm:hidden text-zinc-400 hover:text-white p-1"
          >
             <X size={16} />
          </button>
        </div>
      </div>

      {/* Detached Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`bg-zinc-950/90 backdrop-blur-md shadow-xl border border-zinc-800/60 rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 flex-shrink-0 items-center gap-2 ${isVisible ? 'hidden sm:flex p-2.5' : 'flex px-8 py-3'}`}
        aria-label={isVisible ? "Hide Control Panel" : "Show Control Panel"}
      >
        {isVisible ? (
             <X size={20} />
        ) : (
            <>
                <Settings2 size={18} />
                <span className="text-sm font-semibold text-zinc-200">{terms.control_panel}</span>
            </>
        )}
      </button>

    </div>
  );
}
