export type DocMajorSectionId =
  | 'home'
  | 'about'
  | 'features'
  | 'getting-started'
  | 'security-privacy';

export type DocSectionId =
  | DocMajorSectionId
  | 'home-navigation'
  | 'about-principles'
  | 'features-jump'
  | 'features-cards'
  | 'canvas-controls'
  | 'node-relationships'
  | 'sidebar-tools'
  | 'byo-storage'
  | 'zero-analytics'
  | 'portability';

export interface DocSubItem {
  id: DocSectionId;
  title: string;
}

export interface DocMainItem {
  id: DocMajorSectionId;
  title: string;
  subItems: DocSubItem[];
}

export interface DocNavCategory {
  title: string;
  items: DocMainItem[];
}

export const DOC_CATEGORIES: DocNavCategory[] = [
  {
    title: 'Overview',
    items: [
      {
        id: 'home',
        title: 'Documentation Home',
        subItems: [
          { id: 'home', title: 'Overview' },
          { id: 'home-navigation', title: 'Topics & Navigation' },
        ],
      },
      {
        id: 'about',
        title: 'About Sanak Studio',
        subItems: [
          { id: 'about', title: 'Philosophy' },
          { id: 'about-principles', title: 'Core Principles' },
        ],
      },
    ],
  },
  {
    title: 'Capabilities',
    items: [
      {
        id: 'features',
        title: 'Features Overview',
        subItems: [
          { id: 'features', title: 'Overview' },
          { id: 'features-jump', title: 'Quick Jump Index' },
          { id: 'features-cards', title: 'Feature Breakdown' },
        ],
      },
    ],
  },
  {
    title: 'Guides & Security',
    items: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        subItems: [
          { id: 'getting-started', title: 'Guide Overview' },
          { id: 'canvas-controls', title: 'Canvas & Controls' },
          { id: 'node-relationships', title: 'Node Relationships' },
          { id: 'sidebar-tools', title: 'Sidebar & Editors' },
        ],
      },
      {
        id: 'security-privacy',
        title: 'Security & Privacy',
        subItems: [
          { id: 'security-privacy', title: 'Security Architecture' },
          { id: 'byo-storage', title: 'Bring Your Own Storage' },
          { id: 'zero-analytics', title: 'Zero Tracking Guarantees' },
          { id: 'portability', title: 'Data Portability & Formats' },
        ],
      },
    ],
  },
];

export const ALL_DOC_SECTION_IDS: DocSectionId[] = [
  'home',
  'home-navigation',
  'about',
  'about-principles',
  'features',
  'features-jump',
  'features-cards',
  'getting-started',
  'canvas-controls',
  'node-relationships',
  'sidebar-tools',
  'security-privacy',
  'byo-storage',
  'zero-analytics',
  'portability',
];

export function getMajorSectionForSub(id: DocSectionId): DocMajorSectionId {
  for (const cat of DOC_CATEGORIES) {
    for (const item of cat.items) {
      if (item.id === id || item.subItems.some((s) => s.id === id)) {
        return item.id;
      }
    }
  }
  return 'home';
}

export function getSubItemsForMajor(majorId: DocMajorSectionId): DocSubItem[] {
  for (const cat of DOC_CATEGORIES) {
    for (const item of cat.items) {
      if (item.id === majorId) {
        return item.subItems;
      }
    }
  }
  return [];
}
