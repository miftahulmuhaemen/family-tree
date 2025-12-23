import { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  type Node, 
  MiniMap,
  useViewport,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PersonNode from './PersonNode';
import { getLayoutedElements } from '../utils/layout';
import { calculateRelationship } from '../utils/kinship';

const NODE_WIDTH = 256;
const NODE_HEIGHT = 280;

// Custom SVG lines component that draws family connections
function FamilyLines({ nodes, unions }: { 
  nodes: Node[], 
  unions: { parents: string[], children: string[] }[] 
}) {
  const viewport = useViewport();
  const [nodeHeights, setNodeHeights] = useState<Record<string, number>>({});
  
  // Measure actual node heights from DOM
  useEffect(() => {
    const measureHeights = () => {
      const heights: Record<string, number> = {};
      nodes.forEach(node => {
        const el = document.querySelector(`[data-id="${node.id}"]`);
        if (el) {
          heights[node.id] = el.getBoundingClientRect().height / viewport.zoom;
        }
      });
      setNodeHeights(heights);
    };
    
    // Measure after a short delay to ensure nodes are rendered
    const timer = setTimeout(measureHeights, 100);
    return () => clearTimeout(timer);
  }, [nodes, viewport.zoom]);
  
  if (nodes.length === 0) return null;

  // Group nodes by Y position (same Y = same generation)
  const generationMap: Record<number, Node[]> = {};
  nodes.forEach(node => {
    const y = Math.round(node.position?.y || 0);
    if (!generationMap[y]) generationMap[y] = [];
    generationMap[y].push(node);
  });

  // Calculate max height per generation
  const genMaxHeight: Record<number, number> = {};
  Object.entries(generationMap).forEach(([yStr, genNodes]) => {
    const y = parseInt(yStr);
    const maxH = Math.max(...genNodes.map(n => nodeHeights[n.id] || NODE_HEIGHT));
    genMaxHeight[y] = maxH;
  });

  const paths: string[] = [];

  unions.forEach((union) => {
    // Get parent node positions
    const parentNodes = union.parents
      .map(pid => nodes.find(n => n.id === pid))
      .filter((n): n is Node => n !== undefined);
    
    // Get child node positions  
    const childNodes = union.children
      .map(cid => nodes.find(n => n.id === cid))
      .filter((n): n is Node => n !== undefined);

    if (parentNodes.length === 0 || childNodes.length === 0) return;

    // Get the generation Y for parents (they should be at the same Y)
    const parentY = Math.round(parentNodes[0].position?.y || 0);
    const parentGenHeight = genMaxHeight[parentY] || NODE_HEIGHT;

    // Calculate connection points
    // Parent: bottom center of node (using generation's max height)
    const parentBottoms = parentNodes.map(n => ({
      x: (n.position?.x || 0) + NODE_WIDTH / 2,
      y: (n.position?.y || 0) + parentGenHeight
    }));

    // Child: top center of node
    const childTops = childNodes.map(n => ({
      x: (n.position?.x || 0) + NODE_WIDTH / 2,
      y: n.position?.y || 0
    }));

    // Calculate the merge point Y (halfway between lowest parent and highest child)
    const lowestParentY = Math.max(...parentBottoms.map(p => p.y));
    const highestChildY = Math.min(...childTops.map(c => c.y));
    const mergeY = lowestParentY + (highestChildY - lowestParentY) / 2;

    // Calculate the horizontal line X range
    const allX = [...parentBottoms.map(p => p.x), ...childTops.map(c => c.x)];
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);

    // Draw vertical lines from each parent down to merge line
    parentBottoms.forEach(p => {
      paths.push(`M ${p.x} ${p.y} L ${p.x} ${mergeY}`);
    });

    // Draw horizontal merge line
    paths.push(`M ${minX} ${mergeY} L ${maxX} ${mergeY}`);

    // Draw vertical lines from merge line down to each child
    childTops.forEach(c => {
      paths.push(`M ${c.x} ${mergeY} L ${c.x} ${c.y}`);
    });
  });

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible'
      }}
    >
      <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#888"
            strokeWidth={2 / viewport.zoom}
            fill="none"
          />
        ))}
      </g>
    </svg>
  );
}

interface FamilyTreeProps {
  data: any;
  isLoading?: boolean;
}

function FamilyTreeInner({ data: familyData, isLoading }: FamilyTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [povId, setPovId] = useState<string | null>(null);
  const [unions, setUnions] = useState<{ parents: string[], children: string[] }[]>([]);

  const nodeTypes = useMemo(() => ({ person: PersonNode }), []);

  // Calculate Layout when data loads
  useEffect(() => {
    if (!familyData) return;

    // Build parent-child relationships from YAML
    const childToParents: Record<string, string[]> = {};
    
    // Validate structure (basic check)
    if (!Array.isArray(familyData.relationships) || !Array.isArray(familyData.people)) {
        console.error("Invalid family data structure");
        return;
    }
    
    familyData.relationships.forEach((r: any) => {
      if (r.type === 'parent') {
        if (!childToParents[r.from]) childToParents[r.from] = [];
        childToParents[r.from].push(r.to);
      }
    });

    // Group children by their parent set (union)
    const unionMap: Record<string, { parents: string[], children: string[] }> = {};
    Object.entries(childToParents).forEach(([childId, parentIds]) => {
      parentIds.sort();
      const unionKey = parentIds.join('-');
      if (!unionMap[unionKey]) {
        unionMap[unionKey] = { parents: parentIds, children: [] };
      }
      unionMap[unionKey].children.push(childId);
    });

    const unionList = Object.values(unionMap);
    setUnions(unionList);

    // Create Person nodes only
    const peopleNodes = familyData.people.map((p: any) => ({
      id: p.id,
      position: { x: 0, y: 0 },
      data: { ...p, label: p.name },
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    }));

    // Create edges for ELK layout calculation (but we won't render them)
    const layoutEdges: { id: string, source: string, target: string }[] = [];
    unionList.forEach((union) => {
      union.parents.forEach((parentId) => {
        union.children.forEach((childId) => {
          layoutEdges.push({
            id: `e-${parentId}-${childId}`,
            source: parentId,
            target: childId
          });
        });
      });
    });

    // Layout with ELK
    getLayoutedElements({ nodes: peopleNodes, edges: layoutEdges }).then(({ nodes: layoutedNodes }) => {
      setNodes(layoutedNodes.map((n) => {
        const person = familyData.people.find((p: any) => p.id === n.id);
        return {
          ...n,
          type: 'person',
          data: { 
            ...person,
            label: person?.name
          } 
        };
      }));
    });

  }, [familyData, setNodes]);



  // Update POV relationships when povId changes
  useEffect(() => {
    if (!familyData) return;

    if (!povId) {
      setNodes((nds) => nds.map((node) => ({
        ...node,
        data: { ...node.data, relationshipLabel: undefined }
      })));
      return;
    }

    setNodes((nds) => nds.map((node) => {
      const relationship = calculateRelationship(
        povId, 
        node.id, 
        familyData.relationships.map((r: any) => ({ source: r.to, target: r.from })),
        familyData.people
      );
      return {
        ...node,
        data: {
          ...node.data,
          relationshipLabel: relationship || undefined
        }
      };
    }));
  }, [povId, familyData, setNodes]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setPovId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setPovId(null);
  }, []);

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading Family Tree...</div>;
  if (!familyData) return null;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={[]} // No edges - we draw lines manually
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        nodesConnectable={false}
        nodesDraggable={false}
        panOnScroll
        selectionOnDrag
        panOnDrag={[1, 2]}
      >
        <FamilyLines nodes={nodes} unions={unions} />
        <Background />
        <Controls />
        <MiniMap className="hidden md:block" />
      </ReactFlow>
    </div>
  );
}

export default function FamilyTree(props: FamilyTreeProps) {
  return (
    <ReactFlowProvider>
      <FamilyTreeInner {...props} />
    </ReactFlowProvider>
  );
}
