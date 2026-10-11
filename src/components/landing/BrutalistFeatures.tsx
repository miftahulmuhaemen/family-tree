export interface BrutalistFeaturesProps {
  locale: 'en' | 'id';
}

export function BrutalistFeatures({ locale }: BrutalistFeaturesProps) {
  const features = locale === 'id' ? [
    {
      code: '01',
      title: 'PRIVASI 100% KLIEN',
      tag: 'CORE',
      accent: 'blue',
      desc: 'Penyimpanan lokal di browser tanpa server database. Data keluarga Anda tidak pernah diunggah ke pihak ketiga.',
    },
    {
      code: '02',
      title: 'STANDAR GEDCOM 5.5.1',
      tag: 'STANDARD',
      accent: 'pink',
      desc: 'Kompatibilitas penuh dengan software silsilah dunia. Impor dan ekspor file .GED tanpa hambatan format proprietary.',
    },
    {
      code: '03',
      title: 'PERHITUNGAN KERABAT',
      tag: 'ENGINE',
      accent: 'blue',
      desc: 'Kalkulator sebutan kekerabatan presisi tinggi untuk membedakan garis keturunan dan generasi secara akurat.',
    },
    {
      code: '04',
      title: 'PORTABILITAS MANDIRI',
      tag: 'SECURITY',
      accent: 'pink',
      desc: 'Bawa salinan data kapan saja. Berbagi dokumen silsilah terenkripsi tanpa ketergantungan akun cloud.',
    },
  ] : [
    {
      code: '01',
      title: '100% CLIENT PRIVACY',
      tag: 'CORE',
      accent: 'blue',
      desc: 'Direct in-browser IndexedDB storage with zero telemetry. Your family records never touch external servers.',
    },
    {
      code: '02',
      title: 'GEDCOM 5.5.1 STANDARD',
      tag: 'STANDARD',
      accent: 'pink',
      desc: 'Flawless interoperability with global genealogy software. Import and export .GED files without proprietary lock-in.',
    },
    {
      code: '03',
      title: 'KINSHIP CALCULATOR',
      tag: 'ENGINE',
      accent: 'blue',
      desc: 'High-precision lineage solver determining generational titles and relationships with mathematical accuracy.',
    },
    {
      code: '04',
      title: 'SELF-SOVEREIGN PORTABILITY',
      tag: 'SECURITY',
      accent: 'pink',
      desc: 'Export encrypted snapshots on demand. Share raw lineages without recurring platform subscriptions.',
    },
  ];

  return (
    <section className="relative px-6 md:px-16 py-20 z-10 max-w-7xl mx-auto w-full">
      <div className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-4">
        [ SYSTEM SPECIFICATIONS // ARCHITECTURE ]
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-l-2 border-foreground">
        {features.map((item) => (
          <div
            key={item.code}
            className="border-r-2 border-b-2 border-foreground p-8 flex flex-col justify-between min-h-[220px] bg-background/50 hover:bg-background/80 transition-colors"
          >
            <div className="flex justify-between items-start mb-6 font-sans text-xs">
              <span className="font-bold">[{item.code}]</span>
              <span
                className={`px-2 py-0.5 border text-[10px] font-bold ${
                  item.accent === 'blue'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-pink-500 text-pink-500'
                }`}
              >
                {item.tag}
              </span>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-muted-foreground uppercase leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
