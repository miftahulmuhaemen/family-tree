# Structured Logging and Traceability Standards

Strict architectural standards for backend logging, correlation tracing, and error propagation across the application:

## 1. Logger Engine & Formatting
1. **Standard Library `log/slog`**:
   - All backend application and request logging must use Go's standard library `log/slog`.
   - Third-party loggers (e.g. `logrus`, `zap`, `zerolog`) or unformatted `log.Printf` / `fmt.Println` are prohibited for runtime logging.
2. **Environment-Driven Output Format**:
   - **Production (`APP_ENV=production` or `ENV=production`)**: Logs must output single-line JSON format via `slog.NewJSONHandler`.
   - **Development / Local**: Logs output human-readable text format via `slog.NewTextHandler`.
3. **Always-On Request Logging**:
   - HTTP request logging must remain enabled across all environments (including development and production).

## 2. Request Tracing & Context Propagation
1. **Request ID Generation & Propagation**:
   - Every incoming HTTP request must have an associated `X-Request-ID`.
   - If incoming request contains a valid `X-Request-ID` header, preserve it; otherwise generate a new UUIDv7.
   - The request ID must be returned in the HTTP response header `X-Request-ID`.
2. **Context Binding**:
   - The request ID must be injected into the request `context.Context` under `utils.RequestIDKey`.
   - Handlers and middleware must pass the request context (`c.Request().Context()`) through service and repository layers.
3. **Contextual Log Handler**:
   - The global `slog` logger must be configured with a context-extracting handler (`utils.ContextHandler`).
   - Any log written with `slog.InfoContext`, `slog.ErrorContext`, `slog.WarnContext`, or `slog.DebugContext` must automatically include `"request_id"` when present in the context.

## 3. Single Boundary Logging Pattern
1. **HTTP Boundary Logging**:
   - Errors must be logged once at the outermost HTTP entry boundary (Echo API handler) using `slog.ErrorContext`.
   - Handlers must return sanitized, safe error messages to clients without leaking database queries, internal stack traces, or credentials.
2. **Layered Error Wrapping**:
   - Internal layers (repositories, services) must not log errors they propagate upward.
   - Internal layers must wrap errors using `fmt.Errorf("action context: %w", err)` to preserve causality and error trees.
3. **Non-Fatal Side-Effects**:
   - When a secondary non-fatal operation fails (such as audit logging or telemetry capture), the failure must not be discarded with `_ =`.
   - Non-fatal failures must be logged at `WARN` level using `slog.WarnContext(ctx, "failed to create audit log", "error", err.Error())` without aborting the primary transaction.

## 4. Required Error Log Schema
Structured error logs emitted by the application must contain at minimum:
```json
{
  "time": "2026-09-12T14:00:00.000000+08:00",
  "level": "ERROR",
  "msg": "failed to process transaction",
  "request_id": "0191e4f2-51a0-7f28-895a-c603b55c65f0",
  "error": "pq: duplicate key value violates unique constraint"
}
```

Optional contextual attributes (e.g. `user_id`, `path`, `action`, `entity_type`) should be included whenever relevant to simplify triage and correlation.
