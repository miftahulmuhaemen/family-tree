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
import PersonNode from './PersonNode';
import { getLayoutedElements } from '../utils/layout';
import { calculateRelationship } from '../utils/kinship';
import { TERMS, KINSHIP_ID_MAPPING } from '@/utils/i18n';
import type { Language } from '@/utils/i18n';

const NODE_WIDTH = 256;
const NODE_HEIGHT = 120; // Reduced from 280 to match new minimal card size

// Custom SVG lines component that draws family connections
function FamilyLines({ nodes, unions, relationships, language }: {
  nodes: Node[],
  unions: { parents: string[], children: string[], type?: string }[],
  relationships: any[],
  language: Language
}) {
  const viewport = useViewport();

  if (nodes.length === 0) return null;

  const solidPaths: string[] = [];
  // Foster connections need: Path1 (Top), Path2 (Bottom), LabelX, LabelY
  const fosterConnections: { d1: string, d2: string, x: number, y: number }[] = [];

  unions.forEach((union, index) => {
    const parentNodes = union.parents
      .map(pid => nodes.find(n => n.id === pid))
      .filter((n): n is Node => n !== undefined);

    const childNodes = union.children
      .map(cid => nodes.find(n => n.id === cid))
      .filter((n): n is Node => n !== undefined);

    if (parentNodes.length === 0 || childNodes.length === 0) return;

    const parentBottoms = parentNodes.map(n => ({
      x: (n.position?.x || 0) + NODE_WIDTH / 2,
      y: (n.position?.y || 0) + NODE_HEIGHT,
      id: n.id
    }));

    const childTops = childNodes.map(n => ({
      x: (n.position?.x || 0) + NODE_WIDTH / 2,
      y: n.position?.y || 0,
      id: n.id
    }));

    const lowestParentY = Math.max(...parentBottoms.map(p => p.y));
    const highestChildY = Math.min(...childTops.map(c => c.y));

    const staggerOffset = (index % 5) * 10;
    const mergeY = (lowestParentY + (highestChildY - lowestParentY) / 2) - 20 + staggerOffset;

    const activeParentBottoms = parentBottoms.filter(p => {
        return Math.abs(p.y - lowestParentY) < 10;
    });

    const allX = [...activeParentBottoms.map(p => p.x), ...childTops.map(c => c.x)];
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);

    activeParentBottoms.forEach(p => {
      solidPaths.push(`M ${p.x} ${p.y} L ${p.x} ${mergeY}`);
    });

    solidPaths.push(`M ${minX} ${mergeY} L ${maxX} ${mergeY}`);

    childTops.forEach(c => {
       const isFoster = union.parents.every(pId => {
           const rel = relationships.find((r: any) => r.from === c.id && r.to === pId);
           return rel?.type === 'foster_parent';
       });

       if (isFoster) {
           // Calculate gap
           const dy = c.y - mergeY;
           const midY = mergeY + dy / 2;
           // Dynamic gap: tighter for short lines to maximize line visibility
           const gapHalf = dy < 40 ? 7 : 10;

           if (dy > 20) {
               // Ensure d1 and d2 don't cross boundaries
               const y1 = Math.max(mergeY, midY - gapHalf);
               const y2 = Math.min(c.y, midY + gapHalf);

               const d1 = `M ${c.x} ${mergeY} L ${c.x} ${y1}`;
               const d2 = `M ${c.x} ${y2} L ${c.x} ${c.y}`;
               fosterConnections.push({ d1, d2, x: c.x, y: midY });
           } else {
                // Fallback for very tight spaces: just dashed line
                const path = `M ${c.x} ${mergeY} L ${c.x} ${c.y}`;
                fosterConnections.push({ d1: path, d2: '', x: -10000, y: -10000 });
           }
       } else {
           solidPaths.push(`M ${c.x} ${mergeY} L ${c.x} ${c.y}`);
       }
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
        {solidPaths.map((d, i) => (
          <path
            key={`solid-${i}`}
            d={d}
            stroke="#94a3b8"
            strokeWidth={2 / viewport.zoom}
            fill="none"
          />
        ))}
        {fosterConnections.map((conn, i) => (
            <g key={`foster-${i}`}>
                <path d={conn.d1} stroke="#94a3b8" strokeWidth={2 / viewport.zoom} strokeDasharray="3,3" fill="none" />
                {conn.d2 && <path d={conn.d2} stroke="#94a3b8" strokeWidth={2 / viewport.zoom} strokeDasharray="3,3" fill="none" />}
                {conn.x > -1000 && (
                    <text
                        x={conn.x}
                        y={conn.y}
                        dy={3}
                        textAnchor="middle"
                        fill="#64748b"
                        style={{ fontSize: 10, fontWeight: 500 }}
                    >
                        <tspan fill="white" stroke="white" strokeWidth="4" paintOrder="stroke">{TERMS[language].foster}</tspan>
                        <tspan x={conn.x} dy={0}>{TERMS[language].foster}</tspan>
                    </text>
                )}
            </g>
        ))}
      </g>
    </svg>
  );
}

// Custom SVG lines for married couples
function SpouseLines({ nodes, unions, language }: {
  nodes: Node[],
  unions: { parents: string[], children: string[], type?: string }[],
  language: Language
}) {
  const viewport = useViewport();

  if (nodes.length === 0) return null;

  const connections: React.ReactNode[] = [];

  // 1. Organize unions into Groups (Vertical Hubs) vs Standalone (Horizontal)
  const hubGroups: Record<string, { hub: Node, spouses: { node: Node, type: string }[] }> = {};
  const horizontalCouples: { p1: Node, p2: Node, type: string }[] = [];

  unions.forEach(union => {
      if (union.parents.length !== 2) return;

      const p1 = nodes.find(n => n.id === union.parents[0]);
      const p2 = nodes.find(n => n.id === union.parents[1]);
      if (!p1 || !p2) return;

      const type = union.type || '';
      if (!type) return;

      const dy = Math.abs((p1.position?.y || 0) - (p2.position?.y || 0));
      const isVertical = dy > NODE_HEIGHT / 2;

      if (isVertical) {
          // Identify Hub (Upper) vs Spouse (Lower)
          const [hub, spouse] = (p1.position?.y || 0) < (p2.position?.y || 0) ? [p1, p2] : [p2, p1];

          if (!hubGroups[hub.id]) {
              hubGroups[hub.id] = { hub, spouses: [] };
          }
          hubGroups[hub.id].spouses.push({ node: spouse, type });
      } else {
          horizontalCouples.push({ p1, p2, type });
      }
  });

  // 2. Render Vertical Hub Groups (Unified Fork)
  Object.values(hubGroups).forEach((group, groupIndex) => {
      const { hub, spouses } = group;

      const hubX = (hub.position?.x || 0) + NODE_WIDTH / 2;
      const hubY = (hub.position?.y || 0) + NODE_HEIGHT;

      // Sort spouses by X to find range
      spouses.sort((a, b) => (a.node.position?.x || 0) - (b.node.position?.x || 0));

      // Sort spouses by X to find range
      spouses.sort((a, b) => (a.node.position?.x || 0) - (b.node.position?.x || 0));

      // If layout varies, find min/max Y? ELK usually aligns them. Let's pick min Y of spouses.
      const minY = Math.min(...spouses.map(s => s.node.position?.y || 0));

      const midY = hubY + (minY - hubY) / 2;

      // Draw Trunk (Hub -> Mid)
      connections.push(
          <path
              key={`hub-trunk-${groupIndex}`}
              d={`M ${hubX} ${hubY} L ${hubX} ${midY}`}
              stroke="#94a3b8"
              strokeWidth={2 / viewport.zoom}
              strokeDasharray="5,5"
              fill="none"
          />
      );

      // Range for Horizontal Bar
      const minX = (spouses[0].node.position?.x || 0) + NODE_WIDTH / 2;
      const maxX = (spouses[spouses.length - 1].node.position?.x || 0) + NODE_WIDTH / 2;

      // Draw Horizontal Connector Bar
      const barMinX = Math.min(minX, hubX);
      const barMaxX = Math.max(maxX, hubX);

      connections.push(
          <path
              key={`hub-bar-${groupIndex}`}
              d={`M ${barMinX} ${midY} L ${barMaxX} ${midY}`}
              stroke="#94a3b8"
              strokeWidth={2 / viewport.zoom}
              strokeDasharray="5,5"
              fill="none"
          />
      );

      // Draw Drops to each Spouse
      spouses.forEach((spouse, sIndex) => {
          const sX = (spouse.node.position?.x || 0) + NODE_WIDTH / 2;
          const sY = spouse.node.position?.y || 0;

          const dropPath = `M ${sX} ${midY} L ${sX} ${sY}`;
          const labelKey = spouse.type as keyof typeof TERMS['en'];
          const label = TERMS[language][labelKey] || spouse.type;

          const labelY = midY + (sY - midY) / 2;

          connections.push(
              <g key={`hub-drop-${groupIndex}-${sIndex}`}>
                  <path
                      d={dropPath}
                      stroke="#94a3b8"
                      strokeWidth={2 / viewport.zoom}
                      strokeDasharray="5,5"
                      fill="none"
                  />
                  <text
                    x={sX}
                    y={labelY}
                    dy={4}
                    textAnchor="middle"
                    fill="#64748b"
                    style={{ fontSize: 12, fontWeight: 500 }}
                  >
                     <tspan fill="white" stroke="white" strokeWidth="4" paintOrder="stroke">{label}</tspan>
                     <tspan x={sX} dy={0}>{label}</tspan>
                  </text>
              </g>
          );
      });
  });

  // 3. Render Horizontal Couples (Legacy/Standard)
  horizontalCouples.forEach((couple, index) => {
      const { p1, p2, type } = couple;
      const labelKey = type as keyof typeof TERMS['en'];
      const label = TERMS[language][labelKey] || type;

      const [left, right] = (p1.position?.x || 0) < (p2.position?.x || 0) ? [p1, p2] : [p2, p1];

      const startX = (left.position?.x || 0) + NODE_WIDTH;
      const startY = (left.position?.y || 0) + NODE_HEIGHT / 2;
      const endX = (right.position?.x || 0);
      const endY = (right.position?.y || 0) + NODE_HEIGHT / 2;

      const midX = startX + (endX - startX) / 2;

      const distance = endX - startX;
      const minPadding = 10;

      let gapHalfWidth = 35;
      if (distance < (gapHalfWidth * 2 + minPadding * 2)) {
         gapHalfWidth = Math.max(0, (distance - minPadding * 2) / 2);
      }

      if (startX >= endX) return;

      const leftPath = `M ${startX} ${startY} L ${midX - gapHalfWidth} ${startY}`;
      const rightPath = `M ${midX + gapHalfWidth} ${endY} L ${endX} ${endY}`;

      connections.push(
        <g key={`spouse-horz-${index}`}>
            <path d={leftPath} stroke="#94a3b8" strokeWidth={2 / viewport.zoom} strokeDasharray="5,5" fill="none" />
            <path d={rightPath} stroke="#94a3b8" strokeWidth={2 / viewport.zoom} strokeDasharray="5,5" fill="none" />
            <text x={midX} y={startY} dy={4 / viewport.zoom} textAnchor="middle" fill="#64748b" style={{ fontSize: 12, fontWeight: 500 }}>
                {label}
            </text>
            <circle cx={startX} cy={startY} r={3} fill="#94a3b8" />
            <circle cx={endX} cy={endY} r={3} fill="#94a3b8" />
        </g>
      );
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
        zIndex: 1 // Slightly above FamilyLines (0)
      }}
    >
      <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
        {connections}
      </g>
    </svg>
  );
}

interface FamilyTreeProps {
  data: any;
  isLoading?: boolean;
  language: Language;
  accent: string;
  povId: string | null;
  setPovId: (id: string | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

function FamilyTreeInner({ 
  data: familyData, 
  isLoading, 
  language, 
  accent, 
  povId, 
  setPovId,
  setIsDrawerOpen
}: FamilyTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [unions, setUnions] = useState<{ parents: string[], children: string[], type?: string }[]>([]);
  const { setCenter } = useReactFlow();

  const nodeTypes = useMemo(() => ({ person: PersonNode }), []);

  // Calculate Layout when data loads
  useEffect(() => {
    if (!familyData) return;

    // Build parent-child relationships from YAML
    const childToParents: Record<string, string[]> = {};

    // Validate structure (basic check)
    if (!familyData.relationships || !familyData.people) return;

    // Identify explicit couples
    const explicitCouples: Record<string, string> = {}; // key -> type

    familyData.relationships.forEach((r: any) => {
      if (r.type === 'parent' || r.type === 'foster_parent') {
        if (!childToParents[r.from]) childToParents[r.from] = [];
        childToParents[r.from].push(r.to);
      } else if (['married', 'divorced', 'not_married'].includes(r.type)) {
         const key = [r.from, r.to].sort().join('-');
         explicitCouples[key] = r.type;
      }
    });

    // Group children by their parent set (union)
    const unionMap: Record<string, { parents: string[], children: string[], type?: string }> = {};
    Object.entries(childToParents).forEach(([childId, parentIds]) => {
      parentIds.sort();
      const unionKey = parentIds.join('-');
      if (!unionMap[unionKey]) {
        unionMap[unionKey] = { parents: parentIds, children: [], type: explicitCouples[unionKey] };
      }
      unionMap[unionKey].children.push(childId);
    });

    // Ensure childless couples are included
    Object.entries(explicitCouples).forEach(([key, type]) => {
        if (!unionMap[key]) {
            const parents = key.split('-');
            unionMap[key] = { parents, children: [], type };
        } else {
             // update type if exists
             if (!unionMap[key].type) unionMap[key].type = type;
        }
    });

    const unionList = Object.values(unionMap);
    setUnions(unionList);

    // Create Person nodes only
    const peopleNodes = familyData.people
      .sort((a: any, b: any) => {
         const dateA = new Date(a.birthDate || '1900-01-01').getTime();
         const dateB = new Date(b.birthDate || '1900-01-01').getTime();
         return dateB - dateA;
      })
      .map((p: any) => ({
      id: p.id,
      position: { x: 0, y: 0 },
      data: { ...p, label: p.name },
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    }));

    const layoutEdges: { id: string, source: string, target: string }[] = [];
    const fosterChildrenIds: string[] = [];

    unionList.forEach((union) => {
      union.parents.forEach((parentId) => {
        union.children.forEach((childId) => {
          layoutEdges.push({
            id: `e-${parentId}-${childId}`,
            source: parentId,
            target: childId
          });

          // Check if this specific parent-child relationship is foster
          const isFoster = familyData.relationships.some((r: any) =>
              r.from === childId && r.to === parentId && r.type === 'foster_parent'
          );
          if (isFoster) {
              fosterChildrenIds.push(childId);
          }
        });
      });
    });

    // Layout with ELK
    getLayoutedElements({
      nodes: peopleNodes,
      edges: layoutEdges,
      unions: unionList,
      fosterChildren: fosterChildrenIds
    }).then(({ nodes: layoutedNodes }) => {
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
        familyData.relationships.map((r: any) => ({ source: r.to, target: r.from, type: r.type })),
        familyData.people
      );

      let finalLabel: string | null = relationship;
      // Default to Indonesian translation unless English accent is selected
      if (relationship && accent !== 'English America') {
         finalLabel = KINSHIP_ID_MAPPING[relationship] || relationship;
      }

      return {
        ...node,
        selected: node.id === povId, // Ensure selected state is controlled by povId
        data: {
          ...node.data,
          relationshipLabel: finalLabel || undefined
        }
      };
    }));
  }, [povId, familyData, setNodes, accent]); // This runs when povId changes (click) or accent changes

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setPovId(node.id); // This will trigger the effect above to update selected state and relationships

    // Check if mobile
    if (window.innerWidth < 768) {
        setIsDrawerOpen(false); // Mobile: Select node but don't open drawer immediately
    } else {
        setIsDrawerOpen(true); // Desktop: Open explicitly
    }

    // Center the node
    const x = node.position.x + (node.measured?.width ?? NODE_WIDTH) / 2;
    const y = node.position.y + (node.measured?.height ?? NODE_HEIGHT) / 2;

    setCenter(x, y, { zoom: 1.2, duration: 800 });
  }, [setCenter]);

  const onPaneClick = useCallback(() => {
    setPovId(null);
    setIsDrawerOpen(false);
  }, []);


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
        fitView
        nodesConnectable={false}
        nodesDraggable={false}
        panOnScroll
        selectionOnDrag={false}
        panOnDrag={true}
        maxZoom={4}
        minZoom={0.1}
      >
        <FamilyLines nodes={nodes} unions={unions} relationships={familyData.relationships} language={language} />
        <SpouseLines nodes={nodes} unions={unions} language={language} />
        <Background />
        <Controls style={{ bottom: '16px', left: '16px' }} />
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
