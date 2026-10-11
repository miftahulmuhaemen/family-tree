// Self-contained isometric projection and physics kernel for Hairline figures

export interface Camera {
  az: number;
  elev: number;
  s: number;
  tx: number;
  ty: number;
}

export function Cam(azDeg: number, k: number, S: number): Camera {
  const az = (azDeg * Math.PI) / 180;
  return { az, elev: Math.asin(k), s: S, tx: 0, ty: 0 };
}

export function proj(c: Camera) {
  const cosAz = Math.cos(c.az), sinAz = Math.sin(c.az);
  const sinEl = Math.sin(c.elev), cosEl = Math.cos(c.elev);
  return (x: number, y: number, z: number): [number, number] => {
    const rx = -x * sinAz + y * cosAz;
    const ry = -x * cosAz * sinEl - y * sinAz * sinEl + z * cosEl;
    return [rx * c.s + c.tx, -ry * c.s + c.ty];
  };
}

export function unproj(c: Camera, sx: number, sy: number, z: number): [number, number] {
  const cosAz = Math.cos(c.az), sinAz = Math.sin(c.az);
  const sinEl = Math.sin(c.elev), cosEl = Math.cos(c.elev);
  const rx = (sx - c.tx) / c.s;
  const ry = -(sy - c.ty) / c.s;
  const numY = (ry - z * cosEl) / -sinEl;
  const x = -rx * sinAz - numY * cosAz;
  const y = rx * cosAz - numY * sinAz;
  return [x, y];
}

export function facing(c: Camera) {
  const cosAz = Math.cos(c.az), sinAz = Math.sin(c.az), sinEl = Math.sin(c.elev);
  return (sample: { nu: number; nv: number }) => (-sample.nu * sinAz + sample.nv * cosAz) * -sinEl < 0;
}

export function fit(c: Camera, points: number[][], cx: number, cy: number) {
  const P0 = proj({ ...c, tx: 0, ty: 0 });
  const projected = points.map(([x, y, z]) => P0(x, y, z));
  const minX = Math.min(...projected.map((p) => p[0]));
  const maxX = Math.max(...projected.map((p) => p[0]));
  const minY = Math.min(...projected.map((p) => p[1]));
  const maxY = Math.max(...projected.map((p) => p[1]));
  c.tx = cx - (minX + maxX) / 2;
  c.ty = cy - (minY + maxY) / 2;
}

export interface Sample {
  u: number;
  v: number;
  nu: number;
  nv: number;
}

export function rrect(x0: number, y0: number, x1: number, y1: number, r: number): Sample[] {
  const radius = Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2);
  const samples: Sample[] = [];
  const corners = [
    { cx: x1 - radius, cy: y1 - radius, a0: 0 },
    { cx: x0 + radius, cy: y1 - radius, a0: Math.PI / 2 },
    { cx: x0 + radius, cy: y0 + radius, a0: Math.PI },
    { cx: x1 - radius, cy: y0 + radius, a0: (3 * Math.PI) / 2 },
  ];
  for (const { cx, cy, a0 } of corners) {
    for (let k = 0; k < 4; k++) {
      const a = a0 + (k / 4) * (Math.PI / 2);
      const nu = Math.cos(a), nv = Math.sin(a);
      samples.push({ u: cx + radius * nu, v: cy + radius * nv, nu, nv });
    }
  }
  return samples;
}

export function rings(x0: number, y0: number, x1: number, y1: number, r: number, b: number): [Sample[], Sample[]] {
  return [rrect(x0, y0, x1, y1, r), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b))];
}

export function ringAt(P: (x: number, y: number, z: number) => [number, number], ring: Sample[], z: number): [number, number][] {
  return ring.map((q) => P(q.u, q.v, z));
}

export function run<T>(ring: T[], keep: (sample: T) => boolean): T[] {
  const n = ring.length;
  let s = -1;
  for (let i = 0; i < n; i++) {
    if (!keep(ring[i]) && keep(ring[(i + 1) % n])) {
      s = (i + 1) % n;
      break;
    }
  }
  if (s < 0) return keep(ring[0]) ? ring.slice() : [];
  const out: T[] = [];
  for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) {
    out.push(ring[(s + k) % n]);
  }
  return out;
}

export function poly(points: [number, number][]): string {
  if (!points.length) return '';
  return `M${points[0][0].toFixed(2)},${points[0][0] ? points[0][1].toFixed(2) : 0}` + points.slice(1).map((p) => `L${p[0].toFixed(2)},${p[1].toFixed(2)}`).join('') + 'Z';
}

export function open(points: [number, number][]): string {
  if (!points.length) return '';
  return `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}` + points.slice(1).map((p) => `L${p[0].toFixed(2)},${p[1].toFixed(2)}`).join('');
}

export function seg(a: [number, number], b: [number, number]): string {
  return `M${a[0].toFixed(2)},${a[1].toFixed(2)}L${b[0].toFixed(2)},${b[1].toFixed(2)}`;
}

export function hull(points: [number, number][]): [number, number][] {
  const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length <= 2) return pts;
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

export function prism(P: (x: number, y: number, z: number) => [number, number], front: (s: Sample) => boolean, ring: Sample[], inner: Sample[] | null, z0: number, z1: number) {
  return {
    sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
    crease: inner ? open(ringAt(P, run(inner, front), z1)) : '',
  };
}

export interface Tween {
  from: number;
  to: number;
  start: number;
  dur: number;
  val: number;
}

export function tween(v: number, dur = 700): Tween {
  return { from: v, to: v, start: 0, dur, val: v };
}

export function tset(tw: Tween, to: number, now: number, delay = 0) {
  if (tw.to === to) return;
  tw.from = tw.val;
  tw.to = to;
  tw.start = now + delay;
}

export function tval(tw: Tween, now: number): number {
  if (now <= tw.start) return tw.from;
  const p = Math.min(1, (now - tw.start) / tw.dur);
  // Ease out (.32, .72, 0, 1) approximation
  const ease = 1 - Math.pow(1 - p, 3);
  tw.val = tw.from + (tw.to - tw.from) * ease;
  return tw.val;
}

export function tdone(tw: Tween, now: number): boolean {
  return now >= tw.start + tw.dur;
}

export function injectHairlineStyles(doc = document) {
  if (doc.getElementById('hairline-theme-styles')) return;
  const style = doc.createElement('style');
  style.id = 'hairline-theme-styles';
  style.textContent = `
    [data-hairline] {
      --hl-plate: #ffffff;
      --hl-edge: #232327;
      --hl-mid: #e0e0e4;
      --hl-lo: #9e9ea6;
      --hl-hi: #0284c7;
    }
    .dark [data-hairline], [data-theme="dark"] [data-hairline] {
      --hl-plate: #09090b;
      --hl-edge: #f4f4f5;
      --hl-mid: #27272a;
      --hl-lo: #52525b;
      --hl-hi: #38bdf8;
    }
    [data-hairline] path {
      fill: var(--hl-plate);
      stroke: var(--hl-mid);
      stroke-width: 0.9px;
      vector-effect: non-scaling-stroke;
      stroke-linejoin: round;
      stroke-linecap: round;
      transition: stroke 260ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-hairline] path.sil { stroke: var(--hl-edge); }
    [data-hairline] path.hi { stroke: var(--hl-hi); stroke-width: 1.2px; }
    [data-hairline] path.lo { stroke: var(--hl-lo); }
    [data-hairline] path.nf { fill: none; }
  `;
  doc.head.appendChild(style);
}
