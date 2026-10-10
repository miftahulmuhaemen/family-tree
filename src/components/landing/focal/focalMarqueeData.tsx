import type { ReactNode } from 'react';

export interface FocalItem {
  id: string;
  name: string;
  badge?: string;
  icon: ReactNode;
}

export const TECH_STACK_ITEMS: FocalItem[] = [
  {
    id: 'react',
    name: 'React 19',
    badge: 'UI Engine',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </svg>
    ),
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    badge: 'Strict Types',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <rect width="24" height="24" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
        <path d="M7 8h6M10 8v10M14 16c.8.8 1.8 1.2 3 1.2 1.5 0 2.5-.7 2.5-1.8 0-1.1-.9-1.5-2.2-2l-.8-.3c-1.8-.7-2.7-1.5-2.7-2.9 0-1.7 1.4-2.8 3.5-2.8 1.1 0 2.1.3 2.8.9v2.2c-.7-.6-1.6-.9-2.5-.9-1.2 0-2 .6-2 1.5 0 1 .8 1.4 2.1 1.9l.8.3c1.9.7 2.9 1.6 2.9 3.1 0 1.9-1.5 3-3.8 3-1.4 0-2.6-.4-3.5-1.2V16z" />
      </svg>
    ),
  },
  {
    id: 'gsap',
    name: 'GSAP Motion',
    badge: 'Animation',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: 'd3',
    name: 'D3 Force & Shape',
    badge: 'Data Layout',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <line x1="12" y1="8" x2="5" y2="16" />
        <line x1="12" y1="8" x2="19" y2="16" />
      </svg>
    ),
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    badge: 'Design System',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    ),
  },
  {
    id: 'monaco',
    name: 'Monaco Editor',
    badge: 'Live Inspection',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    id: 'elkjs',
    name: 'ElkJS Graph',
    badge: 'Hierarchy',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="5" rx="1" />
        <rect x="15" y="3" width="6" height="5" rx="1" />
        <rect x="9" y="16" width="6" height="5" rx="1" />
        <path d="M6 8v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8M12 13v3" />
      </svg>
    ),
  },
  {
    id: 'gdrive',
    name: 'Google Drive API',
    badge: 'Zero-Backend',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 19 7 19 12 10" />
        <polygon points="12 2 22 19 17 19 12 10" />
        <polygon points="2 19 7 19 22 19 17 19" />
      </svg>
    ),
  },
  {
    id: 'bun',
    name: 'Bun Runtime',
    badge: 'Tooling',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.5 0-8 3-8 7.5 0 2.8 1.5 5.5 3.5 6.7 1.2.7 1.8 1.8 1.8 3v.8h5.4v-.8c0-1.2.6-2.3 1.8-3 2-1.2 3.5-3.9 3.5-6.7C20 6 16.5 3 12 3zm-2.5 7a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm5 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z" />
      </svg>
    ),
  },
  {
    id: 'vite',
    name: 'Vite Bundler',
    badge: 'Lightning Build',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 2L3 14h7l-1.5 8L21 9h-7.5l2-7z" />
      </svg>
    ),
  },
  {
    id: 'tanstack',
    name: 'TanStack Query',
    badge: 'State Cache',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
  },
];

export const getFeaturesItems = (locale: 'en' | 'id'): FocalItem[] => {
  const isId = locale === 'id';
  return [
    {
      id: 'gedcom',
      name: isId ? 'KOMPATIBEL GEDCOM 5.5.1' : 'GEDCOM 5.5.1 COMPLIANT',
      badge: isId ? 'Standar Silsilah' : 'Lineage Standard',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: 'storage',
      name: isId ? '100% PENYIMPANAN KLIEN' : '100% CLIENT STORAGE',
      badge: isId ? 'Privat Total' : 'Total Privacy',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="12" x2="2" y2="12" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          <line x1="6" y1="16" x2="6.01" y2="16" />
          <line x1="10" y1="16" x2="10.01" y2="16" />
        </svg>
      ),
    },
    {
      id: 'telemetry',
      name: isId ? 'NOL TELEMETRI SERVER' : 'ZERO SERVER TELEMETRY',
      badge: isId ? 'Tanpa Pelacakan' : 'Zero Tracking',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'offline',
      name: isId ? 'ARSITEKTUR OFFLINE-FIRST' : 'OFFLINE-FIRST ARCHITECTURE',
      badge: isId ? 'Lokal Penuh' : 'Fully Local',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      ),
    },
    {
      id: 'cloudsync',
      name: isId ? 'SINKRONISASI GOOGLE DRIVE' : 'GOOGLE DRIVE CLOUD SYNC',
      badge: isId ? 'Penyimpanan Milikmu' : 'Your Storage',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      id: 'layout',
      name: isId ? 'TATA LETAK POHON INTERAKTIF' : 'HIERARCHICAL TREE LAYOUT',
      badge: isId ? 'Navigasi Multi-Generasi' : 'Multi-Gen Nav',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
          <path d="M12 12v3" />
        </svg>
      ),
    },
    {
      id: 'inspector',
      name: isId ? 'INSPEKSI KODE MONACO' : 'REAL-TIME MONACO INSPECTOR',
      badge: isId ? 'Editor Kode Terintegrasi' : 'Embedded Editor',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      id: 'sovereignty',
      name: isId ? 'DATA KELUARGA BERDAULAT' : 'SOVEREIGN FAMILY DATA',
      badge: isId ? 'Kedaulatan Mandiri' : 'Full Ownership',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      id: 'export',
      name: isId ? 'EKSPOR GENEALOGI UNIVERSAL' : 'UNIVERSAL GENEALOGY EXPORT',
      badge: isId ? 'Interoperabilitas Terbuka' : 'Open Export',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
    },
    {
      id: 'kinship',
      name: isId ? 'LOGIKA KEKERABATAN REGIONAL' : 'REGIONAL KINSHIP ENGINE',
      badge: isId ? 'Penyebutan Nusantara' : 'Cultural Kinship',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];
};
