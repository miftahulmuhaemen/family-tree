# Family Tree Visualizer & Editor

Interactive genealogy family tree builder and hierarchical visualizer built with React, Vite, and Cloudflare Workers. It uses standard GEDCOM (5.5.1 / 7 compatible) as its native data representation, ensuring compatibility with industry-standard genealogy platforms (Ancestry.com, FamilySearch, Gramps, MyHeritage).

## Features

- **Standard GEDCOM Data Model**: Bi-directional parsing and serialization of genealogical data using industry-standard GEDCOM 5.5.1 specification (`INDI`, `FAM`, `NAME`, `SEX`, `BIRT`, `DEAT`, `HUSB`, `WIFE`, `CHIL`, `MARR`, `DIV`, `PEDI foster`).
- **Interactive Tree Visualization**: Automatic hierarchical tree layout with multi-parent, spouse, and sibling navigation. Pan, zoom, and focus on specific family branches.
- **Dual Mode Interface**:
  - **Editor Mode**: Interactive node-to-node editing, adding relatives, editing profile attributes, and real-time GEDCOM code editing.
  - **Public Preview Mode**: Clean, read-only viewing experience for sharing with family members without editing controls.
- **Integrated Code Editor**: Real-time Monaco editor for direct GEDCOM code inspection and editing with synchronized graph validation.
- **Secure Remote Sharing**:
  - **Share**: Generate unique, shareable links stored securely in Cloudflare R2.
  - **Edit Token Authorization**: Each share generates an owner edit token required to persist updates to the remote tree, preventing unauthorized modification.
  - **Read-Only Links**: Visitors accessing the link without the edit token can explore the family tree in preview mode.
- **Rich Person Metadata**: Support for full names, birth dates, deceased status, burial places, phone numbers, WhatsApp indicators, addresses, Google Maps links, and custom attributes.
- **Kinship Logic & Search**: Relationship calculation engine (parents, children, spouses, siblings, in-laws) and comprehensive member filtering (gender, alive/deceased status, birth year).

## Project Structure

- **`src/`**: React frontend application
  - `src/components/`: Modular UI components (FamilyTree, EditorSidebar, ControlPanel, modals).
  - `src/hooks/`: Custom state hooks (`useTreeData`, `useTreeRemote`, `useMemberFilters`, etc.).
  - `src/utils/`: Core utilities (`gedcom.ts` parser/serializer, `branchLayout.ts`, `kinship.ts`, `date.ts`).
  - `src/types/`: TypeScript domain definitions (`family.ts`).
- **`worker.js`**: Cloudflare Worker script managing API endpoints, R2 bucket storage, and edit token verification.
- **`wrangler.toml`**: Cloudflare Worker and R2 bucket binding configuration.
- **`public/`**: Static assets and default demo dataset (`family.ged`).

## Development Setup

### Prerequisites

- **Bun** (v1.0+)
- **Cloudflare Account** (for Workers & R2 remote storage)
- **Wrangler CLI**: `npm install -g wrangler`

### 1. Backend Setup (Cloudflare Worker)

1. **Login to Cloudflare**:
   ```bash
   npx wrangler login
   ```

2. **Create R2 Bucket**:
   ```bash
   npx wrangler r2 bucket create familytree
   ```

3. **Start Local Worker**:
   ```bash
   npx wrangler dev
   ```

4. **Deploy Worker**:
   ```bash
   npx wrangler deploy
   ```

### 2. Frontend Setup

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_WORKER_URL` with your Cloudflare Worker endpoint:
   ```env
   VITE_WORKER_URL=https://your-worker-name.workers.dev
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

## Security & Storage Limits

- **Edit Tokens**: Generated per shared tree and required for PUT updates. The token is preserved in the browser's local state.
- **Rate Limiting & Storage Quotas**: Cloudflare Workers enforce storage limits and rate limiting to prevent denial of service and resource exhaustion.
