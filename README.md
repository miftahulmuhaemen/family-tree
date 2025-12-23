# Family Tree Static Website

A static website to visualize family trees using React Flow and ELK.js. Data is sourced from local YAML files.

## Features

- **Hierarchical Layout**: Automatic tree layout using `elkjs`.
- **Interactive Viewer**: Pan and zoom support (React Flow).
- **Kinship Logic**: Click on a node to switch POV and see relationship terms (e.g., "Uncle", "Nephew") relative to the selected person.
- **Read-Only**: Nodes are locked in place but the canvas is interactive.

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

### Building for Production

To build the static site:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Running the Built Application

You can preview the built application locally using Vite's preview command:

```bash
npm run preview
```

Or serve the `dist/` folder using any static file server (e.g., `serve`, `python -m http.server`, nginx).

## Data Configuration

Edit `public/family.yaml` to update the family tree data. The schema matches:

```yaml
people:
  - id: "p1"
    name: "Name"
    gender: "male" # or "female"
    birthDate: "YYYY-MM-DD"
    photo: "url/to/photo.jpg" # Optional
relationships:
  - type: "parent"
    from: "parent_id"
    to: "child_id"
```
