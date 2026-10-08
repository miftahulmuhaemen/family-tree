# Keyset (Cursor) Pagination Standard

Standards to eliminate the deep pagination problem and prevent heavy database scans across collection endpoints.

## 1. Deep Pagination Problem & Prohibition of OFFSET

1. **Prohibition of OFFSET**:
   - `OFFSET N LIMIT M` is prohibited on collection endpoints.
   - **Reason**: `OFFSET N` forces the database engine to traverse, sort, and process all `N + M` rows from disk/index, only to discard the first `N` rows. As datasets grow and clients paginate deeper, latency and disk I/O scale linearly ($O(N)$), causing buffer cache churn, high CPU consumption, and database performance degradation.
2. **Prohibition of Listing COUNT(*)**:
   - `COUNT(*)` queries are prohibited inside collection listing endpoints.
   - Computing `total_records` and `total_pages` requires full-table or wide-range index scans on every request, defeating pagination performance gains.

## 2. Keyset (Cursor) Pagination Specification

1. **Composite Ordering & Tie-Breaker**:
   - All collection queries must sort by `(created_at DESC, id DESC)` (or equivalent monotonic column + unique primary key).
   - The unique primary key `id` (e.g. UUIDv7) is mandatory as a deterministic tie-breaker to prevent skipped or duplicate items when multiple records share identical timestamps.
2. **Seek Predicate**:
   - Queries must seek directly to the cursor coordinates using an index seek:
   ```sql
   WHERE (
     created_at < $cursor_time 
     OR (created_at = $cursor_time AND id < $cursor_id)
   )
   ORDER BY created_at DESC, id DESC
   LIMIT $limit + 1
   ```
3. **B-Tree Index Requirement**:
   - Every paginated table must have a composite B-tree index matching the sort order and soft-delete filter:
   ```sql
   CREATE INDEX idx_<table>_paging ON <table> (created_at DESC, id DESC) WHERE deleted_at IS NULL;
   ```
4. **HasNext Detection (LIMIT + 1)**:
   - Query `limit + 1` rows.
   - If returned rows equal `limit + 1`, pop the last row, set `has_next = true`, and encode the last returned item's `(created_at, id)` into `next_cursor` (opaque URL-safe string, e.g. base64).
   - If returned rows are `<= limit`, set `has_next = false` and `next_cursor = null`.

## 3. Standardized Response Envelope

Collection endpoints must return metadata without `page`, `total_records`, or `total_pages`:
```json
{
  "data": [],
  "meta": {
    "limit": 10,
    "next_cursor": "MjAyNi0wOS0wMVQxNDozMDowMFosMTIzNDU2",
    "has_next": true
  }
}
```

- Allowed limits: default **10**, maximum **100** (clamped by backend).

## 4. Aggregate Metrics Separation

- When business requirements require displaying aggregate totals (e.g. total items in catalog, active staff count), use dedicated summary endpoints (e.g., `GET /api/<resource>/summary`).
- Never attach count queries to collection listing endpoints.

## 5. Frontend UI Guidelines

1. **Numberless Navigation**:
   - Use "Sebelumnya" (Previous) and "Berikutnya" (Next) controls only.
   - Do not render numbered page buttons (1, 2, 3...) that imply random-access page jumping.
2. **No Collection Count Badges**:
   - Do not place count badges on collection navigation tabs unless backed by separate cached/summary counters.
