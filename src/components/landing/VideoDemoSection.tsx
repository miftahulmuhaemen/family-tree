import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface VideoDemoSectionProps {
  locale: 'en' | 'id';
}

const titles = {
  en: {
    line1: 'Sanak Keluarga Studio is your open-source heritage',
    line2: 'tool to build family trees and explore family lineage.',
  },
  id: {
    line1: 'Sanak Keluarga Studio adalah alat silsilah sumber terbuka',
    line2: 'untuk menyusun pohon keluarga dan menelusuri garis keturunan.',
  },
};

export function VideoDemoSection({ locale }: VideoDemoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedContentRef = useRef<HTMLDivElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useGSAP(
    () => {
      const badge = badgeRef.current;
      const videoFrame = videoFrameRef.current;
      const pinnedContent = pinnedContentRef.current;
      const section = sectionRef.current;
      if (!badge || !videoFrame || !pinnedContent || !section) return;

      const getMaxDistance = () => {
        const vh = videoFrame.offsetHeight;
        const bh = badge.offsetHeight;
        return Math.max(0, vh - bh);
      };

      const scrollDistance = () => Math.max(450, Math.round(getMaxDistance() * 1.25));

      const tween = gsap.to(badge, {
        y: () => getMaxDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinnedContent,
          pin: true,
          start: () => {
            const h = pinnedContent.offsetHeight;
            if (window.innerHeight >= h + 60) {
              return 'center center';
            }
            return 'top 80px';
          },
          end: () => `+=${scrollDistance()}`,
          scrub: 0.15,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
      };
    },
    { scope: sectionRef }
  );

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section ref={sectionRef} className="relative z-10 w-full">
      <div
        ref={pinnedContentRef}
        className="relative pl-14 pr-4 sm:px-20 md:px-24 py-16 md:py-24 max-w-6xl mx-auto w-full"
      >
        {/* Editorial Title */}
        <div className="mb-6 sm:mb-8 text-foreground font-sans">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight leading-snug">
            {titles[locale].line1}
            <br className="hidden sm:inline" />{' '}
            {titles[locale].line2}
          </h2>
        </div>

        {/* Video Demo Stage with Attached DEMO Badge */}
        <div className="relative">
          {/* Left DEMO Badge */}
          <div
            ref={badgeRef}
            aria-label="Demo badge"
            className="absolute right-full top-0 w-11 sm:w-14 md:w-16 h-36 sm:h-44 md:h-48 bg-[#4184f6] dark:bg-pink-500 text-white flex items-center justify-center select-none z-20 will-change-transform"
          >
            <span className="font-sans font-black text-xl sm:text-2xl md:text-3xl tracking-widest -rotate-90 select-none">
              DEMO
            </span>
          </div>

          {/* Video Frame */}
          <div
            ref={videoFrameRef}
            className="relative border border-foreground/30 dark:border-white/20 bg-black overflow-hidden group"
          >
          {/* HUD Header */}
          <div className="flex flex-wrap items-center justify-between bg-white text-slate-900 px-4 py-2 font-sans font-bold text-[11px] sm:text-xs uppercase tracking-tight border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span>[FEED // ARCHIVE_DEMO.MP4]</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">[ RES // 1080P_60FPS ]</span>
              <button
                type="button"
                onClick={togglePlay}
                className="hover:opacity-75 transition-opacity cursor-pointer font-bold"
              >
                [{isPlaying ? 'PAUSE' : 'PLAY'}]
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative cursor-pointer" onClick={togglePlay}>
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover block"
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1280&auto=format&fit=crop"
            >
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                type="video/mp4"
              />
            </video>

            {/* Lower Brutalist Metadata Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 backdrop-blur-sm px-4 py-2.5 sm:py-3 flex flex-wrap justify-between items-center font-sans font-bold text-[10px] sm:text-xs uppercase tracking-tight text-white border-t border-white/10">
              <span>
                {locale === 'id' ? 'INTERAKSI GRAFIK KINSHIP REAL-TIME' : 'REAL-TIME KINSHIP GRAPH ENGINE'}
              </span>
              <span className="text-zinc-400">[ STATUS: RECORDED_STREAM ]</span>
            </div>
          </div>
        </div>

        {/* Technical Brutalist Scale Ruler */}
        <div
          aria-hidden="true"
          className="w-full h-2 overflow-hidden mt-1 opacity-40 select-none pointer-events-none"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="video-demo-ticks"
                width="40"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-foreground"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#video-demo-ticks)" />
          </svg>
        </div>
      </div>
      </div>
    </section>
  );
}
