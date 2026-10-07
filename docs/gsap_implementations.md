# GSAP Implementations Overview

This document catalogs all GSAP animation implementations across the codebase:

### 1. Canvas Nodes & Interactivity
- [`src/components/PersonNode.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/PersonNode.tsx)
  - Hover micro-elevation: `gsap.to(card, { y: -2, duration: 0.18, ease: 'power2.out' })`
  - Click depression spring rebound: `gsap.timeline().to(card, { scale: 0.98, duration: 0.08 }).to(card, { scale: 1, duration: 0.14, ease: 'back.out(2)' })`
- [`src/components/tree/RelationshipActionNode.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/tree/RelationshipActionNode.tsx)
  - Hover micro-elevation: `gsap.to(btn, { y: -1, duration: 0.15, ease: 'power2.out' })`
  - Click spring ripple: `gsap.timeline().to(btn, { scale: 0.92, duration: 0.08 }).to(btn, { scale: 1, duration: 0.18, ease: 'back.out(2.5)' })`
- [`src/components/tree/NodeActionMenu.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/tree/NodeActionMenu.tsx)
  - Gear icon hover rotation: `gsap.to(gearRef.current, { rotation: '+=45', duration: 0.28, ease: 'power2.out' })`
  - Gear icon click rotation: `gsap.to(gearRef.current, { rotation: nextState ? 90 : 0, duration: 0.35, ease: 'back.out(1.5)' })`
  - Action popup entrance: Swings and scales outward with gear center as transform origin: `gsap.fromTo(popupRef.current, { opacity: 0, scale: 0.35, rotation: -40, transformOrigin: '16px -24px' }, { opacity: 1, scale: 1, rotation: 0, duration: 0.32, ease: 'back.out(1.6)' })`

### 2. Control Panel
- [`src/components/ControlPanel.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/ControlPanel.tsx)
  - Initial mount spring float: `gsap.fromTo(wrapperRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' })`
  - Theme change tactile pulse: `gsap.to(wrapperRef.current, { scale: 1.02, duration: 0.12, yoyo: true, repeat: 1 })`
  - Expand / collapse accordion panel: `gsap.fromTo(panelRef.current, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' })`

### 3. Editor Sidebar & Drawer Subviews
- [`src/components/EditorSidebar.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/EditorSidebar.tsx)
  - Drawer slide expansion and collapse: `gsap.to(el, { width: isCollapsed ? 0 : width, duration: 0.3, ease: 'power3.inOut' })`
- [`src/components/sidebar/SidebarTabs.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/sidebar/SidebarTabs.tsx)
  - Tab button tactile press and spring rebound: `gsap.timeline().to(btn, { scale: 0.96, duration: 0.08 }).to(btn, { scale: 1, duration: 0.16, ease: 'back.out(2)' })`
- [`src/components/sidebar/MemberList.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/sidebar/MemberList.tsx)
  - Staggered card entrance: `gsap.fromTo(cards, { opacity: 0, y: 6 }, { opacity: 1, y: 0, stagger: 0.02, duration: 0.25, ease: 'power2.out' })`

### 4. Modals & Dialogs
- [`src/components/PersonFormModal.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/PersonFormModal.tsx)
  - Elastic pop-in entry: `gsap.fromTo(modalRef.current, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.24, ease: 'power2.out' })`
- [`src/components/AddRelativeModal.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/AddRelativeModal.tsx)
  - Elastic pop-in entry: `gsap.fromTo(modalRef.current, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.24, ease: 'power2.out' })`
- [`src/components/ShareSuccessModal.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/ShareSuccessModal.tsx)
  - Elastic pop-in entry: `gsap.fromTo(modalRef.current, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.24, ease: 'power2.out' })`
