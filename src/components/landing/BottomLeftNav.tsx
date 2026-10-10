import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, FileText } from 'lucide-react';

export function BottomLeftNav() {
  const [leftOffset, setLeftOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);

  // Hover & press states for Github (1x2 grid)
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [isGithubPressed, setIsGithubPressed] = useState(false);
  const githubRef = useRef<HTMLAnchorElement>(null);
  const githubAnchorRef = useRef<HTMLDivElement>(null);

  // Hover & press states for Docs (1x2 grid)
  const [isDocsHovered, setIsDocsHovered] = useState(false);
  const [isDocsPressed, setIsDocsPressed] = useState(false);
  const docsRef = useRef<HTMLAnchorElement>(null);
  const docsAnchorRef = useRef<HTMLDivElement>(null);

  // Snap left and bottom edges to the 64px brutalist grid
  useEffect(() => {
    const alignWithGrid = () => {
      const clientW = document.documentElement.clientWidth;
      const clientH = window.innerHeight;
      // Left: first grid column with at least 16px clearance
      const firstCol = Math.ceil(16 / 64);
      const leftX = firstCol * 64;
      setLeftOffset(leftX > clientW ? 0 : leftX);
      // Bottom: snap so that bottom edge of nav lands on a grid line
      // Nav is 128px tall (2 rows of 64px each), elevated 1 grid up to clear gaussian blur dock
      const maxRow = Math.floor(clientH / 64);
      const bottomRow = (clientH - maxRow * 64 < 16 ? maxRow - 1 : maxRow) - 1;
      const bottomY = bottomRow * 64;
      setBottomOffset(Math.max(0, clientH - bottomY));
    };

    alignWithGrid();
    window.addEventListener('resize', alignWithGrid);
    return () => window.removeEventListener('resize', alignWithGrid);
  }, []);

  const handleGithubMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!githubRef.current || !githubAnchorRef.current) return;
    const rect = githubRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    githubAnchorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleDocsMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!docsRef.current || !docsAnchorRef.current) return;
    const rect = docsRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    docsAnchorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <nav
      aria-label="External links"
      style={{ left: `${leftOffset}px`, bottom: `${bottomOffset}px` }}
      className="fixed z-40 flex flex-col items-start pointer-events-auto select-none"
    >
      {/* 1x2 Grid Inverted Box: Github (128px x 64px) */}
      <a
        id="nav-github-box"
        data-absorb-cursor="true"
        ref={githubRef}
        href="https://github.com/miftahulmuhaemen/family-tree"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => {
          setIsGithubHovered(true);
          handleGithubMouseMove(e);
        }}
        onMouseMove={handleGithubMouseMove}
        onMouseLeave={() => {
          setIsGithubHovered(false);
          setIsGithubPressed(false);
        }}
        onMouseDown={() => setIsGithubPressed(true)}
        onMouseUp={() => setIsGithubPressed(false)}
        className="w-[128px] h-[64px] relative cursor-pointer select-none group flex items-center justify-start"
      >
        {/* Inverted 1x2 Grid Lens Layer */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 ${
            isGithubHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Inverted Lens Body */}
          <div className="w-full h-full relative bg-[#020817] dark:bg-[#fdf7e8] border border-white/20 dark:border-black/15 shadow-sm">
            <div className="w-full h-full flex items-center justify-start pl-4 text-white dark:text-black">
              <span
                className={`inline-flex items-center gap-2 font-sans font-black text-lg sm:text-xl tracking-tight transition-transform duration-150 ${
                  isGithubPressed ? 'scale-95' : 'scale-100'
                }`}
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span>Github</span>
              </span>
            </div>
          </div>

          {/* SVG Grid Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 128 64">
            <line x1="64" y1="0" x2="64" y2="64" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
            <circle cx="0" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="64" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="128" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="0" cy="64" r="3" className="fill-[#8b887f]" />
            <circle cx="64" cy="64" r="3" className="fill-[#8b887f]" />
            <circle cx="128" cy="64" r="3" className="fill-[#8b887f]" />
          </svg>

          {/* 4 Corner Square Handles */}
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 pointer-events-none z-30 shadow-sm" />

          {/* Collaborator Pill Badge: YOU */}
          <div className="absolute -bottom-5 right-0 translate-x-1/2 flex items-center justify-center pointer-events-none select-none z-30">
            <span className="bg-white text-black dark:bg-black dark:text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              YOU
            </span>
          </div>

          {/* Cursor Anchor Dot */}
          <div
            ref={githubAnchorRef}
            className="absolute top-0 left-0 pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm ring-2 ring-white/70 dark:ring-black/70" />
          </div>
        </div>

        {/* Base Layer Text */}
        <div className="w-full h-full flex items-center justify-start pl-4 text-foreground relative z-10">
          <span
            className={`inline-flex items-center gap-2 font-sans font-black text-lg sm:text-xl tracking-tight transition-transform duration-150 ${
              isGithubPressed ? 'scale-95' : 'scale-100'
            }`}
          >
            <Github className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span>Github</span>
          </span>
        </div>
      </a>

      {/* 1x2 Grid Inverted Box: Docs (128px x 64px) */}
      <Link
        id="nav-docs-box"
        data-absorb-cursor="true"
        ref={docsRef}
        to="/docs"
        onMouseEnter={(e) => {
          setIsDocsHovered(true);
          handleDocsMouseMove(e);
        }}
        onMouseMove={handleDocsMouseMove}
        onMouseLeave={() => {
          setIsDocsHovered(false);
          setIsDocsPressed(false);
        }}
        onMouseDown={() => setIsDocsPressed(true)}
        onMouseUp={() => setIsDocsPressed(false)}
        className="w-[128px] h-[64px] relative cursor-pointer select-none group flex items-center justify-start"
      >
        {/* Inverted 1x2 Grid Lens Layer */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 ${
            isDocsHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Inverted Lens Body */}
          <div className="w-full h-full relative bg-[#020817] dark:bg-[#fdf7e8] border border-white/20 dark:border-black/15 shadow-sm">
            <div className="w-full h-full flex items-center justify-start pl-4 text-white dark:text-black">
              <span
                className={`inline-flex items-center gap-2 font-sans font-black text-lg sm:text-xl tracking-tight transition-transform duration-150 ${
                  isDocsPressed ? 'scale-95' : 'scale-100'
                }`}
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span>Docs</span>
              </span>
            </div>
          </div>

          {/* SVG Grid Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 128 64">
            <line x1="64" y1="0" x2="64" y2="64" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
            <circle cx="0" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="64" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="128" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="0" cy="64" r="3" className="fill-[#8b887f]" />
            <circle cx="64" cy="64" r="3" className="fill-[#8b887f]" />
            <circle cx="128" cy="64" r="3" className="fill-[#8b887f]" />
          </svg>

          {/* 4 Corner Square Handles */}
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 pointer-events-none z-30 shadow-sm" />

          {/* Collaborator Pill Badge: YOU */}
          <div className="absolute -bottom-5 right-0 translate-x-1/2 flex items-center justify-center pointer-events-none select-none z-30">
            <span className="bg-white text-black dark:bg-black dark:text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              YOU
            </span>
          </div>

          {/* Cursor Anchor Dot */}
          <div
            ref={docsAnchorRef}
            className="absolute top-0 left-0 pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm ring-2 ring-white/70 dark:ring-black/70" />
          </div>
        </div>

        {/* Base Layer Text */}
        <div className="w-full h-full flex items-center justify-start pl-4 text-foreground relative z-10">
          <span
            className={`inline-flex items-center gap-2 font-sans font-black text-lg sm:text-xl tracking-tight transition-transform duration-150 ${
              isDocsPressed ? 'scale-95' : 'scale-100'
            }`}
          >
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span>Docs</span>
          </span>
        </div>
      </Link>
    </nav>
  );
}
