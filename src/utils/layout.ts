import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled';

const elk = new ELK();

export type GraphData = {
  nodes: { id: string; width?: number; height?: number; gender?: 'male' | 'female' }[];
  edges: { id: string; source: string; target: string; type?: string }[];
  unions?: { parents: string[]; children: string[]; type?: string }[];
  fosterChildren?: string[];
  relationships?: { type: string; from: string; to: string }[];
};

export async function getLayoutedElements(graph: GraphData) {
  const NODE_WIDTH = 256;
  const NODE_HEIGHT = 120;

  const elkNodes: ElkNode[] = graph.nodes.map(n => ({
    id: n.id,
    width: n.width || NODE_WIDTH,
    height: n.height || NODE_HEIGHT
  }));

  const elkEdges: any[] = [];

  if (graph.unions) {
    graph.unions.forEach((u, idx) => {
      const uId = `union_${idx}`;

      // Virtual union junction node
      elkNodes.push({
        id: uId,
        width: 12,
        height: 12
      });

      // Parents -> Union
      u.parents.forEach(pId => {
        elkEdges.push({
          id: `e_${pId}_${uId}`,
          sources: [pId],
          targets: [uId],
          layoutOptions: {
            'elk.layered.priority.direction': '5'
          }
        });
      });

      // Union -> Children
      u.children.forEach(cId => {
        elkEdges.push({
          id: `e_${uId}_${cId}`,
          sources: [uId],
          targets: [cId]
        });
      });
    });
  }

  // Root ELK graph
  const rootGraph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '60',
      'elk.layered.spacing.nodeNodeBetweenLayers': '90',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP'
    },
    children: elkNodes,
    edges: elkEdges
  };

  const layoutedGraph = await elk.layout(rootGraph);

  // Position map
  const positionMap = new Map<string, { x: number; y: number; width: number; height: number }>();
  (layoutedGraph.children || []).forEach(child => {
    positionMap.set(child.id, {
      x: child.x || 0,
      y: child.y || 0,
      width: child.width || NODE_WIDTH,
      height: child.height || NODE_HEIGHT
    });
  });

  // Extract person nodes with gender
  const personNodes = graph.nodes.map(n => {
    const pos = positionMap.get(n.id) || { x: 0, y: 0, width: NODE_WIDTH, height: NODE_HEIGHT };
    return {
      id: n.id,
      x: pos.x,
      y: pos.y,
      width: pos.width,
      height: pos.height,
      gender: (n as any).gender
    };
  });

  // Map parents and explicit couples
  const childToParents: Record<string, string[]> = {};
  const explicitCouples: Record<string, string> = {};

  if (graph.unions) {
    graph.unions.forEach(u => {
      u.children.forEach(cId => {
        if (!childToParents[cId]) childToParents[cId] = [];
        u.parents.forEach(pId => {
          if (!childToParents[cId].includes(pId)) childToParents[cId].push(pId);
        });
      });
      if (u.parents.length >= 2) {
        const key = [...u.parents].sort().join('-');
        explicitCouples[key] = u.type || 'married';
      }
    });
  }

  // Group person nodes into generational layers (y-clusters within 50px)
  const layers: { y: number; nodes: typeof personNodes }[] = [];
  personNodes.forEach(node => {
    let layer = layers.find(l => Math.abs(l.y - node.y) < 50);
    if (!layer) {
      layer = { y: node.y, nodes: [] };
      layers.push(layer);
    }
    layer.nodes.push(node);
  });
  layers.sort((a, b) => a.y - b.y);

  const SPACING_X = 60;

  // Process layers top-down to enforce spouse adjacency and parent-child alignment
  layers.forEach((layer, layerIdx) => {
    const nodes = layer.nodes;

    // For layers below root, pull children initial x toward their parents' midpoint
    if (layerIdx > 0) {
      nodes.forEach(n => {
        const parents = childToParents[n.id];
        if (parents && parents.length > 0) {
          const pXs = parents.map(pid => {
            const ppos = positionMap.get(pid);
            return ppos ? ppos.x + ppos.width / 2 : null;
          }).filter((x): x is number => x !== null);
          if (pXs.length > 0) {
            const midX = pXs.reduce((a, b) => a + b, 0) / pXs.length;
            n.x = midX - n.width / 2;
          }
        }
      });
    }

    nodes.sort((a, b) => a.x - b.x);

    // Enforce spouse adjacency: ensure married couples are placed immediately side-by-side
    const couplePairs: [string, string][] = [];
    Object.keys(explicitCouples).forEach(key => {
      const [p1, p2] = key.split('-');
      if (nodes.some(n => n.id === p1) && nodes.some(n => n.id === p2)) {
        couplePairs.push([p1, p2]);
      }
    });

    couplePairs.forEach(([p1, p2]) => {
      const idx1 = nodes.findIndex(n => n.id === p1);
      const idx2 = nodes.findIndex(n => n.id === p2);
      if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) > 1) {
        // Anchor the spouse who has parents in the tree; move the in-law spouse
        const p1HasParents = Boolean(childToParents[p1] && childToParents[p1].length > 0);
        const p2HasParents = Boolean(childToParents[p2] && childToParents[p2].length > 0);

        let anchor = p1;
        let mover = p2;
        if (!p1HasParents && p2HasParents) {
          anchor = p2;
          mover = p1;
        }

        const moverIdx = nodes.findIndex(n => n.id === mover);
        const [moverNode] = nodes.splice(moverIdx, 1);
        const newAnchorIdx = nodes.findIndex(n => n.id === anchor);
        const anchorNode = nodes[newAnchorIdx];

        if (moverNode.gender === 'female' || anchorNode.gender === 'male') {
          nodes.splice(newAnchorIdx + 1, 0, moverNode);
        } else {
          nodes.splice(newAnchorIdx, 0, moverNode);
        }
      }
    });

    // Space out nodes to completely eliminate overlaps
    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const minX = prev.x + prev.width + SPACING_X;
      if (nodes[i].x < minX) {
        nodes[i].x = minX;
      }
    }

    // Sync updated positions back into positionMap
    nodes.forEach(n => {
      positionMap.set(n.id, { x: n.x, y: n.y, width: n.width, height: n.height });
    });
  });

  // Extract finalized person nodes
  const flattenedNodes = graph.nodes.map(n => {
    const pos = positionMap.get(n.id) || { x: 0, y: 0, width: NODE_WIDTH, height: NODE_HEIGHT };
    return {
      id: n.id,
      position: { x: pos.x, y: pos.y },
      width: pos.width,
      height: pos.height
    };
  });

  // Build clean orthogonal SVG path edges in inter-layer channels
  // NEVER cut through person cards horizontally!
  const layoutEdges: any[] = [];

  if (graph.unions) {
    graph.unions.forEach((u, idx) => {
      const uId = `union_${idx}`;
      const unionPos = positionMap.get(uId);
      if (!unionPos) return;

      const uCenterY = unionPos.y + unionPos.height / 2;

      // Calculate exact midpoint between parents for the union knot
      const parentXList = u.parents.map(pId => {
        const pPos = positionMap.get(pId);
        return pPos ? pPos.x + pPos.width / 2 : null;
      }).filter((x): x is number => x !== null);

      const knotX = parentXList.length > 0 
        ? parentXList.reduce((sum, val) => sum + val, 0) / parentXList.length 
        : unionPos.x + unionPos.width / 2;

      // 1. Route each parent into the union knot through the whitespace channel below the row
      u.parents.forEach(pId => {
        const parentPos = positionMap.get(pId);
        if (!parentPos) return;

        const pBottomX = parentPos.x + parentPos.width / 2;
        const pBottomY = parentPos.y + parentPos.height;

        // Path drops from bottom of card down to uCenterY, then moves horizontally to union knot
        const path = `M ${pBottomX} ${pBottomY} L ${pBottomX} ${uCenterY} L ${knotX} ${uCenterY}`;

        layoutEdges.push({
          id: `union-parent-${pId}-${uId}`,
          source: pId,
          target: uId,
          type: 'spouse',
          parents: u.parents,
          children: u.children,
          path,
          isDashed: u.type === 'divorced'
        });
      });

      // 2. Route from union knot to each child through the whitespace channel
      u.children.forEach(cId => {
        const childPos = positionMap.get(cId);
        if (!childPos) return;

        const cTopX = childPos.x + childPos.width / 2;
        const cTopY = childPos.y;
        const isFoster = graph.fosterChildren?.includes(cId);

        // Path moves horizontally along uCenterY from union knot to child center X, then drops down into child's top
        const path = `M ${knotX} ${uCenterY} L ${cTopX} ${uCenterY} L ${cTopX} ${cTopY}`;

        layoutEdges.push({
          id: `union-child-${uId}-${cId}`,
          source: uId,
          target: cId,
          type: 'parent-child',
          parents: u.parents,
          children: u.children,
          childId: cId,
          path,
          isFoster,
          isDashed: isFoster
        });
      });
    });
  }

  return {
    nodes: flattenedNodes,
    edges: layoutEdges,
    width: layoutedGraph.width || 3000,
    height: layoutedGraph.height || 2000
  };
}
