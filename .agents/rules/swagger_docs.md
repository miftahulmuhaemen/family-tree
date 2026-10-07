# Swagger / OpenAPI API Documentation Rules

Whenever you modify existing backend API endpoints, handlers, request/response models, or add new routes/annotations:

1. Maintain declarative Swagger doc comments (`@Summary`, `@Description`, `@Tags`, `@Security`, `@Param`, `@Success`, `@Failure`, `@Router`) above handler functions in `backend/v1/api/`.
2. Regenerate the Swagger documentation after changes by running:
   ```bash
   cd backend && swag init -g main.go -d ./ -o docs
   ```
3. Ensure the generated files under `backend/docs/` (`docs.go`, `swagger.json`, `swagger.yaml`) are updated and committed alongside code changes.
