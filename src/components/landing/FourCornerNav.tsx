import { useEffect, useRef, useState } from 'react';
import { smoothScrollTo } from '../../utils/smoothScroll';

export interface FourCornerNavProps {
  locale: 'en' | 'id';
  onToggleLocale: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function FourCornerNav({
  locale,
  onToggleLocale,
  isDarkMode,
  onToggleTheme,
}: FourCornerNavProps) {
  const [rightOffset, setRightOffset] = useState(0);

  // Hover & press states for LANG ID (1x3 grid)
  const [isLangHovered, setIsLangHovered] = useState(false);
  const [isLangPressed, setIsLangPressed] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const langAnchorRef = useRef<HTMLDivElement>(null);

  // Hover & press states for LIGHT/DARK (1x2 grid)
  const [isThemeHovered, setIsThemeHovered] = useState(false);
  const [isThemePressed, setIsThemePressed] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const themeAnchorRef = useRef<HTMLDivElement>(null);

  // Hover & press states for HOME (1x2 grid)
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isHomePressed, setIsHomePressed] = useState(false);
  const [homeOpacity, setHomeOpacity] = useState(0);
  const homeRef = useRef<HTMLDivElement>(null);
  const homeAnchorRef = useRef<HTMLDivElement>(null);

  // Snap right edge to the 64px brutalist grid
  useEffect(() => {
    const alignWithGrid = () => {
      const clientW = document.documentElement.clientWidth;
      const maxCol = Math.floor(clientW / 64);
      // Ensure at least 16px clearance from screen edge
      const rightCol = clientW - maxCol * 64 < 16 ? maxCol - 1 : maxCol;
      const rightX = rightCol * 64;
      setRightOffset(Math.max(0, clientW - rightX));
    };

    alignWithGrid();
    window.addEventListener('resize', alignWithGrid);
    return () => window.removeEventListener('resize', alignWithGrid);
  }, []);

  // Fade-in HOME button near page bottom and reach 100% at the very bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) {
        setHomeOpacity(0);
        return;
      }
      const currentScroll = window.scrollY;
      const distFromBottom = maxScroll - currentScroll;

      // Start fading in within 480px of bottom, reach 1.0 (100%) exactly at bottom
      const fadeThreshold = 480;
      if (distFromBottom >= fadeThreshold) {
        setHomeOpacity(0);
      } else {
        const progress = Math.max(0, Math.min(1, 1 - distFromBottom / fadeThreshold));
        setHomeOpacity(progress);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleLangMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!langRef.current || !langAnchorRef.current) return;
    const rect = langRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    langAnchorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleThemeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!themeRef.current || !themeAnchorRef.current) return;
    const rect = themeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    themeAnchorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleHomeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!homeRef.current || !homeAnchorRef.current) return;
    const rect = homeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    homeAnchorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <nav
      aria-label="Quick actions"
      style={{ right: `${rightOffset}px` }}
      className="fixed top-[64px] z-40 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* 1x3 Grid Inverted Box: LANG ID (192px x 64px) */}
      <div
        id="nav-lang-box"
        data-absorb-cursor="true"
        ref={langRef}
        onClick={onToggleLocale}
        onMouseEnter={(e) => {
          setIsLangHovered(true);
          handleLangMouseMove(e);
        }}
        onMouseMove={handleLangMouseMove}
        onMouseLeave={() => {
          setIsLangHovered(false);
          setIsLangPressed(false);
        }}
        onMouseDown={() => setIsLangPressed(true)}
        onMouseUp={() => setIsLangPressed(false)}
        className="w-[192px] h-[64px] relative cursor-pointer select-none group flex items-center justify-end"
      >
        {/* Inverted 1x3 Grid Lens Layer */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 ${
            isLangHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Inverted Lens Body */}
          <div className="w-full h-full relative bg-[#020817] dark:bg-[#fdf7e8] border border-white/20 dark:border-black/15 shadow-sm">
            {/* Inverted Text */}
            <div className="w-full h-full flex items-center justify-end pr-4 text-white dark:text-black">
              <span
                className={`font-sans font-black text-2xl sm:text-3xl tracking-tighter uppercase transition-transform duration-150 ${
                  isLangPressed ? 'scale-95' : 'scale-100'
                }`}
              >
                LANG {locale === 'id' ? 'ID' : 'EN'}
              </span>
            </div>
          </div>

          {/* SVG Grid Overlay (Unclipped full circles matching BrutalistGrid dots) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 192 64">
            {/* Internal 1x3 grid crosshair vertical lines */}
            <line x1="64" y1="0" x2="64" y2="64" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
            <line x1="128" y1="0" x2="128" y2="64" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
            {/* 8 Grid intersection dots */}
            <circle cx="0" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="64" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="128" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="192" cy="0" r="3" className="fill-[#8b887f]" />
            <circle cx="0" cy="64" r="3" className="fill-[#8b887f]" />
            <circle cx="64" cy="64" r="3" className="fill-[#8b887f]" />
            <circle cx="128" cy="64" r="3" className="fill-[#8b887f]" />
            <circle cx="192" cy="64" r="3" className="fill-[#8b887f]" />
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
            ref={langAnchorRef}
            className="absolute top-0 left-0 pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm ring-2 ring-white/70 dark:ring-black/70" />
          </div>
        </div>

        {/* Base Layer Text */}
        <div className="w-full h-full flex items-center justify-end pr-4 text-foreground relative z-10">
          <span
            className={`font-sans font-black text-2xl sm:text-3xl tracking-tighter uppercase transition-transform duration-150 ${
              isLangPressed ? 'scale-95' : 'scale-100'
            }`}
          >
            LANG {locale === 'id' ? 'ID' : 'EN'}
          </span>
        </div>
      </div>

      {/* 1x2 Grid Inverted Box: LIGHT/DARK (128px x 64px) */}
      <div
        id="nav-theme-box"
        data-absorb-cursor="true"
        ref={themeRef}
        onClick={onToggleTheme}
        onMouseEnter={(e) => {
          setIsThemeHovered(true);
          handleThemeMouseMove(e);
        }}
        onMouseMove={handleThemeMouseMove}
        onMouseLeave={() => {
          setIsThemeHovered(false);
          setIsThemePressed(false);
        }}
        onMouseDown={() => setIsThemePressed(true)}
        onMouseUp={() => setIsThemePressed(false)}
        className="w-[128px] h-[64px] relative cursor-pointer select-none group flex items-center justify-end"
      >
        {/* Inverted 1x2 Grid Lens Layer */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 ${
            isThemeHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Inverted Lens Body */}
          <div className="w-full h-full relative bg-[#020817] dark:bg-[#fdf7e8] border border-white/20 dark:border-black/15 shadow-sm">
            {/* Inverted Text */}
            <div className="w-full h-full flex items-center justify-end pr-4 text-white dark:text-black">
              <span
                className={`font-sans font-black text-2xl sm:text-3xl tracking-tighter uppercase transition-transform duration-150 ${
                  isThemePressed ? 'scale-95' : 'scale-100'
                }`}
              >
                {isDarkMode ? 'LIGHT' : 'DARK'}
              </span>
            </div>
          </div>

          {/* SVG Grid Overlay (Unclipped full circles matching BrutalistGrid dots) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 128 64">
            {/* Internal 1x2 grid crosshair vertical line */}
            <line x1="64" y1="0" x2="64" y2="64" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
            {/* 6 Grid intersection dots */}
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
            ref={themeAnchorRef}
            className="absolute top-0 left-0 pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm ring-2 ring-white/70 dark:ring-black/70" />
          </div>
        </div>

        {/* Base Layer Text */}
        <div className="w-full h-full flex items-center justify-end pr-4 text-foreground relative z-10">
          <span
            className={`font-sans font-black text-2xl sm:text-3xl tracking-tighter uppercase transition-transform duration-150 ${
              isThemePressed ? 'scale-95' : 'scale-100'
            }`}
          >
            {isDarkMode ? 'LIGHT' : 'DARK'}
          </span>
        </div>
      </div>

      {/* 1x2 Grid Inverted Box: HOME (128px x 64px, fades in as page reaches bottom) */}
      <div
        id="nav-home-box"
        data-absorb-cursor="true"
        ref={homeRef}
        onClick={() => smoothScrollTo(0)}
        onMouseEnter={(e) => {
          setIsHomeHovered(true);
          handleHomeMouseMove(e);
        }}
        onMouseMove={handleHomeMouseMove}
        onMouseLeave={() => {
          setIsHomeHovered(false);
          setIsHomePressed(false);
        }}
        onMouseDown={() => setIsHomePressed(true)}
        onMouseUp={() => setIsHomePressed(false)}
        style={{
          opacity: homeOpacity,
          pointerEvents: homeOpacity > 0.05 ? 'auto' : 'none',
          transform: `translate3d(0, ${(1 - homeOpacity) * 12}px, 0)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        className="w-[128px] h-[64px] relative cursor-pointer select-none group flex items-center justify-end"
      >
        {/* Inverted 1x2 Grid Lens Layer */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 ${
            isHomeHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Inverted Lens Body */}
          <div className="w-full h-full relative bg-[#020817] dark:bg-[#fdf7e8] border border-white/20 dark:border-black/15 shadow-sm">
            {/* Inverted Text */}
            <div className="w-full h-full flex items-center justify-end pr-4 text-white dark:text-black">
              <span
                className={`font-sans font-black text-2xl sm:text-3xl tracking-tighter uppercase transition-transform duration-150 ${
                  isHomePressed ? 'scale-95' : 'scale-100'
                }`}
              >
                HOME
              </span>
            </div>
          </div>

          {/* SVG Grid Overlay (Unclipped full circles matching BrutalistGrid dots) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 128 64">
            {/* Internal 1x2 grid crosshair vertical line */}
            <line x1="64" y1="0" x2="64" y2="64" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
            {/* 6 Grid intersection dots */}
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

          {/* Collaborator Pill Badge: TOP */}
          <div className="absolute -bottom-5 right-0 translate-x-1/2 flex items-center justify-center pointer-events-none select-none z-30">
            <span className="bg-white text-black dark:bg-black dark:text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              TOP
            </span>
          </div>

          {/* Cursor Anchor Dot */}
          <div
            ref={homeAnchorRef}
            className="absolute top-0 left-0 pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm ring-2 ring-white/70 dark:ring-black/70" />
          </div>
        </div>

        {/* Base Layer Text */}
        <div className="w-full h-full flex items-center justify-end pr-4 text-foreground relative z-10">
          <span
            className={`font-sans font-black text-2xl sm:text-3xl tracking-tighter uppercase transition-transform duration-150 ${
              isHomePressed ? 'scale-95' : 'scale-100'
            }`}
          >
            HOME
          </span>
        </div>
      </div>
    </nav>
  );
}
