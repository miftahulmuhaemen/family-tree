import { DocsSection } from '../../DocsSection';
import canvasToolbarImg from '@/assets/Screenshot 2026-10-11 023809.png';
import canvasSettingsImg from '@/assets/Screenshot 2026-10-11 023819.png';

interface ShortcutItem {
  action: string;
  keys: string[];
  description: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { action: 'Pan Canvas', keys: ['Space + Drag', 'Mouse Drag'], description: 'Move viewport across workspace' },
  { action: 'Zoom Canvas', keys: ['Wheel', 'Pinch'], description: 'Adjust view magnification scale' },
  { action: 'Fit to Viewport', keys: ['Shift + 1'], description: 'Frame entire tree within visible screen' },
  { action: 'Reset Zoom', keys: ['Ctrl + 0', 'Cmd + 0'], description: 'Restore scale factor to default 100%' },
  { action: 'Toggle Minimap', keys: ['M'], description: 'Show or hide navigation radar in corner' },
];

export function CanvasControlsSubSection() {
  return (
    <DocsSection id="canvas-controls" title="Canvas & Controls">
      <div className="space-y-6">
        <p className="text-foreground leading-relaxed text-base">
          The interactive family tree canvas provides fluid pan, zoom, selection, and viewport management tools
          designed for effortless exploration of complex multi-generational networks.
        </p>

        {/* Floating Controls Bar */}
        <div className="p-4 rounded-lg border border-border bg-card space-y-4">
          <h3 className="font-semibold text-base text-foreground">
            Bottom Floating Control Bar
          </h3>
          <div className="p-3 rounded-md border border-border bg-muted/20 flex items-center justify-center overflow-x-auto">
            <img
              src={canvasToolbarImg}
              alt="Bottom canvas control bar with loaded status, fullscreen, recenter, pointer, hand, zoom slider, settings, and close buttons"
              className="max-h-16 w-auto object-contain rounded"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-foreground">
            <div className="space-y-1.5">
              <p>
                <strong>Status & Sync Timestamp</strong>: Confirms dataset load state and displays the latest save timestamp.
              </p>
              <p>
                <strong>Fullscreen (Expand)</strong>: Maximizes the genealogical graph area to fill the entire monitor.
              </p>
              <p>
                <strong>Recenter View (Reset)</strong>: Re-aligns camera coordinates to focus directly on the active family roots.
              </p>
              <p>
                <strong>Pointer Tool (Select)</strong>: Cursor mode for clicking cards, selecting relationships, and triggering menus.
              </p>
            </div>
            <div className="space-y-1.5">
              <p>
                <strong>Hand Tool (Pan)</strong>: Enables non-destructive free-hand canvas dragging across extensive family trees.
              </p>
              <p>
                <strong>Zoom Slider & Scale</strong>: Smooth zoom controller with increment, decrement, and live percentage readout.
              </p>
              <p>
                <strong>Settings Toggle</strong>: Opens the embedded quick settings toolbar.
              </p>
              <p>
                <strong>Dismiss (X)</strong>: Minimizes or hides the floating dock to maximize screen real estate.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Settings Panel */}
        <div className="p-4 rounded-lg border border-border bg-card space-y-4">
          <h3 className="font-semibold text-base text-foreground">
            Canvas Quick Settings Toolbar
          </h3>
          <div className="p-3 rounded-md border border-border bg-muted/20 flex items-center justify-center overflow-x-auto">
            <img
              src={canvasSettingsImg}
              alt="Canvas quick settings bar with mode, theme, language, and accent controls"
              className="max-h-16 w-auto object-contain rounded"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-foreground">
            <div>
              <p>
                <strong>Mode (Editor / Viewer)</strong>: Switches between full editing capabilities and clean read-only presentation.
              </p>
            </div>
            <div>
              <p>
                <strong>Theme (Default / Neumorphism)</strong>: Toggles between crisp flat surfaces and tactile soft neumorphic elevation.
              </p>
            </div>
            <div>
              <p>
                <strong>Language (EN / ID)</strong>: Switches all interface text between English and Indonesian.
              </p>
            </div>
            <div>
              <p>
                <strong>Accent</strong>: Sets regional nomenclature and linguistic variations for genealogical terms.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="bg-muted px-4 py-2.5 border-b border-border text-sm uppercase tracking-wider text-foreground font-semibold">
            Canvas Shortcuts
          </div>
          <div className="divide-y divide-border text-sm">
            {SHORTCUTS.map((item) => (
              <div key={item.action} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">{item.action}</span>
                  <p className="text-sm text-foreground">{item.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.keys.map((k) => (
                    <kbd key={k} className="px-2.5 py-1 rounded bg-muted border border-border text-xs text-foreground font-medium font-sans">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DocsSection>
  );
}

export default CanvasControlsSubSection;
