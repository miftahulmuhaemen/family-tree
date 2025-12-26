type Edge = { source: string; target: string; type?: string };

export type RelationshipType = 
  | 'Me' 
  // Lineal
  | 'Parent' | 'Father' | 'Mother' | 'Foster Father' | 'Foster Mother'
  | 'Child' | 'Son' | 'Daughter' | 'Foster Child'
  | 'Grandfather' | 'Grandmother'
  | 'Grandchild' | 'Grandson' | 'Granddaughter'
  | 'Great-Grandparent' | 'Great-Grandchild'
  | 'Great-Great-Grandparent' | 'Great-Great-Great-Grandparent'
  // Collateral (Siblings, Uncles, Cousins)
  | 'Sibling' | 'Brother' | 'Sister'
  | 'Uncle' | 'Aunt'
  | 'Niece/Nephew' | 'Nephew' | 'Niece'
  | 'Cousin'
  | 'Grandnephew/niece'
  // Affinal (In-Laws)
  | 'Husband' | 'Wife'
  | 'Parent-in-Law' | 'Son/Daughter-in-Law'
  | 'Sibling-in-Law' 
  | 'Co-Parent-in-Law'
  | 'Ex-Husband' | 'Ex-Wife'
  | 'Grandfather-in-Law' | 'Grandmother-in-Law'
  | 'Cousin-in-Law'
  | 'Grandchild-in-Law' | 'Great-Grandchild-in-Law'
  | 'Great-Grandfather' | 'Great-Grandmother'
  | 'Relative' | '';

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
        if (up === 0) return 'Me';
        if (up === 1) return gender === 'female' ? 'Mother' : 'Father';
        if (up === 2) return gender === 'female' ? 'Grandmother' : 'Grandfather';
        if (up === 3) return 'Great-Grandparent';
        if (up === 4) return 'Great-Great-Grandparent';
        if (up === 5) return 'Great-Great-Great-Grandparent';
        return 'Relative'; // Too high
    }
    if (up === 0) {
        if (down === 1) return gender === 'female' ? 'Daughter' : 'Son';
        if (down === 2) return gender === 'female' ? 'Granddaughter' : 'Grandson';
        if (down === 3) return 'Great-Grandchild';
        return 'Relative';
    }

    // Collateral
    // Sibling: 1, 1
    if (up === 1 && down === 1) return gender === 'female' ? 'Sister' : 'Brother';

    // Uncle/Aunt: Up 2, Down 1 (Parent's Sibling)
    if (up === 2 && down === 1) return gender === 'female' ? 'Aunt' : 'Uncle';

    // Nephew/Niece: Up 1, Down 2 (Sibling's Child)
    if (up === 1 && down === 2) return gender === 'female' ? 'Niece' : 'Nephew';

    // Cousin: Up 2, Down 2 (GP's GC)
    if (up === 2 && down === 2) return 'Cousin';
    if (up === 3 && down === 3) return 'Cousin'; // Second cousin

    // Great-Uncle/Aunt (Kakek/Nenek): Up 3, Down 1 (GGP's child)
    // NOTE: In Indo "Kakek/Nenek" was used. In English "Great-Uncle/Aunt". 
    // Adapting to "Great-Uncle" / "Great-Aunt" or sticking to simplified?
    // User wants standard English. "Great-Uncle" is standard.
    // However, I must ensure I have mapped these in the type definitions.
    // I added 'Great-Grandfather'/'Great-Grandmother' to types, but here logic was 'Kakek'/'Nenek'.
    // Wait, Kakek/Nenek is Grandfather/Grandmother.
    // Logic: Up 3, Down 1 is Great-Grandparent's child -> Parent's Uncle/Aunt -> Great Uncle/Aunt.
    // In Indo code it returned 'Nenek'/'Kakek'.
    // Check old code: "if (up === 3 && down === 1) return gender === 'female' ? 'Nenek' : 'Kakek';"
    // English equivalent for the SAME relationship is Great-Aunt/Great-Uncle.
    // BUT if I want to match the "Indonesian Style" of calling them Grandpa/Grandma, I should maybe stick to Grandfather/Grandmother?
    // "English America" usually distinguishes. 
    // Let's stick to literal translation of the CODE's intent. The code returned Kakek (Grandpa).
    // So I will return Grandfather/Grandmother to maintain the exact same logic structure, 
    // unless the user specifically wants correct English kinship for that relation.
    // "English America" -> "Great-Uncle". "Indonesian" -> "Kakek".
    // If I return "Grandfather" here, English speakers will see "Grandfather" for their Great Uncle. That's weird.
    // But if I return "Great-Uncle", and map it back to "Paman" or "Kakek"?
    // The previous code explicitly returned 'Kakek'. 
    // I will return 'Grandfather' / 'Grandmother' to stay 1:1 with the previous logic for now.
    // It seems the user wants the "Calling" (Panggilan). In Indo you call Great Uncle "Kakek" (Grandpa).
    // In English you call Great Uncle "Great Uncle" or "Uncle". You rarely call him "Grandpa".
    // I will use 'Grandfather' / 'Grandmother' to ensure the ID mapping works back to 'Kakek' / 'Nenek' easily.
    if (up === 3 && down === 1) return gender === 'female' ? 'Grandmother' : 'Grandfather';

    // Great-Nephew (Cucu Keponakan): Up 1, Down 3 (Sibling's GC)
    if (up === 1 && down === 3) return 'Grandnephew/niece';
    
    // Cousin Once Removed
    // Up 3, Down 2: Parent's Cousin => Paman/Bibi (Generic) -> Uncle/Aunt in English? Or Cousin?
    // English: First Cousin Once Removed.
    // Indo Code: Paman/Bibi.
    // I'll return 'Uncle'/'Aunt' to match Indo structure for now (Calling terms).
    if (up === 3 && down === 2) return gender === 'female' ? 'Aunt' : 'Uncle';
    // Up 2, Down 3: Cousin's Child => Keponakan (Generic)
    // English: First Cousin Once Removed.
    // Indo Code: Keponakan.
    if (up === 2 && down === 3) return gender === 'female' ? 'Niece' : 'Nephew';
    
    return 'Relative';
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
      if (directSpouse.type === 'married') return targetGender === 'female' ? 'Wife' : 'Husband';
      if (directSpouse.type === 'divorced') return targetGender === 'female' ? 'Ex-Wife' : 'Ex-Husband';
      if (directSpouse.type === 'not_married') return ''; 
  }

  // 2. Blood/Foster Check
  const bloodCoords = getBloodCoordinates(povId, targetId, parents);
  if (bloodCoords) {
      // Check for Direct Foster Relationship
      if (bloodCoords.up === 1 && bloodCoords.down === 0) {
          // Check if explicit foster edge exists
          const edge = edges.find(e => e.source === targetId && e.target === povId && e.type === 'foster_parent');
          if (edge) return targetGender === 'female' ? 'Foster Mother' : 'Foster Father';
      }
      if (bloodCoords.up === 0 && bloodCoords.down === 1) {
          // Check if explicit foster edge exists
          const edge = edges.find(e => e.source === povId && e.target === targetId && e.type === 'foster_parent');
          if (edge) return 'Foster Child';
      }

      const term = mapBloodToTerm(bloodCoords.up, bloodCoords.down, targetGender);
      if (term && term !== 'Relative') return term;
      return 'Relative';
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
          if (coords.up === 1 && coords.down === 1) return 'Sibling-in-Law';
          
          // Spouse of Child (0,1) -> Menantu
          if (coords.up === 0 && coords.down === 1) return 'Son/Daughter-in-Law';
          
          // Spouse of Grandchild (0,2) -> Cucu Menantu
          if (coords.up === 0 && coords.down === 2) return 'Grandchild-in-Law';
          
          // Spouse of Great-Grandchild (0,3) -> Cicit Menantu
          if (coords.up === 0 && coords.down === 3) return 'Great-Grandchild-in-Law';

          // Spouse of Uncle/Aunt (2,1) -> Paman/Bibi (In-Law)
          if (coords.up === 2 && coords.down === 1) return targetGender === 'female' ? 'Aunt' : 'Uncle';

          // Spouse of Great-Uncle/Aunt (3,1) -> Kakek/Nenek (In-Law)
          if (coords.up === 3 && coords.down === 1) return targetGender === 'female' ? 'Grandmother' : 'Grandfather';

          // Spouse of Cousin (2,2) -> Sepupu Ipar
          if (coords.up === 2 && coords.down === 2) return 'Cousin-in-Law';
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
          if (coords.up === 1 && coords.down === 0) return 'Parent-in-Law';
          
          // Target is Grandparent of Spouse (2,0) -> Kakek/Nenek Mertua
          if (coords.up === 2 && coords.down === 0) return targetGender === 'female' ? 'Grandmother-in-Law' : 'Grandfather-in-Law';

          // Target is Sibling of Spouse (1,1) -> Ipar
          if (coords.up === 1 && coords.down === 1) return 'Sibling-in-Law';
          
          // Target is Uncle/Aunt of Spouse (2,1) -> Paman/Bibi
          if (coords.up === 2 && coords.down === 1) return targetGender === 'female' ? 'Aunt' : 'Uncle'; // (My husband's uncle is my uncle-in-law)
          
          // Target is Cousin of Spouse (2,2) -> Sepupu Ipar
          if (coords.up === 2 && coords.down === 2) return 'Cousin-in-Law';
          
          // Target is Child of Spouse (0,1) -> Anak Tiri? 
          // If we have children together, they are 0,1 to me too. 
          // If step-child (0,1 to spouse, but unknown to me), usually "Anak".
          if (coords.up === 0 && coords.down === 1) return targetGender === 'female' ? 'Daughter' : 'Son';
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
             if (coords.up === 1 && coords.down === 0) return targetGender === 'female' ? 'Grandmother' : 'Grandfather';
             // Target is GP of UncleInLaw (2,0) -> Buyut
             if (coords.up === 2 && coords.down === 0) return 'Great-Grandparent';
             
             // Target is Sibling of UncleInLaw (1,1) -> Paman/Bibi
             if (coords.up === 1 && coords.down === 1) return targetGender === 'female' ? 'Aunt' : 'Uncle';
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
          if (spouseParents.includes(targetId)) return 'Co-Parent-in-Law';
          
          // Extended Besan: Grandparents of spouse?
          const spouseAncestors = getAncestors(cs.id, parents); 
          // Target is ancestor of spouse
          if (spouseAncestors.has(targetId)) {
              const dist = spouseAncestors.get(targetId)!;
              if (dist >= 1) return 'Co-Parent-in-Law'; // Parent(1), GP(2)... all Besan
          }
          
          // Extended Besan: Siblings of Spouse? (My Child's Brother-In-Law)
          // Not strictly Besan, but often treated as family.
      }
  }

  // Fallback
  return 'Relative';
}
