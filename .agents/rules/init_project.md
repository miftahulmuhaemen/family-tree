---
trigger: always_on
description: Project initialization checklist incorporating JWT refresh token authentication and all repository architectural, security, and coding standards.
---

# Project Initialization Checklist

Strict checklist for initializing or scaffolding a new project, service, or major subsystem:

## 1. Authentication & Security
- [ ] **JWT Refresh Token Authentication**: Implement JWT authentication using short-lived access tokens accompanied by a secure refresh token rotation mechanism.
- [ ] **Security Dependency Audits**: Enforce baseline dependency vulnerability scanning (`bun audit` on frontend, dependency checks on backend).
- [ ] **Credential and SQL Injection Protection**: Prohibit hardcoded secrets, enforce environment-driven configuration, and require parameterized database queries across all data layers.
- [ ] **Application-Level Rate Limiting**: Implement baseline sliding-window or token-bucket rate limiting across public and authenticated API endpoints.

## 2. API Design & Data Standards
- [ ] **Server-Side Pagination & Clamping**: Enforce clamped pagination on collection endpoints (default: 10 items, maximum: 100 items) with standardized JSON envelope (`data`, `meta`).
- [ ] **Delta Synchronization Boundaries**: Support timestamp-based delta sync (`since`) bounded to a maximum of 1000 items per chunk for offline data synchronization.
- [ ] **Client-Side Storage Boundaries**: Restrict client offline storage (IndexedDB/Dexie) strictly to core operational entities; query administrative, audit, and credential data directly from backend.
- [ ] **UUIDv7 Identifier Standard**: Use UUIDv7 as the default primary key across backend and frontend models; reserve incremental integers strictly for human-facing counters or sequence logs.

## 3. Code Structure & Architecture
- [ ] **Universal English-Only Naming**: Use English exclusively for all directory names, filenames, identifiers, functions, variables, and type definitions.
- [ ] **Frontend 3-Tier Separation**:
  - Page orchestrator containers (`src/pages/*.tsx`) capped at 100 LOC.
  - Presentational and feature subcomponents (`src/components/<feature>/*.tsx`) capped at 200–250 LOC.
  - Headless/styled design primitives isolated in `src/components/ui/`.
- [ ] **Custom Hooks Layer**: Extract all business logic, state management, and network operations into dedicated hooks (`src/hooks/use<Feature>.ts`) with typed interfaces and matching unit tests.
- [ ] **Backend Clean Layered Architecture**: Maintain strict separation across `entities/`, `repositories/` (with interface definitions), `services/`, thin HTTP handlers (`v1/api/`, <= 80–100 LOC), and container initializers (`v1/container/`).
- [ ] **Entity-Per-File Separation**: Isolate each database table or domain model into its own dedicated file across models, repositories, and handlers without omnibus files.
- [ ] **Single-Table Migration Isolation**: Enforce that each SQL migration file (`.up.sql` and `.down.sql`) strictly creates, alters, or indexes exactly one database table.
- [ ] **Expand-Contract Schema Evolution**: Enforce the expand-contract (parallel run) migration standard on deployed environments; prohibit in-place destructive operations (drop/rename column, alter column datatype) without satisfying the Destructive Migration Gate checklist.

## 4. Tooling, Runtime, & Quality Assurance
- [ ] **Tooling & Runtime Standard (Bun)**: Standardize frontend execution and package management exclusively on `bun` (`bun install`, `bun run dev`, `bun test`); prohibit `npm`, `npx`, `yarn`, and `pnpm`.
- [ ] **Self-Contained Test Modularity**: Enforce 1-to-1 test file mapping (`*_test.go`, `*.test.tsx`) with zero shared mocks or omnibus test suites.
- [ ] **Table-Driven Backend Tests**: Implement table-driven tests for Go covering positive, negative, and edge cases.
- [ ] **Production-Grade Exhaustive Testing**: Prohibit MVP shortcut testing. Test suites must cover boundary limits, zero/empty/negative inputs, collisions, validation bypasses, advisory lock contention, and idempotency.
- [ ] **Clean Binary Policy**: Verify Go builds using `go build -o /dev/null .` to prevent emitting compiled binaries or residual coverage artifacts into the workspace.
- [ ] **VS Code Launch Configuration (`launch.json`)**: Ensure `.vscode/launch.json` is always present in the repository root. If it does not exist, immediately create it with standard debugging configurations for Go backend (Delve), frontend dev server (`bun run dev`), frontend Chrome debugging, and database migrations.
- [ ] **Build-Only Verification During Development**: Rely exclusively on static compilation checks (`bun run build`, `go build -o /dev/null .`) during active development. Prohibit running test suites, security audits, and query explains until the Phase 2 Pre-Commit Gate triggered by the user's explicit "commit" command, where the user selects full verification (EXPLAIN + E2E + audit + unit) or standard verification (unit + build).
- [ ] **Over-Engineering Audit Integration**: Integrate `ponytail-review` and `ponytail-audit` in pre-commit workflows while respecting saved architectural decisions.
- [ ] **Minimal Test Coverage Reporting**: Report overall component coverage percentages directly without breakdown metrics unless requested.
- [ ] **Strict Schema-Synchronized Mocking**: Enforce that all test mocks strictly reflect real backend schemas without fabricating artificial properties, and require updating correlated mocks whenever schemas change.
- [ ] **Go Static Code Analysis (`golangci-lint`)**: In Go projects, if static analysis or linting is not yet present, initialize `golangci-lint` (via `.golangci.yml` and `scripts/lint.sh`) enabling exhaustive bug, SAST (`gosec`), concurrency, and error-handling linters.
- [ ] **Go Mutation Testing (`gremlins`)**: In Go projects, if mutation testing is not yet present, initialize `gremlins` (via `.gremlins.yaml` and `scripts/mutation_test.sh`) enabling all 8 AST mutation engines (`CONDITIONALS_BOUNDARY`, `CONDITIONALS_NEGATION`, `INCREMENT_DECREMENT`, `INVERT_LOGICAL`, `INVERT_NEGATIVES`, `INVERT_LOOPCTRL`, `ARITHMETIC_BASE`, `ASSIGNMENT_ARITHMETIC`) in integration mode with an 80%+ efficacy threshold.
- [ ] **Prohibition of Docker-Based Test and Audit Execution**: NEVER run tests, audits, linters, or mutation tests through Docker or Docker Compose containers due to slow build and rebuild cycles. Execute all verification suites natively on the host environment.
- [ ] **Scoped Verification & Non-Code Exemption**: NEVER run tests for non-code/deployment/markdown changes. When changes are isolated to backend, run ONLY backend verification (never frontend/E2E). When changes are isolated to frontend, run ONLY frontend verification (never backend).

## 5. Documentation & Metadata
- [ ] **OpenAPI / Swagger Documentation**: Maintain declarative Swagger doc annotations on all HTTP handlers and automate regeneration to `backend/docs/`.
- [ ] **Knowledge Graph Maintenance**: Initialize and update the graphify knowledge graph using `graphify extract .`.
- [ ] **Professional Tone & Zero Emojis**: Prohibit decorative emojis and conversational filler across documentation, code comments, commit messages, and user-facing copy.
- [ ] **Issue and PR Standards**: Enforce prefix alignment on PR titles and commit messages linked to issues (`fix` for bugs/defects, `feat` for enhancements), append issue numbers (`(#<IssueNumber>)`), and follow structured PR templates.
- [ ] **Post-Deployment Client Refresh Protocol**: Require notifying active users/cashiers to verify pending offline sync, perform a browser hard refresh, and re-authenticate if auth contracts changed.
- [ ] **Safety & Scope Constraints**: Prohibit `sudo`, require confirmation before destructive operations, require explicit plan approval before executing multi-step changes, strictly enforce single-line commands for user CLI execution, strictly prohibit direct access to remote computing resources (VPS/Dokploy) without prior consent based on a full explanation, risk assessment, rollback plan, and zero deviation guarantee, strictly prohibit autonomous `git push` or PR creation without explicit user confirmation, strictly prohibit `browser_subagent`, prohibit autonomous headless Chrome/Puppeteer without prior approval, and standardize interactive browser inspection exclusively on Vercel Agent Browser (`bun x agent-browser`).
