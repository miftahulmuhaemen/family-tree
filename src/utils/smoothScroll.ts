import gsap from 'gsap';

const smoothScrollObj = { y: 0 };

/**
 * Smoothly scrolls the window to targetY using GSAP's power3.inOut easing.
 * Eliminates browser-native instant snapping or jerky scrollIntoView behavior.
 */
export function smoothScrollTo(targetY: number, baseDuration: number = 1.3) {
  if (typeof window === 'undefined') return;

  const currentY = window.scrollY;
  const distance = Math.abs(currentY - targetY);
  if (distance < 2) return;

  // Kill existing tweens on the scroll target object to prevent conflicting jumps
  gsap.killTweensOf(smoothScrollObj);

  smoothScrollObj.y = currentY;

  // Scale duration adaptively based on distance for comfortable gliding feel
  const duration = Math.min(1.8, Math.max(0.85, baseDuration * (0.8 + 0.4 * (distance / 3000))));

  gsap.to(smoothScrollObj, {
    y: targetY,
    duration,
    ease: 'power3.inOut',
    onUpdate: () => {
      window.scrollTo(0, smoothScrollObj.y);
    },
  });
}
