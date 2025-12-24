import { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  type Node, 
  MiniMap,
  useViewport,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PersonNode, { type PersonData } from './PersonNode';
import DetailDrawer from './DetailDrawer';
import { getLayoutedElements } from '../utils/layout';
import { calculateRelationship } from '../utils/kinship';

const NODE_WIDTH = 256;
const NODE_HEIGHT = 120; // Reduced from 280 to match new minimal card size

// Custom SVG lines component that draws family connections
function FamilyLines({ nodes, unions }: { 
  nodes: Node[], 
  unions: { parents: string[], children: string[] }[] 
}) {
  const viewport = useViewport();
  
  if (nodes.length === 0) return null;

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

    // Calculate connection points
    // Parent: bottom center of node (using fixed NODE_HEIGHT)
    const parentBottoms = parentNodes.map(n => ({
      x: (n.position?.x || 0) + NODE_WIDTH / 2,
      y: (n.position?.y || 0) + NODE_HEIGHT
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
        overflow: 'visible',
        zIndex: 0
      }}
    >
      <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#94a3b8" // slate-400
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
  const { setCenter } = useReactFlow();

  const nodeTypes = useMemo(() => ({ person: PersonNode }), []);

  // Calculate Layout when data loads
  useEffect(() => {
    if (!familyData) return;

    // Build parent-child relationships from YAML
    const childToParents: Record<string, string[]> = {};
    
    // Validate structure (basic check)
    if (!familyData.relationships || !familyData.people) return;
    
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
      // Restore POV if exists
      setNodes(layoutedNodes.map((n) => {
        const person = familyData.people.find((p: any) => p.id === n.id);
        return {
          ...n,
          type: 'person',
          selected: n.id === povId, // Sync selection
          data: { 
            ...person,
            label: person?.name
          } 
        };
      }));
    });

  }, [familyData, setNodes]); // Removed povId from dependency to avoid re-layouting on click, but wait, re-layouting isn't needed on selection.


  // Update POV relationships and Selection when povId changes
  useEffect(() => {
    if (!familyData) return;

    if (!povId) {
      setNodes((nds) => nds.map((node) => ({
        ...node,
        selected: false,
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
        selected: node.id === povId, // Ensure selected state is controlled by povId
        data: {
          ...node.data,
          relationshipLabel: relationship || undefined
        }
      };
    }));
  }, [povId, familyData, setNodes]); // This runs when povId changes (click)

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setPovId(node.id); // This will trigger the effect above to update selected state and relationships
    
    // Center the node
    // We need to account for node width/height to center it perfectly
    // Assuming node width ~256 (NODE_WIDTH). height is variable but let's assume it's roughly centered.
    // setCenter accepts x, y, options.
    const x = node.position.x + (node.measured?.width ?? NODE_WIDTH) / 2;
    const y = node.position.y + (node.measured?.height ?? NODE_HEIGHT) / 2;
    
    setCenter(x, y, { zoom: 1.2, duration: 800 });
  }, [setCenter]);

  const onPaneClick = useCallback(() => {
    setPovId(null);
  }, []);

  const closeDrawer = () => setPovId(null);

  const selectedPerson = useMemo(() => {
      if (!povId || !familyData) return null;
      return familyData.people.find((p: any) => p.id === povId) || null;
  }, [povId, familyData]);


  if (isLoading) return <div className="flex items-center justify-center h-full">Loading Family Tree...</div>;
  if (!familyData) return null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={[]} 
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        // fitView // removed to avoid jump on initial load if we want manual control, but useful for first load.
        // Actually, let's keep fitView but we might need to be careful with it overriding our setCenter?
        // fitView is an initial prop.
        fitView
        nodesConnectable={false}
        nodesDraggable={false} // Maybe allow drag? User didn't specify.
        panOnScroll
        selectionOnDrag={false}
        panOnDrag={[1, 2]}
        maxZoom={4}
        minZoom={0.1}
      >
        <FamilyLines nodes={nodes} unions={unions} />
        <Background />
        <Controls />
        <MiniMap className="hidden md:block" />
      </ReactFlow>

      {/* Detail Drawer */}
      <DetailDrawer 
        isOpen={!!povId} 
        onClose={closeDrawer} 
        person={selectedPerson as PersonData | null} 
      />
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
