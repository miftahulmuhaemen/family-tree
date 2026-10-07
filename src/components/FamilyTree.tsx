import { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  useNodesState, 
  type Node, 
  MiniMap,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PersonNode from './PersonNode';
import { RelationshipActionNode } from './tree/RelationshipActionNode';
import { NewMemberNode } from './tree/NewMemberNode';
import { getBranchLayout } from '../utils/branchLayout';
import type { Language } from '@/utils/i18n';
import type { RelativeType } from './AddRelativeModal';

const NODE_WIDTH = 256;
const NODE_HEIGHT = 120;

import { GraphLines } from './tree/GraphLines';

interface FamilyTreeProps {
  data: any;
  isLoading?: boolean;
  canvasMode?: 'pointer' | 'hand';
  onCanvasModeChange?: (mode: 'pointer' | 'hand') => void;
  language: Language;
  accent: string;
  povId: string | null;
  setPovId: (id: string | null) => void;
  isDarkMode?: boolean;
  onAddRelative?: (targetPerson: any, type: RelativeType) => void;
  onEditPerson?: (person: any) => void;
  onDeletePerson?: (personId: string) => void;
  onAddDirectRelationship?: (rel: { type: 'parent' | 'married' | 'divorced' | 'not_married'; from: string; to: string }) => void;
  onChangeRelationshipStatus?: (parent1Id: string, parent2Id: string, type: 'married' | 'divorced' | 'not_married') => void;
  onOpenDetail?: (personId: string) => void;
  onAddChildToRelationship?: (parent1: any, parent2: any) => void;
  onAddPerson?: () => void;
}

function FamilyTreeInner({ 
  data: familyData, 
  isLoading, 
  language = 'en',
  povId,  
  setPovId,
  isDarkMode,
  canvasMode = 'hand',
  onCanvasModeChange,
  onAddRelative,
  onEditPerson,
  onDeletePerson,
  onAddDirectRelationship,
  onChangeRelationshipStatus,
  onOpenDetail,
  onAddChildToRelationship,
  onAddPerson
}: FamilyTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const { setCenter } = useReactFlow();

  const nodeTypes = useMemo(() => ({ 
    person: PersonNode,
    relationshipAction: RelationshipActionNode,
    newMember: NewMemberNode
  }), []);

  const changeStatusCallback = onChangeRelationshipStatus || (onAddDirectRelationship ? (p1: string, p2: string, type: any) => onAddDirectRelationship({ from: p1, to: p2, type }) : undefined);

  // Calculate Branch Layout when data loads or povId changes
  useEffect(() => {
    if (!familyData || !familyData.people || !familyData.relationships) return;

    if (familyData.people.length === 0) {
      setNodes([
        {
          id: 'new-member-placeholder',
          type: 'newMember',
          position: { x: 0, y: 0 },
          data: {
            onAddPerson,
            language,
            isDarkMode
          }
        }
      ]);
      setEdges([]);
      setCenter(NODE_WIDTH / 2, NODE_HEIGHT / 2, { zoom: 1, duration: 400 });
      return;
    }

    const activeFocusId = povId || familyData.people[0]?.id;
    if (!activeFocusId) return;

    const branch = getBranchLayout(familyData, activeFocusId, {
      onAddRelative,
      onEditPerson,
      onDeletePerson,
      onOpenDetail,
      onAddChildToRelationship,
      onChangeRelationshipStatus: changeStatusCallback
    }, language);

    setNodes(branch.nodes);
    setEdges(branch.edges);

    // Center directly on the focused person node in sync with node glide animation
    const focusNode = branch.nodes.find(n => n.id === activeFocusId);
    if (focusNode) {
      const fX = focusNode.position.x + NODE_WIDTH / 2;
      const fY = focusNode.position.y + NODE_HEIGHT / 2;
      setCenter(fX, fY, { zoom: 1.05, duration: 450 });
    }
  }, [familyData, povId, language, setNodes, onAddRelative, onEditPerson, onDeletePerson, onOpenDetail, setCenter, changeStatusCallback, onAddPerson, isDarkMode]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.id === 'new-member-placeholder') {
      onAddPerson?.();
      return;
    }
    setPovId(node.id);
  }, [setPovId, onAddPerson]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'v' || e.key === 'V') onCanvasModeChange?.('pointer');
      if (e.key === 'h' || e.key === 'H') onCanvasModeChange?.('hand');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCanvasModeChange]);

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
        fitView
        fitViewOptions={{ padding: 0.35 }}
        nodesConnectable={false}
        nodesDraggable={false}
        panOnScroll={true}
        selectionOnDrag={false}
        panOnDrag={canvasMode === 'hand'}
        panActivationKeyCode="Space"
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
        <MiniMap 
          style={{ width: 120, height: 80 }}
          className="hidden md:block !bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-800 rounded-lg shadow-xs" 
          nodeColor={isDarkMode ? '#3f3f46' : '#cbd5e1'}
          maskColor={isDarkMode ? 'rgba(9, 9, 11, 0.75)' : 'rgba(240, 242, 245, 0.7)'}
        />
      </ReactFlow>
    </div>
  );
}

export default function FamilyTree(props: FamilyTreeProps) {
  return <FamilyTreeInner {...props} />;
}
