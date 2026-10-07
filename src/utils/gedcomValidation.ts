import { parseGedcom } from './gedcom';

export interface GedcomValidationResult {
  isValid: boolean;
  status: 'good' | 'bad';
  message: string;
  errorLine?: number;
}

/**
 * Validates a GEDCOM content string for structural, semantic, and syntax integrity
 * before rendering in the family tree view.
 */
export function validateGedcomDetailed(content: string): GedcomValidationResult {
  if (!content || !content.trim()) {
    return {
      isValid: false,
      status: 'bad',
      message: 'Validation check, bad: Content is empty.'
    };
  }

  const lines = content.split(/\r?\n/);
  const individualIds = new Map<string, number>(); // xrefId -> lineNumber
  const familyIds = new Map<string, number>(); // famId -> lineNumber

  interface PendingFamily {
    id: string;
    line: number;
    husbId?: { id: string; line: number };
    wifeId?: { id: string; line: number };
    children: { id: string; line: number }[];
  }

  const families: PendingFamily[] = [];
  let currentFamily: PendingFamily | null = null;
  let prevLevel = -1;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check level format
    const levelMatch = trimmed.match(/^(\d+)(.*)$/);
    if (!levelMatch) {
      return {
        isValid: false,
        status: 'bad',
        errorLine: lineNum,
        message: `Validation check, bad: Line ${lineNum}: Level must start with a non-negative number.`
      };
    }

    const level = parseInt(levelMatch[1], 10);

    // Check level jumping (cannot jump more than 1 level above previous level)
    if (level > 0 && prevLevel >= 0 && level > prevLevel + 1) {
      return {
        isValid: false,
        status: 'bad',
        errorLine: lineNum,
        message: `Validation check, bad: Line ${lineNum}: Invalid level hierarchy (jumped from level ${prevLevel} to ${level}).`
      };
    }
    prevLevel = level;

    // Check unclosed '@' identifiers
    const atCount = (trimmed.match(/@/g) || []).length;
    if (atCount % 2 !== 0) {
      return {
        isValid: false,
        status: 'bad',
        errorLine: lineNum,
        message: `Validation check, bad: Line ${lineNum}: Unclosed '@' identifier.`
      };
    }

    // Match full line structure: LEVEL [XREF] TAG [VALUE]
    const match = trimmed.match(/^(\d+)(?:\s+(@[^@\s]+@))?\s+([A-Za-z0-9_]+)(?:\s+(.*))?$/);
    if (!match) {
      return {
        isValid: false,
        status: 'bad',
        errorLine: lineNum,
        message: `Validation check, bad: Line ${lineNum}: Invalid GEDCOM line syntax.`
      };
    }

    const xref = match[2] ? match[2].replace(/^@|@$/g, '') : '';
    const tag = match[3];
    const value = match[4] ? match[4].trim() : '';

    if (level === 0) {
      let recXref = xref;
      let recTag = tag;
      let recVal = value;

      // Support alternative tag/value order: 0 INDI @I1@
      if (!recXref && recVal.startsWith('@') && recVal.endsWith('@')) {
        recXref = recVal.replace(/^@|@$/g, '');
        recVal = '';
      }

      if (recTag === 'INDI') {
        currentFamily = null;
        if (!recXref) {
          return {
            isValid: false,
            status: 'bad',
            errorLine: lineNum,
            message: `Validation check, bad: Line ${lineNum}: Individual record missing ID (@...@).`
          };
        }
        if (individualIds.has(recXref)) {
          return {
            isValid: false,
            status: 'bad',
            errorLine: lineNum,
            message: `Validation check, bad: Line ${lineNum}: Duplicate individual ID @${recXref}@ (already defined on line ${individualIds.get(recXref)}).`
          };
        }
        individualIds.set(recXref, lineNum);
      } else if (recTag === 'FAM') {
        if (!recXref) {
          return {
            isValid: false,
            status: 'bad',
            errorLine: lineNum,
            message: `Validation check, bad: Line ${lineNum}: Family record missing ID (@...@).`
          };
        }
        if (familyIds.has(recXref)) {
          return {
            isValid: false,
            status: 'bad',
            errorLine: lineNum,
            message: `Validation check, bad: Line ${lineNum}: Duplicate family ID @${recXref}@ (already defined on line ${familyIds.get(recXref)}).`
          };
        }
        familyIds.set(recXref, lineNum);
        currentFamily = {
          id: recXref,
          line: lineNum,
          children: []
        };
        families.push(currentFamily);
      } else {
        currentFamily = null;
      }
    } else if (currentFamily) {
      if (tag === 'HUSB') {
        const hId = value.replace(/^@|@$/g, '');
        currentFamily.husbId = { id: hId, line: lineNum };
      } else if (tag === 'WIFE') {
        const wId = value.replace(/^@|@$/g, '');
        currentFamily.wifeId = { id: wId, line: lineNum };
      } else if (tag === 'CHIL') {
        const cId = value.replace(/^@|@$/g, '');
        currentFamily.children.push({ id: cId, line: lineNum });
      }
    }
  }

  // 1. Check that at least one INDI exists
  if (individualIds.size === 0) {
    return {
      isValid: false,
      status: 'bad',
      message: 'Validation check, bad: No individual records (@... INDI) found.'
    };
  }

  // 2. Check FAM integrity (dangling references, self-marriage, self-parenting)
  for (const fam of families) {
    if (fam.husbId) {
      if (!individualIds.has(fam.husbId.id)) {
        return {
          isValid: false,
          status: 'bad',
          errorLine: fam.husbId.line,
          message: `Validation check, bad: Line ${fam.husbId.line}: Husband @${fam.husbId.id}@ in family @${fam.id}@ does not exist.`
        };
      }
    }
    if (fam.wifeId) {
      if (!individualIds.has(fam.wifeId.id)) {
        return {
          isValid: false,
          status: 'bad',
          errorLine: fam.wifeId.line,
          message: `Validation check, bad: Line ${fam.wifeId.line}: Wife @${fam.wifeId.id}@ in family @${fam.id}@ does not exist.`
        };
      }
    }
    if (fam.husbId && fam.wifeId && fam.husbId.id === fam.wifeId.id) {
      return {
        isValid: false,
        status: 'bad',
        errorLine: fam.wifeId.line,
        message: `Validation check, bad: Line ${fam.wifeId.line}: Individual @${fam.husbId.id}@ cannot be married to themselves in family @${fam.id}@.`
      };
    }

    for (const child of fam.children) {
      if (!individualIds.has(child.id)) {
        return {
          isValid: false,
          status: 'bad',
          errorLine: child.line,
          message: `Validation check, bad: Line ${child.line}: Child @${child.id}@ in family @${fam.id}@ does not exist.`
        };
      }
      if (fam.husbId && child.id === fam.husbId.id) {
        return {
          isValid: false,
          status: 'bad',
          errorLine: child.line,
          message: `Validation check, bad: Line ${child.line}: Individual @${child.id}@ cannot be their own parent/child in family @${fam.id}@.`
        };
      }
      if (fam.wifeId && child.id === fam.wifeId.id) {
        return {
          isValid: false,
          status: 'bad',
          errorLine: child.line,
          message: `Validation check, bad: Line ${child.line}: Individual @${child.id}@ cannot be their own parent/child in family @${fam.id}@.`
        };
      }
    }
  }

  // 3. Graph Cycle Detection (Ancestor cycle: parent -> child -> ... -> parent)
  const parentToChildren = new Map<string, string[]>();
  for (const fam of families) {
    const parents = [fam.husbId?.id, fam.wifeId?.id].filter((id): id is string => Boolean(id));
    for (const p of parents) {
      if (!parentToChildren.has(p)) parentToChildren.set(p, []);
      for (const ch of fam.children) {
        parentToChildren.get(p)!.push(ch.id);
      }
    }
  }

  function findCycle(): string[] | null {
    const visitState = new Map<string, number>(); // 0=unvisited, 1=visiting, 2=visited
    const path: string[] = [];

    function dfs(node: string): string[] | null {
      visitState.set(node, 1);
      path.push(node);

      const children = parentToChildren.get(node) || [];
      for (const ch of children) {
        const state = visitState.get(ch) || 0;
        if (state === 1) {
          const cycleStartIndex = path.indexOf(ch);
          return [...path.slice(cycleStartIndex), ch];
        }
        if (state === 0) {
          const cycle = dfs(ch);
          if (cycle) return cycle;
        }
      }

      path.pop();
      visitState.set(node, 2);
      return null;
    }

    for (const personId of individualIds.keys()) {
      if ((visitState.get(personId) || 0) === 0) {
        const cycle = dfs(personId);
        if (cycle) return cycle;
      }
    }
    return null;
  }

  const detectedCycle = findCycle();
  if (detectedCycle) {
    return {
      isValid: false,
      status: 'bad',
      message: `Validation check, bad: Ancestor cycle detected: ${detectedCycle.map((id: string) => `@${id}@`).join(' -> ')} (impossible to render family tree).`
    };
  }

  // 4. Test actual parsing through parseGedcom
  try {
    const parsed = parseGedcom(content);
    if (!parsed || !Array.isArray(parsed.people) || parsed.people.length === 0) {
      return {
        isValid: false,
        status: 'bad',
        message: 'Validation check, bad: Unable to parse individuals from GEDCOM.'
      };
    }
  } catch (err: any) {
    return {
      isValid: false,
      status: 'bad',
      message: `Validation check, bad: ${err.message || 'Parse failed'}`
    };
  }

  return {
    isValid: true,
    status: 'good',
    message: 'Validation check, good!'
  };
}
