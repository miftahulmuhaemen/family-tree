import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { smoothScrollTo } from '../../../utils/smoothScroll';
import {
  createCam, proj, unproj, fitCam, facingCam, makeRings,
  prismGeom, createSpring, stepSpring, clamp
} from './heroGeometry';
import { NAMES, SEX, getRel, type PersonNode } from './heroData';
import { createSvgEl, createSolid, putSolid, drawPerson } from './heroDrawer';
import { KINSHIP_ID_MAPPING } from '../../../utils/i18n';

interface HeroCrowdStandProps {
  locale?: 'en' | 'id';
}

export function HeroCrowdStand({ locale = 'en' }: HeroCrowdStandProps) {
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inviteBubbleRef = useRef<HTMLDivElement>(null);
  const bARef = useRef<HTMLDivElement>(null);
  const bBRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cursorAnchorRef = useRef<HTMLDivElement>(null);
  const [isActionHovered, setIsActionHovered] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<'studio' | 'story' | null>(null);
  const [isPressed, setIsPressed] = useState<'studio' | 'story' | null>(null);

  const isId = locale === 'id';
  const titleText = isId ? 'Buka Studio' : 'Open Studio';
  const titleChars = Array.from(titleText).map((c) => (c === ' ' ? '\u00A0' : c));
  const subtext = isId ? 'atau cari tahu lebih lanjut ...' : 'or find out more ...';

  const localeRef = useRef(locale);
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const updateLensPosition = (clientX: number, clientY: number) => {
    if (!actionRef.current) return;
    const rect = actionRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // 512px container width, 192px 3x3 lens width -> range [0, 320]
    const targetBoxX = Math.max(0, Math.min(320, x - 96));

    if (lensRef.current) {
      lensRef.current.style.transform = `translate3d(${targetBoxX}px, 0px, 0px)`;
    }
    if (innerRef.current) {
      innerRef.current.style.transform = `translate3d(${-targetBoxX}px, 0px, 0px)`;
    }
    if (cursorAnchorRef.current) {
      cursorAnchorRef.current.style.transform = `translate3d(${x - targetBoxX}px, ${y}px, 0px)`;
    }
  };

  const handleActionMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsActionHovered(true);
    updateLensPosition(e.clientX, e.clientY);
  };

  const handleActionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateLensPosition(e.clientX, e.clientY);
  };

  const handleActionMouseLeave = () => {
    setIsActionHovered(false);
    setHoveredRow(null);
    setIsPressed(null);
  };

  useEffect(() => {
    const snapToGrid = () => {
      const el = actionRef.current;
      if (!el) return;
      el.style.transform = 'translateY(-64px)';
      const rect = el.getBoundingClientRect();
      const snappedX = Math.round(rect.left / 64) * 64;
      const snappedY = Math.round(rect.top / 64) * 64;
      const dx = snappedX - rect.left;
      const dy = snappedY - rect.top;
      el.style.transform = `translate(${dx}px, calc(-64px + ${dy}px))`;
    };

    snapToGrid();
    window.addEventListener('resize', snapToGrid);
    return () => window.removeEventListener('resize', snapToGrid);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    const inviteBubble = inviteBubbleRef.current;
    const bA = bARef.current;
    const bB = bBRef.current;
    if (!stage || !svg || !inviteBubble || !bA || !bB) return;

    svg.replaceChildren();

    const N = 6, CELL = 10.5, EXT = N * CELL, PB = 4;
    const C = createCam(45, 0.5, 2.95);
    fitCam(C, [[-6, -6, -PB], [EXT + 6, EXT + 6, -PB], [EXT + 6, -6, -PB], [-6, EXT + 6, -PB], [0, 0, 24]], 200, 160);
    const P = proj(C), front = facingCam(C);
    const g = createSvgEl("g", {}, svg);

    // Rounded Ground Plinth
    const [pr, pi] = makeRings(-6, -6, EXT + 6, EXT + 6, 8, 2.0);
    const plinthSolid = createSolid(g);
    putSolid(plinthSolid, prismGeom(P, front, pr, pi, -PB, 0));

    // People Grid
    const people: PersonNode[] = [];
    for (let s = 0; s <= 2 * (N - 1); s++) {
      for (let i = 0; i < N; i++) {
        const j = s - i;
        if (j < 0 || j >= N) continue;
        const idx = (i * N + j) % NAMES.length;
        const isFemale = SEX[idx] === "0";
        const pG = createSvgEl("g", {}, g);
        people.push({
          idx, i, j, isFemale, name: NAMES[idx], cx: (i + 0.5) * CELL, cy: (j + 0.5) * CELL,
          pG,
          elTorso: createSolid(pG), elArmL: createSolid(pG), elArmR: createSolid(pG),
          elLegL: createSolid(pG), elLegR: createSolid(pG), elNeck: createSolid(pG),
          elHairBack: isFemale ? createSvgEl("path", { class: "sil" }, pG) : null,
          elHeadCircle: createSvgEl("circle", { class: "sil" }, pG),
          elChin: createSvgEl("path", { class: "nf lo" }, pG),
          elHairFront: isFemale ? createSvgEl("path", { class: "nf lo" }, pG) : null,
          sp: createSpring(0, { eps: 0.02 }),
          spDrop: createSpring(75, { k: 130, c: 14, eps: 0.02 }),
          headPos: [0, 0], visible: false
        });
      }
    }

    const topGuy = people.find((p) => p.i === 0 && p.j === 0) || people[0];
    let focused: PersonNode | null = null;
    let partner: PersonNode | null = null;
    let touched = false;
    let animId = 0;

    const bubbleEl: HTMLDivElement = inviteBubble;
    const bubbleA: HTMLDivElement = bA;
    const bubbleB: HTMLDivElement = bB;

    const bAName = bubbleA.querySelector(".chat-name") as HTMLElement;
    const bAMsg = bubbleA.querySelector(".chat-msg") as HTMLElement;
    const bBName = bubbleB.querySelector(".chat-name") as HTMLElement;
    const bBMsg = bubbleB.querySelector(".chat-msg") as HTMLElement;

    function setHighlight(p: PersonNode | null, on: boolean) {
      if (!p) return;
      p.elTorso.sil.classList.toggle("hi", on);
      p.elArmL.sil.classList.toggle("hi", on);
      p.elArmR.sil.classList.toggle("hi", on);
      p.elLegL.sil.classList.toggle("hi", on);
      p.elLegR.sil.classList.toggle("hi", on);
      p.elNeck.sil.classList.toggle("hi", on);
      p.elHeadCircle.classList.toggle("hi", on);
      p.elChin.classList.toggle("hi", on);
      if (p.elHairFront) p.elHairFront.classList.toggle("hi", on);
      if (p.elHairBack) p.elHairBack.classList.toggle("hi", on);
    }

    function pickPartner(pA: PersonNode) {
      const rels: PersonNode[] = [];
      for (const p of people) {
        if (p === pA) continue;
        const r = getRel(pA.idx, p.idx);
        if (r !== "Relative") rels.push(p);
      }
      return rels.length ? rels[(pA.i + pA.j) % rels.length] : people[(pA.idx + 1) % people.length];
    }

    function updateBubbles() {
      if (!touched && bubbleEl.classList.contains("show")) {
        bubbleEl.style.left = (topGuy.headPos[0] / 4) + "%";
        bubbleEl.style.top = (topGuy.headPos[1] / 3.2) + "%";
      }
      if (focused && partner && touched) {
        bubbleA.classList.remove("hl-hide");
        bubbleB.classList.remove("hl-hide");
        bubbleA.classList.add("show");
        bubbleB.classList.add("show");
        const aTop = focused.headPos[1] <= partner.headPos[1];
        bubbleA.classList.toggle("hl-top", aTop);
        bubbleB.classList.toggle("hl-top", !aTop);
        bubbleA.style.left = `${focused.headPos[0] / 4}%`;
        bubbleA.style.top = `${Math.max(16, focused.headPos[1] / 3.2)}%`;
        bubbleB.style.left = `${partner.headPos[0] / 4}%`;
        bubbleB.style.top = `${Math.max(16, partner.headPos[1] / 3.2)}%`;
      } else {
        bubbleA.classList.add("hl-hide");
        bubbleB.classList.add("hl-hide");
        bubbleA.classList.remove("show");
        bubbleB.classList.remove("show");
      }
    }

    function retarget(over: [number, number] | null) {
      if (!touched) {
        touched = true;
        bubbleEl.classList.remove("show");
        setHighlight(topGuy, false);
      }
      for (const p of people) {
        p.sp.t = 0;
        setHighlight(p, false);
      }
      if (!over) {
        focused = null; partner = null;
      } else {
        const i = clamp(Math.floor(over[0] / CELL), 0, N - 1);
        const j = clamp(Math.floor(over[1] / CELL), 0, N - 1);
        focused = people.find((p) => p.i === i && p.j === j) || people[0];
        partner = pickPartner(focused);
        focused.sp.t = 1; partner.sp.t = 1;
        setHighlight(focused, true);
        setHighlight(partner, true);
        const rA = getRel(partner.idx, focused.idx), rB = getRel(focused.idx, partner.idx);
        const fM = SEX[focused.idx] === "1", pM = SEX[partner.idx] === "1";
        bubbleA.classList.toggle("hl-m", fM); bubbleA.classList.toggle("hl-f", !fM);
        bubbleB.classList.toggle("hl-m", pM); bubbleB.classList.toggle("hl-f", !pM);
        const isCurrentId = localeRef.current === 'id';
        const relA = isCurrentId ? (KINSHIP_ID_MAPPING[rA] || rA) : rA;
        const relB = isCurrentId ? (KINSHIP_ID_MAPPING[rB] || rB) : rB;
        if (bAName) bAName.textContent = focused.name;
        if (bBName) bBName.textContent = partner.name;
        if (bAMsg) bAMsg.textContent = isCurrentId
          ? `"Halo ${partner.name.split(" ")[0]}, aku ${relA}-mu."`
          : `"Hi ${partner.name.split(" ")[0]}, I am your ${rA}."`;
        if (bBMsg) bBMsg.textContent = isCurrentId
          ? `"Halo ${focused.name.split(" ")[0]}, aku ${relB}-mu."`
          : `"Hello ${focused.name.split(" ")[0]}, I am your ${rB}."`;
      }
    }

    // Storyboard sequence: Drop in diagonal cascade, then show invite bubble
    people.forEach((p) => {
      p.spDrop.x = 75; p.spDrop.v = 0; p.spDrop.t = 75;
      p.sp.x = 0; p.sp.v = 0; p.sp.t = 0;
      p.pG.style.display = "none"; p.visible = false;
      setHighlight(p, false);
    });

    const timers: number[] = [];
    timers.push(window.setTimeout(() => {
      people.forEach((p) => {
        const delay = (p.i + p.j) * 35;
        timers.push(window.setTimeout(() => { p.spDrop.t = 0; }, delay));
      });
    }, 400));

    timers.push(window.setTimeout(() => {
      if (!touched) {
        setHighlight(topGuy, true);
        bubbleEl.classList.add("show");
      }
    }, 1800));

    let lastTime = performance.now();
    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      for (const p of people) {
        stepSpring(p.spDrop, dt);
        stepSpring(p.sp, dt);
        drawPerson(p, C, P, front);
      }
      updateBubbles();
      animId = requestAnimationFrame(tick);
    }
    animId = requestAnimationFrame(tick);

    const getStagePt = (e: PointerEvent): [number, number] => {
      const r = stage.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width * 400, (e.clientY - r.top) / r.height * 320];
    };

    const handlePointerMove = (e: PointerEvent) => {
      const pt = getStagePt(e);
      retarget(unproj(C, pt[0], pt[1], 0));
    };
    const handlePointerDown = (e: PointerEvent) => {
      const pt = getStagePt(e);
      retarget(unproj(C, pt[0], pt[1], 0));
    };
    const handlePointerLeave = () => retarget(null);

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerdown", handlePointerDown);
    stage.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(animId);
      timers.forEach(clearTimeout);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerdown", handlePointerDown);
      stage.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const scrollToStory = () => {
    const el = document.getElementById('story-section');
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetY, 1.25);
    }
  };

  return (
    <section className="relative h-screen max-h-screen w-full bg-transparent flex flex-col items-center justify-between pt-2 pb-32 px-4 select-none overflow-hidden">
      <style>{`
        .hero-svg path, .hero-svg polygon, .hero-svg ellipse, .hero-svg circle, .hero-svg line {
          fill: hsl(var(--background));
          stroke: #52525b;
          stroke-width: 0.9px;
          vector-effect: non-scaling-stroke;
          stroke-linejoin: round;
          stroke-linecap: round;
          transition: stroke 240ms ease;
        }
        .hero-svg .nf { fill: none; }
        .hero-svg .fo { stroke: none; }
        .hero-svg .sil { stroke: #52525b; }
        .hero-svg .hi { stroke: #09090b; stroke-width: 1.2px; }
        .hero-svg .lo { stroke: #71717a; }

        .dark .hero-svg path, .dark .hero-svg polygon, .dark .hero-svg ellipse, .dark .hero-svg circle, .dark .hero-svg line {
          stroke: #5b5d64;
        }
        .dark .hero-svg .sil { stroke: #848a96; }
        .dark .hero-svg .hi { stroke: #ffffff; stroke-width: 1.2px; }
        .dark .hero-svg .lo { stroke: #3b3e48; }
        .invite-bubble {
          position: absolute;
          pointer-events: none;
          background: #3b82f6;
          color: #ffffff;
          border-radius: 14px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
          transform: translate(-50%, -100%) translateY(-20px);
          white-space: nowrap;
          z-index: 60;
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .invite-bubble::after {
          content: "";
          position: absolute;
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #3b82f6;
        }
        .invite-bubble.show {
          opacity: 1;
          transform: translate(-50%, -100%) translateY(-14px);
        }
        .chat-wrap {
          position: absolute;
          pointer-events: none;
          transform: translate(-50%, -100%) translateY(-14px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          white-space: nowrap;
          z-index: 50;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .chat-wrap.show {
          opacity: 1 !important;
        }
        .chat-wrap.hl-hide {
          opacity: 0 !important;
          pointer-events: none;
        }
        .chat-name {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
          margin-bottom: 3px;
          padding-left: 2px;
        }
        .dark .chat-name {
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
        }
        .chat-box {
          position: relative;
          border-radius: 14px;
          padding: 7px 13px;
          font-size: 12.5px;
          font-weight: 500;
          color: #ffffff;
          line-height: 1.3;
        }
        .chat-box::after {
          content: "";
          position: absolute;
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top-style: solid;
          border-top-width: 7px;
        }
        .hl-m .chat-name { color: #3b82f6; }
        .hl-m .chat-box { background: #3b82f6; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35); }
        .hl-m .chat-box::after { border-top-color: #3b82f6; }
        .hl-f .chat-name { color: #f472b6; }
        .hl-f .chat-box { background: #f472b6; box-shadow: 0 4px 14px rgba(244, 114, 182, 0.35); }
        .hl-f .chat-box::after { border-top-color: #f472b6; }
        .chat-wrap.hl-top { transform: translate(-50%, -100%) translateY(-56px) !important; }
        .chat-wrap.hl-top .chat-box::after { bottom: -48px !important; border-left-width: 5px !important; border-right-width: 5px !important; border-top-width: 48px !important; }
        .hl-m.hl-top .chat-box::after { border-top-color: #3b82f6 !important; }
        .hl-f.hl-top .chat-box::after { border-top-color: #f472b6 !important; }
        @keyframes heroArrowTingle {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-4px);
          }
          50% {
            transform: translateY(3px);
          }
          75% {
            transform: translateY(-2px);
          }
        }
        .animate-arrow-tingle {
          animation: heroArrowTingle 0.38s ease-in-out infinite;
        }
        @keyframes heroLetterJump {
          0%, 100% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-22px);
          }
          38% {
            transform: translateY(3px);
          }
          52% {
            transform: translateY(-7px);
          }
          68% {
            transform: translateY(1px);
          }
          80%, 100% {
            transform: translateY(0);
          }
        }
        .animate-letter-jump {
          animation: heroLetterJump 1.1s cubic-bezier(0.2, 0.8, 0.3, 1) infinite;
        }
      `}</style>

      {/* Main Crowd Stand Stage */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center my-auto">
        <div ref={stageRef} className="relative h-full max-h-[min(560px,calc(100vh-17rem))] aspect-[400/320] w-auto max-w-[960px] touch-none cursor-pointer">
          {/* Soft light radial gradient circle behind the object (shifted 1 grid row down) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center"
          >
            <div
              className="w-[115%] h-[115%] rounded-full translate-y-16 bg-[radial-gradient(circle_at_50%_50%,_rgba(241,245,249,0.85)_0%,_rgba(241,245,249,0.4)_50%,_transparent_75%)] dark:bg-[radial-gradient(circle_at_50%_50%,_#020817_0%,_rgba(2,8,23,0.85)_35%,_rgba(2,8,23,0.4)_55%,_transparent_75%)]"
            />
          </div>

          <svg ref={svgRef} viewBox="0 0 400 320" className="hero-svg w-full h-full block bg-transparent" />
          <div ref={inviteBubbleRef} className="invite-bubble">{isId ? 'Hai, sentuh aku!' : 'Hey, touch me!'}</div>
          <div ref={bARef} className="chat-wrap hl-bA hl-hide">
            <div className="chat-name" />
            <div className="chat-box"><span className="chat-msg" /></div>
          </div>
          <div ref={bBRef} className="chat-wrap hl-bB hl-hide">
            <div className="chat-name" />
            <div className="chat-box"><span className="chat-msg" /></div>
          </div>
        </div>
      </div>

      {/* Bottom Action Section: 8x3 grid space shifted 1 grid row up (-64px) */}
      <div
        id="hero-action-box"
        data-absorb-cursor="true"
        ref={actionRef}
        className="relative z-20 w-[512px] h-[192px] mx-auto -translate-y-16 select-none shrink-0"
        onMouseEnter={handleActionMouseEnter}
        onMouseMove={handleActionMouseMove}
        onMouseLeave={handleActionMouseLeave}
      >
        {/* Dynamic Inverted 3x3 Grid Lens anchored to cursor (192px x 192px) */}
        <div
          ref={lensRef}
          aria-hidden="true"
          style={{ willChange: 'transform' }}
          className={`absolute top-0 left-0 w-[192px] h-[192px] pointer-events-none z-20 transition-opacity duration-150 ${
            isActionHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Lens Body: Inverted background & Brutalist Grid lines/dots */}
          <div className="w-full h-full relative overflow-hidden bg-[#020817] dark:bg-[#fdf7e8] ring-1 ring-inset ring-white/20 dark:ring-black/15 shadow-sm">
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 192 192">
              {/* Internal 3x3 grid crosshair lines */}
              <line x1="64" y1="0" x2="64" y2="192" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
              <line x1="128" y1="0" x2="128" y2="192" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
              <line x1="0" y1="64" x2="192" y2="64" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
              <line x1="0" y1="128" x2="192" y2="128" stroke="currentColor" strokeWidth="1" className="text-white/[0.12] dark:text-black/[0.12]" />
              {/* 16 Grid intersection dots */}
              <circle cx="0" cy="0" r="3" className="fill-[#8b887f]" />
              <circle cx="64" cy="0" r="3" className="fill-[#8b887f]" />
              <circle cx="128" cy="0" r="3" className="fill-[#8b887f]" />
              <circle cx="192" cy="0" r="3" className="fill-[#8b887f]" />
              <circle cx="0" cy="64" r="3" className="fill-[#8b887f]" />
              <circle cx="64" cy="64" r="3" className="fill-[#8b887f]" />
              <circle cx="128" cy="64" r="3" className="fill-[#8b887f]" />
              <circle cx="192" cy="64" r="3" className="fill-[#8b887f]" />
              <circle cx="0" cy="128" r="3" className="fill-[#8b887f]" />
              <circle cx="64" cy="128" r="3" className="fill-[#8b887f]" />
              <circle cx="128" cy="128" r="3" className="fill-[#8b887f]" />
              <circle cx="192" cy="128" r="3" className="fill-[#8b887f]" />
              <circle cx="0" cy="192" r="3" className="fill-[#8b887f]" />
              <circle cx="64" cy="192" r="3" className="fill-[#8b887f]" />
              <circle cx="128" cy="192" r="3" className="fill-[#8b887f]" />
              <circle cx="192" cy="192" r="3" className="fill-[#8b887f]" />
            </svg>

            {/* Inverted Duplicate Text Layer (Offset negatively to align perfectly with base layer) */}
            <div
              ref={innerRef}
              className="absolute top-0 left-0 w-[512px] h-[192px] pointer-events-none flex flex-col"
              style={{ willChange: 'transform' }}
            >
              {/* Inverted Row 1 & 2: Open Studio (Height: 128px / 2 rows) */}
              <div className="w-full h-32 flex items-center justify-center">
                <span
                  className={`inline-flex items-center justify-center select-none text-5xl sm:text-6xl md:text-7xl font-black leading-none pt-2 transition-transform duration-200 ease-out text-white dark:text-black tracking-tight ${
                    isPressed === 'studio' ? 'scale-95 translate-y-0.5' : ''
                  }`}
                >
                  {titleChars.map((char, idx) => (
                    <span
                      key={idx}
                      className={hoveredRow === 'studio' ? 'animate-letter-jump' : ''}
                      style={{
                        display: 'inline-block',
                        animationDelay: `${idx * 0.045}s`,
                        willChange: hoveredRow === 'studio' ? 'transform' : 'auto',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </div>

              {/* Inverted Row 3: Subtext + Arrow (Height: 64px / 1 row) */}
              <div
                className={`w-full h-16 -mt-5 flex flex-col items-center justify-start pt-1 gap-1.5 pb-1 select-none transition-all duration-200 text-white dark:text-black ${
                  isPressed === 'story' ? 'scale-95 translate-y-1' : ''
                }`}
              >
                <span
                  className={`text-sm sm:text-base md:text-lg tracking-tight transition-all duration-150 ${
                    hoveredRow === 'story'
                      ? 'font-black text-white dark:text-black'
                      : 'font-medium text-white dark:text-black'
                  }`}
                >
                  {subtext}
                </span>
                <div className={hoveredRow === 'story' ? 'animate-arrow-tingle' : ''}>
                  <svg width="32" height="16" viewBox="0 0 24 14" fill="currentColor">
                    <polygon points="0,0 24,0 12,14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Corner Square Handles matching Figma / Canvas selection box */}
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 pointer-events-none z-30 shadow-sm" />
          <span className="w-2.5 h-2.5 bg-white dark:bg-black absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 pointer-events-none z-30 shadow-sm" />

          {/* Collaborator Tag: YOU */}
          <div className="absolute -bottom-5 right-0 translate-x-1/2 flex items-center justify-center pointer-events-none select-none z-30">
            <span className="bg-white text-black dark:bg-black dark:text-white text-xs font-sans font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              YOU
            </span>
          </div>

          {/* Cursor Anchor Dot */}
          <div
            ref={cursorAnchorRef}
            className="absolute top-0 left-0 pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm ring-2 ring-white/70 dark:ring-black/70" />
          </div>
        </div>

        {/* Base Layer Action Click Areas */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Action 1: Open Studio (Row 1 & 2, 128px) */}
          <button
            type="button"
            onClick={() => navigate('/app')}
            onMouseEnter={() => setHoveredRow('studio')}
            onMouseLeave={() => setHoveredRow(null)}
            onMouseDown={() => setIsPressed('studio')}
            onMouseUp={() => setIsPressed(null)}
            aria-label={titleText}
            className="w-full h-32 flex items-center justify-center cursor-pointer select-none"
          >
            <span
              className={`inline-flex items-center justify-center text-5xl sm:text-6xl md:text-7xl font-black leading-none pt-2 transition-transform duration-200 ease-out text-foreground tracking-tight ${
                isPressed === 'studio' ? 'scale-95 translate-y-0.5' : ''
              }`}
            >
              {titleChars.map((char, idx) => (
                <span
                  key={idx}
                  className={hoveredRow === 'studio' ? 'animate-letter-jump' : ''}
                  style={{
                    display: 'inline-block',
                    animationDelay: `${idx * 0.045}s`,
                    willChange: hoveredRow === 'studio' ? 'transform' : 'auto',
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </button>

          {/* Action 2: Subtext and arrow as one click container (Row 3, 64px) */}
          <button
            type="button"
            onClick={scrollToStory}
            onMouseEnter={() => setHoveredRow('story')}
            onMouseLeave={() => setHoveredRow(null)}
            onMouseDown={() => setIsPressed('story')}
            onMouseUp={() => setIsPressed(null)}
            aria-label={isId ? 'Gulir ke bagian cerita' : 'Scroll to story section'}
            className={`w-full h-16 -mt-5 flex flex-col items-center justify-start pt-1 gap-1.5 pb-1 cursor-pointer select-none transition-all duration-200 text-foreground ${
              isPressed === 'story' ? 'scale-95 translate-y-1' : ''
            }`}
          >
            <span
              className={`text-sm sm:text-base md:text-lg tracking-tight transition-all duration-150 ${
                hoveredRow === 'story'
                  ? 'font-black text-foreground'
                  : 'font-medium text-foreground'
              }`}
            >
              {subtext}
            </span>
            <div className={hoveredRow === 'story' ? 'animate-arrow-tingle' : ''}>
              <svg width="32" height="16" viewBox="0 0 24 14" fill="currentColor">
                <polygon points="0,0 24,0 12,14" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
