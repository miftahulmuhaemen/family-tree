# Family Tree Visualizer & Editor

Interactive genealogy family tree builder and hierarchical visualizer built with React and Vite. It uses standard GEDCOM (5.5.1 / 7 compatible) as its native data representation, ensuring compatibility with industry-standard genealogy platforms (Ancestry.com, FamilySearch, Gramps, MyHeritage).

## Features

- **Standard GEDCOM Data Model**: Bi-directional parsing and serialization of genealogical data using industry-standard GEDCOM 5.5.1 specification (`INDI`, `FAM`, `NAME`, `SEX`, `BIRT`, `DEAT`, `HUSB`, `WIFE`, `CHIL`, `MARR`, `DIV`, `PEDI foster`).
- **Interactive Tree Visualization**: Automatic hierarchical tree layout with multi-parent, spouse, and sibling navigation. Pan, zoom, and focus on specific family branches.
- **Dual Mode Interface**:
  - **Editor Mode**: Interactive node-to-node editing, adding relatives, editing profile attributes, and real-time GEDCOM code editing.
  - **Public Preview Mode**: Clean, read-only viewing experience for sharing with family members without editing controls.
- **Integrated Code Editor**: Real-time Monaco editor for direct GEDCOM code inspection and editing with synchronized graph validation.
- **Zero-Backend Google Drive Storage**:
  - **Direct Save & Sync**: Save and update GEDCOM files directly into the user's Google Drive via Google Identity Services (GIS) and Google Drive REST API v3.
  - **Google Picker Integration**: Browse and select existing `.ged` files directly from Google Drive.
  - **Shareable Links**: Generate share links (`?driveId={fileId}`) with Google Drive public viewer/editor permissions.
  - **Access Level Detection**: Real-time indicator displaying active file name and authorization level (Editor vs Viewer Only).
- **Rich Person Metadata**: Support for full names, birth dates, deceased status, burial places, phone numbers, WhatsApp indicators, addresses, Google Maps links, and custom attributes.
- **Kinship Logic & Search**: Relationship calculation engine (parents, children, spouses, siblings, in-laws) and comprehensive member filtering (gender, alive/deceased status, birth year).

## Project Structure

- **`src/`**: React frontend application
  - `src/components/`: Modular UI components (FamilyTree, EditorSidebar, ControlPanel, modals).
  - `src/hooks/`: Custom state hooks (`useTreeData`, `useGoogleDriveTree`, `useMemberFilters`, etc.).
  - `src/services/`: Google Drive API client (`googleDriveService.ts`).
  - `src/utils/`: Core utilities (`gedcom.ts` parser/serializer, `branchLayout.ts`, `kinship.ts`, `date.ts`).
  - `src/types/`: TypeScript domain definitions (`family.ts`, `google.d.ts`).
- **`public/`**: Static assets and default demo dataset (`family.ged`).

## Development Setup

### Prerequisites

- **Bun** (v1.0+)
- **Google Cloud Console Project** with Google Drive API and Google Picker API enabled

### 1. Google Cloud Console Configuration

1. **Enable APIs**:
   - Google Drive API
   - Google Picker API

2. **Configure OAuth Consent Screen**:
   - Scope: `https://www.googleapis.com/auth/drive.file`

3. **Create Credentials**:
   - **OAuth 2.0 Client ID** (Web application):
     - Authorized JavaScript origins: `http://localhost:5173` and your production domain.
   - **API Key**:
     - Restricted to HTTP referrers matching your application domains.

### 2. Application Setup

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Provide your Google API credentials:
   ```env
   VITE_GOOGLE_API_KEY=your-api-key
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   VITE_GOOGLE_PROJECT_ID=your-project-id
   ```

3. **Run Development Server**:
   ```bash
   bun run dev
   ```
   Open `http://localhost:5173` to access the application.

## Verification & Build Commands

- **Static Build Compilation**:
  ```bash
  bun run build
  ```
- **Automated Unit Tests**:
  ```bash
  bun test
  ```
- **Playwright E2E Tests**:
  ```bash
  bun run test:e2e
  ```
- **Knowledge Graph Maintenance**:
  ```bash
  graphify extract .
  ```

## GEDCOM Data Specification

The application serializes family data according to the Lineage-Linked GEDCOM standard:

```gedcom
0 HEAD
1 SOUR FamilyTreeApp
2 VERS 1.0.0
1 GEDC
2 VERS 5.5.1
2 FORM LINEAGE-LINKED
1 CHAR UTF-8
0 @helda_rusmadi@ INDI
1 NAME Helda /Rusmadi/
1 SEX M
1 BIRT
2 DATE 6 NOV 1964
1 FAMS @FAM_helda_rusmadi_rusidah@
0 @rusidah@ INDI
1 NAME Rusidah
1 SEX F
1 BIRT
2 DATE 11 AUG 1975
1 FAMS @FAM_helda_rusmadi_rusidah@
0 @miftahul_muhaemen@ INDI
1 NAME Miftahul /Muhaemen/
1 SEX M
1 BIRT
2 DATE 9 MAY 1997
1 FAMC @FAM_helda_rusmadi_rusidah@
0 @FAM_helda_rusmadi_rusidah@ FAM
1 HUSB @helda_rusmadi@
1 WIFE @rusidah@
1 MARR
1 CHIL @miftahul_muhaemen@
0 TRLR
```

## Security & Permissions Model

- **Scope Principle of Least Privilege**: The application requests only the `https://www.googleapis.com/auth/drive.file` scope, granting access exclusively to files created or opened by this app—never the user's broader Google Drive contents.
- **Access Control & Permissions**: File access levels (Editor vs Viewer) follow Google Drive's native permission model, managed directly through Google Drive REST API.
- **Client-Side Direct Storage**: No intermediate backend or database is involved; all data is exchanged directly between the browser and Google APIs over HTTPS.
