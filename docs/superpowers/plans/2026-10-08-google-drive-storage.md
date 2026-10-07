# Google Drive Storage & Zero-Backend Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Cloudflare Worker and R2 backend with a zero-cost, zero-backend Google Drive persistence model using Google Identity Services (GIS), Google Drive REST API v3, and the Google Drive Picker API.

**Architecture:** Client-side Google Identity Services (GIS) token client authenticates the user directly from the browser with `drive.file` scope. Files (`family.ged`) are created, updated, and read via Google Drive API v3. File selection is powered by the Google Picker API modal. Public viewing is supported via Google Drive Permissions API (`role: "reader", type: "anyone"`) and public API key retrieval. This eliminates `worker.js`, Cloudflare R2, custom edit tokens, and hosting state.

**Tech Stack:** React 19, TypeScript, Google Identity Services (`google.accounts.oauth2`), Google Drive API v3, Google Picker API (`gapi.picker`), Vite, Bun.

## Global Constraints
- Prohibit hardcoded secrets; load credentials exclusively via `import.meta.env.VITE_GOOGLE_API_KEY` and `import.meta.env.VITE_GOOGLE_CLIENT_ID`.
- Package management must exclusively use `bun`.
- Static build compilation must pass cleanly via `bun run build` at every task gate.
- Maintain English-only naming for files, identifiers, functions, and types.
- Support dual-theme (Default & Neumorphism) and dual-language (`id` & `en`) across all new UI components.

---

### Task 1: Google Drive Service Layer & Script Loader

**Files:**
- Create: `src/services/googleDriveService.ts`
- Create: `src/services/googleDriveService.test.ts`
- Modify: `index.html` (include GIS & GAPI script tags asynchronously)

**Interfaces:**
- Consumes: `VITE_GOOGLE_API_KEY`, `VITE_GOOGLE_CLIENT_ID` from `import.meta.env`
- Produces: `googleDriveService` with methods:
  - `loadScripts(): Promise<void>`
  - `requestAccessToken(): Promise<string>`
  - `getAccessToken(): string | null`
  - `saveFile(name: string, content: string, existingFileId?: string): Promise<{ id: string; name: string }>`
  - `loadFile(fileId: string): Promise<string>`
  - `openPicker(onSelect: (fileId: string, fileName: string) => void): Promise<void>`
  - `setPublicPermission(fileId: string, role?: 'reader' | 'writer'): Promise<void>`

- [ ] **Step 1: Write unit tests for googleDriveService**

Create `src/services/googleDriveService.test.ts` testing script loading guard, save file (new vs update), load file, and permission grant using mocked `fetch` and Google globals.

- [ ] **Step 2: Add Google scripts to index.html**

Add asynchronous script tags in `index.html` for Google Identity Services (`https://accounts.google.com/gsi/client`) and Google API Client (`https://apis.google.com/js/api.js`).

- [ ] **Step 3: Implement src/services/googleDriveService.ts**

Implement `googleDriveService.ts` with:
- `loadScripts()` checking for `window.google?.accounts?.oauth2` and `window.gapi`.
- `requestAccessToken()` initializing `google.accounts.oauth2.initTokenClient` with scope `https://www.googleapis.com/auth/drive.file`.
- `saveFile()` doing multipart POST when `existingFileId` is undefined and PATCH when `existingFileId` is provided.
- `loadFile()` fetching `https://www.googleapis.com/drive/v3/files/{fileId}?alt=media` using bearer token or API key fallback.
- `openPicker()` building `google.picker.PickerBuilder` with view `DOCS`.
- `setPublicPermission()` calling `POST https://www.googleapis.com/drive/v3/files/{fileId}/permissions`.

- [ ] **Step 4: Run unit tests**

Run: `bun test src/services/googleDriveService.test.ts`
Verify all tests pass.

- [ ] **Step 5: Verify build**

Run: `bun run build`
Verify zero TypeScript or Vite compilation errors.

---

### Task 2: Reactive Hook useGoogleDriveTree

**Files:**
- Create: `src/hooks/useGoogleDriveTree.ts`
- Create: `src/hooks/useGoogleDriveTree.test.ts`

**Interfaces:**
- Consumes: `googleDriveService`, `gedcomContent: string`, `isValid: boolean`, `onGedcomLoaded: (content: string) => void`
- Produces:
  ```typescript
  export interface UseGoogleDriveTreeReturn {
    fileId: string | null;
    fileName: string | null;
    lastSaved: Date | null;
    isSaving: boolean;
    isLoading: boolean;
    isReadOnly: boolean;
    errorMessage: string;
    shareUrl: string | null;
    showShareModal: boolean;
    setShowShareModal: (open: boolean) => void;
    handleSaveToDrive: () => Promise<void>;
    handleOpenPicker: () => Promise<void>;
    handleLoadDriveId: (id: string) => Promise<void>;
    handleShareDriveFile: (role?: 'reader' | 'writer') => Promise<string>;
  }
  ```

- [ ] **Step 1: Write unit tests for useGoogleDriveTree**

Create `src/hooks/useGoogleDriveTree.test.ts` testing URL param detection (`?driveId=...`), saving to Drive, opening picker callback, and sharing.

- [ ] **Step 2: Implement src/hooks/useGoogleDriveTree.ts**

Implement `useGoogleDriveTree.ts`:
- Check URL search params for `driveId` (with backward compatibility fallback for `id`).
- Automatically load file from Google Drive on startup or fallback to `/family.ged`.
- Implement `handleSaveToDrive`: saves or updates `family.ged` on Drive, updates `fileId` state, sets browser URL `?driveId={fileId}`, updates `lastSaved`.
- Implement `handleOpenPicker`: displays Google Picker, on select calls `handleLoadDriveId`.
- Implement `handleShareDriveFile`: grants public read permission, creates shareable URL.

- [ ] **Step 3: Run unit tests**

Run: `bun test src/hooks/useGoogleDriveTree.test.ts`
Verify all tests pass.

- [ ] **Step 4: Verify build**

Run: `bun run build`
Verify zero errors.

---

### Task 3: Localization & UI Integration (Footer, Header, Share Modal)

**Files:**
- Modify: `src/utils/i18n.ts`
- Modify: `src/components/sidebar/SidebarFooter.tsx`
- Modify: `src/components/sidebar/SidebarHeader.tsx`
- Modify: `src/components/ShareSuccessModal.tsx`
- Modify: `src/components/EditorSidebar.tsx`
- Modify: `src/pages/FamilyTreePage.tsx`

**Interfaces:**
- Consumes: `useGoogleDriveTree` from Task 2
- Produces: Integrated Google Drive UI in Editor Sidebar, Header, and Share Modal

- [ ] **Step 1: Add i18n translation keys in src/utils/i18n.ts**

Add keys in English and Indonesian:
- `save_to_drive`: "Save to Google Drive" / "Simpan ke Google Drive"
- `open_from_drive`: "Open from Google Drive" / "Buka dari Google Drive"
- `drive_file`: "Google Drive File" / "Berkas Google Drive"
- `public_view_link`: "Public View Link" / "Tautan Publik (Hanya Lihat)"
- `collaborator_link`: "Collaborator Link" / "Tautan Kolaborator (Edit)"
- `open_in_drive`: "Open in Google Drive" / "Buka di Google Drive"

- [ ] **Step 2: Update SidebarFooter.tsx**

Update footer action button:
- When valid and no fileId: Shows Google Drive cloud/save icon + "Save to Google Drive".
- When fileId exists: Shows Save icon + "Save Changes to Drive".
- Shows `lastSaved` timestamp.

- [ ] **Step 3: Update SidebarHeader.tsx**

Update header actions:
- Replace manual ID popover with direct "Open from Google Drive" button calling `handleOpenPicker`.
- Display active Drive file name or truncated `fileId`.
- Preserve manual ID fallback for sharing links.

- [ ] **Step 4: Update ShareSuccessModal.tsx**

Update modal to show:
- Google Drive shareable application link: `https://.../?driveId={fileId}`.
- Direct link to file in Google Drive: `https://drive.google.com/file/d/{fileId}/view`.
- Share permission selector (Public View vs Contributor).

- [ ] **Step 5: Wire up in FamilyTreePage.tsx & EditorSidebar.tsx**

Replace `useTreeRemote` with `useGoogleDriveTree`. Pass Google Drive handlers down to `EditorSidebar`.

- [ ] **Step 6: Verify build**

Run: `bun run build`
Verify zero errors.

---

### Task 4: Deprecate R2 / Worker & Update Documentation & E2E

**Files:**
- Modify: `e2e/persistence-and-share.spec.ts`
- Modify: `README.md`
- Delete: `worker.js`, `wrangler.toml`, `wrangler.example.toml`
- Delete (or mark deprecated): `src/hooks/useTreeRemote.ts`

- [ ] **Step 1: Update e2e/persistence-and-share.spec.ts**

Update Playwright test to verify presence of Google Drive save/share action in the sidebar.

- [ ] **Step 2: Remove legacy worker files**

Delete unused backend artifacts:
- `worker.js`
- `wrangler.toml`
- `wrangler.example.toml`

- [ ] **Step 3: Update README.md**

Update README documentation:
- Explain the zero-backend architecture.
- Document required environment variables: `VITE_GOOGLE_API_KEY`, `VITE_GOOGLE_CLIENT_ID`.
- Provide setup instructions for Google Cloud Console OAuth & Picker.

- [ ] **Step 4: Verify build**

Run: `bun run build`
Ensure build passes cleanly.

- [ ] **Step 5: Run graphify extract**

Run: `graphify extract .`
Ensure knowledge graph is fully synchronized.
