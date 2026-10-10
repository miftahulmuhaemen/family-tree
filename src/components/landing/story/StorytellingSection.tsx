import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORY_NARRATIVES } from './storyNarratives';
import { StorySlide1 } from './StorySlide1';
import { StorySlide2 } from './StorySlide2';
import { StorySlide3 } from './StorySlide3';
import { StorySlide4 } from './StorySlide4';
import './storyStyles.css';

gsap.registerPlugin(ScrollTrigger);

export interface StorytellingSectionProps {
  locale: 'en' | 'id';
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function StorytellingSection({ locale }: StorytellingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const narrativeCardRef = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [slideProgresses, setSlideProgresses] = useState<[number, number, number, number]>([0, 0, 0, 0]);

  const narratives = STORY_NARRATIVES[locale];
  const currentNarrative = narratives[activeSlide] || narratives[0];

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const st = ScrollTrigger.create({
      trigger: section,
      pin: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const P = clamp(self.progress, 0, 1);

        // Calculate progress within each slide with generous stop-frame buffer
        // Motion completes in first 40% of each slide, holding at 1.0 (stop frame) for the remaining 60%
        const calcProgress = (start: number, end: number) => {
          if (P <= start) return 0;
          if (P >= end) return 1;
          const local = (P - start) / (end - start);
          return clamp(local / 0.40, 0, 1);
        };

        const p1 = calcProgress(0.00, 0.25);
        const p2 = calcProgress(0.25, 0.50);
        const p3 = calcProgress(0.50, 0.75);
        const p4 = calcProgress(0.75, 1.00);
        setSlideProgresses([p1, p2, p3, p4]);

        const slideIdx = P < 0.25 ? 0 : P < 0.50 ? 1 : P < 0.75 ? 2 : 3;
        setActiveSlide(slideIdx);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  // Animate left narrative change
  useEffect(() => {
    if (!narrativeCardRef.current) return;
    gsap.fromTo(
      narrativeCardRef.current,
      { opacity: 0.4, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [activeSlide, locale]);

  return (
    <section
      id="story-section"
      ref={sectionRef}
      className="relative h-[440vh] bg-transparent w-full"
    >
      {/* Pinned Fullscreen Presentation Container */}
      <div ref={containerRef} className="h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
        <div className="max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center h-full">
          
          {/* Left Column: Sticky Narrative Content */}
          <div className="lg:col-span-5 flex flex-col justify-center select-none relative z-20">
            {/* Soft light radial gradient behind text (softens background grid dots) */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 -z-10 pointer-events-none flex items-center justify-center"
            >
              <div
                className="w-[130%] h-[130%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(241,245,249,0.92)_0%,_rgba(241,245,249,0.45)_50%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_center,_#020817_0%,_rgba(2,8,23,0.88)_35%,_rgba(2,8,23,0.45)_55%,_transparent_75%)]"
              />
            </div>

            <div ref={narrativeCardRef} className="flex flex-col gap-4 max-w-lg">
              
              {/* Slide Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                {currentNarrative.title}
              </h2>

              {/* Description - All white in dark mode, dark in light mode */}
              <p className="text-foreground text-base sm:text-lg leading-relaxed font-normal">
                {currentNarrative.desc}
              </p>

              {/* Minimal Progress Indicator */}
              <div className="flex items-center gap-2 mt-4 pt-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === activeSlide
                        ? 'w-8 bg-foreground'
                        : 'w-3 bg-foreground/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Stage (Slides 1 to 4, discrete instant snap, no cross-fade ghosting) */}
          <div className="lg:col-span-7 flex items-center justify-center relative w-full aspect-[400/290] max-w-4xl mx-auto story-svg">
            {/* Soft light radial gradient circle behind the SVG stage */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 -z-10 pointer-events-none flex items-center justify-center"
            >
              <div
                className="w-[120%] h-[120%] rounded-full bg-[radial-gradient(circle_at_50%_50%,_rgba(241,245,249,0.92)_0%,_rgba(241,245,249,0.45)_50%,_transparent_75%)] dark:bg-[radial-gradient(circle_at_50%_50%,_#020817_0%,_rgba(2,8,23,0.88)_35%,_rgba(2,8,23,0.45)_55%,_transparent_75%)]"
              />
            </div>

            <div
              className="absolute inset-0"
              style={{
                display: activeSlide === 0 ? 'block' : 'none',
                pointerEvents: activeSlide === 0 ? 'auto' : 'none',
              }}
            >
              <StorySlide1 progress={slideProgresses[0]} locale={locale} />
            </div>

            <div
              className="absolute inset-0"
              style={{
                display: activeSlide === 1 ? 'block' : 'none',
                pointerEvents: activeSlide === 1 ? 'auto' : 'none',
              }}
            >
              <StorySlide2 progress={slideProgresses[1]} locale={locale} />
            </div>

            <div
              className="absolute inset-0"
              style={{
                display: activeSlide === 2 ? 'block' : 'none',
                pointerEvents: activeSlide === 2 ? 'auto' : 'none',
              }}
            >
              <StorySlide3 progress={slideProgresses[2]} locale={locale} />
            </div>

            <div
              className="absolute inset-0"
              style={{
                display: activeSlide === 3 ? 'block' : 'none',
                pointerEvents: activeSlide === 3 ? 'auto' : 'none',
              }}
            >
              <StorySlide4 progress={slideProgresses[3]} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
