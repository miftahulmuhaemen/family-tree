import { DocsSection } from '../../DocsSection';
import treeCanvasNodesImg from '@/assets/Screenshot 2026-10-11 023905.png';
import relationshipStatusImg from '@/assets/Screenshot 2026-10-11 023916.png';
import addMemberModalImg from '@/assets/Screenshot 2026-10-11 023836.png';
import addChildNewImg from '@/assets/Screenshot 2026-10-11 023922.png';
import addChildExistingImg from '@/assets/Screenshot 2026-10-11 023930.png';

export function NodeRelationshipsSubSection() {
  return (
    <DocsSection id="node-relationships" title="Node Relationships & Modals">
      <div className="space-y-6">
        <p className="text-foreground leading-relaxed text-base">
          Kinship trees are organized into generational levels connected by clean orthogonal lines.
          Individual nodes, marital unions, and child connections each provide interactive actions and specialized dialogs.
        </p>

        {/* Tree Canvas Nodes & Marriage Junction */}
        <div className="p-4 rounded-lg border border-border bg-card space-y-4">
          <h3 className="font-semibold text-base text-foreground">
            Person Cards and Relationship Actions
          </h3>
          <div className="p-3 rounded-md border border-border bg-muted/20 flex items-center justify-center overflow-x-auto">
            <img
              src={treeCanvasNodesImg}
              alt="Family tree canvas showing male and female nodes, marriage connector with Add Child button, and children"
              className="max-h-72 w-auto object-contain rounded"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground">
            <div>
              <p>
                <strong>Individual Person Card</strong>: Displays person avatar, full name, calculated age, and gender-accented outline (blue for male, pink for female, gray for deceased).
              </p>
              <p className="pt-2">
                <strong>Card Options (Gear Icon)</strong>: Located on the top-left corner of each card. Opens person actions to edit profile details, link parents, or remove nodes.
              </p>
            </div>
            <div>
              <p>
                <strong>Marriage Action Bar</strong>: Placed between spouses. Houses the <strong>+ Child</strong> button to expand descendants and the relationship status selector.
              </p>
              <p className="pt-2">
                <strong>Orthogonal Branching Lines</strong>: Automatically routes parent-to-child connections straight down to descendant cohorts without visual overlaps.
              </p>
            </div>
          </div>
        </div>

        {/* Add / Edit Member Modal & Relationship Status Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add Member Modal */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-center p-3 rounded-md border border-border bg-muted/20">
                <img
                  src={addMemberModalImg}
                  alt="Add Member modal with fields for full name, gender, birth date, deceased toggle, biography, phone numbers, and addresses"
                  className="max-h-72 w-auto object-contain rounded"
                />
              </div>
              <h4 className="font-semibold text-base text-foreground">
                Add / Edit Member Modal
              </h4>
              <ul className="space-y-1.5 text-sm text-foreground">
                <li>
                  <strong>Full Name</strong>: Primary genealogical full name.
                </li>
                <li>
                  <strong>Gender</strong>: Toggles between Male and Female.
                </li>
                <li>
                  <strong>Birth Date</strong>: Sets date of birth with calendar picker.
                </li>
                <li>
                  <strong>Deceased Toggle</strong>: Marks whether the individual has passed away.
                </li>
                <li>
                  <strong>Short Biography</strong>: Free-form historical and biographical notes.
                </li>
                <li>
                  <strong>Phone Numbers & Addresses</strong>: Dynamic items managed via <strong>+ Tambah</strong> buttons.
                </li>
                <li>
                  <strong>Save Changes</strong>: Commits edits to the family tree database.
                </li>
              </ul>
            </div>
          </div>

          {/* Relationship Status Selector */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-center p-3 rounded-md border border-border bg-muted/20">
                <img
                  src={relationshipStatusImg}
                  alt="Relationship status dropdown menu with Married, Divorced, and Not Married options"
                  className="max-h-56 w-auto object-contain rounded"
                />
              </div>
              <h4 className="font-semibold text-base text-foreground">
                Relationship Status Selector
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                Clicking the relationship status indicator on the marriage bar opens this menu to define union types:
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li>
                  <strong>Married</strong>: Standard marital union between spouses.
                </li>
                <li>
                  <strong>Divorced</strong>: Dissolved partnership while retaining shared parental lineage.
                </li>
                <li>
                  <strong>Not Married</strong>: Co-parenting or unmarried domestic partnership.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Child Dialog: Create New vs Select Existing */}
        <div className="p-4 rounded-lg border border-border bg-card space-y-4">
          <h3 className="font-semibold text-base text-foreground">
            Add Child Modal: New vs Existing Member
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            Clicking the <strong>+ Child</strong> button on any marital connector opens the Add Child dialog.
            You can either register a new descendant or connect an existing directory member.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Create New Tab */}
            <div className="p-3 rounded-md border border-border bg-muted/10 space-y-3">
              <div className="flex items-center justify-center p-2 rounded border border-border bg-muted/20">
                <img
                  src={addChildNewImg}
                  alt="Add Child modal - Create New tab"
                  className="max-h-64 w-auto object-contain rounded"
                />
              </div>
              <h4 className="font-semibold text-sm text-foreground">
                Tab: Create New Child
              </h4>
              <ul className="space-y-1 text-sm text-foreground">
                <li>
                  <strong>Parent Relationship</strong>: Confirms target parents.
                </li>
                <li>
                  <strong>Status</strong>: Biological Child vs Foster Child.
                </li>
                <li>
                  <strong>Member Fields</strong>: Input Name, Gender, and Birth Date.
                </li>
                <li>
                  <strong>Simpan Hubungan</strong>: Creates record and links child node.
                </li>
              </ul>
            </div>

            {/* Select Existing Tab */}
            <div className="p-3 rounded-md border border-border bg-muted/10 space-y-3">
              <div className="flex items-center justify-center p-2 rounded border border-border bg-muted/20">
                <img
                  src={addChildExistingImg}
                  alt="Add Child modal - Select Existing tab with member search"
                  className="max-h-64 w-auto object-contain rounded"
                />
              </div>
              <h4 className="font-semibold text-sm text-foreground">
                Tab: Select Existing Member
              </h4>
              <ul className="space-y-1 text-sm text-foreground">
                <li>
                  <strong>Search Filter</strong>: Filter members by typing in <em>Cari anggota yang ada...</em>
                </li>
                <li>
                  <strong>Candidate List</strong>: Shows matching members and birth year.
                </li>
                <li>
                  <strong>Relationship Type</strong>: Choose Biological or Foster connection.
                </li>
                <li>
                  <strong>Simpan Hubungan</strong>: Links the selected person as child without creating duplicate records.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
}

export default NodeRelationshipsSubSection;
