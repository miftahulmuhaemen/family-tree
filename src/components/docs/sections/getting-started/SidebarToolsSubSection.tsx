import { DocsSection } from '../../DocsSection';
import sidebarMembersImg from '@/assets/Screenshot 2026-10-11 023900.png';
import gedcomEditorImg from '@/assets/Screenshot 2026-10-11 023947.png';

export function SidebarToolsSubSection() {
  return (
    <DocsSection id="sidebar-tools" title="Sidebar & GEDCOM Editor">
      <div className="space-y-6">
        <p className="text-foreground leading-relaxed text-base">
          The workspace sidebar houses the member directory search engine and the raw GEDCOM code buffer.
          Both panels synchronize bi-directionally with the visual canvas in real time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Members Directory & Filtering */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-center p-3 rounded-md border border-border bg-muted/20">
                <img
                  src={sidebarMembersImg}
                  alt="Sidebar members directory with search bar, filters, and member list"
                  className="max-h-72 w-auto object-contain rounded"
                />
              </div>
              <h4 className="font-semibold text-base text-foreground">
                Members Directory & Search Tools
              </h4>
              <ul className="space-y-2 text-sm text-foreground">
                <li>
                  <strong>Members Tab</strong>: Displays total indexed individuals count in the active tree.
                </li>
                <li>
                  <strong>Search Field</strong>: Instant live text search matching against given names and surnames.
                </li>
                <li>
                  <strong>Filter Dropdowns</strong>: Refine records by Gender, Vital Status (Alive / Deceased), and Birth Year cohorts.
                </li>
                <li>
                  <strong>Reset Button</strong>: Quickly clears all active filter parameters.
                </li>
                <li>
                  <strong>Interactive Member Cards</strong>: Displays name, gender, birth year, and status. Clicking any card automatically centers the canvas on that relative.
                </li>
              </ul>
            </div>
          </div>

          {/* GEDCOM Code Editor */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-center p-3 rounded-md border border-border bg-muted/20">
                <img
                  src={gedcomEditorImg}
                  alt="GEDCOM Code editor tab showing syntax check, save button, and code editor"
                  className="max-h-72 w-auto object-contain rounded"
                />
              </div>
              <h4 className="font-semibold text-base text-foreground">
                GEDCOM Code Editor Buffer
              </h4>
              <ul className="space-y-2 text-sm text-foreground">
                <li>
                  <strong>Validation Check Indicator</strong>: Real-time validator checking syntax against standard GEDCOM 5.5.1 specifications.
                </li>
                <li>
                  <strong>Save Button</strong>: Commits manual text edits in the buffer and recalculates the visual family tree layout.
                </li>
                <li>
                  <strong>Syntax-Highlighted Editor</strong>: Line numbers and formatting for genealogical tags including INDI, FAM, BIRT, and DEAT.
                </li>
                <li>
                  <strong>Minimap Radar</strong>: Scroll overview in the right margin for traversing large family data structures.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
}

export default SidebarToolsSubSection;
