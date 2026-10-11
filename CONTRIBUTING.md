# Contributing to Family Tree Visualizer & Editor

Thank you for your interest in contributing to the project. Please follow these guidelines to set up your local development environment and submit changes.

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
     - Authorized JavaScript origins: `http://localhost:5173` and your staging/production domain.
   - **API Key**:
     - Restricted to HTTP referrers matching your application domains.

### 2. Application Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/miftahulmuhaemen/family-tree.git
   cd family-tree
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Provide your credentials in `.env`:
   ```env
   VITE_GOOGLE_API_KEY=your-api-key
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   VITE_GOOGLE_PROJECT_ID=your-project-id
   ```

4. **Run development server**:
   ```bash
   bun run dev
   ```
   Open `http://localhost:5173` in your browser.

## Verification & Build Commands

Before submitting pull requests, ensure all checks pass:

- **Static build compilation**:
  ```bash
  bun run build
  ```
- **Automated unit tests**:
  ```bash
  bun test
  ```
- **Playwright E2E tests**:
  ```bash
  bun run test:e2e
  ```
- **Linting**:
  ```bash
  bun run lint
  ```

## Pull Request Guidelines

1. **Branch Naming**: Use descriptive branch names with conventional prefixes (`feat/`, `fix/`, `chore/`, `docs/`).
2. **Commit Messages**: Follow Conventional Commits format (`type(scope): description`).
   - `feat(...)`: New features and enhancements
   - `fix(...)`: Bug fixes and error resolutions
   - `refactor(...)`: Restructuring without functional changes
   - `test(...)`: Test additions or adjustments
   - `docs(...)`: Documentation and guide updates
3. **Keep PRs Focused**: Keep pull requests focused on a single feature or bug fix to simplify review.
