import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled';

const elk = new ELK();

export type GraphData = {
  nodes: { id: string; width?: number; height?: number }[];
  edges: { id: string; source: string; target: string }[];
  unions?: { parents: string[], children: string[], type?: string }[];
  fosterChildren?: string[];
};

export async function getLayoutedElements(graph: GraphData, direction = 'DOWN') {
  const isHorizontal = direction === 'RIGHT';
  
  // Maps to track container assignment
  const nodeContainerMap: Record<string, string> = {}; // personId -> containerId
  const containerNodes: Record<string, ElkNode> = {};
  
  if (graph.unions) {
    // 1. Identify "Spouse Hubs" (people with multiple spouses)
    const personSpouseCount: Record<string, Set<string>> = {};
    graph.unions.forEach(u => {
      if (u.parents.length === 2) {
         if (!personSpouseCount[u.parents[0]]) personSpouseCount[u.parents[0]] = new Set();
         if (!personSpouseCount[u.parents[1]]) personSpouseCount[u.parents[1]] = new Set();
         personSpouseCount[u.parents[0]].add(u.parents[1]);
         personSpouseCount[u.parents[1]].add(u.parents[0]);
      }
    });

    const multiSpouseHubs = new Set<string>();
    Object.entries(personSpouseCount).forEach(([id, spouses]) => {
        if (spouses.size > 1) multiSpouseHubs.add(id);
    });
    
    // 2. Create Hub Groups (Vertical Layout)
    multiSpouseHubs.forEach(hubId => {
        const groupId = `group-hub-${hubId}`;
        const spouses = personSpouseCount[hubId];
        
        containerNodes[groupId] = {
            id: groupId,
            children: [],
            layoutOptions: {
                'elk.direction': 'DOWN', 
                'elk.spacing.nodeNode': '60', 
                'elk.algorithm': 'layered',
                'elk.padding': '[top=20,left=20,bottom=20,right=20]' 
            }
        };
        
        nodeContainerMap[hubId] = groupId;
        spouses.forEach(sId => nodeContainerMap[sId] = groupId);
    });

    // 3. Process Standard Unions (Horizontal Layout)
    graph.unions.forEach((union) => {
        if (union.parents.length === 2) {
             const p1 = union.parents[0];
             const p2 = union.parents[1];
             
             // If either is in a hub group, skip standard union container
             if (nodeContainerMap[p1] || nodeContainerMap[p2]) {
                 return;
             }

             const unionId = `union-${union.parents.sort().join('-')}`;
             
             if (!containerNodes[unionId]) {
                containerNodes[unionId] = {
                    id: unionId,
                    children: [],
                    layoutOptions: {
                        'elk.direction': 'RIGHT',
                        'elk.spacing.nodeNode': '150',
                        'elk.algorithm': 'layered',
                    }
                };
             }
             
             union.parents.forEach(pId => {
                 nodeContainerMap[pId] = unionId;
             });
        }
    });

    // 4. Add explicit edges for Hub -> Spouse to force vertical layout INSIDE the Hub Group
    if (multiSpouseHubs.size > 0) {
        graph.unions.forEach(union => {
            if (union.parents.length === 2) {
                const p1 = union.parents[0];
                const p2 = union.parents[1];
                
                if (multiSpouseHubs.has(p1)) {
                    graph.edges.push({ id: `spouse-hier-${p1}-${p2}`, source: p1, target: p2 });
                } else if (multiSpouseHubs.has(p2)) {
                    graph.edges.push({ id: `spouse-hier-${p2}-${p1}`, source: p2, target: p1 });
                }
            }
        });
    }
  }

  // Build children for ELK root
  const rootChildren: ElkNode[] = [];
  
  graph.nodes.forEach(node => {
      const containerId = nodeContainerMap[node.id];
      if (containerId && containerNodes[containerId]) {
          containerNodes[containerId].children?.push({
              id: node.id,
              width: node.width || 280,
              height: node.height || 200,
          });
      } else {
          // Standalone
          rootChildren.push({
              id: node.id,
              width: node.width || 280,
              height: node.height || 200,
          });
      }
  });

  // Add containers to root
  Object.values(containerNodes).forEach(group => {
      rootChildren.push(group);
  });

  const elkGraph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': isHorizontal ? 'RIGHT' : 'DOWN',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.spacing.nodeNode': '80', // Back to standard spacing
      'elk.layered.spacing.nodeNodeBetweenLayers': '60',
      'elk.layered.spacing.edgeNodeBetweenLayers': '25',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN', // Important for hierarchy
    },
    children: rootChildren,
    edges: graph.edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(elkGraph);

  // function to recursively flatten nodes
  const flattenedNodes: { id: string, position: { x: number, y: number }, width?: number, height?: number }[] = [];
  
  const collectNodes = (node: ElkNode, parentX = 0, parentY = 0) => {
      const currentX = parentX + (node.x || 0);
      const currentY = parentY + (node.y || 0);
      
      // If it's a leaf node (our person node)
      if (!node.children || node.children.length === 0) {
          // We only care about nodes that were in our original list (person IDs)
          // Simple check: does it look like a union ID or group ID? 
          if (!node.id.startsWith('union-') && !node.id.startsWith('group-hub-')) {
            // Apply offset for foster children
            let y = currentY;
            if (graph.fosterChildren?.includes(node.id)) {
                 y += 70; // Push down by 70px to create space for label
            }

            flattenedNodes.push({
                id: node.id,
                position: { x: currentX, y: y },
                width: node.width,
                height: node.height
            });
          }
      }
      
      // Recurse
      if (node.children) {
          node.children.forEach(child => collectNodes(child, currentX, currentY));
      }
  };

  if (layoutedGraph.children) {
      layoutedGraph.children.forEach(node => collectNodes(node));
  }

  return { nodes: flattenedNodes, width: layoutedGraph.width, height: layoutedGraph.height };
}
