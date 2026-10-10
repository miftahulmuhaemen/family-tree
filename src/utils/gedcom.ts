import type { FamilyData, Person, Relationship, RelationshipType, DeceasedInfo } from '@/types/family';
import YAML from 'yaml';

const GEDCOM_MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

interface GedcomNode {
  level: number;
  tag: string;
  value: string;
  children: GedcomNode[];
}

interface GedcomRecord {
  xref: string;
  tag: string;
  value: string;
  children: GedcomNode[];
}

/**
 * Format internal date (YYYY-MM-DD or YYYY) into standard GEDCOM date format (e.g. 15 MAY 1980 or 1950)
 */
export function formatGedcomDate(dateStr?: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();

  // Match YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    if (month >= 1 && month <= 12) {
      const monthName = GEDCOM_MONTHS[month - 1];
      return `${day} ${monthName} ${year}`;
    }
  }

  // Match YYYY
  if (/^\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Parse GEDCOM date (e.g. '15 MAY 1980', '1980-05-15', '1950') into internal YYYY-MM-DD format
 */
export function parseGedcomDate(gedDate?: string): string {
  if (!gedDate) return '';
  const trimmed = gedDate.trim();

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Match DD MMM YYYY or D MMM YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,4})\s+(\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const monthName = dmyMatch[2].toUpperCase().slice(0, 3);
    const monthIdx = GEDCOM_MONTHS.indexOf(monthName) + 1;
    if (monthIdx > 0) {
      return `${dmyMatch[3]}-${String(monthIdx).padStart(2, '0')}-${day}`;
    }
  }

  // Match MMM YYYY
  const myMatch = trimmed.match(/^([A-Za-z]{3,4})\s+(\d{4})$/);
  if (myMatch) {
    const monthName = myMatch[1].toUpperCase().slice(0, 3);
    const monthIdx = GEDCOM_MONTHS.indexOf(monthName) + 1;
    if (monthIdx > 0) {
      return `${myMatch[2]}-${String(monthIdx).padStart(2, '0')}-01`;
    }
  }

  // Match just YYYY
  const yearMatch = trimmed.match(/\b(\d{4})\b/);
  if (yearMatch) {
    return `${yearMatch[1]}-01-01`;
  }

  return trimmed;
}

/**
 * Format name with genealogical /Surname/ slash markers
 */
export function formatGedcomName(name?: string): string {
  if (!name) return 'Unknown';
  const trimmed = name.trim();
  if (trimmed.includes('/')) return trimmed;

  const parts = trimmed.split(/\s+/);
  if (parts.length <= 1) return trimmed;

  const surname = parts.pop()!;
  return `${parts.join(' ')} /${surname}/`;
}

/**
 * Parse GEDCOM name, stripping surname markers
 */
export function parseGedcomName(rawName?: string): string {
  if (!rawName) return 'Unknown';
  return rawName.replace(/\//g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Sanitize identifier for GEDCOM xref (@ID@)
 */
function sanitizeXref(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Deduplicate relationships array
 */
export function deduplicateRelationships(relationships: Relationship[]): Relationship[] {
  const seenRel = new Set<string>();
  const deduplicated: Relationship[] = [];

  for (const r of relationships) {
    if (!r || typeof r !== 'object' || !r.type || !r.from || !r.to) continue;
    const key = ['married', 'divorced', 'not_married'].includes(r.type)
      ? `${r.type}:${[r.from, r.to].sort().join('-')}`
      : `${r.type}:${r.from}:${r.to}`;

    if (!seenRel.has(key)) {
      seenRel.add(key);
      deduplicated.push(r);
    }
  }

  return deduplicated;
}

/**
 * Parses GEDCOM standard string into FamilyData.
 * Also provides fallback compatibility for YAML input if encountered.
 */
export function parseGedcom(content: string): FamilyData {
  if (!content || !content.trim()) {
    return { people: [], relationships: [] };
  }

  const trimmed = content.trim();

  // Seamless fallback for YAML input
  if (trimmed.startsWith('people:') || (!trimmed.includes('0 ') && trimmed.includes('people:'))) {
    try {
      const parsed = YAML.parse(trimmed);
      if (parsed && Array.isArray(parsed.people)) {
        return {
          people: parsed.people.filter((p: any) => p && typeof p === 'object'),
          relationships: deduplicateRelationships(parsed.relationships || [])
        };
      }
    } catch {
      // Fall through to GEDCOM parser
    }
  }

  const lines = content.split(/\r?\n/);
  const records: GedcomRecord[] = [];
  let currentRecord: GedcomRecord | null = null;
  const nodeStack: GedcomNode[] = [];

  for (const line of lines) {
    const lineTrimmed = line.trim();
    if (!lineTrimmed) continue;

    // Line format: LEVEL [XREF] TAG [VALUE] or LEVEL TAG [VALUE]
    const match = lineTrimmed.match(/^(\d+)(?:\s+(@[^@]+@))?\s+([A-Za-z0-9_]+)(?:\s+(.*))?$/);
    if (!match) continue;

    const level = parseInt(match[1], 10);
    const xref = match[2] || '';
    const tag = match[3];
    const value = match[4] ? match[4].trim() : '';

    if (level === 0) {
      let recXref = xref;
      let recTag = tag;
      let recVal = value;

      // Handle cases where xref was parsed into tag/value (e.g., 0 INDI @I1@)
      if (!recXref && recVal.startsWith('@') && recVal.endsWith('@')) {
        recXref = recVal;
        recVal = '';
      }

      currentRecord = {
        xref: recXref.replace(/^@|@$/g, ''),
        tag: recTag,
        value: recVal,
        children: []
      };
      records.push(currentRecord);
      nodeStack.length = 0;
    } else if (currentRecord) {
      const newNode: GedcomNode = {
        level,
        tag,
        value,
        children: []
      };

      while (nodeStack.length > 0 && nodeStack[nodeStack.length - 1].level >= level) {
        nodeStack.pop();
      }

      if (nodeStack.length === 0) {
        currentRecord.children.push(newNode);
      } else {
        nodeStack[nodeStack.length - 1].children.push(newNode);
      }

      nodeStack.push(newNode);
    }
  }

  const people: Person[] = [];
  const relationships: Relationship[] = [];

  // 1. Process Individual Records (INDI)
  const indiRecords = records.filter(r => r.tag === 'INDI');
  const fosterChildXrefs = new Set<string>();

  for (const rec of indiRecords) {
    const id = rec.xref;
    if (!id) continue;

    let name = 'Unknown';
    let gender: 'male' | 'female' = 'male';
    let birthDate: string | undefined;
    let deceased: boolean | DeceasedInfo | undefined;
    let short_bio: string | undefined;
    const phone_number: { number: string; is_whatsapp_number: boolean }[] = [];
    const address: { address: string; gmap_link: string }[] = [];
    const additionals: Record<string, string> = {};

    for (const child of rec.children) {
      if (child.tag === 'NAME') {
        name = parseGedcomName(child.value);
      } else if (child.tag === 'SEX') {
        const sexVal = child.value.toUpperCase();
        gender = (sexVal.startsWith('F') || sexVal === 'FEMALE') ? 'female' : 'male';
      } else if (child.tag === 'BIRT') {
        const dateChild = child.children.find(c => c.tag === 'DATE');
        if (dateChild) {
          birthDate = parseGedcomDate(dateChild.value);
        }
      } else if (child.tag === 'DEAT') {
        const dateChild = child.children.find(c => c.tag === 'DATE');
        const placChild = child.children.find(c => c.tag === 'PLAC');
        if (dateChild || placChild) {
          const info: DeceasedInfo = {
            status: true,
            ...(dateChild ? { date: parseGedcomDate(dateChild.value) } : {}),
            ...(placChild ? { place: placChild.value } : {})
          };
          deceased = info;
        } else {
          deceased = { status: true };
        }
      } else if (child.tag === 'NOTE') {
        const noteLines: string[] = [child.value];
        for (const sub of child.children) {
          if (sub.tag === 'CONT') noteLines.push(sub.value);
          else if (sub.tag === 'CONC') noteLines[noteLines.length - 1] += sub.value;
        }
        const fullNote = noteLines.join('\n').trim();
        if (fullNote.includes(':') && !short_bio) {
          const colonIdx = fullNote.indexOf(':');
          const key = fullNote.slice(0, colonIdx).trim();
          const val = fullNote.slice(colonIdx + 1).trim();
          if (key.length > 0 && val.length > 0) {
            additionals[key] = val;
          } else {
            short_bio = short_bio ? `${short_bio}\n${fullNote}` : fullNote;
          }
        } else {
          short_bio = short_bio ? `${short_bio}\n${fullNote}` : fullNote;
        }
      } else if (child.tag === 'PHON') {
        const isWa = child.children.some(c => c.tag === '_WA' && c.value.toUpperCase().startsWith('Y'));
        phone_number.push({ number: child.value, is_whatsapp_number: isWa });
      } else if (child.tag === 'RESI' || child.tag === 'ADDR') {
        let addrStr = child.tag === 'ADDR' ? child.value : '';
        let gmap = '';
        const addrSub = child.children.find(c => c.tag === 'ADDR');
        if (addrSub) addrStr = addrSub.value;
        const gmapSub = child.children.find(c => c.tag === '_GMAP');
        if (gmapSub) gmap = gmapSub.value;
        if (addrStr || gmap) {
          address.push({ address: addrStr, gmap_link: gmap });
        }
      } else if (child.tag === 'FAMC') {
        const pediChild = child.children.find(c => c.tag === 'PEDI');
        if (pediChild && (pediChild.value.toLowerCase().includes('foster') || pediChild.value.toLowerCase().includes('adopt'))) {
          fosterChildXrefs.add(id);
        }
      } else if (child.tag.startsWith('_') && child.value) {
        additionals[child.tag.slice(1)] = child.value;
      }
    }

    const person: Person = {
      id,
      name,
      gender,
      ...(birthDate ? { birthDate } : {}),
      ...(deceased !== undefined ? { deceased } : {}),
      ...(short_bio ? { short_bio } : {}),
      ...(phone_number.length > 0 ? { phone_number } : {}),
      ...(address.length > 0 ? { address } : {}),
      ...(Object.keys(additionals).length > 0 ? { additionals } : {})
    };

    people.push(person);
  }

  // 2. Process Family Records (FAM)
  const famRecords = records.filter(r => r.tag === 'FAM');

  for (const fam of famRecords) {
    let husbId: string | undefined;
    let wifeId: string | undefined;
    let isDivorced = false;
    let isNotMarried = false;
    const children: { id: string; isFoster: boolean }[] = [];

    for (const child of fam.children) {
      if (child.tag === 'HUSB') {
        husbId = child.value.replace(/^@|@$/g, '');
      } else if (child.tag === 'WIFE') {
        wifeId = child.value.replace(/^@|@$/g, '');
      } else if (child.tag === 'DIV') {
        isDivorced = true;
      } else if (child.tag === '_STAT' && child.value.toLowerCase().includes('not_married')) {
        isNotMarried = true;
      } else if (child.tag === 'CHIL') {
        const childId = child.value.replace(/^@|@$/g, '');
        const isFoster = child.children.some(c => c.tag === 'PEDI' && (c.value.toLowerCase().includes('foster') || c.value.toLowerCase().includes('adopt')))
          || fosterChildXrefs.has(childId);
        children.push({ id: childId, isFoster });
      }
    }

    // Couple relationship
    if (husbId && wifeId) {
      const coupleType: RelationshipType = isDivorced
        ? 'divorced'
        : isNotMarried
        ? 'not_married'
        : 'married';

      relationships.push({
        type: coupleType,
        from: husbId,
        to: wifeId
      });
    }

    // Parent-child relationships
    for (const ch of children) {
      const pType: RelationshipType = ch.isFoster ? 'foster_parent' : 'parent';
      if (husbId) {
        relationships.push({ type: pType, from: ch.id, to: husbId });
      }
      if (wifeId) {
        relationships.push({ type: pType, from: ch.id, to: wifeId });
      }
    }
  }

  return {
    people,
    relationships: deduplicateRelationships(relationships)
  };
}

/**
 * Serializes FamilyData into standard GEDCOM 5.5.1 string format.
 */
export function serializeGedcom(data: FamilyData): string {
  const lines: string[] = [
    '0 HEAD',
    '1 SOUR FamilyTreeApp',
    '2 VERS 1.0.0',
    '1 GEDC',
    '2 VERS 5.5.1',
    '2 FORM LINEAGE-LINKED',
    '1 CHAR UTF-8'
  ];

  const people = data.people || [];
  const relationships = deduplicateRelationships(data.relationships || []);
  const peopleMap = new Map<string, Person>(people.map(p => [p.id, p]));

  // Partition relationships
  const couples = relationships.filter(r => ['married', 'divorced', 'not_married'].includes(r.type));
  const parentRels = relationships.filter(r => r.type === 'parent' || r.type === 'foster_parent');

  // Map child -> parents
  const childToParents = new Map<string, { parentId: string; type: RelationshipType }[]>();
  for (const r of parentRels) {
    if (!childToParents.has(r.from)) childToParents.set(r.from, []);
    childToParents.get(r.from)!.push({ parentId: r.to, type: r.type });
  }

  interface InternalFamily {
    id: string;
    husbId?: string;
    wifeId?: string;
    type: RelationshipType | 'single';
    children: { childId: string; isFoster: boolean }[];
  }

  const famList: InternalFamily[] = [];
  const coupleFamMap = new Map<string, InternalFamily>();
  const personFamsMap = new Map<string, string[]>(); // personId -> famId[]
  const personFamcMap = new Map<string, { famId: string; isFoster: boolean }[]>(); // childId -> { famId, isFoster }[]

  const registerFams = (personId: string, famId: string) => {
    if (!personFamsMap.has(personId)) personFamsMap.set(personId, []);
    personFamsMap.get(personId)!.push(famId);
  };

  const registerFamc = (childId: string, famId: string, isFoster: boolean) => {
    if (!personFamcMap.has(childId)) personFamcMap.set(childId, []);
    personFamcMap.get(childId)!.push({ famId, isFoster });
  };

  // 1. Build family records for all couples
  for (const c of couples) {
    const p1 = peopleMap.get(c.from);
    const p2 = peopleMap.get(c.to);

    // Heuristic: male as husb, female as wife
    let husbId = c.from;
    let wifeId = c.to;
    if (p1?.gender === 'female' && p2?.gender === 'male') {
      husbId = c.to;
      wifeId = c.from;
    } else if (p2?.gender === 'female') {
      husbId = c.from;
      wifeId = c.to;
    }

    const famId = `FAM_${sanitizeXref(husbId)}_${sanitizeXref(wifeId)}`;
    const pairKey = [c.from, c.to].sort().join('<->');

    const fam: InternalFamily = {
      id: famId,
      husbId,
      wifeId,
      type: c.type,
      children: []
    };

    famList.push(fam);
    coupleFamMap.set(pairKey, fam);
    registerFams(husbId, famId);
    registerFams(wifeId, famId);
  }

  // 2. Assign children to families
  const singleParentFams = new Map<string, InternalFamily>();

  for (const [childId, parents] of childToParents.entries()) {
    if (parents.length === 2) {
      const pairKey = [parents[0].parentId, parents[1].parentId].sort().join('<->');
      let coupleFam = coupleFamMap.get(pairKey);

      if (!coupleFam) {
        // Parents not yet linked as a couple, create family for them
        const p1 = peopleMap.get(parents[0].parentId);
        const p2 = peopleMap.get(parents[1].parentId);
        let husbId = parents[0].parentId;
        let wifeId = parents[1].parentId;
        if (p1?.gender === 'female' && p2?.gender === 'male') {
          husbId = parents[1].parentId;
          wifeId = parents[0].parentId;
        }
        const famId = `FAM_${sanitizeXref(husbId)}_${sanitizeXref(wifeId)}`;
        coupleFam = {
          id: famId,
          husbId,
          wifeId,
          type: 'married',
          children: []
        };
        famList.push(coupleFam);
        coupleFamMap.set(pairKey, coupleFam);
        registerFams(husbId, famId);
        registerFams(wifeId, famId);
      }

      const isFoster = parents.some(p => p.type === 'foster_parent');
      coupleFam.children.push({ childId, isFoster });
      registerFamc(childId, coupleFam.id, isFoster);
      continue;
    }

    // Single parent or unusual count
    for (const p of parents) {
      let sFam = singleParentFams.get(p.parentId);
      if (!sFam) {
        const parentPerson = peopleMap.get(p.parentId);
        const isFemale = parentPerson?.gender === 'female';
        const famId = `FAM_S_${sanitizeXref(p.parentId)}`;
        sFam = {
          id: famId,
          husbId: isFemale ? undefined : p.parentId,
          wifeId: isFemale ? p.parentId : undefined,
          type: 'single',
          children: []
        };
        famList.push(sFam);
        singleParentFams.set(p.parentId, sFam);
        registerFams(p.parentId, famId);
      }

      const isFoster = p.type === 'foster_parent';
      sFam.children.push({ childId, isFoster });
      registerFamc(childId, sFam.id, isFoster);
    }
  }

  // 3. Output Individual Records (INDI)
  for (const person of people) {
    const xref = sanitizeXref(person.id);
    lines.push(`0 @${xref}@ INDI`);
    lines.push(`1 NAME ${formatGedcomName(person.name)}`);
    lines.push(`1 SEX ${person.gender === 'female' ? 'F' : 'M'}`);

    if (person.birthDate) {
      lines.push('1 BIRT');
      lines.push(`2 DATE ${formatGedcomDate(person.birthDate)}`);
    }

    if (person.deceased) {
      lines.push('1 DEAT Y');
      if (typeof person.deceased === 'object' && person.deceased.status) {
        if (person.deceased.date) {
          lines.push(`2 DATE ${formatGedcomDate(person.deceased.date)}`);
        }
        if (person.deceased.place) {
          lines.push(`2 PLAC ${person.deceased.place}`);
        }
      }
    }

    if (person.short_bio) {
      const bioLines = person.short_bio.split(/\r?\n/);
      if (bioLines.length > 0) {
        lines.push(`1 NOTE ${bioLines[0]}`);
        for (let i = 1; i < bioLines.length; i++) {
          lines.push(`2 CONT ${bioLines[i]}`);
        }
      }
    }

    if (Array.isArray(person.phone_number)) {
      for (const ph of person.phone_number) {
        lines.push(`1 PHON ${ph.number}`);
        if (ph.is_whatsapp_number) {
          lines.push('2 _WA Y');
        }
      }
    }

    if (Array.isArray(person.address)) {
      for (const addr of person.address) {
        lines.push('1 RESI');
        if (addr.address) lines.push(`2 ADDR ${addr.address}`);
        if (addr.gmap_link) lines.push(`2 _GMAP ${addr.gmap_link}`);
      }
    }

    if (person.additionals) {
      for (const [key, val] of Object.entries(person.additionals)) {
        lines.push(`1 NOTE ${key}: ${val}`);
      }
    }

    // FAMS and FAMC links
    const fams = personFamsMap.get(person.id) || [];
    for (const fId of fams) {
      lines.push(`1 FAMS @${fId}@`);
    }

    const famc = personFamcMap.get(person.id) || [];
    for (const { famId, isFoster } of famc) {
      lines.push(`1 FAMC @${famId}@`);
      if (isFoster) {
        lines.push('2 PEDI foster');
      }
    }
  }

  // 4. Output Family Records (FAM)
  for (const fam of famList) {
    lines.push(`0 @${fam.id}@ FAM`);
    if (fam.husbId) lines.push(`1 HUSB @${sanitizeXref(fam.husbId)}@`);
    if (fam.wifeId) lines.push(`1 WIFE @${sanitizeXref(fam.wifeId)}@`);

    if (fam.type === 'married') {
      lines.push('1 MARR');
    } else if (fam.type === 'divorced') {
      lines.push('1 MARR');
      lines.push('1 DIV');
    } else if (fam.type === 'not_married') {
      lines.push('1 _STAT not_married');
    }

    for (const ch of fam.children) {
      lines.push(`1 CHIL @${sanitizeXref(ch.childId)}@`);
      if (ch.isFoster) {
        lines.push('2 PEDI foster');
      }
    }
  }

  lines.push('0 TRLR');
  return lines.join('\n') + '\n';
}
