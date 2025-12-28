# Family Tree Visualizer & Editor

Interactive family tree builder with editor and automatically visualize it. You can share it safely with your family members without worrying about the privacy, to take it further you can deploy it yourself.

## Features

*   **Interactive Visualization**: Automatic hierarchical layout. Pan, zoom, and explore family connections.
*   **Real-time Editor**: Integrated Monaco Editor for live YAML editing with syntax highlighting and validation.
*   **Secure Sharing**:
    *   **Share**: Generate unique, shareable links for your family tree configurations.
    *   **Edit Token Security**: Each new share generates a private **Edit Token**. This token is required to update the configuration later, preventing unauthorized changes.
*   **Privacy & Control**:
    *   **Read-Only Mode**: Viewers without the token can explore but not modify your tree.
    *   **Lock/Unlock**: Easily toggle editing permissions using your token.
*   **Friendly UI**:
    *   **Dark Mode**: A sleek, dark-themed editor sidebar.
    *   **Responsive Design**: Collapsible, resizable sidebar and mobile-friendly layout.
    *   **Kinship Logic**: Relationship calculation (parent, child, spouse, etc.).

## Project Structure 

*   **`src/`**: The React frontend application.
    *   `src/components/`: UI components (EditorSidebar, ShareSuccessModal, etc.).
    *   `src/utils/`: Logic for parsing YAML and calculating layouts.
*   **`worker.js`**: Cloudflare Worker script. Handles API requests, R2 storage, and authentication.
*   **`wrangler.toml`**: Configuration file for the Cloudflare Worker and R2 bucket binding.
*   **`env`**: Environment variables file.
*   **`public/`**: Static assets and default `family.yaml`.

## Development Setup

### Prequisites

*   **Node.js** (v20+) & **npm**
*   **Cloudflare Account** (for Workers & R2)
*   **Wrangler CLI**: `npm install -g wrangler`

### 1. Backend Setup (Cloudflare Worker)

The backend manages storage and security.

1.  **Login to Cloudflare**:
    ```bash
    npx wrangler login
    ```

2.  **Create R2 Bucket**:
    Create a bucket named `familytree` in your Cloudflare dashboard or via CLI:
    ```bash
    npx wrangler r2 bucket create familytree
    ```

3.  **Start Local Worker**:
    Run the worker locally to test API endpoints.
    ```bash
    npx wrangler dev
    ```
    *Note the local URL usually provided, e.g., `http://localhost:8787`.*

4.  **Deploy Worker**:
    Deploy the worker to the edge.
    ```bash
    npx wrangler deploy
    ```
    *Copy your deployed Worker URL (e.g., `https://family-tree-worker.your-subdomain.workers.dev`).*

### 2. Frontend Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Configuration**:
    Create a `.env` file in the root directory:
    ```bash
    cp .env.example .env
    ```
    Update `VITE_WORKER_URL` with your **Deployed Worker URL** (or local URL for dev).
    ```env
    VITE_WORKER_URL=https://your-worker-name.workers.dev
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to view the app.

## Deployment

### Frontend Deployment

Build the static site:
```bash
npm run build
```
The output will be in the `dist/` folder. You can deploy this folder to any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages).

**Deploying to Cloudflare Pages (Recommended):**
```bash
npx wrangler pages deploy dist --project-name my-family-tree
```

or connect to your repository and let the CI/CD handle it.

## Security Note

*   **Edit Tokens**: The system generates an "Edit Token" for every new file. **This token is stored in the browser but is NOT recoverable if lost.** Always save your tokens or keep the link with the generated ID safe.
*   **Storage Limits**: The worker forces a limit of 100 objects to prevent abuse. You can modify this in `worker.js`.
