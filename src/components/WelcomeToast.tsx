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
        fixed top-8 left-1/2 -translate-x-1/2 z-50
        transition-all duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95'}
      `}
    >
      <div className="bg-zinc-950/90 backdrop-blur-md shadow-2xl border border-zinc-800/60 rounded-full px-5 py-2.5 flex items-center gap-4 w-auto min-w-[420px] max-w-3xl">
        
        {/* Icon */}
        <div className="bg-zinc-900/50 p-1.5 rounded-full text-zinc-100 shrink-0">
           <MessageCircleQuestion size={18} />
        </div>

        {/* Text Content */}
        <div className="flex-1 text-sm text-zinc-400 whitespace-nowrap">
          <span className="font-medium text-zinc-100 mr-2">Welcome!</span>
          If you have questions, email{' '}
          <a
            href={`mailto:${supportEmail}`}
            className="text-zinc-200 underline decoration-zinc-600 underline-offset-2 hover:decoration-white hover:text-white transition-all"
          >
            {supportEmail || 'support'}
          </a>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-5 bg-zinc-800 shrink-0"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-800 shrink-0"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
