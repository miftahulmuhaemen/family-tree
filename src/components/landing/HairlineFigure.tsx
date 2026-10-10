import { useEffect, useRef } from 'react';
import {
  Cam, facing, fit, poly, prism, proj, rings, seg, ringAt,
  tdone, tset, tval, tween, unproj, injectHairlineStyles,
} from './hairlineCore';

const NODES = [
  { id: 0, l: 0, d: 34, h: 5 }, // Root / Self
  { id: 1, l: -32, d: 2, h: 7 }, // Father / Paternal line
  { id: 2, l: 32, d: 2, h: 7 }, // Mother / Maternal line
  { id: 3, l: -48, d: -30, h: 9 }, // Paternal grandfather
  { id: 4, l: -16, d: -30, h: 9 }, // Paternal grandmother
  { id: 5, l: 16, d: -30, h: 9 }, // Maternal grandfather
  { id: 6, l: 48, d: -30, h: 9 }, // Maternal grandmother
];

const LINEAGE: Record<number, Record<number, number>> = {
  0: { 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 2 },
  1: { 1: 0, 0: 1, 3: 1, 4: 1 },
  2: { 2: 0, 0: 1, 5: 1, 6: 1 },
  3: { 3: 0, 1: 1, 0: 2 },
  4: { 4: 0, 1: 1, 0: 2 },
  5: { 5: 0, 2: 1, 0: 2 },
  6: { 6: 0, 2: 1, 0: 2 },
};

const EDGES = [[3, 1], [4, 1], [5, 2], [6, 2], [1, 0], [2, 0]];
const LIFT = 14, RW = 5.4, RH = 5.4, RAD = 1.5, INSET = 0.55;
const toW = (l: number, d: number): [number, number] => [(d + l) / 2, (d - l) / 2];

interface HairlineFigureProps {
  className?: string;
  activeNodeId?: number | null;
  onNodeHover?: (nodeId: number | null) => void;
}

export function HairlineFigure({ className = '', activeNodeId = null, onNodeHover }: HairlineFigureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number>(-1);
  const baseActiveRef = useRef<number>(-1);
  const setActiveRef = useRef<(a: number) => void>(() => {});

  useEffect(() => {
    injectHairlineStyles();
    const container = containerRef.current;
    if (!container) return;

    const C = Cam(45, 0.5, 1.92);
    fit(C, [[-52, -52, -5], [52, 52, -5], [-52, 52, -5], [52, -52, -5], [0, 0, 24]], 200, 166);
    const P = proj(C), front = facing(C);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 400 320');
    svg.setAttribute('class', 'w-full h-full select-none');
    container.innerHTML = '';
    container.appendChild(svg);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(g);

    // Plinth base
    const [pRing, pInner] = rings(-50, -50, 50, 50, 10, 2.0);
    const pPrism = prism(P, front, pRing, pInner, -5, 0);
    const pSil = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pSil.setAttribute('d', pPrism.sil);
    pSil.setAttribute('class', 'sil');
    g.appendChild(pSil);
    if (pPrism.crease) {
      const pCr = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pCr.setAttribute('d', pPrism.crease);
      pCr.setAttribute('class', 'lo nf');
      g.appendChild(pCr);
    }

    // Lineage conduits
    for (const [u, v] of EDGES) {
      const [ux, uy] = toW(NODES[u].l, NODES[u].d);
      const [vx, vy] = toW(NODES[v].l, NODES[v].d);
      const edgePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      edgePath.setAttribute('d', seg(P(ux, uy, 0.1), P(vx, vy, 0.1)));
      edgePath.setAttribute('class', 'nf lo');
      g.appendChild(edgePath);
    }

    // Sockets
    for (const n of NODES.slice().sort((a, b) => a.d - b.d)) {
      const [cx, cy] = toW(n.l, n.d);
      const [sRing] = rings(cx - RW, cy - RH, cx + RW, cy + RH, RAD, INSET);
      const sock = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      sock.setAttribute('d', poly(ringAt(P, sRing, 0.1)));
      sock.setAttribute('class', 'nf lo');
      g.appendChild(sock);
    }

    // Tablets
    const tablets = NODES.map((n, i) => {
      const [cx, cy] = toW(n.l, n.d);
      const [ring, inner] = rings(cx - RW, cy - RH, cx + RW, cy + RH, RAD, INSET);
      const grp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const sil = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      sil.setAttribute('class', i === 0 ? 'sil hi' : 'sil');
      const cr = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      cr.setAttribute('class', 'lo nf');
      grp.appendChild(sil);
      grp.appendChild(cr);
      g.appendChild(grp);
      return { ...n, cx, cy, ring, inner, sil, cr, z: tween(0), lastZ: NaN };
    });

    const draw = (i: number, zVal: number) => {
      const tb = tablets[i];
      if (Math.abs(zVal - tb.lastZ) < 0.02) return;
      tb.lastZ = zVal;
      const res = prism(P, front, tb.ring, tb.inner, zVal, tb.h + zVal);
      tb.sil.setAttribute('d', res.sil);
      tb.cr.setAttribute('d', res.crease);
    };
    tablets.forEach((_, i) => draw(i, 0));

    let frameId = 0;
    const tick = () => {
      const now = performance.now();
      let moving = false;
      tablets.forEach((tb, i) => {
        draw(i, tval(tb.z, now));
        if (!tdone(tb.z, now)) moving = true;
      });
      if (moving) frameId = requestAnimationFrame(tick);
    };

    const setActive = (a: number) => {
      if (a === activeRef.current) return;
      const now = performance.now();
      const from = a >= 0 ? a : activeRef.current;
      activeRef.current = a;
      tablets.forEach((tb, i) => {
        const inLineage = a >= 0 && i in LINEAGE[a];
        const dist = a >= 0 ? (LINEAGE[a][i] ?? 0) : (from >= 0 ? (LINEAGE[from][i] ?? 0) : 0);
        const delay = dist * 45;
        const targetZ = inLineage ? (a === i ? LIFT : LIFT * 0.6) : 0;
        tset(tb.z, targetZ, now, delay);
        tb.sil.classList.toggle('hi', a < 0 ? i === 0 : inLineage);
      });
      onNodeHover?.(a < 0 ? null : a);
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(tick);
    };
    setActiveRef.current = setActive;

    // Initialize with activeNodeId or root
    const initial = baseActiveRef.current >= 0 ? baseActiveRef.current : 0;
    setActive(initial);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * 400;
      const sy = ((e.clientY - rect.top) / rect.height) * 320;
      let best = -1, minD = Infinity;
      for (let i = 0; i < tablets.length; i++) {
        const tb = tablets[i];
        const [wx, wy] = unproj(C, sx, sy, tb.h);
        const d = Math.hypot(wx - tb.cx, wy - tb.cy);
        if (d < 8 && d < minD) { minD = d; best = i; }
      }
      setActive(best >= 0 ? best : baseActiveRef.current);
    };

    const handlePointerLeave = () => {
      setActive(baseActiveRef.current);
    };

    svg.addEventListener('pointermove', handlePointerMove);
    svg.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      svg.removeEventListener('pointermove', handlePointerMove);
      svg.removeEventListener('pointerleave', handlePointerLeave);
      container.innerHTML = '';
    };
  }, [onNodeHover]);

  useEffect(() => {
    const target = activeNodeId ?? 0;
    baseActiveRef.current = target;
    setActiveRef.current(target);
  }, [activeNodeId]);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <div className="w-full max-w-[480px] rounded-2xl border border-border/80 bg-card/40 p-2 relative shadow-sm overflow-hidden">
        <div ref={containerRef} data-hairline="pedigree" className="w-full aspect-[5/4] cursor-pointer" />
      </div>
    </div>
  );
}
