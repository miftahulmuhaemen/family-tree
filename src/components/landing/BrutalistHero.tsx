import { useNavigate } from 'react-router-dom';

export interface BrutalistHeroProps {
  locale: 'en' | 'id';
}

export function BrutalistHero({ locale }: BrutalistHeroProps) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-16 pt-24 pb-16 z-10 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-none animate-pulse" />
        <span className="font-sans font-bold text-xs uppercase tracking-widest text-muted-foreground">
          {locale === 'id' ? 'SISTEM SILSILAH PRIBADI' : 'PRIVATE GENEALOGY STUDIO'} // V1.0
        </span>
      </div>

      <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-black uppercase tracking-tighter leading-[0.84] text-foreground mb-8">
        SANAK <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-foreground/40">
          KELUARGA
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-6">
        <p className="md:col-span-7 text-base md:text-xl font-sans font-medium text-muted-foreground leading-relaxed uppercase">
          {locale === 'id'
            ? 'Struktur silsilah keluarga mandiri berbasis browser. Tanpa akun, tanpa cloud, format terbuka GEDCOM 5.5.1.'
            : 'Browser-native sovereign genealogy workspace. Zero cloud lock-in, zero tracking, strict GEDCOM 5.5.1 standard.'}
        </p>

        <div className="md:col-span-5 flex flex-wrap gap-4 md:justify-end">
          <button
            onClick={() => navigate('/app')}
            className="font-sans font-bold text-sm uppercase px-8 py-4 border-2 border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-all duration-150"
          >
            {locale === 'id' ? '[ BUKA APLIKASI ]' : '[ LAUNCH STUDIO ]'}
          </button>
        </div>
      </div>
    </section>
  );
}
