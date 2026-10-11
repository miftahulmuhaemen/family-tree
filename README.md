<p align="center">
  <img src="src/assets/sanak_log.webp" alt="Sanak Keluarga" width="480" />
</p>

# Family Tree Management & Visualization

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deployed on Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deployed-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Interactive family tree management and visualization platform built with React and Vite. It focuses on intuitive family lineage management and exploration, with optional GEDCOM support for interoperability with external genealogy tools.

## Features

- **Standard GEDCOM 5.5.1 Compatibility**: Bi-directional parsing and serialization of genealogical records using industry-standard GEDCOM 5.5.1 specification (`INDI`, `FAM`, `NAME`, `SEX`, `BIRT`, `DEAT`, `HUSB`, `WIFE`, `CHIL`, `MARR`, `DIV`, `PEDI foster`).
- **Interactive Visual Canvas**: Automatic hierarchical layout engine with orthogonal generational connectors, multi-parent and spouse lines, and smooth pan and zoom controls.
- **Dual Mode Interface & Live Code Editor**: Interactive canvas editing alongside an integrated Monaco editor buffer with two-way synchronized graph validation and clean read-only public preview mode.
- **Private On-Device Storage**: Client-side execution storing records locally in IndexedDB without accounts, passwords, or server telemetry.
- **Direct Google Drive Sync & Sharing**: Save and sync trees directly to personal Google Drive storage, browse via Google Picker, and share read or edit links with family members.
- **Kinship & Perspective Relationship Finder**: Multi-branch graph traversal resolving genealogical connections between any two individuals (lineal, collateral, affinal) and perspective-based addressing to determine what a chosen person calls everyone else in the tree.
- **Rich Profiles & Direct Family Contact**: Preserve detailed member records including burial places, residential addresses, phone numbers, WhatsApp shortcuts, and Google Maps navigation coordinates.
- **Regional & Customary Kinship Titles**: Cultural address rules resolving traditional kinship titles across Indonesian ethnic traditions (Banjar, Dayak, Javanese, Sundanese, Minang, Batak).

## Future Features

- **Expanded Regional Kinship Dictionaries**: Further expansion of localized address forms and dialect variants across Nusantara traditions ([#7](https://github.com/miftahulmuhaemen/family-tree/issues/7)).

## Contributing & Development

Contributions are welcome! Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for local environment setup, Google Cloud credentials configuration, verification commands, and pull request guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
