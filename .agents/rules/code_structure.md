# Code Structure & Modularization Guidelines

Strict rules for maintaining code organization, readability, maintainability, and Single Responsibility Principle (SRP) across the repository:

## 1. Universal English-Only Naming Conventions

All codebase identifiers, files, and directory structures across both Frontend and Backend must be written in **English only**:
1. **Directories & Folders**: Must use kebab-case or standard English names (e.g., `src/components/stock-management/`, `src/components/cashier/`, `src/components/staff/`). Never use non-English terms in folder names.
2. **Files**: All filenames (components, pages, hooks, utilities, repositories, services, handlers, migrations, tests) must be named in English (e.g., `Cashier.tsx`, `useStockManagement.ts`, `ProductHeader.tsx`, `transaction_service.go`).
3. **Functions, Methods, Variables, & Hooks**: Must use English naming (e.g., `fetchStockHistory`, `handleCheckout`, `useProducts`, `calculateDiscountAmount`).
4. **Types, Interfaces, & Classes**: Must use PascalCase English identifiers (e.g., `StockMovementItem`, `PaymentSummaryProps`).
5. **Exception**: User-facing UI display copy, mock receipt text, and localization dictionary values in `i18n.ts` may contain Indonesian language as needed for local business operations.

---

## 2. Frontend Architecture Standards (React / TypeScript)

All frontend feature development and refactoring must adhere to a strict 3-tier modular separation:

### A. File Size & Responsibility Limits
1. **Page Orchestrator Containers (`src/pages/*.tsx`)**:
   - Must not exceed **100 lines of code (LOC)**.
   - Responsible strictly for composing subcomponents, hooking up state/actions, and high-level routing wrappers (e.g. `PullToRefresh`).
   - Must **never** include inline API requests, direct Dexie IndexedDB queries, complex data formatting algorithms, or multi-nested JSX trees.
2. **Presentational / Feature Subcomponents (`src/components/<feature>/*.tsx`)**:
   - Must be grouped by English feature directory (e.g., `src/components/staff/`, `src/components/cashier/`, `src/components/stock-management/`, `src/components/stock-opname/`, `src/components/products/`, `src/components/reports/`, `src/components/transactions/`).
   - Maximum recommended size: **200–250 lines**.
   - Each component must have a focused single responsibility (e.g., a dedicated modal, filter bar, card grid, or data table).
   - Must accept typed TypeScript props and callbacks; avoid tightly coupled global side-effects.
3. **Design System Primitives (`src/components/ui/`)**:
   - Reserved purely for reusable, headless/styled UI primitives (e.g., `Button`, `Card`, `Table`, `Dialog`, `DropdownMenu`).
   - Do not place domain-specific logic or feature data structures inside `src/components/ui/`.

### B. Custom Hooks Layer (`src/hooks/use<Feature>.ts`)
1. All business logic, state management (`useState`, `useReducer`), asynchronous network queries (`axios`), local storage access, Dexie/IndexedDB queries (`useLiveQuery`), metric derivations (`useMemo`), and filtering/pagination must be extracted into dedicated custom hooks in English (e.g., `useProducts.ts`, `useCashier.ts`, `useStockManagement.ts`).
2. Every custom hook must export clean TypeScript interfaces for:
   - State data structures and parameters.
   - Return values (state items, computed metrics, action functions).
3. Every custom hook should have a corresponding unit test file (`src/hooks/use<Feature>.test.ts`) covering initial state, query handling, and offline fallback paths.

---

## 3. Backend Architecture Standards (Go)

Backend services must adhere to a clean layered architecture with clear boundaries:

### A. Layered Structure
1. **Entities Layer (`entities/`)**: Pure domain models, database entity definitions, and DTOs. Must not contain database queries or business operations.
2. **Repositories Layer (`repositories/`)**:
   - Must define interfaces for all data-access methods to facilitate mocking and dependency injection.
   - Struct implementations must strictly perform database queries (GORM/SQL) without embedding business decisions.
   - Strict one-file-per-entity convention (e.g., `product_repository.go`, `category_repository.go`, `user_repository.go`).
3. **Services Layer (`services/`)**:
   - Contains all domain business logic, validations, stock calculations, authorization checks, and transaction boundaries.
   - Interacts only with repository interfaces, never raw HTTP contexts.
4. **Handlers / Controllers Layer (`v1/api/`)**:
   - Thin HTTP adapters (maximum **80–100 lines per handler file**).
   - Responsible only for request binding, input validation, calling the appropriate service method, and formatting JSON responses.
5. **Dependency Injection & Containers (`v1/container/`)**:
   - Maintain dedicated container initializers (`Initialize*Api`) for wiring repositories, services, and API handlers.
   - Keep interface definitions (`I*Api`, `I*Service`, `I*Repository`) to enforce loose coupling and modular testability.

### B. Entity-Per-File Separation
- Models, migrations, seeders, repositories, and handlers must be split into dedicated files per database table or domain entity.
- Never combine multiple distinct entities into generic omnibus files.

---

## 4. Database Layer Structure
- **Frontend Dexie**: Keep database schema definitions (`schema.ts`), Dexie instance initialization (`db.ts`), and baseline seed data (`seed.ts`) in dedicated modules under `src/db/`.
- **Backend Migrations**: Keep SQL schema migrations versioned and isolated in `backend/migrations/`.
- **Strict Single-Table Migration Isolation**:
  - Every single SQL migration file (`.up.sql` and `.down.sql`) must strictly modify, create, index, or alter **only ONE single database table**.
  - NEVER combine schema modifications, index creations, or table declarations across multiple tables into a single migration file.
  - If changes involve multiple tables, create sequentially numbered, dedicated migration files per table (e.g. `000026_add_transactions_indexes`, `000027_add_transaction_details_indexes`, `000028_add_products_indexes`).

---

## 5. Tooling & Runtime Standard (Bun)
- **Frontend Package Manager & Runtime**: Always use `bun` (e.g., `bun install`, `bun add`, `bun run dev`, `bun run build`, `bun test`, `bunx`).
- **Prohibited**: Do not use `npm`, `npx`, `yarn`, or `pnpm`.

---

## 6. Test File Modularity & Naming Standard

1. **Strict 1-to-1 Mapping for Logic Files**: Every file containing executable logic, service workflows, or HTTP handlers must have a matching `{{source_filename}}_test.go` (Go) or `{{source_filename}}.test.tsx` (TypeScript/React).
2. **Prohibit Shared Test Files & Shared Mocks**:
   - Every test file must be 100% self-contained.
   - Do NOT create shared mock files (e.g., `mock_test.go`), shared test suites, or omnibus test files (e.g., `api_test.go`, `repo_test.go`, `svc_test.go`, `ProductModals.test.tsx`).
   - Define test doubles and mocks locally inside the specific test file that needs them.
3. **Exclusion of Definition-Only Files**: Files containing only struct declarations, type aliases, interface definitions, or simple constructors without branching logic (e.g. `opname.go`, `supplierapi.go`, repository constructors) must NOT have tests.
4. **Mandatory Table-Driven Test Pattern**: Every Go unit test must use table-driven tests (`tests := []struct{ name string; ... }`) testing:
   - **Positive Cases**: Happy paths, valid state changes, and expected returns.
   - **Negative Cases**: Validation failures, database/repository errors, and unauthorized access.
   - **Edge Cases**: Zero/empty values, auto-generated fallbacks (UUIDs, timestamps, formatted numbers), and boundary conditions.

---

## 7. Prohibit Emitting Compiled Binaries to Workspace

1. **Compilation Verification Standard**: When checking that Go code compiles, never run bare `go build .` which creates executable binaries in the source tree. Always compile to `/dev/null`:
   ```bash
   go build -o /dev/null .
   ```
2. **Prohibit Residual Artifacts**: Never leave compiled binaries, executables, or test output files (e.g. `koperasi`, `server`, `*.exe`, `*.test`, `coverage.out`) in the repository working directory. If temporary artifacts are generated for coverage analysis, clean them up immediately after inspection.

---

## 8. VS Code Launch Configuration (`.vscode/launch.json`)

1. **Mandatory Configuration File**: The repository MUST always have `.vscode/launch.json` present. If it does not exist, create it immediately.
2. **Standard Configurations**:
   - `Launch Backend`: Go debugger (`delve`) targeting `${workspaceFolder}/backend`, loading `${workspaceFolder}/backend/.env`, with `dlvFlags: ["--check-go-version=false"]`.
   - `Launch Frontend (Dev Server)`: Node terminal running `bun run dev` in `${workspaceFolder}/frontend`.
   - `Launch Frontend (Chrome)`: Chrome debugger attaching to `http://localhost:5173`.
   - `Run Migrations (Up)` & `Run Migrations (Down)`: Go debugger for `${workspaceFolder}/backend/cmd/migrate` with `-dir=up` and `-dir=down`.
   - Compound `Launch Fullstack (Backend + Frontend)`: Combines backend and frontend dev server launch.

