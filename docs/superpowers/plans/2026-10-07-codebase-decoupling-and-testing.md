# Codebase Decoupling, Testing Suite, and Architecture Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Decouple and modularize the family tree application into a strict 3-tier frontend architecture adhering to strict lines-of-code (LOC) limits, establish comprehensive unit tests via Bun Test and E2E tests via Playwright, extract a persistent Graphify knowledge graph, and clean up repository hygiene (`.gitignore`, `.graphifyignore`, `.vscode/launch.json`).

**Architecture:** 
1. **Presentation Layer**: Thin page orchestrator (`src/pages/FamilyTreePage.tsx` <= 100 LOC), decoupled feature subcomponents (`src/components/sidebar/*`, `src/components/modals/*`, `src/components/tree/*` capped at <= 200–250 LOC), and reusable primitives (`src/components/ui/*`).
2. **Business Logic & State Layer**: Domain custom hooks (`src/hooks/useTreeData.ts`, `src/hooks/useTreeRemote.ts`, `src/hooks/useTreeModals.ts`, `src/hooks/useTreeNavigation.ts`, `src/hooks/useDarkMode.ts`) isolating all mutations, validation, network access, and filtering.
3. **Quality & Verification Layer**: 1-to-1 unit tests via `bun test` for all hooks and algorithms; production-grade Playwright E2E suites isolated in `e2e/` adhering to the Phase 1 zero-execution rule; Graphify knowledge graph at `graphify-out/`.

**Tech Stack:** React 19, TypeScript 5.9, Bun runtime/package manager, Vite 7, @xyflow/react, Lucide React, Monaco Editor, Tailwind CSS, Playwright, Graphify CLI.

## Global Constraints
- Strictly enforce Bun runtime (`bun`, `bun test`, `bun run dev`, `bun run build`); never use `npm`, `npx`, `yarn`, or `pnpm`.
- Universal English-only naming for directories, files, functions, types, and hooks (UI display copy/i18n can retain Indonesian).
- Strict LOC limits: Page Orchestrators <= 100 LOC; Feature Subcomponents <= 200–250 LOC; Handlers/Modals <= 200 LOC.
- Self-contained test modularity: 1-to-1 test mapping (`*.test.ts`, `*.test.tsx`) with zero shared mocks or omnibus test suites.
- E2E Zero-Execution Rule: NEVER execute E2E test commands (`bun run test:e2e`, `playwright test`) during active development (Phase 1).
- Single-Table / Single-Responsibility isolation across all files; no omnibus files.

---

## Phase 1: Tooling, Gitignore & Knowledge Graph Setup

### Task 1: Environment, Gitignore & VS Code Launch Hardening
**Files:**
- Modify: [`.gitignore`](file:///home/sahana/Code_Repository/personal/familytree/.gitignore)
- Create: [`.graphifyignore`](file:///home/sahana/Code_Repository/personal/familytree/.graphifyignore)
- Create: [`.vscode/launch.json`](file:///home/sahana/Code_Repository/personal/familytree/.vscode/launch.json)

**Interfaces:**
- Consumes: Existing project structure
- Produces: Sanitized git tracking and standardized debugger configs

- [ ] **Step 1: Update `.gitignore`**
  - Add Playwright artifacts: `test-results/`, `playwright-report/`, `blob-report/`.
  - Add test coverage & logs: `coverage/`, `*.test.log`.
  - Fix VS Code rule: whitelist `!.vscode/launch.json` alongside `!.vscode/extensions.json`.
  - Add scratch scripts directory ignore: `scratch/`.

- [ ] **Step 2: Create `.graphifyignore`**
  - Strictly ignore all dotfiles/directories: `.*`, `.agents/`, `.vscode/`, `.git/`, `.wrangler/`.
  - Ignore build & dependency artifacts: `node_modules/`, `dist/`, `test-results/`, `playwright-report/`, `coverage/`, `public/`.

- [ ] **Step 3: Create `.vscode/launch.json`**
  - Configure `Launch Frontend (Dev Server)` using `bun run dev`.
  - Configure `Launch Frontend (Chrome)` targeting `http://localhost:5173`.
  - Configure `Run Unit Tests` using `bun test`.

- [ ] **Step 4: Verify git status and check ignores**
  ```bash
  git status -s
  ```

---

### Task 2: Graphify Knowledge Graph Extraction
**Files:**
- Output directory: `graphify-out/` (`graph.json`, `wiki/index.md`, `GRAPH_REPORT.md`)

**Interfaces:**
- Consumes: Entire codebase while respecting `.graphifyignore`
- Produces: Graphify knowledge graph for rapid structural and dependency analysis

- [ ] **Step 1: Run graphify extraction**
  ```bash
  graphify extract .
  ```

- [ ] **Step 2: Verify knowledge graph generation**
  - Confirm `graphify-out/graph.json` exists.
  - Confirm `graphify-out/wiki/index.md` exists.
  - Query graphify to ensure indexing excludes `.agents/` and `.vscode/`:
    ```bash
    graphify query "What are the main components of the application?"
    ```

---

## Phase 2: Architectural Decoupling & 3-Tier Layering (Strict LoC Enforcement)

### Task 3: Extract Domain Custom Hooks Layer
**Files:**
- Create: [`src/hooks/useTreeData.ts`](file:///home/sahana/Code_Repository/personal/familytree/src/hooks/useTreeData.ts)
- Create: [`src/hooks/useTreeRemote.ts`](file:///home/sahana/Code_Repository/personal/familytree/src/hooks/useTreeRemote.ts)
- Create: [`src/hooks/useTreeModals.ts`](file:///home/sahana/Code_Repository/personal/familytree/src/hooks/useTreeModals.ts)
- Create: [`src/hooks/useTreeNavigation.ts`](file:///home/sahana/Code_Repository/personal/familytree/src/hooks/useTreeNavigation.ts)
- Create: [`src/hooks/useDarkMode.ts`](file:///home/sahana/Code_Repository/personal/familytree/src/hooks/useDarkMode.ts)

**Interfaces:**
- `useTreeData`:
  - Input: `{ defaultYaml?: string }`
  - Output: `{ yamlContent: string, treeData: FamilyTreeData | null, isValid: boolean, errorMsg: string, setYamlContent: (yaml: string) => void, updateTreeState: (people: Person[], relationships: Relationship[]) => void, deduplicateRelationships: (rels: Relationship[]) => Relationship[] }`
- `useTreeRemote`:
  - Input: `{ yamlContent: string, isValid: boolean, onLoaded: (yaml: string, id: string, token: string | null, lastMod: Date | null) => void }`
  - Output: `{ currentId: string | null, editToken: string | null, lastSaved: Date | null, isReadOnly: boolean, isSharing: boolean, isLoading: boolean, errorMsg: string, setEditToken: (token: string | null) => void, handleShareOrSave: () => Promise<void>, handleLoadId: (id: string, token?: string) => Promise<void> }`
- `useTreeModals`:
  - Input: `{ treeData: FamilyTreeData | null, onUpdateTree: (people: Person[], rels: Relationship[]) => void }`
  - Output: `{ isPersonModalOpen: boolean, editingPerson: Person | null, isRelativeModalOpen: boolean, relativeTargetPerson: Person | null, relativeType: RelativeType, showShareModal: boolean, shareData: any, openEditPerson: (p: Person) => void, openAddPerson: () => void, closePersonModal: () => void, openAddRelative: (target: Person, type: RelativeType) => void, closeRelativeModal: () => void, handleSavePerson: (payload: any) => void, handleDeletePerson: (personId: string) => void, handleAddRelative: (payload: any) => void, handleAddDirectRelationship: (rel: any) => void }`
- `useTreeNavigation`:
  - Input: `{ initialPovId?: string | null }`
  - Output: `{ povId: string | null, isSidebarCollapsed: boolean, setPovId: (id: string | null) => void, setIsSidebarCollapsed: (val: boolean) => void, handleOpenDetail: (personId: string) => void }`
- `useDarkMode`:
  - Output: `{ isDarkMode: boolean, toggleDarkMode: () => void }`

- [ ] **Step 1: Implement `src/hooks/useDarkMode.ts`**
  - Encapsulate `localStorage` sync, media-query detection, and `document.documentElement` class toggle.
  - Capped under 40 LOC.
- [ ] **Step 2: Implement `src/hooks/useTreeData.ts`**
  - Encapsulate YAML string parsing, syntax error validation, deduplication algorithm for bidirectional relationships, and `setTreeData`.
  - Capped under 80 LOC.
- [ ] **Step 3: Implement `src/hooks/useTreeRemote.ts`**
  - Encapsulate R2 fetch via Cloudflare Worker, PUT save with `X-Edit-Token`, POST share, 401/403 authorization handling, and browser pushState history updates.
  - Capped under 120 LOC.
- [ ] **Step 4: Implement `src/hooks/useTreeModals.ts`**
  - Encapsulate person CRUD logic, relative validation (max 2 biological parents, no duplicate spouses), direct drag-and-drop connections, and modal toggles.
  - Capped under 150 LOC.
- [ ] **Step 5: Implement `src/hooks/useTreeNavigation.ts`**
  - Encapsulate camera focus node state (`povId`), sidebar collapse coordination, and `handleOpenDetail`.
  - Capped under 40 LOC.
- [ ] **Step 6: Build verification**
  ```bash
  bun run build
  ```

---

### Task 4: Modularize Sidebar Components (Breaking 1,228 LOC Monolith)
Currently `src/components/EditorSidebar.tsx` is 1,228 LOC. Break it down into English feature components under `src/components/sidebar/` capped at <= 150–200 LOC each.

**Files:**
- Create: `src/components/sidebar/SidebarHeader.tsx` (<= 100 LOC)
- Create: `src/components/sidebar/SidebarTabs.tsx` (<= 60 LOC)
- Create: `src/components/sidebar/PersonDetailView.tsx` (<= 180 LOC)
- Create: `src/components/sidebar/MemberFilterBar.tsx` (<= 110 LOC)
- Create: `src/components/sidebar/BirthYearCombobox.tsx` (<= 130 LOC)
- Create: `src/components/sidebar/MemberList.tsx` (<= 120 LOC)
- Create: `src/components/sidebar/MembersView.tsx` (<= 100 LOC)
- Create: `src/components/sidebar/YamlEditorView.tsx` (<= 140 LOC)
- Refactor: [`src/components/EditorSidebar.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/EditorSidebar.tsx) (Orchestrator container <= 150 LOC)

**Interfaces:**
- `BirthYearCombobox`: Props: `{ value: string, onChange: (year: string) => void, availableYears: number[], terms: any }`. Max 10 items limit strictly maintained.
- `PersonDetailView`: Props: `{ person: Person, onEdit: (p: Person) => void, onDelete: (id: string) => void, onBack: () => void, terms: any, language: Language }`.
- `MembersView`: Composes `MemberFilterBar`, `BirthYearCombobox`, `MemberList`, and Add Person trigger.
- `YamlEditorView`: Integrates Monaco Editor, error banner, and save/share button.

- [ ] **Step 1: Extract `src/components/sidebar/BirthYearCombobox.tsx`**
  - Isolate click-outside listener, search input, and `.slice(0, 10)` clamped results.
- [ ] **Step 2: Extract `src/components/sidebar/MemberFilterBar.tsx` & `MemberList.tsx`**
  - Isolate gender pills, status pills, and list item rendering with initials avatar.
- [ ] **Step 3: Extract `src/components/sidebar/MembersView.tsx`**
  - Compose search input, filter bar, combobox, and member list.
- [ ] **Step 4: Extract `src/components/sidebar/PersonDetailView.tsx`**
  - Isolate profile card, bio, phone numbers (with WhatsApp link), addresses (with Google Maps link), and metadata.
- [ ] **Step 5: Extract `src/components/sidebar/YamlEditorView.tsx`**
  - Monaco Editor wrapper, status indicators, and share/save action buttons.
- [ ] **Step 6: Extract `src/components/sidebar/SidebarHeader.tsx` & `SidebarTabs.tsx`**
  - Header with title, dark mode toggle, lock/unlock popovers, and tab selector.
- [ ] **Step 7: Refactor `src/components/EditorSidebar.tsx` into a thin orchestrator**
  - Retain only width resizing and subcomponent layout composition (<= 120 LOC).
- [ ] **Step 8: Build verification**
  ```bash
  bun run build
  ```

---

### Task 5: Decouple Modals & Form Dialogs
Currently `AddRelativeModal.tsx` is 426 LOC and `PersonFormModal.tsx` is 389 LOC (violating the 200–250 LOC rule).

**Files:**
- Create: `src/hooks/usePersonForm.ts` (<= 100 LOC)
- Create: `src/components/modals/ContactFieldsGroup.tsx` (<= 90 LOC)
- Create: `src/components/modals/AddressFieldsGroup.tsx` (<= 90 LOC)
- Refactor: [`src/components/PersonFormModal.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/PersonFormModal.tsx) (<= 180 LOC)
- Create: `src/hooks/useAddRelativeForm.ts` (<= 100 LOC)
- Create: `src/components/modals/PersonSelectCombobox.tsx` (<= 110 LOC)
- Refactor: [`src/components/AddRelativeModal.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/AddRelativeModal.tsx) (<= 180 LOC)

**Interfaces:**
- `usePersonForm`: Handles dynamic contact lists, dynamic address lists, date validation, and payload packaging.
- `useAddRelativeForm`: Handles switching between creating a new person vs linking an existing tree member, foster parent toggles, and spouse select.

- [ ] **Step 1: Extract form logic into `src/hooks/usePersonForm.ts`**
- [ ] **Step 2: Extract sub-field components: `ContactFieldsGroup.tsx` and `AddressFieldsGroup.tsx`**
- [ ] **Step 3: Refactor `PersonFormModal.tsx` down to <= 180 LOC**
- [ ] **Step 4: Extract `src/hooks/useAddRelativeForm.ts` and `PersonSelectCombobox.tsx`**
- [ ] **Step 5: Refactor `AddRelativeModal.tsx` down to <= 180 LOC**
- [ ] **Step 6: Build verification**
  ```bash
  bun run build
  ```

---

### Task 6: Tree Subcomponents & Page Orchestrator (Capping `App.tsx` / `FamilyTreePage.tsx` <= 100 LOC)
Currently `src/App.tsx` is 592 LOC.

**Files:**
- Create: `src/components/tree/GraphLines.tsx` (<= 75 LOC)
- Refactor: [`src/components/FamilyTree.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/components/FamilyTree.tsx) (<= 150 LOC)
- Create: `src/pages/FamilyTreePage.tsx` (<= 90 LOC)
- Refactor: [`src/App.tsx`](file:///home/sahana/Code_Repository/personal/familytree/src/App.tsx) (<= 45 LOC)

**Interfaces:**
- `FamilyTreePage`: Orchestrates hooks (`useTreeData`, `useTreeRemote`, `useTreeModals`, `useTreeNavigation`, `useDarkMode`) and renders layout container, sidebar, canvas, control panel, toast, and modals.
- `App.tsx`: Root QueryClientProvider wrapper rendering `FamilyTreePage`.

- [ ] **Step 1: Extract `src/components/tree/GraphLines.tsx` from `FamilyTree.tsx`**
  - Isolates orthogonal SVG line routing, active POV highlighting, and zoom scaling.
- [ ] **Step 2: Create `src/pages/FamilyTreePage.tsx`**
  - Composes the decoupled hooks and renders child components without inline business logic (strictly <= 90 LOC).
- [ ] **Step 3: Refactor `src/App.tsx`**
  - Slim down to QueryClientProvider and top-level error boundary (<= 40 LOC).
- [ ] **Step 4: Verify LOC limits across all files**
  ```bash
  wc -l src/App.tsx src/pages/FamilyTreePage.tsx src/components/EditorSidebar.tsx src/components/FamilyTree.tsx
  ```
- [ ] **Step 5: Build verification**
  ```bash
  bun run build
  ```

---

## Phase 3: Unit Testing Suite (`bun test`)

Implement thorough, self-contained unit tests covering positive, negative, and edge cases for all logic files and hooks.

### Task 7: Unit Tests for Custom Hooks
**Files:**
- Create: `src/hooks/useTreeData.test.ts`
- Create: `src/hooks/useTreeRemote.test.ts`
- Create: `src/hooks/useTreeModals.test.ts`
- Create: `src/hooks/useTreeNavigation.test.ts`
- Create: `src/hooks/useDarkMode.test.ts`

- [ ] **Step 1: Implement `src/hooks/useTreeData.test.ts`**
  - Positive: Valid YAML parses into `people` and `relationships` correctly.
  - Negative: Invalid/malformed YAML triggers validation error and sets `isValid: false`.
  - Edge cases: Empty string, missing arrays, duplicate relationships deduplicated properly.
- [ ] **Step 2: Implement `src/hooks/useTreeRemote.test.ts`**
  - Positive: Successful fetch from worker populates YAML and last-modified header.
  - Negative: 401/403 unauthorized edit token failure alert and error propagation.
  - Edge cases: Network failure fallback to local demo data.
- [ ] **Step 3: Implement `src/hooks/useTreeModals.test.ts`**
  - Positive: Add relative creates new relationship and updates tree.
  - Negative: Prevent adding a 3rd biological parent (alert rejection). Prevent duplicate marriage.
  - Edge cases: Deleting a person cascades and purges all connected relationships.
- [ ] **Step 4: Implement `src/hooks/useTreeNavigation.test.ts`**
  - Positive: `setPovId` updates selected person.
  - Positive: `handleOpenDetail` sets `povId` AND sets `isSidebarCollapsed: false`.
  - Negative/Edge: Node selection on canvas does NOT alter `isSidebarCollapsed`.

---

### Task 8: Unit Tests for Tree Layout & Kinship Algorithms
**Files:**
- Create: `src/utils/branchLayout.test.ts`
- Create: `src/utils/kinship.test.ts`

- [ ] **Step 1: Implement `src/utils/branchLayout.test.ts`**
  - Test single person layout without spouses.
  - Test marriage layout: Husband on left, wife on right, spouse edge generated.
  - Test polygamous / multiple marriage layout: Focus person in center, spouses distributed symmetrically on left and right without pierced lines.
  - Test biological parents (above) and foster parents.
  - Test children distribution (below) with orthogonal parent channel bus lines.
  - Confirm focus node NEVER has `"FOKUS"` relationship label.
- [ ] **Step 2: Implement `src/utils/kinship.test.ts`**
  - Test kinship degree calculations: Father, Mother, Foster Parent, Son, Daughter, Grandparent, Grandchild, Sibling, Uncle/Aunt, Cousin.
  - Test localized terminology output for Indonesian (`id`) and English (`en`).

---

### Task 9: Unit Tests for Presentational Components
**Files:**
- Create: `src/components/sidebar/BirthYearCombobox.test.tsx`
- Create: `src/components/PersonNode.test.tsx`

- [ ] **Step 1: Implement `src/components/sidebar/BirthYearCombobox.test.tsx`**
  - Test initial render shows `Semua Tahun Lahir`.
  - Test click opens dropdown with search input.
  - Test clamping: when 25 years are available, list displays strictly at most 10 items (`.slice(0, 10)`).
  - Test search filtering: typing "196" filters years to matching subset.
  - Test selecting a year invokes `onChange` and closes dropdown.
- [ ] **Step 2: Implement `src/components/PersonNode.test.tsx`**
  - Test renders full name and age.
  - Test gender border colors: blue for male, pink for female.
  - Test "Detail" button presence on top-left of the card.
  - Test clicking "Detail" button triggers `onOpenDetail` with person ID and stops event propagation.
  - Test absence of any `"FOKUS"` text.

---

## Phase 4: End-to-End Testing Suite (`playwright`)

Setup production-grade Playwright E2E suites isolated under `e2e/`, strictly adhering to the zero-execution rule during development.

### Task 10: Playwright Configuration & Scaffolding
**Files:**
- Create: `playwright.config.ts`
- Modify: [`package.json`](file:///home/sahana/Code_Repository/personal/familytree/package.json) (add `test` and `test:e2e` scripts)

- [ ] **Step 1: Install Playwright dependencies with Bun**
  ```bash
  bun add -d @playwright/test
  bunx playwright install chromium
  ```
- [ ] **Step 2: Create `playwright.config.ts`**
  - Configure `webServer` to launch `bun run dev -- --host` on port 5173.
  - Target Chromium browser.
  - Set test directory to `e2e/`.
- [ ] **Step 3: Update `package.json` scripts**
  - `"test": "bun test"`
  - `"test:e2e": "playwright test"`

---

### Task 11: Implement Exhaustive E2E Test Suites
**Files:**
- Create: `e2e/tree-navigation.spec.ts`
- Create: `e2e/member-filtering.spec.ts`
- Create: `e2e/crud-workflows.spec.ts`
- Create: `e2e/persistence-and-share.spec.ts`

- [ ] **Step 1: Implement `e2e/tree-navigation.spec.ts`**
  - Canvas initial load: tree nodes render with gender borders.
  - Focus node verification: Helda Rusmadi is centered with NO "FOKUS" label.
  - Node click isolation: clicking a canvas node centers the node, but does NOT open the sidebar.
  - Detail button action: clicking the "Detail" button on a node card opens the sidebar directly to that person's Detail tab.
- [ ] **Step 2: Implement `e2e/member-filtering.spec.ts`**
  - Open sidebar, navigate to "Anggota" tab.
  - Test member list sorted ascending by birth year.
  - Test gender filter pills (`Semua`, `L`, `P`).
  - Test deceased filter pills (`Semua`, `Hidup`, `Alm.`).
  - Test Birth Year Combobox: verify click opens dropdown, verify search input functions, verify at most 10 items are displayed at any time.
  - Test filter reset button restores all items.
- [ ] **Step 3: Implement `e2e/crud-workflows.spec.ts`**
  - Add new person via `+ Tambah Anggota` modal, save, verify appearance in tree and members list.
  - Add relative via node hover action (+ Pasangan, + Anak, + Ortu).
  - Verify validation prevents adding a 3rd biological parent.
  - Edit person profile details, save, verify card updates.
  - Delete person, confirm modal, verify tree nodes and relationships are removed.
- [ ] **Step 4: Implement `e2e/persistence-and-share.spec.ts`**
  - Switch between light and dark modes, reload page, verify dark mode preference is preserved.
  - Open Share Modal, verify link generation, copy to clipboard trigger.
  - Switch language to English (`EN`) and Indonesian (`ID`), verify UI labels update accurately.

---

### Task 12: Documentation & Execution Instructions
**Files:**
- Modify: [`README.md`](file:///home/sahana/Code_Repository/personal/familytree/README.md)

- [ ] **Step 1: Document testing workflows in `README.md`**
  - Instructions for running unit tests: `bun run test`
  - Instructions for running E2E tests: `bun run test:e2e`
  - Explanation of E2E zero-execution rule during Phase 1 development.
  - Guide on updating the Graphify knowledge graph: `graphify extract .`

---

## Verification Plan

### Automated Checks
- Static compilation: `bun run build`
- Unit tests: `bun run test` (triggered ONLY during pre-commit gate Phase 2 or when explicitly requested)
- E2E tests: `bun run test:e2e` (triggered ONLY during pre-commit gate Phase 2 full verification)

### Manual Verification Checkpoints
1. Verify LOC limits:
   - `wc -l src/App.tsx src/pages/FamilyTreePage.tsx` <= 100 LOC.
   - `wc -l src/components/sidebar/*.tsx` each <= 200–250 LOC.
2. Verify tree behavior:
   - Canvas node click centers without expanding sidebar.
   - Node "Detail" button opens sidebar to detail view.
   - Focus node has zero "FOKUS" text.
   - Birth year combobox displays at most 10 items.
3. Verify Graphify knowledge graph:
   - `graphify-out/graph.json` contains full repository index, excluding dotfiles and gitignored files.
