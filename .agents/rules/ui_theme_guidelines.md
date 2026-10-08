# Universal Multi-Theme Support Guidelines

All user interface components in this application MUST strictly support all active themes:
1. **Default Theme** (`data-theme="default"`)
2. **Neumorphism Theme** (`data-theme="neumorphism"`)

## Requirements for Any Component Modification or Creation:
- **Zero Hardcoded Flat Styles**: Never hardcode fixed border colors, backgrounds, or flat box-shadows without providing their corresponding neumorphic elevation counterparts.
- **Semantic Neumorphic Tokens**: Use semantic tokens defined in `src/index.css` (`--neu-base`, `--neu-surface`, `--neu-raised`, `--neu-pressed`, `--neu-male`, `--neu-female`, `--neu-deceased`) or Tailwind variants (`data-[theme=neumorphism]:...`).
- **4-State Matrix Verification**: Always verify visual contrast and accessibility across all 4 matrix permutations:
  1. Default Light
  2. Default Dark
  3. Neumorphism Light (Soft Porcelain Alabaster)
  4. Neumorphism Dark (Obsidian Graphite)
- **High-Contrast Text Guarantee**: Maintain WCAG AAA contrast ratios. Neumorphic text must remain crisp and readable; never wash out typography into low-contrast gray.
- **GSAP Interactive Animations**: All physical UI interactions (hover micro-elevation, click/press depression, toggle transitions, drawer sliding, modal pop-ins) must use GSAP (`gsap`, `@gsap/react`) with scoped cleanup (`useGSAP`).
- **Anti-Slop Restraint**: Zero perpetual pulsing loops, zero generic rainbow gradients, and zero decorative orbs. All animation and tactile surfaces must serve a clear functional UX purpose.
