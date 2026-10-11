import { DocsSection } from '../../DocsSection';
import fileMenuDropdownImg from '@/assets/Screenshot 2026-10-11 023952.png';
import loadFileModalImg from '@/assets/Screenshot 2026-10-11 023958.png';
import addMemberCardImg from '@/assets/Screenshot 2026-10-11 023804.png';

export function InitGuideSubSection() {
  return (
    <DocsSection id="getting-started" title="Getting Started Guide">
      <div className="space-y-6">
        <p className="text-foreground leading-relaxed text-base">
          Sanak Studio runs entirely within your web browser. You can start a new blank lineage,
          import existing genealogical files, or load sample datasets to explore features immediately.
        </p>

        {/* 3 Step Workflow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-lg border border-border bg-card space-y-2">
            <h3 className="font-semibold text-base text-foreground">
              01. Initialize Workspace
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Open the File menu in the top-left corner to start a blank canvas, import a file,
              or load a built-in demo family tree.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card space-y-2">
            <h3 className="font-semibold text-base text-foreground">
              02. Create Root Individual
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Click the Add Member starter prompt on the empty canvas to register your primary ancestor
              with birth date, gender, and personal notes.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card space-y-2">
            <h3 className="font-semibold text-base text-foreground">
              03. Connect Generations
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Use marital action bars and node option menus to link spouses, establish biological or foster
              children, and expand generational branches.
            </p>
          </div>
        </div>

        {/* File Actions and Modal Explanation */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-semibold text-foreground">
            File Menu and Data Sources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Menu */}
            <div className="p-4 rounded-lg border border-border bg-card space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-center p-3 rounded-md border border-border bg-muted/20">
                  <img
                    src={fileMenuDropdownImg}
                    alt="File Menu Dropdown with New, Load, Save, Download, and Theme options"
                    className="max-h-56 w-auto object-contain rounded"
                  />
                </div>
                <h4 className="font-semibold text-base text-foreground">
                  File Operations Dropdown
                </h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>
                    <strong>New +</strong>: Clears the workspace and initializes a fresh blank family tree.
                  </li>
                  <li>
                    <strong>Load</strong>: Opens the data source modal to import files from cloud or local drives.
                  </li>
                  <li>
                    <strong>Save to Google Drive</strong>: Saves and synchronizes your active lineage directly to your personal Google Drive.
                  </li>
                  <li>
                    <strong>Download .ged</strong>: Exports and downloads standard GEDCOM 5.5.1 files straight to your device.
                  </li>
                  <li>
                    <strong>Dark Mode</strong>: Toggles high-contrast dark theme for low-light editing sessions.
                  </li>
                </ul>
              </div>
            </div>

            {/* Load Modal */}
            <div className="p-4 rounded-lg border border-border bg-card space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-center p-3 rounded-md border border-border bg-muted/20">
                  <img
                    src={loadFileModalImg}
                    alt="Load Family Tree File modal showing Google Drive, Local File, and Sample Family Tree options"
                    className="max-h-56 w-auto object-contain rounded"
                  />
                </div>
                <h4 className="font-semibold text-base text-foreground">
                  Load Family Tree Modal
                </h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>
                    <strong>Google Drive</strong>: Connects your Google Drive account to open stored genealogical files.
                  </li>
                  <li>
                    <strong>Local File (.ged)</strong>: Imports existing GEDCOM files from your local file system.
                  </li>
                  <li>
                    <strong>Sample Family Tree</strong>: Instantly populates the interactive canvas with sample multi-generation data for testing.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Empty Canvas Starter Card */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 rounded-md border border-border bg-muted/20 shrink-0">
                <img
                  src={addMemberCardImg}
                  alt="Add Member empty canvas prompt card"
                  className="max-h-24 w-auto object-contain rounded"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">
                  Empty Canvas Starter Action
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  When starting with a clean workspace, the canvas displays this interactive Add Member button.
                  Clicking the card opens the Add Member modal so you can establish the initial root individual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
}

export default InitGuideSubSection;
