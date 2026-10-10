import sanakLog from '@/assets/sanak_log.webp';
import sanakLogInverted from '@/assets/sanak_log_inverted.webp';

export interface BrutalistFooterProps {
  locale?: 'en' | 'id';
}

export function BrutalistFooter({ locale: _locale }: BrutalistFooterProps) {
  return (
    <footer className="w-full relative z-20">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-16 pt-12 md:pt-16 pb-8 flex flex-col items-start">
        {/* Brand Logo */}
        <div className="w-full flex items-start">
          <img
            src={sanakLogInverted}
            alt="Sanak Keluarga"
            className="w-full h-auto select-none pointer-events-none block dark:hidden"
            draggable={false}
          />
          <img
            src={sanakLog}
            alt="Sanak Keluarga"
            className="w-full h-auto select-none pointer-events-none hidden dark:block"
            draggable={false}
          />
        </div>
      </div>
    </footer>
  );
}
