import { useEffect, useRef } from 'react';

export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dot = dotRef.current;
    if (!dot) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let hasMoved = false;
    let rafId: number;
    let absorbScale = 1;

    const onPointerMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        currentX = targetX;
        currentY = targetY;
        dot.style.opacity = '1';
      }
    };

    const onMouseLeave = () => {
      dot.style.opacity = '0';
    };

    const onMouseEnter = () => {
      if (hasMoved) {
        dot.style.opacity = absorbScale > 0.05 ? '1' : '0';
      }
    };

    const animate = () => {
      if (hasMoved) {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;

        // Check absorption into interactive brutalist grid boxes
        const absorbElements = document.querySelectorAll<HTMLElement>('[data-absorb-cursor="true"]');
        let isInside = false;
        let pullX = currentX;
        let pullY = currentY;
        let minSurfaceDist = Infinity;
        let closestNearestX = currentX;
        let closestNearestY = currentY;

        for (let k = 0; k < absorbElements.length; k++) {
          const el = absorbElements[k];
          const rect = el.getBoundingClientRect();
          const inside = (
            targetX >= rect.left &&
            targetX <= rect.right &&
            targetY >= rect.top &&
            targetY <= rect.bottom
          );
          if (inside) {
            isInside = true;
            pullX = targetX;
            pullY = targetY;
            break;
          }

          const nearestX = Math.max(rect.left, Math.min(rect.right, targetX));
          const nearestY = Math.max(rect.top, Math.min(rect.bottom, targetY));
          const dist = Math.hypot(targetX - nearestX, targetY - nearestY);
          if (dist < minSurfaceDist) {
            minSurfaceDist = dist;
            closestNearestX = nearestX;
            closestNearestY = nearestY;
          }
        }

        if (!isInside && minSurfaceDist < 42) {
          const pullFactor = Math.pow(1 - minSurfaceDist / 42, 2) * 0.45;
          pullX = currentX + (closestNearestX - currentX) * pullFactor;
          pullY = currentY + (closestNearestY - currentY) * pullFactor;
        }

        if (isInside) {
          // Rapidly absorb into the box: scale down to 0
          absorbScale += (0 - absorbScale) * 0.32;
          if (absorbScale < 0.01) absorbScale = 0;
        } else {
          // Emerge back out from the box with a smooth spring expansion
          absorbScale += (1 - absorbScale) * 0.22;
          if (absorbScale > 0.99) absorbScale = 1;
        }

        dot.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) translate(-50%, -50%) scale(${absorbScale.toFixed(3)})`;
        dot.style.opacity = (absorbScale > 0.01 ? absorbScale : 0).toString();
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        opacity: 0,
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(1)',
        willChange: 'transform, opacity',
      }}
      className="fixed top-0 left-0 w-10 h-10 rounded-full bg-white mix-blend-difference pointer-events-none z-50"
    />
  );
}



