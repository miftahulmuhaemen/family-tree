# API Design & Data Access Standards

Strict architectural standards for backend APIs, pagination, rate limiting, and client-side data storage across projects:

## 1. Keyset (Cursor) Pagination & Clamping
1. **Mandatory Keyset Cursor Pagination**:
   - Every collection endpoint must enforce keyset cursor pagination (`(created_at DESC, id DESC)`) and prohibited `OFFSET N` queries to eliminate deep pagination performance degradation.
   - Every paginated table must have a composite B-tree index `(created_at DESC, id DESC)` where `deleted_at IS NULL`.
   - `COUNT(*)` queries are prohibited on collection listing requests.
   - Default pagination limit: **10 items**.
   - Maximum allowed pagination limit: **100 items** (clamped automatically by the backend).
   - See `.agents/rules/pagination.md` for full query specifications.
2. **Standardized Response Envelope**:
   - All collection endpoints must return data wrapped in a uniform response envelope:
   ```json
   {
     "data": [],
     "meta": {
       "limit": 10,
       "next_cursor": "base64_encoded_string_or_null",
       "has_next": false
     }
   }
   ```

## 2. Delta Synchronization & Bulk Query Boundaries
1. **Timestamp-Based Delta Sync**:
   - Endpoints designed for offline cache synchronization must accept incremental filters (e.g., `since` timestamp).
2. **Bounded Sync Limit**:
   - Dedicated sync queries must enforce a hard upper bound of **1000 items per chunk** to prevent memory exhaustion and timeout errors.

## 3. Client-Side Storage Scope & Security
1. **Least-Privilege Offline Storage**:
   - Client-side storage (IndexedDB, Dexie, SQLite, local caches) must strictly store only entities required for core offline-resilient workflows.
2. **Direct Backend Querying for Administrative Data**:
   - Administrative records, security logs, audit trails, account credentials, and non-offline operational data must never be mirrored into client-side databases. They must query the backend API directly on demand.

## 4. Application-Level Rate Limiting
1. **Global Rate Limiting**:
   - All public and authenticated API routes must have baseline token-bucket or sliding-window rate limiters enabled by default to prevent query abuse and resource starvation.

## 5. Identifier (ID) Generation Standard
1. **UUIDv7 as Default Primary Key**:
   - All primary key IDs across backend and frontend models, entities, and transactions must use **UUIDv7** by default to enhance security, prevent enumeration attacks, and preserve time-ordered index performance.
   - **Backend**: Use `github.com/google/uuid` via `uuid.NewV7()`.
   - **Frontend**: Use the official `uuid` package via `import { v7 as uuidv7 } from 'uuid'`.
2. **Incremental Identifiers Scope**:
   - Auto-incrementing or sequential integers may only be used for logging, audit sequence tracking, or human-facing reference counters—never as core database primary keys or exposed entity IDs.

