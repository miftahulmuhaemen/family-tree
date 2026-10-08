# Database Query Optimization and Indexing Standards

Strict architectural standards for database queries, indexing, search patterns, and client-side offline storage:

## 1. Zero Full-Table Scans & Mandatory Warnings
1. **Zero Full-Table Scans ($O(N)$)**:
   - All collection queries, search lookups, delta synchronizations, and reporting aggregations must be backed by appropriate B-Tree or composite indexes.
   - Any query executing an unindexed sequential scan on production tables is strictly prohibited.
2. **Proactive Scan Warnings**:
   - When proposing or reviewing any SQL query, repository method, or schema migration, you must proactively analyze whether the query can utilize an existing index.
   - If an index is missing, you must immediately warn the user and propose the required single-table index migration before implementing the query.

## 2. Strict Ban on Leading Wildcards
1. **Prohibit `%LIKE%` and `%ILIKE%`**:
   - Substring wildcards (`LIKE '%...%'` or `ILIKE '%...%'`) force full table scans by defeating B-Tree index traversal. They are strictly prohibited on core transactional and operational tables.
2. **Prefix Matching with `varchar_pattern_ops`**:
   - Text search on identifiers, names, document numbers, and codes must use prefix matching (`column LIKE $1 || '%'`).
   - The targeted column must have a matching B-Tree index using the `varchar_pattern_ops` operator class (e.g. `CREATE INDEX idx_... ON table(lower(column) varchar_pattern_ops);`).
3. **Exact Matching for Identifiers**:
   - Barcodes, UUIDs, status values, payment methods, and foreign keys must use exact equality matching (`column = $1`).

## 3. Strict Ban on Wrapping Indexed Columns in Functions or Casts
1. **Raw Column Predicates in `WHERE` and `JOIN`**:
   - Never wrap indexed columns in runtime type casts (e.g., `t.id::text ILIKE $1`), functions (e.g., `DATE(created_at) = CURRENT_DATE`), or default fallbacks (e.g., `COALESCE(is_active, true) = $1`) within `WHERE` or `JOIN` clauses.
   - Wrapping a column in a function or cast invalidates standard B-Tree index lookups and forces a sequential scan.
2. **Direct Interval & Type Comparisons**:
   - For timestamp date comparisons, use half-open bounded timestamp ranges on the raw column:
     `created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL '1 day'`.
   - For nullable booleans, use index-safe comparisons:
     `(is_active = $1 OR ($1 = true AND is_active IS NULL))`.
   - Pass strongly-typed parameters directly from application code (e.g. `time.Time`, `uuid.UUID`) rather than casting strings inside SQL.

## 4. Subquery Filter Pushdown & Single-Table Migrations
1. **Pushdown Before `UNION ALL`**:
   - When combining datasets (e.g. stock ins and stock outs in stock history), filter criteria (`product_id`, `created_at`, search prefixes, pagination cursors) must be pushed down into each individual subquery branch *before* the `UNION ALL`.
   - Avoid querying branches that are excluded by request filters (e.g., if filtering for `type = 'in'`, omit `stock_outs` entirely).
2. **Single-Table Migration Isolation**:
   - Each database migration pair (`.up.sql` and `.down.sql`) must strictly create, alter, or index **exactly one** database table. Never combine multi-table schema modifications into a single migration file.

## 5. Client Storage (Dexie) Ephemeral Outbound Queue
1. **Ephemeral Offline Transaction Queue**:
   - Client-side IndexedDB (Dexie) must act strictly as a temporary outbound offline queue for pending transactions and local cache for POS offline resilience.
2. **Immediate Post-Sync Deletion**:
   - Transactions and transaction details must be deleted from client storage immediately upon successful synchronization to the backend.
3. **Direct Server Querying for Historical Data**:
   - Transaction history, reporting aggregations, audit logs, and administrative records must query backend paginated endpoints (`/api/transactions`) directly on demand and must never accumulate indefinitely in client storage.

## 6. PostgreSQL Built-In Query Analysis (`EXPLAIN (ANALYZE, BUFFERS)`)
1. **Mandatory Query Plan Coverage**:
   - For projects backed by PostgreSQL, every single database query across all repositories must be evaluated using PostgreSQL's built-in query analyzer (`EXPLAIN (ANALYZE, BUFFERS)`) to verify index usage, buffer hit/read ratios, and execution plan shapes.
2. **Strict Prohibition on Autonomous Execution During Development**:
   - The agent MUST NEVER run `EXPLAIN` or query analyzer benchmarks autonomously during Phase 1 active development.
3. **Execution Gate**:
   - Query analysis is executed strictly when:
     - The user explicitly instructs to run `EXPLAIN` on queries in chat.
     - Or during the Phase 2 Pre-Commit Gate when the user answers "yes" to running full verification (EXPLAIN + E2E + security audit).

## 7. Expand-Contract Schema Evolution & Destructive Migration Gate

1. **Strict Prohibition on In-Place Destructive Schema Changes**:
   - Once an application is deployed (to staging or production), direct in-place destructive operations (`DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, `ALTER TABLE ... RENAME`, and `ALTER TABLE ... ALTER COLUMN ... TYPE`) are strictly prohibited in a single-phase release.
   - Migrations must never assume zero downtime or instantaneous code synchronization across replicas, containers, or previous release rollbacks.

2. **Prohibition of In-Place Column Datatype Alteration**:
   - `ALTER TABLE ... ALTER COLUMN ... TYPE ...` is strictly prohibited on live tables. In-place type changes acquire an `ACCESS EXCLUSIVE` table lock, force a full table rewrite, risk silent data corruption or conversion crashes, and break backward compatibility with running application containers.
   - **Type Evolution Standard**:
     - Step 1: Add a new column with the target datatype (`NULLABLE`).
     - Step 2: Update application code to dual-write to both old and new columns, and prefer reading from the new column when populated.
     - Step 3: Backfill historical data in bounded asynchronous batches without long-lived table locks.
     - Step 4: Deprecate the old column once verified in production.
     - Step 5: Prune/drop the old column only after passing the Destructive Migration Gate Checklist.

3. **Expand-Contract (Parallel Run) Workflow**:
   - **Phase 1: Expand (Additive & Non-Breaking)**:
     - Add new tables, columns, or indexes.
     - New columns on existing tables MUST be `NULLABLE` or define a safe `DEFAULT` value. Adding `NOT NULL` without a default value is strictly prohibited.
     - Application code is deployed to start writing to new columns while gracefully reading from either old or new.
   - **Phase 2: Transition & Backfill**:
     - Run bounded batch backfill operations if historical rows need conversion.
     - Verify both `main` and `develop` branches are operating on the expanded schema.
     - Remove all application code reading or writing the old schema elements.
   - **Phase 3: Contract (Pruning & Cleanup)**:
     - The old columns, tables, or constraints are marked for removal only after all application code has ceased referencing them.
     - The destructive migration is scheduled and executed strictly under the Destructive Migration Gate Checklist.

4. **Destructive Migration Gate Checklist**:
   Before proposing or executing any migration that drops a column, drops a table, or removes an existing constraint, every single item in this checklist MUST be verified:
   - [ ] **Dual-Branch Code Audit**: Backend and frontend code across **both** `main` and `develop` branches must contain zero occurrences or references (`SELECT`, `INSERT`, `UPDATE`, scan structs, SQL models, types, or API responses) to the dropped target.
   - [ ] **Maintenance Window & Zero Active Users**: Destructive DDL must be scheduled strictly during a designated low-traffic or maintenance window where active traffic/users on the service is zero or near zero, preventing lock queuing and cascading transaction timeouts.
   - [ ] **Explicit Lock Timeout Guard**: Every destructive migration file must explicitly include a short lock timeout (e.g. `SET lock_timeout = '2s';`) at the top of the transaction. If the table lock cannot be acquired within 2 seconds due to concurrent queries, the migration fails immediately rather than queueing and stalling incoming traffic.
   - [ ] **Unscheduled Pre-Migration Backup**: Execute an immediate, unscheduled snapshot before applying the destructive migration and verify the resulting artifact:
     - **Via Dokploy UI**: Open Dokploy > **Databases** > `shared-postgres` > **Backups** tab > click **Backup Now**. Confirm task execution turns green and verify the new `.sql.gz` dump appears in Backblaze B2 with non-zero byte size.
     - **Via Single-Line VPS CLI (Fallback)**: Run `docker exec -t $(docker ps -q -f name=sharedpostgres) pg_dump -U postgres -d <db_name> | gzip > /var/backups/<db_name>_pre_destructive_$(date +%Y%m%d_%H%M%S).sql.gz` and verify file size with `ls -lh /var/backups/`.
   - [ ] **Down-Migration Caveat Acknowledgment**: The `.down.sql` file must explicitly document that dropped data cannot be recovered via rollback and requires restoring from the pre-migration snapshot.


