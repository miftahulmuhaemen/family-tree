import { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  type Node, 
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PersonNode from './PersonNode';
import { RelationshipActionNode } from './tree/RelationshipActionNode';
import { ConnectNodesModal } from './ConnectNodesModal';
import { getBranchLayout } from '../utils/branchLayout';
import type { Language } from '@/utils/i18n';
import type { RelativeType } from './AddRelativeModal';

const NODE_WIDTH = 256;
const NODE_HEIGHT = 120;

import { GraphLines } from './tree/GraphLines';

interface FamilyTreeProps {
  data: any;
  isLoading?: boolean;
  language: Language;
  accent: string;
  povId: string | null;
  setPovId: (id: string | null) => void;
  isDarkMode?: boolean;
  onAddRelative?: (targetPerson: any, type: RelativeType) => void;
  onEditPerson?: (person: any) => void;
  onDeletePerson?: (personId: string) => void;
  onAddDirectRelationship?: (rel: { type: 'parent' | 'married' | 'divorced' | 'not_married'; from: string; to: string }) => void;
  onOpenDetail?: (personId: string) => void;
  onAddChildToRelationship?: (parent1: any, parent2: any) => void;
}

function FamilyTreeInner({ 
  data: familyData, 
  isLoading, 
  povId,  
  setPovId,
  isDarkMode,
  onAddRelative,
  onEditPerson,
  onDeletePerson,
  onAddDirectRelationship,
  onOpenDetail,
  onAddChildToRelationship
}: FamilyTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [pendingConnection, setPendingConnection] = useState<{ sourceId: string; targetId: string } | null>(null);
  const { setCenter } = useReactFlow();

  const nodeTypes = useMemo(() => ({ 
    person: PersonNode,
    relationshipAction: RelationshipActionNode
  }), []);

  // Calculate Branch Layout when data loads or povId changes
  useEffect(() => {
    if (!familyData || !familyData.people || !familyData.relationships) return;

    const activeFocusId = povId || familyData.people[0]?.id;
    if (!activeFocusId) return;

    const branch = getBranchLayout(familyData, activeFocusId, {
      onAddRelative,
      onEditPerson,
      onDeletePerson,
      onOpenDetail,
      onAddChildToRelationship
    });

    setNodes(branch.nodes);
    setEdges(branch.edges);

    // Center directly on the focused person node
    const focusNode = branch.nodes.find(n => n.id === activeFocusId);
    if (focusNode) {
      const fX = focusNode.position.x + NODE_WIDTH / 2;
      const fY = focusNode.position.y + NODE_HEIGHT / 2;
      setTimeout(() => {
        setCenter(fX, fY, { zoom: 1.05, duration: 450 });
      }, 100);
    }
  }, [familyData, povId, setNodes, onAddRelative, onEditPerson, onDeletePerson, onOpenDetail, setCenter]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setPovId(node.id);
  }, [setPovId]);

  // Drag-and-drop edge connect
  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;
    if (connection.source === connection.target) return;
    setPendingConnection({ sourceId: connection.source, targetId: connection.target });
  }, []);

  if (isLoading) return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">Loading Family Tree...</div>;
  if (!familyData) return null;

  return (
    <div className="w-full h-full relative bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <ReactFlow
        nodes={nodes}
        edges={[]}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        fitView
        nodesConnectable={true}
        nodesDraggable={false}
        panOnScroll
        selectionOnDrag={false}
        panOnDrag={true}
        maxZoom={4}
        minZoom={0.1}
        colorMode={isDarkMode ? 'dark' : 'light'}
      >
        <GraphLines edges={edges} povId={povId} isDarkMode={isDarkMode} />
        <Background 
          color={isDarkMode ? '#27272a' : '#cbd5e1'} 
          gap={16} 
          size={1} 
        />
        <Controls 
          style={{ bottom: '16px', left: '16px' }} 
          className="dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200"
        />
        <MiniMap 
          style={{ width: 120, height: 80 }}
          className="hidden md:block !bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-800 rounded-lg shadow-xs" 
          nodeColor={isDarkMode ? '#3f3f46' : '#cbd5e1'}
          maskColor={isDarkMode ? 'rgba(9, 9, 11, 0.75)' : 'rgba(240, 242, 245, 0.7)'}
        />
      </ReactFlow>

      {/* Connect Nodes Modal for Drag-and-Drop */}
      {pendingConnection && (
        <ConnectNodesModal
          isOpen={Boolean(pendingConnection)}
          onClose={() => setPendingConnection(null)}
          sourcePerson={familyData.people.find((p: any) => p.id === pendingConnection.sourceId) || null}
          targetPerson={familyData.people.find((p: any) => p.id === pendingConnection.targetId) || null}
          allRelationships={familyData.relationships || []}
          onConnect={(rel) => {
            onAddDirectRelationship?.(rel);
            setPendingConnection(null);
          }}
        />
      )}
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
