export interface ProgressiveBlurProps {
  className?: string;
  direction?: 'bottom' | 'top';
}

const BLUR_LAYERS = [
  { blur: '1px', stop1: '0%', stop2: '12.5%' },
  { blur: '2px', stop1: '12.5%', stop2: '25%' },
  { blur: '4px', stop1: '25%', stop2: '37.5%' },
  { blur: '8px', stop1: '37.5%', stop2: '50%' },
  { blur: '16px', stop1: '50%', stop2: '62.5%' },
  { blur: '32px', stop1: '62.5%', stop2: '75%' },
  { blur: '64px', stop1: '75%', stop2: '87.5%' },
  { blur: '96px', stop1: '87.5%', stop2: '100%' },
];

export function ProgressiveBlur({ className = '', direction = 'bottom' }: ProgressiveBlurProps) {
  const isBottom = direction === 'bottom';
  const dirGradient = isBottom ? 'to bottom' : 'to top';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 overflow-hidden ${
        isBottom ? 'bottom-0' : 'top-0'
      } ${className}`}
    >
      {BLUR_LAYERS.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${layer.blur})`,
            WebkitBackdropFilter: `blur(${layer.blur})`,
            maskImage: `linear-gradient(${dirGradient}, transparent ${layer.stop1}, black ${layer.stop2}, black 100%)`,
            WebkitMaskImage: `linear-gradient(${dirGradient}, transparent ${layer.stop1}, black ${layer.stop2}, black 100%)`,
          }}
        />
      ))}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80"
        style={{
          transform: isBottom ? 'none' : 'rotate(180deg)',
        }}
      />
    </div>
  );
}
