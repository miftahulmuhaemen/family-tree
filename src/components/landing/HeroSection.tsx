import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { LandingContent } from '../../constants/landingTranslations';
import { HairlineFigure } from './HairlineFigure';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroSectionProps {
  t: LandingContent;
}

export function HeroSection({ t }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const figureWrapRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<number | null>(0);

  useGSAP(
    () => {
      // 1. Entrance timeline for Hero elements
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-headline', {
        y: 35,
        opacity: 0,
        duration: 0.85,
      })
        .from(
          '.hero-desc',
          {
            y: 20,
            opacity: 0,
            duration: 0.65,
          },
          '-=0.45'
        )
        .from(
          '.hero-actions',
          {
            y: 15,
            opacity: 0,
            duration: 0.55,
          },
          '-=0.35'
        )
        .from(
          '.hero-highlight-item',
          {
            y: 10,
            opacity: 0,
            stagger: 0.08,
            duration: 0.45,
          },
          '-=0.25'
        )
        .from(
          figureWrapRef.current,
          {
            scale: 0.94,
            opacity: 0,
            duration: 0.9,
            ease: 'power2.out',
          },
          '-=0.7'
        );

      // 2. Second-layer GSAP animation: ScrollTrigger driving ancestral wave & parallax float
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Step through lineage generations as user scrolls
          if (p < 0.25) {
            setActiveNode(0); // Self / Root
          } else if (p < 0.5) {
            setActiveNode(1); // Father / Paternal
          } else if (p < 0.75) {
            setActiveNode(2); // Mother / Maternal
          } else {
            setActiveNode(3); // Ancestral grandparents
          }
        },
      });

      // Subtle parallax float on the figure wrapper
      if (figureWrapRef.current) {
        gsap.to(figureWrapRef.current, {
          y: 45,
          rotationZ: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Narrative Headline & Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Headline */}
            <h1 className="hero-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              {t.hero.titleLine1}{' '}
              <span className="text-muted-foreground font-semibold">
                {t.hero.titleLine2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-desc text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              {t.hero.description}
            </p>

            {/* Action Group */}
            <div className="hero-actions flex flex-wrap items-center gap-3 sm:gap-4 mb-8 w-full sm:w-auto">
              <Link
                to="/app"
                className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 flex items-center justify-center transition-colors shadow-sm w-full sm:w-auto"
              >
                <span>{t.hero.primaryCta}</span>
              </Link>
              <a
                href="#pillars"
                className="h-11 px-5 rounded-xl border border-border bg-card/60 hover:bg-accent text-foreground text-sm font-medium flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
              >
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                <span>{t.hero.secondaryCta}</span>
              </a>
            </div>

            {/* Verified Technical Characteristics */}
            <ul className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-6 pt-6 border-t border-border/60 text-xs text-muted-foreground w-full">
              {t.hero.highlights.map((highlight, idx) => (
                <li key={idx} className="hero-highlight-item flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-foreground/70 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Hairline Isometric Pedigree Figure with GSAP Scroll Wave */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div ref={figureWrapRef} className="w-full relative will-change-transform">
              <HairlineFigure className="w-full" activeNodeId={activeNode} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
