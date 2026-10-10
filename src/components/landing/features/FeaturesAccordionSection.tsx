import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { LandingContent } from '../../../constants/landingTranslations';
import { FeatureAccordionItem } from './FeatureAccordionItem';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FeaturesAccordionSectionProps {
  t: LandingContent;
}

export function FeaturesAccordionSection({ t }: FeaturesAccordionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 1st point is open initially
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [trackOffset, setTrackOffset] = useState<number>(0);

  const features = t.featuresList.items;

  // Snap-scroll: translate listTrack so focused point stays at the top
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) {
      setTrackOffset(0);
      return;
    }

    if (activeIdx <= 0) {
      setTrackOffset(0);
      return;
    }

    let offsetSum = 0;
    for (let i = 0; i < activeIdx; i++) {
      const el = itemRefs.current[i];
      const btn = el?.querySelector('button');
      offsetSum += btn ? btn.offsetHeight : 52;
    }
    setTrackOffset(offsetSum);
  }, [activeIdx]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      const leftCol = leftColRef.current;
      const textBlock = textBlockRef.current;
      if (!section || !container || !leftCol || !textBlock) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const getMaxDistance = () => {
          const lh = leftCol.offsetHeight || 560;
          const th = textBlock.offsetHeight || 0;
          return Math.max(0, lh - th);
        };

        const scrollDistance = () => Math.max(2200, Math.round(features.length * 280));
        const stepThreshold = 0.80;
        const dragEndThreshold = 0.94; // Hold frame at bottom alignment

        const tween = gsap.to(textBlock, {
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            start: () => {
              const h = container.offsetHeight;
              if (window.innerHeight >= h + 60) {
                return 'center center';
              }
              return 'top 80px';
            },
            end: () => `+=${scrollDistance()}`,
            scrub: 0.15,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = Math.max(0, Math.min(1, self.progress));

              if (p <= stepThreshold) {
                // Step through items 0 to 10 while text stays sticky at top
                const stepP = p / stepThreshold;
                const nextIdx = Math.min(
                  features.length - 1,
                  Math.floor(stepP * features.length)
                );
                setActiveIdx(nextIdx);
                gsap.set(textBlock, { y: 0 });
              } else if (p <= dragEndThreshold) {
                // Last point remains open; text smoothly drags down to bottom stop
                setActiveIdx(features.length - 1);
                const dragP = (p - stepThreshold) / (dragEndThreshold - stepThreshold);
                const maxDist = getMaxDistance();
                gsap.set(textBlock, { y: Math.min(maxDist, dragP * maxDist) });
              } else {
                // Strictly hold at intended bottom stop; text never rolls lower
                setActiveIdx(features.length - 1);
                const maxDist = getMaxDistance();
                gsap.set(textBlock, { y: maxDist });
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [features.length] }
  );

  const handleToggle = (index: number) => {
    setActiveIdx((current) => (current === index ? -1 : index));
  };

  return (
    <section ref={sectionRef} id="features" className="relative z-10 w-full">
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-24 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Focused Point Stays on Top (No inner scrollbar) */}
          <div className="order-2 lg:order-1 lg:col-span-7 relative">
            {/* Soft light radial gradient behind accordion (softens background grid dots) */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 -z-10 pointer-events-none flex items-center justify-center"
            >
              <div
                className="w-[125%] h-[125%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(241,245,249,0.92)_0%,_rgba(241,245,249,0.45)_50%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_center,_#020817_0%,_rgba(2,8,23,0.88)_35%,_rgba(2,8,23,0.45)_55%,_transparent_75%)]"
              />
            </div>

            <div
              ref={leftColRef}
              className="border-t border-border overflow-hidden relative z-10 lg:h-[560px]"
            >
              <div
                style={{
                  transform: `translateY(-${trackOffset}px)`,
                }}
                className="flex flex-col transition-transform duration-500 ease-out will-change-transform"
              >
                {features.map((item, idx) => (
                  <div
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                  >
                    <FeatureAccordionItem
                      id={item.id}
                      number={item.number}
                      title={item.title}
                      description={item.description}
                      assetLabel={item.assetLabel}
                      isOpen={activeIdx === idx}
                      onToggle={() => handleToggle(idx)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text (Sticky at top, drags down after last point) */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative lg:h-[560px]">
            <div
              ref={textBlockRef}
              className="flex flex-col items-start will-change-transform relative z-10"
            >
              {/* Subtle softlight behind text: strictly bounded between title top and subtext bottom */}
              <div
                aria-hidden="true"
                className="absolute -inset-x-8 -top-2 -bottom-2 -z-10 pointer-events-none flex items-center justify-center"
              >
                <div
                  className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_50%_50%,_rgba(241,245,249,0.85)_0%,_rgba(241,245,249,0.4)_50%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_50%_50%,_#020817_0%,_rgba(2,8,23,0.85)_35%,_rgba(2,8,23,0.4)_55%,_transparent_75%)]"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-[1.05] mb-5">
                {t.featuresList.title}
              </h2>
              <p className="font-sans text-base sm:text-lg leading-relaxed font-normal text-black dark:text-white max-w-md">
                {t.featuresList.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
