import { useState, useRef, useEffect } from 'react';

export interface UseSidebarResizeReturn {
  width: number;
  isResizing: boolean;
  setIsResizing: (val: boolean) => void;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
}

export function useSidebarResize(initialWidth: number = 440): UseSidebarResizeReturn {
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return initialWidth;
    return Math.min(initialWidth, window.innerWidth);
  });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      const maxWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
      if (newWidth >= 320 && newWidth <= maxWidth * 0.6) {
        setWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return { width, isResizing, setIsResizing, sidebarRef };
}
