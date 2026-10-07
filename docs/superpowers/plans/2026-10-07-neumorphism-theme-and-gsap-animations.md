# Neumorphism Theme & GSAP Interactive Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dual-theme architecture supporting a production-grade Neumorphism UI alongside the Default theme, with an orthogonal Light/Dark matrix, a Control Panel theme switcher, universal component styling adhering to `.agents/rules/ui_theme_guidelines.md`, and choreographed GSAP physics micro-interactions across the entire application.

**Architecture:** A global `useTheme` hook persists the active theme (`'default'` | `'neumorphism'`) in `localStorage` and toggles a `data-theme="neumorphism"` attribute on `document.documentElement`. Surfaces, dual-source shadows, and gender/status palettes are tokenized in `src/index.css`. All interactive components (nodes, sidebar, control panel, modals) adapt their visual treatment and employ `@gsap/react` (`useGSAP`) for scoped, hardware-accelerated spring animations.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide Icons, GSAP 3, `@gsap/react`, Bun.

## Global Constraints
- Strictly adhere to `.agents/rules/ui_theme_guidelines.md`: all components must support both `default` and `neumorphism` across both light and dark modes.
- Strictly adhere to `antislop-ui`: zero perpetual looping or pulsing animations (R-19), high-contrast typography satisfying WCAG AAA (R-25), and zero generic rainbow gradients (R-01).
- Package management must exclusively use `bun` (`bun add`).
- Static build compilation must pass cleanly via `bun run build` at every task gate.

---

### Task 1: Install GSAP & Define Neumorphic CSS Tokens

**Files:**
- Modify: `package.json`
- Modify: `src/index.css:1-97`

**Interfaces:**
- Consumes: Tailwind CSS base configuration
- Produces: CSS variables and utility classes:
  - `--neu-base`, `--neu-surface`, `--neu-border`
  - `--neu-shadow-dark`, `--neu-shadow-light`
  - `--neu-raised`, `--neu-raised-sm`, `--neu-pressed`, `--neu-pressed-sm`
  - `--neu-male`, `--neu-male-bg`, `--neu-female`, `--neu-female-bg`, `--neu-deceased`, `--neu-deceased-bg`
  - Utility classes: `.shadow-neu-raised`, `.shadow-neu-raised-sm`, `.shadow-neu-pressed`, `.shadow-neu-pressed-sm`, `.shadow-neu-convex`

- [ ] **Step 1: Install gsap and @gsap/react**

Run: `bun add gsap @gsap/react`
Verify `package.json` includes `"gsap"` and `"@gsap/react"`.

- [ ] **Step 2: Add Neumorphic Tokens and Utility Classes to src/index.css**

Add the 4-state matrix CSS variables and utility classes in `src/index.css`:
```css
/* Neumorphism Theme Variables */
[data-theme="neumorphism"] {
  --neu-base: #e6e9ef;
  --neu-surface: #e6e9ef;
  --neu-border: rgba(255, 255, 255, 0.7);
  --neu-shadow-dark: rgba(163, 177, 198, 0.6);
  --neu-shadow-light: rgba(255, 255, 255, 0.85);

  --neu-raised: 6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light);
  --neu-raised-sm: 3px 3px 8px var(--neu-shadow-dark), -3px -3px 8px var(--neu-shadow-light);
  --neu-pressed: inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light);
  --neu-pressed-sm: inset 1.5px 1.5px 3px var(--neu-shadow-dark), inset -1.5px -1.5px 3px var(--neu-shadow-light);

  --neu-accent: #4338ca;
  --neu-male: #2563eb;
  --neu-male-bg: #dbeafe;
  --neu-female: #e11d48;
  --neu-female-bg: #ffe4e6;
  --neu-deceased: #64748b;
  --neu-deceased-bg: #e2e8f0;
}

[data-theme="neumorphism"].dark {
  --neu-base: #181b20;
  --neu-surface: #1c2027;
  --neu-border: rgba(255, 255, 255, 0.06);
  --neu-shadow-dark: rgba(0, 0, 0, 0.75);
  --neu-shadow-light: rgba(255, 255, 255, 0.04);

  --neu-raised: 6px 6px 16px var(--neu-shadow-dark), -4px -4px 12px var(--neu-shadow-light);
  --neu-raised-sm: 3px 3px 8px var(--neu-shadow-dark), -2px -2px 6px var(--neu-shadow-light);
  --neu-pressed: inset 3px 3px 6px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
  --neu-pressed-sm: inset 1.5px 1.5px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light);

  --neu-accent: #818cf8;
  --neu-male: #38bdf8;
  --neu-male-bg: rgba(56, 189, 248, 0.12);
  --neu-female: #fb7185;
  --neu-female-bg: rgba(251, 113, 133, 0.12);
  --neu-deceased: #94a3b8;
  --neu-deceased-bg: rgba(148, 163, 184, 0.12);
}

@layer utilities {
  .shadow-neu-raised {
    box-shadow: var(--neu-raised);
  }
  .shadow-neu-raised-sm {
    box-shadow: var(--neu-raised-sm);
  }
  .shadow-neu-pressed {
    box-shadow: var(--neu-pressed);
  }
  .shadow-neu-pressed-sm {
    box-shadow: var(--neu-pressed-sm);
  }
}
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: Exits with code 0.

- [ ] **Step 4: Commit**

Run:
```bash
git add package.json bun.lock src/index.css
git commit -m "feat(theme): install gsap and define neumorphic design tokens"
```

---

### Task 2: Implement Theme Management Hook (`useTheme`)

**Files:**
- Create: `src/hooks/useTheme.ts`
- Create: `src/hooks/useTheme.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type Theme = 'default' | 'neumorphism';
  export interface UseThemeReturn {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
  }
  export function useTheme(): UseThemeReturn;
  ```

- [ ] **Step 1: Write test for useTheme hook**

Create `src/hooks/useTheme.test.ts`:
```typescript
import { describe, expect, test, beforeEach } from 'bun:test';
import { useTheme, type Theme } from './useTheme';

describe('useTheme hook behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  test('defaults to default theme when localStorage is empty', () => {
    // Basic verification of theme constants and key
    expect(localStorage.getItem('familytree_theme')).toBeNull();
  });
});
```

- [ ] **Step 2: Implement useTheme**

Create `src/hooks/useTheme.ts`:
```typescript
import { useState, useEffect, useCallback } from 'react';

export type Theme = 'default' | 'neumorphism';

const THEME_STORAGE_KEY = 'familytree_theme';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'default';
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return saved === 'neumorphism' ? 'neumorphism' : 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'neumorphism') {
      root.setAttribute('data-theme', 'neumorphism');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'default' ? 'neumorphism' : 'default'));
  }, []);

  return { theme, setTheme, toggleTheme };
}
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: Exits with code 0.

- [ ] **Step 4: Commit**

Run:
```bash
git add src/hooks/useTheme.ts src/hooks/useTheme.test.ts
git commit -m "feat(theme): implement useTheme hook with localstorage persistence"
```

---

### Task 3: Update Control Panel with Theme Switcher & GSAP Physics

**Files:**
- Modify: `src/utils/i18n.ts:70-75, 190-195`
- Modify: `src/components/ControlPanel.tsx:1-120`

**Interfaces:**
- Consumes: `useTheme` types (`Theme`)
- Produces: `ControlPanelProps` with `theme: Theme`, `setTheme: (t: Theme) => void`
- Adds GSAP sliding thumb animation for segmented switch buttons.

- [ ] **Step 1: Add i18n keys for theme switch**

In `src/utils/i18n.ts`, add:
```typescript
// EN
theme_label: "THEME",
theme_default: "Default",
theme_neu: "Soft Clay",

// ID
theme_label: "TEMA",
theme_default: "Standar",
theme_neu: "Neumorfisme",
```

- [ ] **Step 2: Update ControlPanel to support Theme switcher and GSAP micro-interactions**

Update `src/components/ControlPanel.tsx` with:
- `theme: Theme` and `setTheme: (theme: Theme) => void` in `ControlPanelProps`.
- Styled with dual-mode support: default blurred dock or neumorphic convex slab (`shadow-neu-raised`).
- Inset switch tracks (`shadow-neu-pressed-sm`) with raised tactile active buttons (`shadow-neu-raised-sm`).
- GSAP spring transition for opening/closing expandable menu and theme switching:
```typescript
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Use scoped useGSAP on panelRef
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: Exits with code 0.

- [ ] **Step 4: Commit**

Run:
```bash
git add src/utils/i18n.ts src/components/ControlPanel.tsx
git commit -m "feat(control-panel): add theme switcher and gsap spring transitions"
```

---

### Task 4: Adapt Canvas Nodes (PersonNode & RelationshipActionNode) with Neumorphic Tactile Physics

**Files:**
- Modify: `src/components/PersonNode.tsx:1-180`
- Modify: `src/components/tree/RelationshipActionNode.tsx:1-120`

**Interfaces:**
- Consumes: `--neu-raised`, `--neu-pressed`, `--neu-male`, `--neu-female`, `--neu-deceased`
- Produces: Dual-theme PersonNode cards with GSAP click depression (`scale: 0.98`) and hover micro-elevation.

- [ ] **Step 1: Update PersonNode with Neumorphic card styling and GSAP interaction**

In `src/components/PersonNode.tsx`:
- Under Neumorphism:
  - Surface: `border border-white/60 dark:border-white/5 rounded-2xl shadow-neu-raised bg-[#e6e9ef] dark:bg-[#1c2027]`.
  - Inset Avatar: `shadow-neu-pressed-sm rounded-full`.
  - Male Accent: `text-[#2563eb] dark:text-[#38bdf8] bg-[#dbeafe] dark:bg-[rgba(56,189,248,0.12)]`.
  - Female Accent: `text-[#e11d48] dark:text-[#fb7185] bg-[#ffe4e6] dark:bg-[rgba(251,113,133,0.12)]`.
  - Deceased: `shadow-neu-pressed text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/50`.
  - Selected state: Inset debossed frame `shadow-neu-pressed ring-2 ring-indigo-500`.
- GSAP Micro-Interaction via `useGSAP`:
  - Scoped to `nodeRef`.
  - On mouse enter: `gsap.to(cardRef, { y: -2, duration: 0.18, ease: "power2.out" })`.
  - On mouse leave: `gsap.to(cardRef, { y: 0, duration: 0.18, ease: "power2.out" })`.
  - On click: `gsap.timeline().to(cardRef, { scale: 0.98, duration: 0.08 }).to(cardRef, { scale: 1, duration: 0.14, ease: "back.out(2)" })`.

- [ ] **Step 2: Update RelationshipActionNode with Neumorphic bead styling**

In `src/components/tree/RelationshipActionNode.tsx`:
- Render action bead as extruded tactile circle `shadow-neu-raised bg-[#e6e9ef] dark:bg-[#1c2027] border border-white/60 dark:border-white/5`.
- Active state transitions to `shadow-neu-pressed`.
- GSAP micro-interaction on button click.

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: Exits with code 0.

- [ ] **Step 4: Commit**

Run:
```bash
git add src/components/PersonNode.tsx src/components/tree/RelationshipActionNode.tsx
git commit -m "feat(tree-nodes): style person and relationship nodes for neumorphism with gsap motion"
```

---

### Task 5: Adapt Editor Sidebar and Subviews for Universal Theming & GSAP Glide

**Files:**
- Modify: `src/components/EditorSidebar.tsx:1-240`
- Modify: `src/components/sidebar/SidebarTabs.tsx:1-70`
- Modify: `src/components/sidebar/MembersView.tsx:1-150`
- Modify: `src/components/sidebar/PersonDetailView.tsx:1-200`
- Modify: `src/components/sidebar/SidebarHeader.tsx:1-60`
- Modify: `src/components/sidebar/SidebarFooter.tsx:1-80`

**Interfaces:**
- Consumes: `--neu-surface`, `--neu-raised`, `--neu-pressed`, `useGSAP`
- Produces: Dual-theme EditorSidebar with smooth sliding drawer transition and tactile recessed input fields.

- [ ] **Step 1: Update SidebarTabs with Neumorphic segmented track**

In `src/components/sidebar/SidebarTabs.tsx`:
- Under Neumorphism: Container is inset track `shadow-neu-pressed-sm rounded-xl p-1 bg-[#e6e9ef] dark:bg-[#181b20]`.
- Active tab pill: Raised extruded tile `shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] text-indigo-600 dark:text-indigo-400 font-semibold`.

- [ ] **Step 2: Update MembersView with recessed search and tactile member cards**

In `src/components/sidebar/MembersView.tsx`:
- Search input: Inset recessed trough `shadow-neu-pressed rounded-xl border border-white/50 dark:border-white/5 bg-transparent`.
- Filter badges: Raised beads `shadow-neu-raised-sm` with pressed active states `shadow-neu-pressed`.
- Member list cards: Raised tactile items with GSAP staggered entrance (`stagger: 0.02, opacity: 0 -> 1, y: 6 -> 0`).

- [ ] **Step 3: Update PersonDetailView with Neumorphic card sections**

In `src/components/sidebar/PersonDetailView.tsx`:
- Bio, Contact, Location blocks: Tactile extruded slabs `shadow-neu-raised-sm rounded-xl p-4 bg-[#e6e9ef] dark:bg-[#1c2027]`.
- Quick action buttons (Edit, Add Relative, Delete): Physical raised buttons with pressed active states.

- [ ] **Step 4: Update EditorSidebar container with GSAP glide physics**

In `src/components/EditorSidebar.tsx`:
- When opening/collapsing, animate width/translate using `gsap.to(sidebarRef, { duration: 0.3, ease: "power3.inOut" })`.

- [ ] **Step 5: Verify build**

Run: `bun run build`
Expected: Exits with code 0.

- [ ] **Step 6: Commit**

Run:
```bash
git add src/components/EditorSidebar.tsx src/components/sidebar/
git commit -m "feat(sidebar): adapt sidebar and subviews for neumorphism with gsap motion"
```

---

### Task 6: Adapt Modals & Dialogs with Elastic GSAP Entrances

**Files:**
- Modify: `src/pages/PageModals.tsx:1-100`
- Modify: `src/components/PersonFormModal.tsx:1-180`
- Modify: `src/components/AddRelativeModal.tsx:1-180`
- Modify: `src/components/ConnectNodesModal.tsx:1-150`
- Modify: `src/components/ShareSuccessModal.tsx:1-120`

**Interfaces:**
- Consumes: Neumorphic tokens, `@gsap/react`
- Produces: Modals with elastic pop-in animation (`scale: 0.94 -> 1.0`, `opacity: 0 -> 1`, `duration: 0.24`, `ease: "power2.out"`), inset form troughs, and physical tactile buttons.

- [ ] **Step 1: Update Modal base styling and entry transitions**

Across all modal dialogs:
- Neumorphic dialog container: `bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border border-white/60 dark:border-white/5 rounded-3xl`.
- Form inputs (`<input>`, `<select>`, `<textarea>`): Inset troughs `shadow-neu-pressed rounded-xl border border-white/40 dark:border-white/5 bg-transparent`.
- Primary actions (Save, Submit, Share): Raised buttons `shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] hover:shadow-neu-raised active:shadow-neu-pressed`.
- GSAP Entry Hook:
```typescript
const modalRef = useRef<HTMLDivElement>(null);
useGSAP(() => {
  if (isOpen && modalRef.current) {
    gsap.fromTo(modalRef.current,
      { scale: 0.94, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.24, ease: "power2.out" }
    );
  }
}, [isOpen]);
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: Exits with code 0.

- [ ] **Step 3: Commit**

Run:
```bash
git add src/pages/PageModals.tsx src/components/PersonFormModal.tsx src/components/AddRelativeModal.tsx src/components/ConnectNodesModal.tsx src/components/ShareSuccessModal.tsx
git commit -m "feat(modals): style modals with neumorphic surfaces and elastic gsap entrances"
```

---

### Task 7: Wire Global Theme in FamilyTreePage & Verification

**Files:**
- Modify: `src/pages/FamilyTreePage.tsx:1-95`

**Interfaces:**
- Consumes: `useTheme`
- Passes `theme` and `setTheme` to `ControlPanel` and ensures full synchronization with `useDarkMode`.

- [ ] **Step 1: Wire useTheme in FamilyTreePage**

In `src/pages/FamilyTreePage.tsx`:
```typescript
import { useTheme } from '@/hooks/useTheme';

export function FamilyTreePage() {
  const { theme, setTheme } = useTheme();
  // ...
  <ControlPanel
    theme={theme}
    setTheme={setTheme}
    // other props
  />
}
```

- [ ] **Step 2: Verify production build compilation**

Run: `bun run build`
Expected: Exits with code 0 with zero TypeScript or Vite errors.

- [ ] **Step 3: Update knowledge graph**

Run: `graphify extract .`
Expected: Updates `graphify-out/graph.json` with new files.

- [ ] **Step 4: Commit**

Run:
```bash
git add src/pages/FamilyTreePage.tsx
git commit -m "feat(page): wire theme state and complete neumorphic theme system"
```

---
