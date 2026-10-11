import { useEffect, useRef, useMemo } from 'react';
import { TECH_STACK_ITEMS, getFeaturesItems, type FocalItem } from './focalMarqueeData';

export interface FocalMarqueeProps {
  type: 'tech' | 'features';
  locale?: 'en' | 'id';
  speed?: number; // pixels per second
  itemWidth?: number;
  className?: string;
}

const REPEAT_SETS = 3; // 3 complete sets for seamless infinite track wrapping

export function FocalMarquee({
  type,
  locale = 'en',
  speed = 72,
  itemWidth,
  className = '',
}: FocalMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isHoveredRef = useRef(false);
  const currentSpeedRef = useRef(speed);

  // Tech stack items have shorter labels; narrow to 200px to tighten gap while keeping features at 300px
  const resolvedItemWidth = itemWidth ?? (type === 'tech' ? 200 : 300);
  const focusRadius = type === 'tech' ? 50 : 75;

  const rawItems: FocalItem[] = useMemo(() => {
    return type === 'tech' ? TECH_STACK_ITEMS : getFeaturesItems(locale);
  }, [type, locale]);

  // Triple the items so we have [Set A, Set B, Set C]
  const items = useMemo(() => {
    const list: FocalItem[] = [];
    for (let r = 0; r < REPEAT_SETS; r++) {
      list.push(...rawItems);
    }
    return list;
  }, [rawItems]);

  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animId: number;
    const cycleWidth = rawItems.length * resolvedItemWidth;

    const renderFrame = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const container = containerRef.current;
      const track = trackRef.current;

      if (!container || !track) {
        animId = requestAnimationFrame(renderFrame);
        return;
      }

      const containerWidth = container.clientWidth || 1200;
      const centerX = containerWidth / 2;

      // Smooth deceleration on hover and smooth acceleration on resume
      const targetSpeed = isHoveredRef.current ? 0 : speed;
      const smoothingFactor = 1 - Math.exp(-dt * 4.5);
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * smoothingFactor;

      if (currentSpeedRef.current > 0.05) {
        offsetRef.current = (offsetRef.current + currentSpeedRef.current * dt) % cycleWidth;
      }

      // Track translates to the right from -cycleWidth towards 0
      const trackX = (offsetRef.current % cycleWidth) - cycleWidth;
      track.style.transform = `translate3d(${trackX}px, 0, 0)`;

      // Calculate optical focal depth per item based on center distance
      const totalCount = items.length;
      for (let i = 0; i < totalCount; i++) {
        const el = itemElementsRef.current[i];
        if (!el) continue;

        const itemScreenX = trackX + i * resolvedItemWidth + resolvedItemWidth / 2;
        const distFromCenter = Math.abs(itemScreenX - centerX);

        // Cull items outside the bounded container view
        if (itemScreenX < -resolvedItemWidth || itemScreenX > containerWidth + resolvedItemWidth) {
          el.style.visibility = 'hidden';
          continue;
        }

        el.style.visibility = 'visible';

        // Optical focal depth: center item is 100% in focus, others progressively blurred
        let blur = 0;
        let opacity = 1;
        let scale = 1;

        if (distFromCenter > focusRadius) {
          const falloff = Math.min(1, (distFromCenter - focusRadius) / (centerX * 0.72));
          blur = falloff * 6.5;
          opacity = Math.max(0.2, 1 - falloff * 0.75);
          scale = Math.max(0.88, 1 - falloff * 0.12);
        }

        el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none';
        el.style.opacity = opacity.toFixed(2);
        el.style.transform = `scale(${scale.toFixed(3)})`;
      }

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animId);
      lastTimeRef.current = null;
    };
  }, [items.length, rawItems.length, speed, resolvedItemWidth, focusRadius]);

  return (
    <section
      aria-label={type === 'tech' ? 'Technologies' : 'Features'}
      className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 select-none z-20 cursor-default ${className}`}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* Soft light radial gradient ellipse spanning across the back */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center overflow-visible"
      >
        <div
          className="w-[110%] h-[220%] rounded-full bg-[radial-gradient(ellipse_at_50%_50%,_rgba(241,245,249,0.9)_0%,_rgba(241,245,249,0.4)_50%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_50%_50%,_#020817_0%,_rgba(2,8,23,0.85)_35%,_rgba(2,8,23,0.4)_55%,_transparent_75%)]"
        />
      </div>

      {/* Bounded viewport with edge fade mask */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        {/* Continuous Rolling Track */}
        <div
          ref={trackRef}
          className="h-full flex flex-row items-center will-change-transform"
          style={{ width: `${items.length * resolvedItemWidth}px` }}
        >
          {items.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              ref={(node) => {
                itemElementsRef.current[idx] = node;
              }}
              style={{
                width: `${resolvedItemWidth}px`,
                willChange: 'transform, filter, opacity',
              }}
              className="h-full flex items-center justify-center gap-3.5 px-3 shrink-0 transition-none"
            >
              <div className="flex items-center justify-center text-foreground shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="font-sans font-bold text-xs md:text-sm tracking-tight text-foreground truncate whitespace-nowrap">
                  {item.name}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest leading-none pt-0.5">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
