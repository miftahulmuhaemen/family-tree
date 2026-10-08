# Neumorphism Theme & GSAP Micro-Interactions Implementation Report

## Summary
The dual-theme architecture supporting both Default and Neumorphism themes across the light/dark matrix, alongside tactile GSAP physics animations, has been implemented across the application.

## Key Changes
1. **Design Tokens & System**:
   - Integrated `gsap` and `@gsap/react`.
   - Defined Neumorphic surface, raised, and pressed shadow tokens in `src/index.css`.
   - Codified universal dual-theme project rule in `.agents/rules/ui_theme_guidelines.md`.

2. **Theme Management**:
   - Implemented `useTheme` hook with `localStorage` persistence and `document.documentElement` `data-theme` synchronization.
   - Centralized reactive `useIsNeumorphic` observer for instant UI re-rendering.

3. **Control Panel**:
   - Added dual-state segmented theme switcher (`Default` vs `Soft Clay` / `Neumorfisme`) with i18n support.
   - Integrated GSAP spring transitions on expansion, collapse, and option selection.

4. **Interactive Tree Canvas**:
   - Person nodes: Convex tactile slabs, recessed avatars, sex-specific accents, deceased indicators, and debossed selected states.
   - Relationship nodes: Tactile action beads with active pressed feedback.
   - GSAP micro-interactions: Smooth hover elevation (`y: -2px`) and tactile click spring depression (`scale: 0.98 -> 1.0`).

5. **Editor Sidebar & Subviews**:
   - Sidebar container: Tactile background slab with GSAP sliding drawer transition (`duration: 0.3s`, `ease: "power3.inOut"`).
   - Inset segmented navigation track in `SidebarTabs`.
   - Inset search troughs, raised filter badges, and member list cards with GSAP staggered entrances in `MembersView`.
   - Extruded sections and physical action buttons in `PersonDetailView`.
   - Tactile buttons across `SidebarHeader` and `SidebarFooter`.

6. **Modals & Dialogs**:
   - Extruded surfaces, inset form inputs (`<input>`, `<select>`, `<textarea>`), and tactile raised/pressed buttons across `PersonFormModal`, `AddRelativeModal`, `ConnectNodesModal`, and `ShareSuccessModal`.
   - Integrated GSAP elastic pop-in entry animations (`scale: 0.94 -> 1.0`, `opacity: 0 -> 1`, `duration: 0.24s`, `ease: "power2.out"`).
   - Replaced legacy unicode emojis with Lucide SVG icons.

7. **Page Wiring & Verification**:
   - Integrated global theme state in `src/pages/FamilyTreePage.tsx`.
   - Maintained all subcomponents and orchestrators within architectural line count limits.
   - Successfully compiled production build via `bun run build`.
   - Updated knowledge graph via `graphify extract .`.
