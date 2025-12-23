type Edge = { source: string; target: string };

export type RelationshipType = 
  | 'Diri Sendiri' 
  | 'Orang Tua' 
  | 'Anak' 
  | 'Saudara Kandung' 
  | 'Kakek/Nenek' 
  | 'Cucu' 
  | 'Paman/Bibi' 
  | 'Keponakan' 
  | 'Sepupu' 
  | 'Buyut' 
  | 'Cicit'
  | 'Paman/Bibi Buyut'
  | 'Canggah'
  | 'Wareng'
  | 'Ibu' | 'Ayah' | 'Putra' | 'Putri'
  | 'Saudara Laki-laki' | 'Saudara Perempuan' | 'Nenek' | 'Kakek'
  | 'Cucu Perempuan' | 'Cucu Laki-laki' | 'Paman' | 'Bibi'
  | 'Keponakan Laki-laki' | 'Keponakan Perempuan'
  | 'Mertua' | 'Menantu' | 'Istri' | 'Suami'
  | 'Ipar' | 'Sepupu Ipar' | 'Nenek Mertua' | 'Kakek Mertua'
  | 'Besan' | 'Cucu Keponakan' | 'Cucu Menantu'
  | 'Kerabat';

export function calculateRelationship(
  povId: string, 
  targetId: string, 
  edges: Edge[], 
  people: { id: string, gender?: string }[]
): RelationshipType | null {
  if (povId === targetId) return 'Diri Sendiri';

  // Build adjacency list (undirected for traversal, but tracking direction)
  const parents: Record<string, string[]> = {}; // child -> parents
  const children: Record<string, string[]> = {}; // parent -> children

  edges.forEach(e => {
    if (!children[e.source]) children[e.source] = [];
    children[e.source].push(e.target);
    
    if (!parents[e.target]) parents[e.target] = [];
    parents[e.target].push(e.source);
  });

  // BFS
  const visited = new Set<string>();
  const queue: { id: string; path: string[] }[] = [{ id: povId, path: [] }];

  let shortestPath: string[] | null = null;

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    if (id === targetId) {
      shortestPath = path;
      break;
    }
    visited.add(id);

    // Up (to parents) - mark as 'U'
    const pList = parents[id] || [];
    for (const p of pList) {
        if (!visited.has(p)) queue.push({ id: p, path: [...path, 'U'] });
    }

    // Down (to children) - mark as 'D'
    const cList = children[id] || [];
    for (const c of cList) {
        if (!visited.has(c)) queue.push({ id: c, path: [...path, 'D'] });
    }
  }

  if (!shortestPath) return null;

  const upCount = shortestPath.filter(x => x === 'U').length;
  const downCount = shortestPath.filter(x => x === 'D').length;
  const gender = people.find(p => p.id === targetId)?.gender;

  // Pattern detection
  const pathStr = shortestPath.join('');

  // --- Spouse & In-Laws ---
  
  // Spouse (D->U)
  if (pathStr === 'DU') {
    return gender === 'female' ? 'Istri' : 'Suami';
  }
  // Mertua (D->U->U)
  if (pathStr === 'DUU') return 'Mertua';
  // Kakek/Nenek Mertua (D -> U -> U -> U)
  if (pathStr === 'DUUU') return gender === 'female' ? 'Nenek Mertua' : 'Kakek Mertua'; 
  
  // Besan (Path via Menantu)
  // Menantu is DDU.
  // Parent of Menantu: D D U + U = DDUU.
  if (pathStr === 'DDUU') return 'Besan';
  // Grand-Besan: DDUUU
  if (pathStr === 'DDUUU') return 'Besan';
  // Sibling of Menantu: DDUUD?
  if (pathStr === 'DDUUD') return 'Besan'; // Use Besan loosely for family of in-law

  // Cucu Menantu (Grandchild-in-law): DDDU
  if (pathStr === 'DDDU') return 'Cucu Menantu';
  
  // Besan via Cucu Menantu: DDDUU (Parent of CM), DDDUUD (Sibling of CM)
  if (pathStr === 'DDDUU') return 'Besan';
  if (pathStr === 'DDDUUD') return 'Besan';

  // Menantu (D->D->U)
  if (pathStr === 'DDU') return 'Menantu';

  // Ipar (Sibling-in-law)
  if (pathStr === 'DUUD') return 'Ipar'; // Spouse's Sibling
  if (pathStr === 'UDDU') return 'Ipar'; // Sibling's Spouse

  // Sepupu Ipar (Cousin's Spouse) - Path U-U-D-D-D-U
  if (pathStr === 'UUDDDU') return 'Sepupu Ipar'; 


  // --- Direct Bloodline & Extended Relatives ---
  let isValidStandard = true;
  let switchedToDown = false;
  for (const step of shortestPath) {
      if (step === 'U') {
          if (switchedToDown) { isValidStandard = false; break; }
      } else {
          switchedToDown = true;
      }
  }

  // If strict Up-Down path
  if (isValidStandard) {
      if (upCount === 1 && downCount === 0) return gender === 'female' ? 'Ibu' : 'Ayah';
      if (upCount === 2 && downCount === 0) return gender === 'female' ? 'Nenek' : 'Kakek';
      if (upCount === 3 && downCount === 0) return 'Buyut';
      if (upCount >= 4 && downCount === 0) return 'Canggah'; 

      if (upCount === 0 && downCount === 1) return gender === 'female' ? 'Putri' : 'Putra';
      if (upCount === 0 && downCount === 2) return gender === 'female' ? 'Cucu Perempuan' : 'Cucu Laki-laki';
      if (upCount === 0 && downCount === 3) return 'Cicit';

      if (upCount === 1 && downCount === 1) return gender === 'female' ? 'Saudara Perempuan' : 'Saudara Laki-laki'; 
      
      // Aunt/Uncle logic: (Up N, Down N-1)
      if (upCount === 2 && downCount === 1) return gender === 'female' ? 'Bibi' : 'Paman'; 
      if (upCount === 3 && downCount === 2) return gender === 'female' ? 'Bibi' : 'Paman'; 
      
      // Nephew/Niece logic: (Up N, Down N+1)
      if (upCount === 1 && downCount === 2) return gender === 'female' ? 'Keponakan Perempuan' : 'Keponakan Laki-laki'; 
      if (upCount === 2 && downCount === 3) return gender === 'female' ? 'Keponakan Perempuan' : 'Keponakan Laki-laki';
      
      // Cucu Keponakan (Great-Nephew): Sibling -> Child -> Child (U1 D3)
      if (upCount === 1 && downCount === 3) return 'Cucu Keponakan';

      // Cousin logic: (Up N, Down N) for N >= 2
      if (upCount === 2 && downCount === 2) return 'Sepupu';
      if (upCount === 3 && downCount === 3) return 'Sepupu'; 

      if (upCount === 3 && downCount === 1) return 'Paman/Bibi Buyut'; 
  }
  
  // --- Extended Spouse & In-Law Logic ---
  
  // Rina -> Sri (Aunt via marriage): U U D D U.
  if (pathStr === 'UUDDU') {
      return gender === 'female' ? 'Bibi' : 'Paman';
  }
  
  // Agus -> Dewi (Nephew's Wife): U D D D U.
  if (pathStr === 'UDDDU') return gender === 'female' ? 'Keponakan Perempuan' : 'Keponakan Laki-laki';

  // --- Dewi (Spouse View) ---
  
  // Dewi -> Agus (Husband's Uncle). D U U U D.
  if (pathStr === 'DUUUD') return gender === 'female' ? 'Bibi' : 'Paman';

  // Dewi -> Rina (Husband's Cousin). D U U U D D.
  if (pathStr === 'DUUUDD') return 'Sepupu Ipar';
  
  // Dewi -> Dika (Husband's Cousin's Spouse). DUUUDDDU.
  if (pathStr === 'DUUUDDDU') return 'Sepupu Ipar';

  // Dewi -> Rini (Husband's Cousin's Child). DUUUDDD.
  if (pathStr === 'DUUUDDD') return gender === 'female' ? 'Keponakan Perempuan' : 'Keponakan Laki-laki';
  
  // Dewi -> InLaws (Herman/Sastro): DUUUDDDUU+
  if (pathStr.startsWith('DUUUDDDU')) return 'Besan'; // Distant besan. Or just generic.


  // --- Alya (Gen 4) Perspective on In-Laws ---
  
  // Paman (Dika) from Alya: UUUDDDU
  if (pathStr === 'UUUDDDU') {
      return gender === 'female' ? 'Bibi' : 'Paman';
  }
  // Kakek (Herman) from Alya: UUUDDDU + U
  if (pathStr === 'UUUDDDUU') return gender === 'female' ? 'Nenek' : 'Kakek';

  // Buyut (Sastro) from Alya: UUUDDDU + UU
  if (pathStr === 'UUUDDDUUU') return 'Buyut';

  // Bibi (Sari - Dika's Sister) from Alya: UUUDDDU + UD -> UUUDDDUUD
  if (pathStr === 'UUUDDDUUD') return gender === 'female' ? 'Bibi' : 'Paman';


  // --- Eko (Gen 3) Perspective on In-Laws ---
  
  // Sepupu Ipar (Dika) from Eko: UUDDDU
  if (pathStr === 'UUDDDU') return 'Sepupu Ipar';
  
  // Cousin-in-law's Parent (Herman): UUDDDU + U
  if (pathStr === 'UUDDDUU') return gender === 'female' ? 'Bibi' : 'Paman'; 

  // Cousin-in-law's Grandparent (Sastro): UUDDDU + UU
  if (pathStr === 'UUDDDUUU') return gender === 'female' ? 'Nenek' : 'Kakek'; 

  // Cousin-in-law's Sibling (Sari): UUDDDU + UD
  if (pathStr === 'UUDDDUUD') return 'Sepupu'; 

  return 'Kerabat';
}
