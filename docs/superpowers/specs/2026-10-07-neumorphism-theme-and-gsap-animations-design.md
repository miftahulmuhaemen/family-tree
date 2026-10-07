# Design Specification: Neumorphism Theme System & GSAP Interactive Animations

**Date**: 2026-10-07  
**Status**: Approved (Ready for Implementation Planning)  
**Scope**: Dual Theme Architecture (`default` | `neumorphism`), Full Light/Dark Matrix, Control Panel Theme Switch, Universal Component Theming, and GSAP Choreographed Animations.

---

## 1. Overview & Purpose

The objective is to replace the generic AI-slop appearance of the application with a high-fidelity, tactile, production-ready **Neumorphic Design System** alongside the existing **Default** theme. The user can seamlessly toggle between themes from the bottom Control Panel.

Additionally, interactive animation across all user touchpoints will be elevated using **GSAP** (`gsap` and `@gsap/react`), delivering physics-grounded micro-interactions (press feedback, spring-based sliding toggles, staggered drawer reveal, elastic modal entry) without perpetual loops or gratuitous visual noise.

A permanent engineering standard will be codified requiring all current and future UI components to strictly support both themes.

---

## 2. Theme Architecture & Matrix

### 2.1 Four-State Theme Matrix
Themes and color modes operate as orthogonal dimensions:
1. `default` + `light`: Clean, flat modern SaaS styling.
2. `default` + `dark`: Deep zinc dark mode.
3. `neumorphism` + `light`: Soft porcelain alabaster surfaces with extruded dual-source drop shadows and crisp light rims.
4. `neumorphism` + `dark`: Obsidian graphite surfaces with recessed inset lighting and deep ambient shadowing.

### 2.2 Root Attributes
State is applied to `document.documentElement`:
- `data-theme="default" | "neumorphism"`
- `class="dark" | ""`
- Persisted in browser `localStorage` under `familytree_theme` and `familytree_dark_mode`.

### 2.3 Theme State Hook (`useTheme.ts`)
```typescript
export type Theme = 'default' | 'neumorphism';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

---

## 3. Design System Tokens (`src/index.css`)

### 3.1 Neumorphic Surface Shadows & Highlights
Neumorphism often fails accessibility by creating low-contrast "muddy clay" surfaces. To achieve production-grade clarity, every surface combines dual ambient shadows with a subtle 1px border highlight rim for razor-sharp edge definition:

- **Light Mode (`[data-theme="neumorphism"]`)**:
  - Base Background: `#E6E9EF` (Warm Porcelain)
  - Dark Light Source: `rgba(163, 177, 198, 0.6)`
  - Light Light Source: `rgba(255, 255, 255, 0.85)`
  - Border Rim: `1px solid rgba(255, 255, 255, 0.7)`
  - Raised Surface: `6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light)`
  - Raised Compact: `3px 3px 8px var(--neu-shadow-dark), -3px -3px 8px var(--neu-shadow-light)`
  - Inset (Pressed/Debossed): `inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light)`
  - Inset Subtle: `inset 1.5px 1.5px 3px var(--neu-shadow-dark), inset -1.5px -1.5px 3px var(--neu-shadow-light)`

- **Dark Mode (`[data-theme="neumorphism"].dark`)**:
  - Base Background: `#181B20` (Obsidian Cast)
  - Dark Light Source: `rgba(0, 0, 0, 0.75)`
  - Light Light Source: `rgba(255, 255, 255, 0.04)`
  - Border Rim: `1px solid rgba(255, 255, 255, 0.05)`
  - Raised Surface: `6px 6px 16px var(--neu-shadow-dark), -4px -4px 12px var(--neu-shadow-light)`
  - Raised Compact: `3px 3px 8px var(--neu-shadow-dark), -2px -2px 6px var(--neu-shadow-light)`
  - Inset (Pressed/Debossed): `inset 3px 3px 6px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)`
  - Inset Subtle: `inset 1.5px 1.5px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)`

### 3.2 Semantic Color Palette (Anti-Slop Restraint)
- **Primary / Brand Accent**:
  - Light: Deep Indigo `#4338CA`
  - Dark: Soft Periwinkle `#818CF8`
- **Male Gender**:
  - Light: Classic Steel Azure `#2563EB` (Background tint: `#DBEAFE`)
  - Dark: Deep Cerulean `#38BDF8` (Background tint: `rgba(56, 189, 248, 0.12)`)
- **Female Gender**:
  - Light: Terracotta Rose `#E11D48` (Background tint: `#FFE4E6`)
  - Dark: Coral Flamingo `#FB7185` (Background tint: `rgba(251, 113, 133, 0.12)`)
- **Deceased Indicator**:
  - Light: Inset Debossed Stone Slate `#64748B` with monochrome seal badge
  - Dark: Subdued Ash `#94A3B8`
- **Text & Foreground**:
  - Light: High contrast Charcoal `#1E293B` (Body: `#475569`) — strict WCAG AAA compliance.
  - Dark: Crisp Platinum `#F1F5F9` (Body: `#94A3B8`).

---

## 4. Component Theming Architecture

Every component adapts via Tailwind theme variants (`data-[theme=neumorphism]:...`) and dedicated shared CSS utility classes:

### 4.1 Canvas Person Cards (`src/components/PersonNode.tsx`)
- **Default Theme**: Flat border card, rounded corners, colored top bar.
- **Neumorphism Theme**:
  - Extruded card container (`shadow-neu-raised`).
  - Subtle inset avatar frame (`shadow-neu-pressed-sm`).
  - Active/Selected state transforms to pressed debossed elevation (`shadow-neu-pressed`) with an indigo accent indicator.
  - Floating action buttons (`+ Pasangan`, `+ Anak`, `...`) use compact raised beads (`shadow-neu-raised-sm`).

### 4.2 Relationship Action Node (`src/components/tree/RelationshipActionNode.tsx`)
- **Default Theme**: Diamond / pill badge with subtle border.
- **Neumorphism Theme**:
  - Tactile circular bead extruded from canvas ground.
  - Hover triggers spring depression; active click feels physical.

### 4.3 Floating Control Panel (`src/components/ControlPanel.tsx`)
- **Default Theme**: Floating translucent blurred dock.
- **Neumorphism Theme**:
  - Extruded convex pill dock (`shadow-neu-raised`).
  - Integrated Segmented Controls (`LANG`, `ACCENT`, `MODE`, `THEME`): Inset track (`shadow-neu-pressed-sm`) with a physical raised sliding thumb.
  - Quick theme toggle: Switch between `Default` and `Neumorphism` instantaneously.

### 4.4 Editor Sidebar (`src/components/EditorSidebar.tsx`)
- **Default Theme**: Bordered vertical drawer.
- **Neumorphism Theme**:
  - Monolithic extruded panel matching canvas foundation tone.
  - Search input: Inset recessed trough (`shadow-neu-pressed`).
  - Tabs (`Detail`, `Members`, `GEDCOM`): Inset switch container with raised active tab pill.
  - Member List Cards: Subtle raised tiles with tactile click feedback.

### 4.5 Modals & Overlays (`src/components/modals/*`, `PageModals.tsx`)
- **Default Theme**: Centered popover with backdrop blur.
- **Neumorphism Theme**:
  - Soft backdrop dimming.
  - Dialog container rendered as an extruded tactile slab with rounded edges.
  - Form inputs rendered as debossed inset troughs.
  - Action buttons (Save, Cancel, Delete) styled with raised tactile physics.

---

## 5. GSAP Animation Architecture

### 5.1 Library Integration
- Dependencies: `gsap` (core animation) and `@gsap/react` (`useGSAP` hook with automatic context cleanup).
- Standard register in application initialization:
  ```typescript
  import gsap from 'gsap';
  import { useGSAP } from '@gsap/react';
  gsap.registerPlugin(useGSAP);
  ```

### 5.2 Micro-Interactions & Physics
1. **Control Panel Segmented Switches**:
   - Sliding thumb uses GSAP spring tween (`duration: 0.25`, `ease: "power2.out"`).
   - Expand/collapse transitions use elastic height morphing without layout thrashing.
2. **Editor Sidebar Transitions**:
   - Sidebar open/collapse glides with `x: 0 -> -100%` (`duration: 0.35`, `ease: "power3.inOut"`).
   - Tab switching triggers a fast staggered reveal of list items (`stagger: 0.03`, `opacity: 0 -> 1`, `y: 8 -> 0`).
3. **Canvas Nodes & Action Buttons**:
   - Hover: Micro-elevation (`y: -2`, scale: 1.01, duration: 0.18s).
   - Press/Active: Spring tactile depression (`y: 0`, scale: 0.98, duration: 0.12s).
   - New relative node insertion: Smooth scale-up elastic entrance (`scale: 0.8 -> 1`, `opacity: 0 -> 1`, `ease: "back.out(1.4)"`).
4. **Modal Dialogs**:
   - Entry: `scale: 0.94 -> 1.0`, `opacity: 0 -> 1` (`duration: 0.24`, `ease: "power2.out"`).
   - Exit: `scale: 1.0 -> 0.96`, `opacity: 1 -> 0` (`duration: 0.18`, `ease: "power2.in"`).
5. **Anti-Slop Compliance**:
   - Zero perpetual loops or continuous pulsing glow effects (strictly adheres to R-19).
   - All motion serves a functional UX feedback purpose.

---

## 6. Engineering Rule for Current & Future Components

To ensure the codebase never drifts or forgets theme support, an official project rule is added to `.agents/rules/ui_theme_guidelines.md`:

```markdown
# UI Theme Guidelines: Universal Multi-Theme Support

All user interface components in this application MUST support both existing themes:
1. **Default Theme** (`data-theme="default"`)
2. **Neumorphism Theme** (`data-theme="neumorphism"`)

### Requirements for Any Component Edit or Creation:
- Never hardcode fixed border colors, backgrounds, or flat box-shadows without providing their neumorphic equivalents.
- Use semantic CSS tokens (`--neu-surface`, `--neu-raised`, `--neu-pressed`) or Tailwind `data-[theme=neumorphism]:` variants.
- Test and verify component appearance across all 4 matrix states (Default Light, Default Dark, Neumorphic Light, Neumorphic Dark).
- All interactive micro-interactions (press, toggle, expand) must utilize GSAP physics-based motion with automatic cleanup (`useGSAP`).
```

---

## 7. Verification & Quality Gates

1. **Static Build & Type Check**:
   - `bun run build` must compile with 0 errors.
2. **Matrix Test Verification**:
   - Verify all 4 states on canvas, sidebar, control panel, and modals.
3. **GSAP Cleanup Verification**:
   - Verify zero animation leaks or detached DOM memory warnings when unmounting modals or collapsing the sidebar.
4. **Knowledge Graph**:
   - Update knowledge graph via `graphify extract .`.
