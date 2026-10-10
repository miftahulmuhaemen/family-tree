// Shared 3D Geometry and Math for Storytelling Slides

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const rad = (d: number) => (d * Math.PI) / 180;
export const r2 = (n: number) => Math.round(n * 100) / 100;
export const poly = (pts: [number, number][]) =>
  "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L") + "Z";
export const openPath = (pts: [number, number][]) =>
  pts.length < 2 ? "" : "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L");
export const seg = (a: [number, number], b: [number, number]) =>
  `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;

export interface StoryCam {
  az: number;
  k: number;
  S: number;
  ox: number;
  oy: number;
}

export function createStoryCam(azDeg: number, k: number, S: number): StoryCam {
  return { az: rad(azDeg), k, S, ox: 0, oy: 0 };
}

export function storyProj(C: StoryCam) {
  const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
  return (x: number, y: number, z: number): [number, number] => {
    const X = x * c - y * s, Y = x * s + y * c;
    return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
  };
}

export function fitStoryCam(C: StoryCam, pts: [number, number, number][], cx: number, cy: number) {
  C.ox = 0; C.oy = 0;
  const P = storyProj(C);
  let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
  for (const p of pts) {
    const q = P(p[0], p[1], p[2]);
    a = Math.min(a, q[0]); b = Math.max(b, q[0]);
    c = Math.min(c, q[1]); d = Math.max(d, q[1]);
  }
  C.ox = cx - (a + b) / 2;
  C.oy = cy - (c + d) / 2;
}

export interface StoryRingPt {
  u: number; v: number; nu: number; nv: number;
}

export function storyFacing(C: StoryCam) {
  const s = Math.sin(C.az), c = Math.cos(C.az);
  return (q: StoryRingPt) => q.nu * s + q.nv * c >= -1e-6;
}

export function storyHull(pts: [number, number][]): [number, number][] {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const x = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [], up: [number, number][] = [];
  for (const pt of p) {
    while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], pt) <= 0) lo.pop();
    lo.push(pt);
  }
  for (let i = p.length - 1; i >= 0; i--) {
    const pt = p[i];
    while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], pt) <= 0) up.pop();
    up.push(pt);
  }
  lo.pop(); up.pop();
  return lo.concat(up);
}

export function storyRrect(u0: number, v0: number, u1: number, v1: number, r: number, n = 4): StoryRingPt[] {
  r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2));
  const out: StoryRingPt[] = [];
  for (const [cu, cv, a0] of [[u1 - r, v1 - r, 0], [u0 + r, v1 - r, 90], [u0 + r, v0 + r, 180], [u1 - r, v0 + r, 270]]) {
    for (let k = 0; k <= n; k++) {
      const a = rad(a0 + (90 * k) / n), ca = Math.cos(a), sa = Math.sin(a);
      out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa });
    }
  }
  return out;
}

export const storyRings = (x0: number, y0: number, x1: number, y1: number, r: number, b: number): [StoryRingPt[], StoryRingPt[]] => [
  storyRrect(x0, y0, x1, y1, r),
  storyRrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b)),
];

export function storyRun(ring: StoryRingPt[], keep: (q: StoryRingPt) => boolean): StoryRingPt[] {
  const n = ring.length;
  let s = -1;
  for (let i = 0; i < n; i++) if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) { s = i; break; }
  if (s < 0) return keep(ring[0]) ? ring.slice() : [];
  const out: StoryRingPt[] = [];
  for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n]);
  return out;
}

export function storyPrism(
  P: (x: number, y: number, z: number) => [number, number],
  front: (q: StoryRingPt) => boolean,
  ring: StoryRingPt[],
  inner: StoryRingPt[] | null,
  z0: number,
  z1: number
) {
  const ring0 = ring.map((q) => P(q.u, q.v, z0));
  const ring1 = ring.map((q) => P(q.u, q.v, z1));
  return {
    sil: poly(storyHull(ring1.concat(ring0))),
    crease: inner ? openPath(inner.map((q) => P(q.u, q.v, z1)).filter((_, i) => front(inner[i]))) : "",
  };
}

export function storyCircRing(cx: number, cy: number, r: number, n = 16): StoryRingPt[] {
  return Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2;
    return { u: cx + r * Math.cos(a), v: cy + r * Math.sin(a), nu: Math.cos(a), nv: Math.sin(a) };
  });
}

export function storyArmSolid(
  P: (x: number, y: number, z: number) => [number, number],
  c1: [number, number, number],
  r1: number,
  c2: [number, number, number],
  r2: number
) {
  const q1 = storyCircRing(c1[0], c1[1], r1).map((q) => P(q.u, q.v, c1[2]));
  const q2 = storyCircRing(c2[0], c2[1], r2).map((q) => P(q.u, q.v, c2[2]));
  const in2 = storyCircRing(c2[0], c2[1], Math.max(0.4, r2 - 0.7)).map((q) => P(q.u, q.v, c2[2]));
  return { sil: poly(storyHull(q1.concat(q2))), crease: openPath(in2.slice(0, 9)) };
}

export function storyTaperPrism(
  P: (x: number, y: number, z: number) => [number, number],
  foot: StoryRingPt[],
  top: StoryRingPt[],
  z0: number,
  z1: number
) {
  const fP = foot.map((q) => P(q.u, q.v, z0)), tP = top.map((q) => P(q.u, q.v, z1));
  return { sil: poly(storyHull(fP.concat(tP))), crease: openPath(tP.slice(0, Math.floor(tP.length * 0.6))) };
}

export interface StorySolid {
  g: SVGGElement;
  sil: SVGPathElement;
  cr: SVGPathElement;
}

const NS = "http://www.w3.org/2000/svg";

export function createStorySvgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  parent?: SVGElement
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (parent) parent.appendChild(el);
  return el;
}

export function createStorySolid(parent: SVGElement): StorySolid {
  const g = createStorySvgEl("g", {}, parent);
  return {
    g,
    sil: createStorySvgEl("path", { class: "sil" }, g),
    cr: createStorySvgEl("path", { class: "nf lo" }, g),
  };
}

export function putStorySolid(el: StorySolid, s: { sil: string; crease: string }) {
  el.sil.setAttribute("d", s.sil);
  el.cr.setAttribute("d", s.crease);
}
