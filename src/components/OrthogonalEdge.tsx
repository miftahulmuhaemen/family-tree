import { BaseEdge, type EdgeProps } from '@xyflow/react';

// Custom edge that draws clean orthogonal (right-angle) paths
export default function OrthogonalEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}: EdgeProps) {
  // Calculate the middle Y point between source and target
  const midY = sourceY + (targetY - sourceY) / 2;

  // Create an orthogonal path: down from source, horizontal, then down to target
  const path = `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;

  return (
    <BaseEdge
      id={id}
      path={path}
      style={{ stroke: '#888', strokeWidth: 2, ...style }}
    />
  );
}
