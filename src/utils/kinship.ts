type Edge = { source: string; target: string; type?: string };

export type RelationshipType = 
  | 'Diri Sendiri' 
  // Lineal
  | 'Orang Tua' | 'Ayah' | 'Ibu' | 'Ayah Angkat' | 'Ibu Angkat'
  | 'Anak' | 'Putra' | 'Putri' | 'Anak Angkat'
  | 'Kakek' | 'Nenek'
  | 'Cucu' | 'Cucu Laki-laki' | 'Cucu Perempuan'
  | 'Buyut' | 'Cicit'
  | 'Canggah' | 'Wareng'
  // Collateral (Siblings, Uncles, Cousins)
  | 'Saudara Kandung' | 'Saudara Laki-laki' | 'Saudara Perempuan'
  | 'Paman' | 'Bibi'
  | 'Keponakan' | 'Keponakan Laki-laki' | 'Keponakan Perempuan'
  | 'Sepupu'
  | 'Cucu Keponakan'
  // Affinal (In-Laws)
  | 'Suami' | 'Istri'
  | 'Mertua' | 'Menantu'
  | 'Ipar' 
  | 'Besan'
  | 'Mantan Suami' | 'Mantan Istri'
  | 'Kakek Mertua' | 'Nenek Mertua'
  | 'Sepupu Ipar'
  | 'Cucu Menantu' | 'Cicit Menantu'
  | 'Kakek Buyut' | 'Nenek Buyut'
  | 'Kerabat' | '';

// --- Graph Helpers ---

// returns { children: Map<id, childIds[]>, parents: Map<id, parentIds[]>, spouses: Map<id, {partnerId, type}[]> }
function buildGraph(edges: Edge[]) {
    const children = new Map<string, string[]>();
    const parents = new Map<string, string[]>();
    const spouses = new Map<string, { id: string; type: string }[]>();

    edges.forEach(e => {
        // Parent-Child edges (default or explicitly 'parent' or 'foster_parent')
        if (!e.type || e.type === 'parent' || e.type === 'foster_parent') {
            const parentId = e.source;
            const childId = e.target;

            if (!parents.has(childId)) parents.set(childId, []);
            parents.get(childId)!.push(parentId);

            if (!children.has(parentId)) children.set(parentId, []);
            children.get(parentId)!.push(childId);
        } else {
            // Spouse edges
            // Undirected concept, but stored directed.
            const a = e.source;
            const b = e.target;
            const type = e.type;

            if (!spouses.has(a)) spouses.set(a, []);
            spouses.get(a)!.push({ id: b, type });

            if (!spouses.has(b)) spouses.set(b, []);
            spouses.get(b)!.push({ id: a, type });
        }
    });

    return { children, parents, spouses };
}

// Find all ancestors with their distance (Steps UP)
function getAncestors(startNode: string, parentMap: Map<string, string[]>) {
    const ancestors = new Map<string, number>(); // id -> steps up
    const queue: { id: string; dist: number }[] = [{ id: startNode, dist: 0 }];
    ancestors.set(startNode, 0);

    while (queue.length > 0) {
        const { id, dist } = queue.shift()!;
        const pars = parentMap.get(id) || [];
        for (const p of pars) {
            if (!ancestors.has(p)) {
                ancestors.set(p, dist + 1);
                queue.push({ id: p, dist: dist + 1 });
            }
        }
    }
    return ancestors;
}

// --- Coordinate System Logic ---

function getBloodCoordinates(povId: string, targetId: string, parentMap: Map<string, string[]>) {
    if (povId === targetId) return { up: 0, down: 0, lca: povId };

    const ancsA = getAncestors(povId, parentMap);
    const ancsB = getAncestors(targetId, parentMap);

    let bestLCA: string | null = null;
    let minSum = Infinity;
    let bestUp = -1;
    let bestDown = -1;

    // Iterate intersection
    for (const [ancId, upDist] of ancsA.entries()) {
        if (ancsB.has(ancId)) {
            const downDist = ancsB.get(ancId)!;
            const sum = upDist + downDist;
            // Examples:
            // Sibling: Up 1, Down 1. Sum 2.
            // Parent: Up 1, Down 0. Sum 1.
            // We want closest connection.
            if (sum < minSum) {
                minSum = sum;
                bestLCA = ancId;
                bestUp = upDist;
                bestDown = downDist;
            }
        }
    }

    if (bestLCA) return { up: bestUp, down: bestDown, lca: bestLCA };
    return null;
}

function mapBloodToTerm(up: number, down: number, gender?: string): RelationshipType | null {
    // Lineal (Direct Ancestors/Descendants)
    if (down === 0) {
        if (up === 0) return 'Diri Sendiri';
        if (up === 1) return gender === 'female' ? 'Ibu' : 'Ayah';
        if (up === 2) return gender === 'female' ? 'Nenek' : 'Kakek';
        if (up === 3) return 'Buyut';
        if (up === 4) return 'Canggah';
        if (up === 5) return 'Wareng';
        return 'Kerabat'; // Too high
    }
    if (up === 0) {
        if (down === 1) return gender === 'female' ? 'Putri' : 'Putra';
        if (down === 2) return gender === 'female' ? 'Cucu Perempuan' : 'Cucu Laki-laki';
        if (down === 3) return 'Cicit';
        return 'Kerabat';
    }

    // Collateral
    // Sibling: 1, 1
    if (up === 1 && down === 1) return gender === 'female' ? 'Saudara Perempuan' : 'Saudara Laki-laki';

    // Uncle/Aunt: Up 2, Down 1 (Parent's Sibling)
    if (up === 2 && down === 1) return gender === 'female' ? 'Bibi' : 'Paman';

    // Nephew/Niece: Up 1, Down 2 (Sibling's Child)
    if (up === 1 && down === 2) return gender === 'female' ? 'Keponakan Perempuan' : 'Keponakan Laki-laki';

    // Cousin: Up 2, Down 2 (GP's GC)
    if (up === 2 && down === 2) return 'Sepupu';
    if (up === 3 && down === 3) return 'Sepupu'; // Second cousin

    // Great-Uncle/Aunt (Kakek/Nenek): Up 3, Down 1 (GGP's child)
    if (up === 3 && down === 1) return gender === 'female' ? 'Nenek' : 'Kakek';

    // Great-Nephew (Cucu Keponakan): Up 1, Down 3 (Sibling's GC)
    if (up === 1 && down === 3) return 'Cucu Keponakan';
    
    // Cousin Once Removed
    // Up 3, Down 2: Parent's Cousin => Paman/Bibi (Generic)
    if (up === 3 && down === 2) return gender === 'female' ? 'Bibi' : 'Paman';
    // Up 2, Down 3: Cousin's Child => Keponakan (Generic)
    if (up === 2 && down === 3) return gender === 'female' ? 'Keponakan Perempuan' : 'Keponakan Laki-laki';
    
    return 'Kerabat';
}


// Helper to find Uncles/Aunts (Blood)
// Returns list of IDs
function getUnclesAunts(povId: string, parentsMap: Map<string, string[]>, childrenMap: Map<string, string[]>) {
    const pList = parentsMap.get(povId) || [];
    const unclesAunts: string[] = [];
    for (const p of pList) {
        const gpList = parentsMap.get(p) || [];
        for (const gp of gpList) {
            const siblings = childrenMap.get(gp) || [];
            for (const s of siblings) {
                if (s !== p) unclesAunts.push(s);
            }
        }
    }
    return unclesAunts;
}

// --- Main Function ---

export function calculateRelationship(
  povId: string, 
  targetId: string, 
  edges: Edge[], 
  people: { id: string, gender?: string }[]
): RelationshipType | null {
  const { children, parents, spouses } = buildGraph(edges);
  const targetGender = people.find(p => p.id === targetId)?.gender;

  // 1. Direct Spouse Check
  const mySpouses = spouses.get(povId) || [];
  const directSpouse = mySpouses.find(s => s.id === targetId);
  if (directSpouse) {
      if (directSpouse.type === 'married') return targetGender === 'female' ? 'Istri' : 'Suami';
      if (directSpouse.type === 'divorced') return targetGender === 'female' ? 'Mantan Istri' : 'Mantan Suami';
      if (directSpouse.type === 'not_married') return ''; 
  }

  // 2. Blood/Foster Check
  const bloodCoords = getBloodCoordinates(povId, targetId, parents);
  if (bloodCoords) {
      // Check for Direct Foster Relationship
      if (bloodCoords.up === 1 && bloodCoords.down === 0) {
          // Check if explicit foster edge exists
          const edge = edges.find(e => e.source === targetId && e.target === povId && e.type === 'foster_parent');
          if (edge) return targetGender === 'female' ? 'Ibu Angkat' : 'Ayah Angkat';
      }
      if (bloodCoords.up === 0 && bloodCoords.down === 1) {
          // Check if explicit foster edge exists
          const edge = edges.find(e => e.source === povId && e.target === targetId && e.type === 'foster_parent');
          if (edge) return 'Anak Angkat';
      }

      const term = mapBloodToTerm(bloodCoords.up, bloodCoords.down, targetGender);
      if (term && term !== 'Kerabat') return term;
      return 'Kerabat';
  }

  // 3. Affinal (In-Laws) Check
  
  // A) Target is Spouse of my Relative (My Relative -> Target)
  // Check if Target has any spouse 'S' who is related to 'Me'.
  const targetSpouses = spouses.get(targetId) || [];
  for (const s of targetSpouses) {
      if (s.type === 'not_married') continue; // Not-married partners are not in-laws

      const spouseId = s.id;
      const coords = getBloodCoordinates(povId, spouseId, parents);
      if (coords) {
          // I am related to Target's Spouse.
          
          // MAPPING
          // Spouse of Sibling (1,1) -> Ipar
          if (coords.up === 1 && coords.down === 1) return 'Ipar';
          
          // Spouse of Child (0,1) -> Menantu
          if (coords.up === 0 && coords.down === 1) return 'Menantu';
          
          // Spouse of Grandchild (0,2) -> Cucu Menantu
          if (coords.up === 0 && coords.down === 2) return 'Cucu Menantu';
          
          // Spouse of Great-Grandchild (0,3) -> Cicit Menantu
          if (coords.up === 0 && coords.down === 3) return 'Cicit Menantu';

          // Spouse of Uncle/Aunt (2,1) -> Paman/Bibi (In-Law)
          if (coords.up === 2 && coords.down === 1) return targetGender === 'female' ? 'Bibi' : 'Paman';

          // Spouse of Great-Uncle/Aunt (3,1) -> Kakek/Nenek (In-Law)
          if (coords.up === 3 && coords.down === 1) return targetGender === 'female' ? 'Nenek' : 'Kakek';

          // Spouse of Cousin (2,2) -> Sepupu Ipar
          if (coords.up === 2 && coords.down === 2) return 'Sepupu Ipar';
      }
  }

  // B) I am Spouse of Target's Relative (My Spouse -> Target)
  // Check if My Spouse is related to Target.
  for (const s of mySpouses) {
      if (s.type === 'not_married') continue;
      
      const mySpouseId = s.id;
      const coords = getBloodCoordinates(mySpouseId, targetId, parents); // relative -> target
      if (coords) {
          // My Spouse is related to Target.
          // I am effectively stepping into my Spouse's shoes.
          
          // Target is Parent of Spouse (1,0) -> Mertua
          if (coords.up === 1 && coords.down === 0) return 'Mertua';
          
          // Target is Grandparent of Spouse (2,0) -> Kakek/Nenek Mertua
          if (coords.up === 2 && coords.down === 0) return targetGender === 'female' ? 'Nenek Mertua' : 'Kakek Mertua';

          // Target is Sibling of Spouse (1,1) -> Ipar
          if (coords.up === 1 && coords.down === 1) return 'Ipar';
          
          // Target is Uncle/Aunt of Spouse (2,1) -> Paman/Bibi
          if (coords.up === 2 && coords.down === 1) return targetGender === 'female' ? 'Bibi' : 'Paman'; // (My husband's uncle is my uncle-in-law)
          
          // Target is Cousin of Spouse (2,2) -> Sepupu Ipar
          if (coords.up === 2 && coords.down === 2) return 'Sepupu Ipar';
          
          // Target is Child of Spouse (0,1) -> Anak Tiri? 
          // If we have children together, they are 0,1 to me too. 
          // If step-child (0,1 to spouse, but unknown to me), usually "Anak".
          if (coords.up === 0 && coords.down === 1) return targetGender === 'female' ? 'Putri' : 'Putra';
      }
  }

  // C) Extended Affinal: Ancestors of Uncle-In-Law (Alya -> Herman/Sastro)
  // Logic: My Aunt -> Spouse (Uncle-in-Law) -> Parent (Herman) / GP (Sastro).
  const myUnclesAunts = getUnclesAunts(povId, parents, children);
  for (const uaId of myUnclesAunts) {
      const uaSpouses = spouses.get(uaId) || [];
      for (const s of uaSpouses) {
          if (s.type === 'not_married') continue;
          
          const inLawId = s.id;
          const coords = getBloodCoordinates(inLawId, targetId, parents); // UncleInLaw -> Target
          if (coords) {
             // Target is Parent of UncleInLaw (1,0) -> Kakek/Nenek
             if (coords.up === 1 && coords.down === 0) return targetGender === 'female' ? 'Nenek' : 'Kakek';
             // Target is GP of UncleInLaw (2,0) -> Buyut
             if (coords.up === 2 && coords.down === 0) return 'Buyut';
             
             // Target is Sibling of UncleInLaw (1,1) -> Paman/Bibi
             if (coords.up === 1 && coords.down === 1) return targetGender === 'female' ? 'Bibi' : 'Paman';
          }
      }
  }

  // D) Besan Check (My Child -> Spouse -> Target)
  // I have a child. That child has a spouse. That spouse has a parent (Target).
  // Iterate my children
  const myChildren = children.get(povId) || [];
  for (const childId of myChildren) {
      const childSpouses = spouses.get(childId) || [];
      for (const cs of childSpouses) {
          if (cs.type === 'not_married') continue;
          
          // Is Target a parent of this spouse?
          const spouseParents = parents.get(cs.id) || [];
          if (spouseParents.includes(targetId)) return 'Besan';
          
          // Extended Besan: Grandparents of spouse?
          const spouseAncestors = getAncestors(cs.id, parents); 
          // Target is ancestor of spouse
          if (spouseAncestors.has(targetId)) {
              const dist = spouseAncestors.get(targetId)!;
              if (dist >= 1) return 'Besan'; // Parent(1), GP(2)... all Besan
          }
          
          // Extended Besan: Siblings of Spouse? (My Child's Brother-In-Law)
          // Not strictly Besan, but often treated as family.
      }
  }

  // Fallback
  return 'Kerabat';
}
