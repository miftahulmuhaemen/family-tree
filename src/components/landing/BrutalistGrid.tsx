export function BrutalistGrid() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <svg className="w-full h-full block absolute inset-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="brutalist-grid-pattern"
            x="0"
            y="0"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/[0.05] dark:text-foreground/[0.06]"
            />
            <circle
              cx="0"
              cy="0"
              r="3"
              className="fill-foreground/[0.28] dark:fill-foreground/[0.38]"
            />
            <circle
              cx="64"
              cy="0"
              r="3"
              className="fill-foreground/[0.28] dark:fill-foreground/[0.38]"
            />
            <circle
              cx="0"
              cy="64"
              r="3"
              className="fill-foreground/[0.28] dark:fill-foreground/[0.38]"
            />
            <circle
              cx="64"
              cy="64"
              r="3"
              className="fill-foreground/[0.28] dark:fill-foreground/[0.38]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brutalist-grid-pattern)" />
      </svg>
    </div>
  );
}
