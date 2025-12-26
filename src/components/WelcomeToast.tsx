import { useState, useEffect } from 'react';
import { X, MessageCircleQuestion } from 'lucide-react';

export function WelcomeToast() {
  const [isMounted, setIsMounted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;

  useEffect(() => {
    // Trigger "in" animation shortly after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Trigger "out" animation
    // Unmount after animation completes (match duration)
    setTimeout(() => setIsMounted(false), 500);
  };

  if (!isMounted) return null;

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto
        transition-all duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95'}
      `}
    >
      <div className="bg-zinc-950/90 backdrop-blur-md shadow-2xl border border-zinc-800/60 rounded-2xl md:rounded-full px-4 py-3 md:px-5 md:py-2.5 flex items-start md:items-center gap-3 md:gap-4 md:min-w-[420px] max-w-3xl">
        
        {/* Icon */}
        <div className="bg-zinc-900/50 p-1.5 rounded-full text-zinc-100 shrink-0 mt-0.5 md:mt-0">
           <MessageCircleQuestion size={18} />
        </div>

        {/* Text Content */}
        <div className="flex-1 text-sm text-zinc-400 md:whitespace-nowrap leading-tight">
          <span className="font-medium text-zinc-100 mr-1 block md:inline mb-1 md:mb-0">Welcome!</span>
          If you have questions, email{' '}
          <a
            href={`mailto:${supportEmail}`}
            className="text-zinc-200 underline decoration-zinc-600 underline-offset-2 hover:decoration-white hover:text-white transition-all break-all md:break-normal"
          >
            {supportEmail || 'support'}
          </a>
        </div>

        {/* Vertical Divider (Hidden on mobile) */}
        <div className="hidden md:block w-px h-5 bg-zinc-800 shrink-0"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-800 shrink-0 -mr-1 md:mr-0"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
