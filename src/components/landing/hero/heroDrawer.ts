// SVG Drawing and Manipulation for Hero Crowd Stand

import {
  clamp, lerp, r2, makeRings, prismGeom,
  type Camera3D,
} from './heroGeometry';
import type { PersonNode, SolidEl } from './heroData';

const NS = "http://www.w3.org/2000/svg";

export function createSvgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  parent?: SVGElement
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (parent) parent.appendChild(el);
  return el;
}

export function createSolid(parent: SVGElement): SolidEl {
  const g = createSvgEl("g", {}, parent);
  return {
    g,
    sil: createSvgEl("path", { class: "sil" }, g),
    cr: createSvgEl("path", { class: "nf lo" }, g),
  };
}

export function putSolid(el: SolidEl, s: { sil: string; crease: string }) {
  el.sil.setAttribute("d", s.sil);
  el.cr.setAttribute("d", s.crease);
}

export function drawPerson(
  p: PersonNode,
  C: Camera3D,
  P: (x: number, y: number, z: number) => [number, number],
  front: (q: { u: number; v: number; nu: number; nv: number }) => boolean
) {
  const t = clamp(p.sp.x, 0, 1);
  const zDrop = Math.max(0, p.spDrop.x);

  if (zDrop > 55) {
    if (p.visible) {
      p.pG.style.display = "none";
      p.visible = false;
    }
    return;
  } else if (!p.visible) {
    p.pG.style.display = "";
    p.visible = true;
  }

  p.pG.style.opacity = String(clamp((50 - zDrop) / 15, 0, 1));

  const { cx, cy } = p;
  const legSep = lerp(0.85, 1.35, t);
  const armSep = lerp(1.85, 2.75, t);
  const zHip = lerp(0.2, 9.6, t) + zDrop;
  const zShoulder = lerp(6.8, 17.6, t) + zDrop;
  const fwdTorso = lerp(-0.4, 0, t);
  const fwdLeg = lerp(1.3, 0, t);
  const zLegTop = lerp(6.0, 9.6, t) + zDrop;
  const zLegBot = zDrop;
  const fwdArm = lerp(1.0, 0, t);
  const zArm0 = lerp(3.8, 10.2, t) + zDrop;
  const zArm1 = lerp(6.6, 16.8, t) + zDrop;

  const tx = cx + fwdTorso;
  const ty = cy + fwdTorso;
  const [torR, torI] = makeRings(tx - 1.85, ty - 1.85, tx + 1.85, ty + 1.85, 1.15, 0.35);
  putSolid(p.elTorso, prismGeom(P, front, torR, torI, zHip, zShoulder));

  const axL = cx - armSep + fwdArm;
  const ayL = cy + armSep + fwdArm;
  const [aL_R, aL_I] = makeRings(axL - 0.6, ayL - 0.6, axL + 0.6, ayL + 0.6, 0.6, 0.2);
  putSolid(p.elArmL, prismGeom(P, front, aL_R, aL_I, zArm0, zArm1));

  const axR = cx + armSep + fwdArm;
  const ayR = cy - armSep + fwdArm;
  const [aR_R, aR_I] = makeRings(axR - 0.6, ayR - 0.6, axR + 0.6, ayR + 0.6, 0.6, 0.2);
  putSolid(p.elArmR, prismGeom(P, front, aR_R, aR_I, zArm0, zArm1));

  const lxL = cx - legSep + fwdLeg;
  const lyL = cy + legSep + fwdLeg;
  const [lL_R, lL_I] = makeRings(lxL - 0.72, lyL - 0.72, lxL + 0.72, lyL + 0.72, 0.72, 0.2);
  putSolid(p.elLegL, prismGeom(P, front, lL_R, lL_I, zLegBot, zLegTop));

  const lxR = cx + legSep + fwdLeg;
  const lyR = cy - legSep + fwdLeg;
  const [lR_R, lR_I] = makeRings(lxR - 0.72, lyR - 0.72, lxR + 0.72, lyR + 0.72, 0.72, 0.2);
  putSolid(p.elLegR, prismGeom(P, front, lR_R, lR_I, zLegBot, zLegTop));

  const hx = cx + fwdTorso * 0.3;
  const hy = cy + fwdTorso * 0.3;
  const zNeck0 = zShoulder - 0.2;
  const zNeck1 = lerp(7.8, 18.6, t) + zDrop;
  const [neckR, neckI] = makeRings(hx - 0.7, hy - 0.7, hx + 0.7, hy + 0.7, 0.6, 0.2);
  putSolid(p.elNeck, prismGeom(P, front, neckR, neckI, zNeck0, zNeck1));

  const zHeadC = lerp(9.4, 20.2, t) + zDrop;
  const sc = P(hx, hy, zHeadC);
  const headR = 1.75 * C.S;

  if (p.isFemale && p.elHairBack) {
    const bhD =
      "M " + r2(sc[0] - headR * 1.25) + " " + r2(sc[1] - headR * 0.2) +
      " C " + r2(sc[0] - headR * 1.35) + " " + r2(sc[1] - headR * 1.35) + ", " +
              r2(sc[0] + headR * 1.35) + " " + r2(sc[1] - headR * 1.35) + ", " +
              r2(sc[0] + headR * 1.25) + " " + r2(sc[1] - headR * 0.2) +
      " C " + r2(sc[0] + headR * 1.35) + " " + r2(sc[1] + headR * 0.9) + ", " +
              r2(sc[0] + headR * 1.1) + " " + r2(sc[1] + headR * 1.4) + ", " +
              r2(sc[0] + headR * 0.55) + " " + r2(sc[1] + headR * 1.65) +
      " C " + r2(sc[0] + headR * 0.2) + " " + r2(sc[1] + headR * 1.3) + ", " +
              r2(sc[0] + headR * 0.3) + " " + r2(sc[1] + headR * 0.8) + ", " +
              r2(sc[0] + headR * 0.8) + " " + r2(sc[1] + headR * 0.4) +
      " L " + r2(sc[0] - headR * 0.8) + " " + r2(sc[1] + headR * 0.4) +
      " C " + r2(sc[0] - headR * 0.3) + " " + r2(sc[1] + headR * 0.8) + ", " +
              r2(sc[0] - headR * 0.2) + " " + r2(sc[1] + headR * 1.3) + ", " +
              r2(sc[0] - headR * 0.55) + " " + r2(sc[1] + headR * 1.65) +
      " C " + r2(sc[0] - headR * 1.1) + " " + r2(sc[1] + headR * 1.4) + ", " +
              r2(sc[0] - headR * 1.35) + " " + r2(sc[1] + headR * 0.9) + ", " +
              r2(sc[0] - headR * 1.25) + " " + r2(sc[1] - headR * 0.2) + " Z";
    p.elHairBack.setAttribute("d", bhD);
  }

  p.elHeadCircle.setAttribute("cx", String(r2(sc[0])));
  p.elHeadCircle.setAttribute("cy", String(r2(sc[1])));
  p.elHeadCircle.setAttribute("r", String(r2(headR)));

  const chinD =
    "M " + r2(sc[0] - headR * 0.6) + " " + r2(sc[1] + headR * 0.35) +
    " Q " + r2(sc[0]) + " " + r2(sc[1] + headR * 0.75) +
    " " + r2(sc[0] + headR * 0.6) + " " + r2(sc[1] + headR * 0.35);
  p.elChin.setAttribute("d", chinD);

  if (p.isFemale && p.elHairFront) {
    const bangsD =
      "M " + r2(sc[0] - headR * 0.95) + " " + r2(sc[1] - headR * 0.1) +
      " Q " + r2(sc[0] - headR * 0.2) + " " + r2(sc[1] - headR * 0.55) +
      " " + r2(sc[0] + headR * 0.15) + " " + r2(sc[1] - headR * 0.25) +
      " Q " + r2(sc[0] + headR * 0.55) + " " + r2(sc[1] - headR * 0.45) +
      " " + r2(sc[0] + headR * 0.95) + " " + r2(sc[1] - headR * 0.1);
    p.elHairFront.setAttribute("d", bangsD);
  }

  p.headPos = [sc[0], sc[1] - headR];
}
