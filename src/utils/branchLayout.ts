import type { Person, Relationship } from '@/types/family';

export interface BranchResult {
  nodes: any[];
  edges: any[];
  focusPerson: Person | null;
  parents: Person[];
  spouses: { person: Person; type: string }[];
  children: Person[];
  siblings: Person[];
}

export function getBranchLayout(
  familyData: { people: Person[]; relationships: Relationship[] },
  focusId: string,
  callbacks?: {
    onAddRelative?: (targetPerson: any, type: any) => void;
    onEditPerson?: (person: any) => void;
    onDeletePerson?: (personId: string) => void;
    onOpenDetail?: (personId: string) => void;
    onAddChildToRelationship?: (parent1: Person, parent2: Person) => void;
    onChangeRelationshipStatus?: (parent1Id: string, parent2Id: string, type: 'married' | 'divorced' | 'not_married') => void;
  },
  language: 'id' | 'en' = 'en'
): BranchResult {
  const peopleMap = new Map<string, Person>();
  familyData.people.forEach(p => peopleMap.set(p.id, p));

  const focusPerson = peopleMap.get(focusId) || familyData.people[0] || null;
  if (!focusPerson) {
    return {
      nodes: [],
      edges: [],
      focusPerson: null,
      parents: [],
      spouses: [],
      children: [],
      siblings: []
    };
  }

  const currentFocusId = focusPerson.id;

  // 1. Direct Parents (Generation -1)
  const parentRels = familyData.relationships.filter(
    r => (r.type === 'parent' || r.type === 'foster_parent') && r.from === currentFocusId
  );
  const parents: Person[] = [];
  parentRels.forEach(r => {
    const parentPerson = peopleMap.get(r.to);
    if (parentPerson && !parents.some(p => p.id === parentPerson.id)) {
      parents.push(parentPerson);
    }
  });

  // 2. Siblings (people who share at least one parent with focusPerson)
  const parentIds = parents.map(p => p.id);
  const siblings: Person[] = [];
  if (parentIds.length > 0) {
    const siblingIds = new Set<string>();
    familyData.relationships.forEach(r => {
      if ((r.type === 'parent' || r.type === 'foster_parent') && parentIds.includes(r.to) && r.from !== currentFocusId) {
        siblingIds.add(r.from);
      }
    });
    siblingIds.forEach(id => {
      const p = peopleMap.get(id);
      if (p) siblings.push(p);
    });
  }

  // 3. Spouses (Generation 0)
  const spouseRels = familyData.relationships.filter(
    r => ['married', 'divorced', 'not_married'].includes(r.type) && (r.from === currentFocusId || r.to === currentFocusId)
  );
  const spouses: { person: Person; type: string }[] = [];
  spouseRels.forEach(r => {
    const spouseId = r.from === currentFocusId ? r.to : r.from;
    const spousePerson = peopleMap.get(spouseId);
    if (spousePerson && !spouses.some(s => s.person.id === spousePerson.id)) {
      spouses.push({ person: spousePerson, type: r.type });
    }
  });

  // 4. Marriages and their Children (Generation +1)
  const accountedChildIds = new Set<string>();
  const marriages: { spouse: Person; type: string; children: Person[] }[] = [];
  spouses.forEach(s => {
    const childrenOfMarriage: Person[] = [];
    familyData.relationships.forEach(r => {
      if ((r.type === 'parent' || r.type === 'foster_parent') && r.to === currentFocusId) {
        const childId = r.from;
        const hasSpouse = familyData.relationships.some(
          r2 => (r2.type === 'parent' || r2.type === 'foster_parent') && r2.from === childId && r2.to === s.person.id
        );
        if (hasSpouse && !accountedChildIds.has(childId)) {
          const childPerson = peopleMap.get(childId);
          if (childPerson) {
            childrenOfMarriage.push(childPerson);
            accountedChildIds.add(childId);
          }
        }
      }
    });
    marriages.push({ spouse: s.person, type: s.type, children: childrenOfMarriage });
  });

  // Solo children (children where only focus person is recorded as parent)
  const soloChildren: Person[] = [];
  familyData.relationships.forEach(r => {
    if ((r.type === 'parent' || r.type === 'foster_parent') && r.to === currentFocusId) {
      if (!accountedChildIds.has(r.from)) {
        const c = peopleMap.get(r.from);
        if (c && !soloChildren.some(sc => sc.id === c.id)) {
          soloChildren.push(c);
          accountedChildIds.add(c.id);
        }
      }
    }
  });

  const allChildren = [...marriages.flatMap(m => m.children), ...soloChildren];

  // 5. Geometry & Coordinate Calculations
  const NODE_WIDTH = 256;
  const NODE_HEIGHT = 120;
  const GAP_X = 64;
  const SPOUSE_GAP_X = 300;
  const LEVEL_GAP_Y = 140;

  const nodes: any[] = [];
  const edges: any[] = [];

  const createNode = (person: Person, x: number, y: number, relationshipLabel?: string) => {
    const personParents = familyData.relationships.filter(
      r => (r.type === 'parent' || r.type === 'foster_parent') && r.from === person.id
    );
    const parentPeople = personParents.map(r => peopleMap.get(r.to)).filter(Boolean);
    const hasFather = parentPeople.some(p => p?.gender === 'male');
    const hasMother = parentPeople.some(p => p?.gender === 'female');
    const parentCount = personParents.length;

    return {
      id: person.id,
      type: 'person',
      position: { x, y },
      data: {
        ...person,
        label: person.name,
        relationshipLabel,
        parentCount,
        hasFather,
        hasMother,
        language,
        onAddRelative: callbacks?.onAddRelative,
        onEditPerson: callbacks?.onEditPerson,
        onDeletePerson: callbacks?.onDeletePerson,
        onOpenDetail: callbacks?.onOpenDetail
      },
      selected: person.id === currentFocusId,
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    };
  };

  const spouseLabel = (type: string) => type === 'married' 
    ? (language === 'id' ? 'Pasangan' : 'Spouse') 
    : (language === 'id' ? 'Mantan Pasangan' : 'Ex-Spouse');

  // --- LEVEL 0: Middle Row (Focus Person & Spouses) ---
  const middleY = LEVEL_GAP_Y + NODE_HEIGHT;
  let focusX = 0;

  if (marriages.length === 0) {
    focusX = 0;
    nodes.push(createNode(focusPerson, focusX, middleY, undefined));
  } else if (marriages.length === 1) {
    const m = marriages[0];
    const isMale = focusPerson.gender === 'male';
    // Husband on left, wife on right
    focusX = isMale ? -(NODE_WIDTH + SPOUSE_GAP_X) / 2 : (NODE_WIDTH + SPOUSE_GAP_X) / 2;
    const spouseX = isMale ? (NODE_WIDTH + SPOUSE_GAP_X) / 2 : -(NODE_WIDTH + SPOUSE_GAP_X) / 2;

    nodes.push(createNode(focusPerson, focusX, middleY, undefined));
    nodes.push(createNode(m.spouse, spouseX, middleY, spouseLabel(m.type)));

    // Direct clean horizontal marriage line
    const leftX = Math.min(focusX, spouseX) + NODE_WIDTH;
    const rightX = Math.max(focusX, spouseX);
    const lineY = middleY + NODE_HEIGHT / 2;
    const actionMidX = (leftX + rightX) / 2 + 25;

    edges.push({
      id: `spouse-${focusPerson.id}-${m.spouse.id}`,
      path: `M ${leftX} ${lineY} L ${rightX} ${lineY}`,
      type: 'spouse',
      parents: [focusPerson.id, m.spouse.id],
      isDashed: m.type === 'divorced'
    });

    if (callbacks?.onAddChildToRelationship || callbacks?.onChangeRelationshipStatus) {
      nodes.push({
        id: `rel-action-${focusPerson.id}-${m.spouse.id}`,
        type: 'relationshipAction',
        position: { x: actionMidX - 70, y: lineY - 14 },
        data: {
          parent1: focusPerson,
          parent2: m.spouse,
          relationshipType: m.type as 'married' | 'divorced' | 'not_married',
          language,
          onAddChild: callbacks?.onAddChildToRelationship,
          onChangeRelationshipStatus: callbacks?.onChangeRelationshipStatus
        },
        width: 140,
        height: 28,
        selectable: false,
        draggable: false
      });
    }
  } else {
    // Multiple spouses: Focus in center, spouses distributed symmetrically (left and right)
    // Avoids lines piercing across intervening spouses!
    focusX = 0;
    nodes.push(createNode(focusPerson, focusX, middleY, undefined));

    // Distribute spouses: 0 on left, 1 on right, 2 on far left, 3 on far right...
    const leftSpouses: { m: typeof marriages[0]; slotIndex: number }[] = [];
    const rightSpouses: { m: typeof marriages[0]; slotIndex: number }[] = [];

    marriages.forEach((m, idx) => {
      if (idx % 2 === 0) {
        // Left side slots: 1, 2, 3...
        const slot = Math.floor(idx / 2) + 1;
        leftSpouses.push({ m, slotIndex: slot });
      } else {
        // Right side slots: 1, 2, 3...
        const slot = Math.floor(idx / 2) + 1;
        rightSpouses.push({ m, slotIndex: slot });
      }
    });

    // Place left spouses
    leftSpouses.forEach(({ m, slotIndex }) => {
      const spouseX = -slotIndex * (NODE_WIDTH + SPOUSE_GAP_X);
      nodes.push(createNode(m.spouse, spouseX, middleY, spouseLabel(m.type)));

      if (slotIndex === 1) {
        // Immediately adjacent to Focus: direct horizontal connection
        const leftX = spouseX + NODE_WIDTH;
        const rightX = focusX;
        const lineY = middleY + NODE_HEIGHT / 2;
        const actionMidX = (leftX + rightX) / 2 + 25;
        edges.push({
          id: `spouse-${focusPerson.id}-${m.spouse.id}`,
          path: `M ${leftX} ${lineY} L ${rightX} ${lineY}`,
          type: 'spouse',
          parents: [focusPerson.id, m.spouse.id],
          children: m.children.map(c => c.id),
          isDashed: m.type === 'divorced'
        });

        if (callbacks?.onAddChildToRelationship || callbacks?.onChangeRelationshipStatus) {
          nodes.push({
            id: `rel-action-${focusPerson.id}-${m.spouse.id}`,
            type: 'relationshipAction',
            position: { x: actionMidX - 70, y: lineY - 14 },
            data: {
              parent1: focusPerson,
              parent2: m.spouse,
              relationshipType: m.type as 'married' | 'divorced' | 'not_married',
              language,
              onAddChild: callbacks?.onAddChildToRelationship,
              onChangeRelationshipStatus: callbacks?.onChangeRelationshipStatus
            },
            width: 140,
            height: 28,
            selectable: false,
            draggable: false
          });
        }
      } else {
        // Outer spouse: route underneath intermediate nodes via dedicated under-channel
        const channelY = middleY + NODE_HEIGHT + 14 * slotIndex;
        const sMidX = spouseX + NODE_WIDTH / 2;
        const fMidX = focusX + NODE_WIDTH / 2;
        const underMidX = (sMidX + fMidX) / 2;
        edges.push({
          id: `spouse-${focusPerson.id}-${m.spouse.id}`,
          path: `M ${sMidX} ${middleY + NODE_HEIGHT} L ${sMidX} ${channelY} L ${fMidX} ${channelY} L ${fMidX} ${middleY + NODE_HEIGHT}`,
          type: 'spouse',
          parents: [focusPerson.id, m.spouse.id],
          children: m.children.map(c => c.id),
          isDashed: m.type === 'divorced'
        });

        if (callbacks?.onAddChildToRelationship || callbacks?.onChangeRelationshipStatus) {
          nodes.push({
            id: `rel-action-${focusPerson.id}-${m.spouse.id}`,
            type: 'relationshipAction',
            position: { x: underMidX - 70, y: channelY - 14 },
            data: {
              parent1: focusPerson,
              parent2: m.spouse,
              relationshipType: m.type as 'married' | 'divorced' | 'not_married',
              language,
              onAddChild: callbacks?.onAddChildToRelationship,
              onChangeRelationshipStatus: callbacks?.onChangeRelationshipStatus
            },
            width: 140,
            height: 28,
            selectable: false,
            draggable: false
          });
        }
      }
    });

    // Place right spouses
    rightSpouses.forEach(({ m, slotIndex }) => {
      const spouseX = slotIndex * (NODE_WIDTH + SPOUSE_GAP_X);
      nodes.push(createNode(m.spouse, spouseX, middleY, spouseLabel(m.type)));

      if (slotIndex === 1) {
        // Immediately adjacent to Focus: direct horizontal connection
        const leftX = focusX + NODE_WIDTH;
        const rightX = spouseX;
        const lineY = middleY + NODE_HEIGHT / 2;
        const actionMidX = (leftX + rightX) / 2 + 25;
        edges.push({
          id: `spouse-${focusPerson.id}-${m.spouse.id}`,
          path: `M ${leftX} ${lineY} L ${rightX} ${lineY}`,
          type: 'spouse',
          parents: [focusPerson.id, m.spouse.id],
          children: m.children.map(c => c.id),
          isDashed: m.type === 'divorced'
        });

        if (callbacks?.onAddChildToRelationship || callbacks?.onChangeRelationshipStatus) {
          nodes.push({
            id: `rel-action-${focusPerson.id}-${m.spouse.id}`,
            type: 'relationshipAction',
            position: { x: actionMidX - 70, y: lineY - 14 },
            data: {
              parent1: focusPerson,
              parent2: m.spouse,
              relationshipType: m.type as 'married' | 'divorced' | 'not_married',
              language,
              onAddChild: callbacks?.onAddChildToRelationship,
              onChangeRelationshipStatus: callbacks?.onChangeRelationshipStatus
            },
            width: 140,
            height: 28,
            selectable: false,
            draggable: false
          });
        }
      } else {
        // Outer spouse: route underneath intermediate nodes via dedicated under-channel
        const channelY = middleY + NODE_HEIGHT + 14 * slotIndex;
        const sMidX = spouseX + NODE_WIDTH / 2;
        const fMidX = focusX + NODE_WIDTH / 2;
        const underMidX = (sMidX + fMidX) / 2;
        edges.push({
          id: `spouse-${focusPerson.id}-${m.spouse.id}`,
          path: `M ${sMidX} ${middleY + NODE_HEIGHT} L ${sMidX} ${channelY} L ${fMidX} ${channelY} L ${fMidX} ${middleY + NODE_HEIGHT}`,
          type: 'spouse',
          parents: [focusPerson.id, m.spouse.id],
          children: m.children.map(c => c.id),
          isDashed: m.type === 'divorced'
        });

        if (callbacks?.onAddChildToRelationship || callbacks?.onChangeRelationshipStatus) {
          nodes.push({
            id: `rel-action-${focusPerson.id}-${m.spouse.id}`,
            type: 'relationshipAction',
            position: { x: underMidX - 70, y: channelY - 14 },
            data: {
              parent1: focusPerson,
              parent2: m.spouse,
              relationshipType: m.type as 'married' | 'divorced' | 'not_married',
              language,
              onAddChild: callbacks?.onAddChildToRelationship,
              onChangeRelationshipStatus: callbacks?.onChangeRelationshipStatus
            },
            width: 140,
            height: 28,
            selectable: false,
            draggable: false
          });
        }
      }
    });
  }

  // --- LEVEL -1: Top Row (Parents) ---
  const topY = 0;
  const distinctParents = parents.slice(0, 2);

  if (distinctParents.length === 1) {
    const p = distinctParents[0];
    const pX = focusX;
    nodes.push(createNode(p, pX, topY, p.gender === 'male' ? (language === 'id' ? 'Ayah' : 'Father') : (language === 'id' ? 'Ibu' : 'Mother')));

    const pBottomX = pX + NODE_WIDTH / 2;
    const pBottomY = topY + NODE_HEIGHT;
    const fTopX = focusX + NODE_WIDTH / 2;

    edges.push({
      id: `parent-${p.id}-${focusPerson.id}`,
      path: `M ${pBottomX} ${pBottomY} L ${fTopX} ${middleY}`,
      type: 'parent-child',
      parents: [p.id],
      childId: focusPerson.id
    });
  } else if (distinctParents.length === 2) {
    const father = distinctParents.find(p => p.gender === 'male') || distinctParents[0];
    const mother = distinctParents.find(p => p.id !== father.id) || distinctParents[1];

    const p1X = focusX - (NODE_WIDTH + SPOUSE_GAP_X) / 2;
    const p2X = focusX + (NODE_WIDTH + SPOUSE_GAP_X) / 2;

    nodes.push(createNode(father, p1X, topY, language === 'id' ? 'Ayah' : 'Father'));
    nodes.push(createNode(mother, p2X, topY, language === 'id' ? 'Ibu' : 'Mother'));

    // Parent marriage & drop to focus
    const parentChannelY = topY + NODE_HEIGHT + 24;
    const f1X = p1X + NODE_WIDTH / 2;
    const m1X = p2X + NODE_WIDTH / 2;
    const midParentX = (p1X + p2X + NODE_WIDTH) / 2;
    const focusTopX = focusX + NODE_WIDTH / 2;

    edges.push({
      id: `parents-union-${father.id}-${mother.id}`,
      path: `M ${f1X} ${topY + NODE_HEIGHT} L ${f1X} ${parentChannelY} L ${m1X} ${parentChannelY} L ${m1X} ${topY + NODE_HEIGHT}`,
      type: 'spouse',
      parents: [father.id, mother.id],
      children: [focusPerson.id]
    });

    edges.push({
      id: `parents-to-focus-${focusPerson.id}`,
      path: `M ${midParentX} ${parentChannelY} L ${focusTopX} ${parentChannelY} L ${focusTopX} ${middleY}`,
      type: 'parent-child',
      parents: [father.id, mother.id],
      childId: focusPerson.id
    });
  }

  // --- LEVEL +1: Bottom Row (Children - Strict Sequential Non-Overlapping Layout) ---
  const bottomY = middleY + NODE_HEIGHT + LEVEL_GAP_Y;

  interface ChildFamilyGroup {
    key: string;
    targetMidX: number;
    parents: string[];
    children: Person[];
    width: number;
  }

  const childGroups: ChildFamilyGroup[] = [];

  // 1. Collect marriage groups
  marriages.forEach((m, idx) => {
    if (m.children.length > 0) {
      const sNode = nodes.find(n => n.id === m.spouse.id);
      const fNode = nodes.find(n => n.id === focusPerson.id);
      const sX = sNode ? sNode.position.x : 0;
      const fX = fNode ? fNode.position.x : 0;
      const relActionNode = nodes.find(n => n.id === `rel-action-${focusPerson.id}-${m.spouse.id}`);
      const actionMidX = relActionNode
        ? relActionNode.position.x + 70
        : (Math.min(fX, sX) + NODE_WIDTH + Math.max(fX, sX)) / 2 + 25;
      const groupWidth = m.children.length * NODE_WIDTH + (m.children.length - 1) * GAP_X;

      childGroups.push({
        key: `marriage-${idx}-${m.spouse.id}`,
        targetMidX: actionMidX,
        parents: [focusPerson.id, m.spouse.id],
        children: m.children,
        width: groupWidth
      });
    }
  });

  // 2. Collect solo children group
  if (soloChildren.length > 0) {
    const fNode = nodes.find(n => n.id === focusPerson.id);
    const soloMidX = (fNode ? fNode.position.x : 0) + NODE_WIDTH / 2;
    const groupWidth = soloChildren.length * NODE_WIDTH + (soloChildren.length - 1) * GAP_X;

    childGroups.push({
      key: `solo-${focusPerson.id}`,
      targetMidX: soloMidX,
      parents: [focusPerson.id],
      children: soloChildren,
      width: groupWidth
    });
  }

  // 3. Layout child groups sequentially along the horizontal axis with GUARANTEED spacing
  if (childGroups.length > 0) {
    // Sort groups from left to right according to parent midpoint
    childGroups.sort((a, b) => a.targetMidX - b.targetMidX);

    const groupStartX: number[] = new Array(childGroups.length).fill(0);

    // Initial pass: center each group around its targetMidX
    for (let i = 0; i < childGroups.length; i++) {
      groupStartX[i] = childGroups[i].targetMidX - childGroups[i].width / 2;
    }

    // Forward pass: resolve collisions from left to right
    for (let i = 1; i < childGroups.length; i++) {
      const minRequiredX = groupStartX[i - 1] + childGroups[i - 1].width + GAP_X;
      if (groupStartX[i] < minRequiredX) {
        groupStartX[i] = minRequiredX;
      }
    }

    // Backward pass: ensure spacing is balanced if right groups were pushed
    for (let i = childGroups.length - 2; i >= 0; i--) {
      const maxAllowedX = groupStartX[i + 1] - GAP_X - childGroups[i].width;
      if (groupStartX[i] > maxAllowedX) {
        groupStartX[i] = maxAllowedX;
      }
    }

    // Center the entire children fleet under the tree focus center or marriage midpoint
    const totalFleetLeft = groupStartX[0];
    const totalFleetRight = groupStartX[childGroups.length - 1] + childGroups[childGroups.length - 1].width;
    const fleetCenter = (totalFleetLeft + totalFleetRight) / 2;
    const desiredCenter = marriages.length === 1 && childGroups.length === 1
      ? childGroups[0].targetMidX
      : focusX + NODE_WIDTH / 2;
    const fleetShift = desiredCenter - fleetCenter;

    for (let i = 0; i < childGroups.length; i++) {
      groupStartX[i] += fleetShift;
    }

    // Render nodes & connecting orthogonal edges for each group
    childGroups.forEach((group, gIdx) => {
      const startX = groupStartX[gIdx];
      // Stagger channel Y slightly so multiple marriage channels never overlap
      const childChannelY = middleY + NODE_HEIGHT + 28 + gIdx * 14;

      // Vertical drop from parents' union midpoint down to the distribution channel
      edges.push({
        id: `drop-${group.key}`,
        path: `M ${group.targetMidX} ${middleY + NODE_HEIGHT / 2} L ${group.targetMidX} ${childChannelY}`,
        type: 'parent-child',
        parents: group.parents,
        children: group.children.map(c => c.id)
      });

      group.children.forEach((c, cIdx) => {
        const cX = startX + cIdx * (NODE_WIDTH + GAP_X);
        nodes.push(createNode(c, cX, bottomY, language === 'id' ? 'Anak' : 'Child'));

        const cTopX = cX + NODE_WIDTH / 2;
        // Orthogonal drop: from marriage union midpoint horizontally along channel to child top
        edges.push({
          id: `child-${c.id}-${group.key}`,
          path: `M ${group.targetMidX} ${childChannelY} L ${cTopX} ${childChannelY} L ${cTopX} ${bottomY}`,
          type: 'parent-child',
          parents: group.parents,
          childId: c.id
        });
      });
    });
  }

  return {
    nodes,
    edges,
    focusPerson,
    parents,
    spouses,
    children: allChildren,
    siblings
  };
}
