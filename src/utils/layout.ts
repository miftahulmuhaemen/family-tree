import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled';

const elk = new ELK();

export type GraphData = {
  nodes: { id: string; width?: number; height?: number }[];
  edges: { id: string; source: string; target: string }[];
};

export async function getLayoutedElements(graph: GraphData, direction = 'DOWN') {
  const isHorizontal = direction === 'RIGHT';
  
  const elkGraph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': isHorizontal ? 'RIGHT' : 'DOWN',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.spacing.nodeNode': '80',
      'elk.layered.spacing.nodeNodeBetweenLayers': '60',
      'elk.layered.spacing.edgeNodeBetweenLayers': '25',
    },
    children: graph.nodes.map((node) => ({
      id: node.id,
      width: node.width || 280,
      height: node.height || 200,
    })),
    edges: graph.edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(elkGraph);

  const layoutedNodes = (layoutedGraph.children || []).map((node) => ({
    id: node.id,
    position: { x: node.x || 0, y: node.y || 0 },
    width: node.width,
    height: node.height,
  }));

  return { nodes: layoutedNodes, width: layoutedGraph.width, height: layoutedGraph.height };
}
