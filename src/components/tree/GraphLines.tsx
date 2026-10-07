import { useViewport } from '@xyflow/react';

export interface GraphLinesProps {
  edges: any[];
  povId: string | null;
  isDarkMode?: boolean;
}

// Render clean channel-routed lines (Neutral slate by default, crisp blue when active)
export function GraphLines({ edges, povId, isDarkMode }: GraphLinesProps) {
  const viewport = useViewport();

  if (!edges || edges.length === 0) return null;

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
        {edges.map((e, i) => {
          const isConnected = Boolean(
            !povId ||
            (e.parents && e.parents.includes(povId)) ||
            (e.childId === povId)
          );

          // Strictly White, Black, and Blue palette:
          // Unconnected lines: neutral slate-400 (#94a3b8) in light, zinc-600 (#52525b) in dark
          // Active / POV highlighted lines: electric blue (#2563eb in light, #3b82f6 in dark)
          const strokeColor = isConnected 
            ? (isDarkMode ? '#3b82f6' : '#2563eb') 
            : (isDarkMode ? '#52525b' : '#94a3b8');
          const strokeWidth = isConnected ? 2.5 : 1.5;
          const opacity = isConnected ? 1 : 0.45;

          return (
            <path
              key={e.id || i}
              d={e.path}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth / viewport.zoom}
              strokeDasharray={e.isDashed ? '4,4' : 'none'}
              opacity={opacity}
            />
          );
        })}
      </g>
    </svg>
  );
}
