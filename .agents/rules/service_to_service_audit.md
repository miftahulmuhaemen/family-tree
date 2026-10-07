# Service-to-Service Contract Integrity and Interaction Testing Standards

Strict architectural rules governing frontend-to-backend contract alignment, interactive control traceability, production mock data prohibition, and automated interaction testing across all applications:

---

## 1. The 5-Point Full-Chain Traceability Standard

Every interactive UI control that filters, searches, sorts, or paginates data displayed in a table or list must satisfy an unbroken 5-point contract chain:

```
[1. UI Component] ──> [2. Data Hook / Fetcher] ──> [3. HTTP Handler] ──> [4. Domain Service] ──> [5. Database Query]
   Control State           Serialized Payload          Param Ingestion         Business Method         SQL WHERE Clause
```

### Traceability Rules
1. **Control-to-Request Completeness**:
   - Every input, select dropdown, checkbox, date range picker, or toggle must bind to component state and be serialized into the outgoing HTTP request (`params` for GET, JSON body for POST/PUT/PATCH).
   - If an interactive control exists in the UI but its value is omitted from the request payload, it is a contract defect.
2. **Strict Handler Ingestion**:
   - Backend HTTP handlers must explicitly bind and validate all incoming query and body parameters.
   - **Prohibition of Silent Parameter Dropping**: Backend routing frameworks must never silently ignore parameters sent by the client. Unbound parameters or silent drops are strictly prohibited.
3. **Service Layer Propagation**:
   - Service interfaces and implementations must accept the parameter and enforce domain validation (e.g. valid range, valid enum, ownership).
   - Parameters must not be discarded or dropped at the service boundary.
4. **Database Query Binding (Anti-Fake Parameter Rule)**:
   - The repository query must bind the parameter via a parameter placeholder (`$N`, `?`) in a `WHERE`, `JOIN`, or `HAVING` clause.
   - Accepting a parameter in the API handler without a corresponding database filter condition is prohibited.
5. **Response Consistency & Rendering**:
   - The backend response must return only data matching the query parameters.
   - The frontend view must render the response directly. Local state or client caches must never override or mask server-returned filtered datasets.

---

## 2. Exhaustive Full-Matrix E2E Interaction Coverage

Automated End-to-End (E2E) testing must cover every interactive element that changes request parameters or table responses. Superficial test assertions are strictly prohibited.

### Strict E2E Coverage Requirements
1. **Interactive Control Coverage**:
   - Every table and list page containing filters, searches, dropdowns, date pickers, or toggles must have automated E2E test cases exercising each control.
   - Testing only default rendering or checking that rows exist (`expect(rows.first()).toBeVisible()`) without exercising interactive controls is prohibited.
2. **Filter & Mutation Verification Pattern**:
   - Every filter E2E test must follow this sequence:
     a. Load page and assert initial baseline row count or content.
     b. Interact with the control (select option, type search query, set date range).
     c. Intercept the outgoing network request and assert that the serialized query parameter is present and correct.
     d. Assert that table rows update to reflect only records matching the selected filter.
     e. Reset or change the filter and assert that the table updates accordingly.
3. **Multi-Channel State Mutation Coverage**:
   - When a workflow supports multiple operational paths (e.g. multiple payment channels, multiple approval actions, multiple status transitions), every path must have a dedicated E2E test scenario verifying database persistence and audit log entry.

---

## 3. Zero Tolerance for Production Mock and Dummy Data

Shipping mock, placeholder, or dummy data to production pages is strictly prohibited.

### Rules
1. **Prohibition of Production Mocks**:
   - Mock data structures, dummy product arrays, hardcoded placeholder lists, and fallback items are prohibited in production source code (`src/**` excluding test directories).
   - Mock datasets are permitted exclusively in:
     - Unit and integration tests (`*.test.*`, `*.spec.*`).
     - Test harness setup (`src/setupTests.*`).
     - Offline operational database seed files (`src/db/seed.*`) used strictly for initializing local operational stores.
2. **Mandatory Explicit Empty States**:
   - When an API returns an empty dataset (`[]`, `null`) or local operational tables contain zero records, components must return `[]` and render an explicit empty state component (`TableEmptyState` or `EmptyCard`).
   - Conditional fallbacks that inject dummy arrays when data is empty (`if (!data || data.length === 0) return [dummy1, dummy2]`) are strictly forbidden.
3. **Automated Static Scanning**:
   - Pre-commit checks must scan production directories for hardcoded dummy object arrays and fail compilation if detected.

---

## 4. Single Source of Truth for Global Configuration & Identity

Client branding, organization identity, contact details, and system-wide configuration strings must never be duplicated across multiple views or components.

### Rules
1. **Centralized Configuration Module**:
   - All organization titles, names, addresses, contact information, and global constants must reside in a single, typed configuration module (`src/config/branding.*` or `src/config/app.*`).
   - All layout headers, sidebars, print templates, login screens, and export sheets must import directly from this centralized module. Inline hardcoding is prohibited.
2. **Automated Regression Guard**:
   - Every centralized configuration property must have a dedicated unit test and E2E visual/text assertion verifying that rendered surfaces display the centralized values.
   - Any accidental overwrite or regression during large refactors must immediately break the test suite.
3. **Diff-Boundary Auditing on Large Changes**:
   - For pull requests modifying more than 10 files, diff boundaries must be audited against ticket scope. Files modified outside the explicit scope of the change must be rejected.

---

## 5. Storage Boundary: Authoritative Server vs. Offline Client Cache

Applications combining online and offline capabilities must maintain strict separation between operational front-line caches and authoritative administrative records.

### Rules
1. **Front-Line Operational Scope for Client Storage**:
   - Client-side storage (IndexedDB, Dexie, local caches) is restricted strictly to front-line operational workflows that must survive network disconnection (e.g. cashier point-of-sale checkout).
2. **Strict Server-Authoritative Requirement for Management & Audit**:
   - Administrative, financial, reporting, and audit screens must query the authoritative backend database directly.
   - Administrative views must never query or fall back to client-side offline storage.
   - If the backend is unreachable during an administrative operation, the interface must display an explicit network error state. Fabricating figures or falling back to local browser cache for administrative views is strictly prohibited.
3. **Contract Strictness for Enums and Filter Groups**:
   - Abstract filter categories (e.g. group filters that match multiple underlying types) must never be accepted as valid persisted values for new records.
   - Record creation and mutation endpoints must enforce specific, unambiguous enum values. Grouping aliases are permitted exclusively as read-only query filter parameters.
