import { useEffect, useRef } from 'react';
import {
  createStoryCam, storyProj, storyFacing,
  storyRings, storyPrism, storyArmSolid, openPath,
  createStorySvgEl, createStorySolid, putStorySolid,
  r2, seg
} from './storyCommon';

export interface StorySlideProps {
  progress: number;
  locale: 'en' | 'id';
}

export function StorySlide3({ progress, locale }: StorySlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lblHenryRef = useRef<HTMLDivElement>(null);
  const lblDavidRef = useRef<HTMLDivElement>(null);
  const lblSarahRef = useRef<HTMLDivElement>(null);
  const lblYouRef = useRef<HTMLDivElement>(null);
  const poseFnRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const elHenry = lblHenryRef.current;
    const elDavid = lblDavidRef.current;
    const elSarah = lblSarahRef.current;
    const elYou = lblYouRef.current;
    if (!svg) return;

    svg.replaceChildren();

    // Standardized camera matching all 4 slides: S=3.44, ox=200, oy=190
    const C = createStoryCam(45, 0.5, 3.44);
    C.ox = 200;
    C.oy = 190;
    const P = storyProj(C), front = storyFacing(C);

    const gGrid = createStorySvgEl("g", {}, svg);
    const gBeams = createStorySvgEl("g", {}, svg);
    const gPedestals = createStorySvgEl("g", {}, svg);
    const gChars = createStorySvgEl("g", {}, svg);

    for (let i = -36; i <= 36; i += 12) {
      createStorySvgEl("path", { d: seg(P(i, -36, 0), P(i, 36, 0)), class: "lo nf", opacity: "0.2" }, gGrid);
      createStorySvgEl("path", { d: seg(P(-36, i, 0), P(36, i, 0)), class: "lo nf", opacity: "0.2" }, gGrid);
    }

    const N_HENRY = { id: "henry", x: -8, y: -10, z: 30 };
    const N_DAVID = { id: "david", x: -24, y: 6, z: 15 };
    const N_SARAH = { id: "sarah", x: 26, y: -4, z: 14 };
    const N_YOU = { id: "you", x: -24, y: 24, z: 0 };
    const NODES = [N_HENRY, N_DAVID, N_SARAH, N_YOU];

    NODES.forEach((n) => {
      const gP = createStorySvgEl("g", {}, gPedestals);
      const [r0, r1] = storyRings(n.x - 9, n.y - 9, n.x + 9, n.y + 9, 3.8, 0.9);
      const geom = storyPrism(P, front, r0, r1, n.z, n.z + 3.2);
      createStorySvgEl("path", { d: geom.sil, class: "pedestal" }, gP);
      createStorySvgEl("path", { d: geom.crease, class: "lo nf" }, gP);
    });

    function makeConduit(p1: [number, number, number], p2: [number, number, number]) {
      const pts3D: [number, number, number][] = [
        [p1[0], p1[1], p1[2] + 2],
        [p1[0], (p1[1] + p2[1]) / 2, p1[2] + 2],
        [p2[0], (p1[1] + p2[1]) / 2, p2[2] + 2],
        [p2[0], p2[1], p2[2] + 2]
      ];
      return openPath(pts3D.map((pt) => P(pt[0], pt[1], pt[2])));
    }

    const dHenryDavid = makeConduit([N_HENRY.x, N_HENRY.y, N_HENRY.z], [N_DAVID.x, N_DAVID.y, N_DAVID.z]);
    const dHenrySarah = makeConduit([N_HENRY.x, N_HENRY.y, N_HENRY.z], [N_SARAH.x, N_SARAH.y, N_SARAH.z]);
    const dDavidYou = makeConduit([N_DAVID.x, N_DAVID.y, N_DAVID.z], [N_YOU.x, N_YOU.y, N_YOU.z]);

    createStorySvgEl("path", { d: dHenryDavid, class: "beam-bg" }, gBeams);
    createStorySvgEl("path", { d: dHenrySarah, class: "beam-bg" }, gBeams);
    createStorySvgEl("path", { d: dDavidYou, class: "beam-bg" }, gBeams);

    const beamHenryDavid = createStorySvgEl("path", { d: dHenryDavid, class: "beam-active" }, gBeams);
    const beamHenrySarah = createStorySvgEl("path", { d: dHenrySarah, class: "beam-active" }, gBeams);
    const beamDavidYou = createStorySvgEl("path", { d: dDavidYou, class: "beam-active" }, gBeams);

    const pulseDot = createStorySvgEl("circle", { r: 3.2, fill: "#ffffff", class: "hi" }, gBeams);
    pulseDot.setAttribute("filter", "drop-shadow(0 0 6px #60a5fa)");

    function createAvatar(parent: SVGGElement, node: { x: number; y: number; z: number }, type: string) {
      const g = createStorySvgEl("g", {}, parent);
      const z0 = node.z + 3.2, x = node.x, y = node.y;
      const body = createStorySolid(g), armL = createStorySolid(g), armR = createStorySolid(g);
      const handL = createStorySolid(g), handR = createStorySolid(g), neck = createStorySolid(g);
      const head = createStorySvgEl("path", { class: "sil" }, g);
      const hair = createStorySvgEl("path", { class: "sil" }, g);
      const hairCr = createStorySvgEl("path", { class: "lo nf" }, g);
      const eyeL = createStorySvgEl("circle", { r: 1.05, class: "dot" }, g);
      const eyeR = createStorySvgEl("circle", { r: 1.05, class: "dot" }, g);
      const smile = createStorySvgEl("path", { class: "lo nf" }, g);

      const [tr, ti] = storyRings(x - 3.8, y - 3.4, x + 3.8, y + 3.4, 2.2, 0.6);
      putStorySolid(body, storyPrism(P, front, tr, ti, z0, z0 + 9));
      const shL: [number, number, number] = [x - 3.4, y + 2.0, z0 + 7.5], hL: [number, number, number] = [x - 4.4, y + 2.8, z0 + 1.5];
      const shR: [number, number, number] = [x + 3.4, y - 2.0, z0 + 7.5], hR: [number, number, number] = [x + 4.4, y - 2.8, z0 + 1.5];
      putStorySolid(armL, storyArmSolid(P, shL, 1.8, hL, 1.3));
      putStorySolid(armR, storyArmSolid(P, shR, 1.8, hR, 1.3));
      const [hlr, hli] = storyRings(hL[0] - 1.0, hL[1] - 1.0, hL[0] + 1.0, hL[1] + 1.0, 0.7, 0.3);
      const [hrr, hri] = storyRings(hR[0] - 1.0, hR[1] - 1.0, hR[0] + 1.0, hR[1] + 1.0, 0.7, 0.3);
      putStorySolid(handL, storyPrism(P, front, hlr, hli, z0 + 0.5, z0 + 2.0));
      putStorySolid(handR, storyPrism(P, front, hrr, hri, z0 + 0.5, z0 + 2.0));

      const [nr, ni] = storyRings(x - 1.5, y - 1.5, x + 1.5, y + 1.5, 1.0, 0.3);
      putStorySolid(neck, storyPrism(P, front, nr, ni, z0 + 9, z0 + 10.2));

      const pH = P(x, y, z0 + 13.8);
      const hx = r2(pH[0]), hy = r2(pH[1]), s = 0.56;
      head.setAttribute("d", `M ${r2(hx - 11.5 * s)},${r2(hy - 6 * s)} C ${r2(hx - 11.5 * s)},${r2(hy - 13 * s)} ${r2(hx - 7 * s)},${r2(hy - 15 * s)} ${hx},${r2(hy - 15 * s)} C ${r2(hx + 7 * s)},${r2(hy - 15 * s)} ${r2(hx + 11.5 * s)},${r2(hy - 13 * s)} ${r2(hx + 11.5 * s)},${r2(hy - 6 * s)} L ${r2(hx + 11.5 * s)},${r2(hy + 6 * s)} C ${r2(hx + 11.5 * s)},${r2(hy + 13 * s)} ${r2(hx + 7 * s)},${r2(hy + 15 * s)} ${hx},${r2(hy + 15 * s)} C ${r2(hx - 7 * s)},${r2(hy + 15 * s)} ${r2(hx - 11.5 * s)},${r2(hy + 13 * s)} ${r2(hx - 11.5 * s)},${r2(hy + 6 * s)} Z`);
      eyeL.setAttribute("cx", String(r2(hx - 4.2 * s)));
      eyeL.setAttribute("cy", String(r2(hy + 2.5 * s)));
      eyeR.setAttribute("cx", String(r2(hx + 4.2 * s)));
      eyeR.setAttribute("cy", String(r2(hy + 2.5 * s)));
      smile.setAttribute("d", `M${r2(hx - 3.2 * s)},${r2(hy + 7 * s)} Q${hx},${r2(hy + 10.5 * s)} ${r2(hx + 3.2 * s)},${r2(hy + 7 * s)}`);

      if (type === "sarah") {
        hair.setAttribute("d", `M ${hx},${r2(hy - 18 * s)} C ${r2(hx + 10 * s)},${r2(hy - 18 * s)} ${r2(hx + 17 * s)},${r2(hy - 13 * s)} ${r2(hx + 19 * s)},${r2(hy - 7 * s)} C ${r2(hx + 24 * s)},${r2(hy + 3 * s)} ${r2(hx + 20 * s)},${r2(hy + 15 * s)} ${r2(hx + 16 * s)},${r2(hy + 24 * s)} C ${r2(hx + 11 * s)},${r2(hy + 20 * s)} ${r2(hx + 12 * s)},${r2(hy + 8 * s)} ${r2(hx + 10 * s)},${r2(hy + 1 * s)} C ${r2(hx + 8 * s)},${r2(hy - 2 * s)} ${r2(hx + 4 * s)},${r2(hy - 2 * s)} ${r2(hx + 1.5 * s)},${r2(hy + 0.5 * s)} C ${r2(hx - 1.5 * s)},${r2(hy + 0.5 * s)} ${r2(hx - 4 * s)},${r2(hy - 2 * s)} ${r2(hx - 8 * s)},${r2(hy - 2 * s)} C ${r2(hx - 10 * s)},${r2(hy + 1 * s)} ${r2(hx - 12 * s)},${r2(hy + 8 * s)} ${r2(hx - 11 * s)},${r2(hy + 20 * s)} C ${r2(hx - 16 * s)},${r2(hy + 24 * s)} ${r2(hx - 20 * s)},${r2(hy + 15 * s)} ${r2(hx - 24 * s)},${r2(hy + 3 * s)} C ${r2(hx - 19 * s)},${r2(hy - 7 * s)} ${r2(hx - 17 * s)},${r2(hy - 13 * s)} ${r2(hx - 10 * s)},${r2(hy - 18 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 2 * s)},${r2(hy - 16 * s)} Q${hx},${r2(hy - 8 * s)} ${r2(hx - 2 * s)},${r2(hy)}`);
      } else if (type === "henry") {
        hair.setAttribute("d", `M ${hx},${r2(hy - 16 * s)} C ${r2(hx + 10 * s)},${r2(hy - 16 * s)} ${r2(hx + 14 * s)},${r2(hy - 10 * s)} ${r2(hx + 14 * s)},${r2(hy - 3 * s)} C ${r2(hx + 14 * s)},${r2(hy + 6 * s)} ${r2(hx + 11 * s)},${r2(hy + 10 * s)} ${r2(hx + 10 * s)},${r2(hy + 9 * s)} C ${r2(hx + 10 * s)},${r2(hy + 2 * s)} ${r2(hx + 10 * s)},${r2(hy - 4 * s)} ${r2(hx + 7 * s)},${r2(hy - 8 * s)} C ${r2(hx + 4 * s)},${r2(hy - 10 * s)} ${r2(hx - 4 * s)},${r2(hy - 10 * s)} ${r2(hx - 7 * s)},${r2(hy - 8 * s)} C ${r2(hx - 10 * s)},${r2(hy - 4 * s)} ${r2(hx - 10 * s)},${r2(hy + 2 * s)} ${r2(hx - 10 * s)},${r2(hy + 9 * s)} C ${r2(hx - 11 * s)},${r2(hy + 10 * s)} ${r2(hx - 14 * s)},${r2(hy + 6 * s)} ${r2(hx - 14 * s)},${r2(hy - 3 * s)} C ${r2(hx - 14 * s)},${r2(hy - 10 * s)} ${r2(hx - 10 * s)},${r2(hy - 16 * s)} ${hx},${r2(hy - 16 * s)} Z`);
        hairCr.setAttribute("d", `M ${r2(hx - 5.5 * s)},${r2(hy + 2.5 * s)} C ${r2(hx - 5.5 * s)},${r2(hy - 0.5 * s)} ${r2(hx - 2.5 * s)},${r2(hy - 0.5 * s)} ${r2(hx - 2.5 * s)},${r2(hy + 2.5 * s)} M ${r2(hx + 2.5 * s)},${r2(hy + 2.5 * s)} C ${r2(hx + 2.5 * s)},${r2(hy - 0.5 * s)} ${r2(hx + 5.5 * s)},${r2(hy - 0.5 * s)} ${r2(hx + 5.5 * s)},${r2(hy + 2.5 * s)} M ${r2(hx - 2.5 * s)},${r2(hy + 1 * s)} L ${r2(hx + 2.5 * s)},${r2(hy + 1 * s)}`);
      } else if (type === "david") {
        hair.setAttribute("d", `M ${hx},${r2(hy - 17 * s)} C ${r2(hx + 8 * s)},${r2(hy - 17 * s)} ${r2(hx + 14 * s)},${r2(hy - 12 * s)} ${r2(hx + 14 * s)},${r2(hy - 4 * s)} C ${r2(hx + 14 * s)},${r2(hy + 4 * s)} ${r2(hx + 11 * s)},${r2(hy + 8 * s)} ${r2(hx + 9.5 * s)},${r2(hy + 7 * s)} C ${r2(hx + 9.5 * s)},${r2(hy + 1 * s)} ${r2(hx + 8 * s)},${r2(hy - 3 * s)} ${r2(hx + 5 * s)},${r2(hy - 4 * s)} C ${r2(hx + 2 * s)},${r2(hy - 4 * s)} ${r2(hx - 3 * s)},${r2(hy - 2 * s)} ${r2(hx - 7 * s)},${r2(hy - 0.5 * s)} C ${r2(hx - 9 * s)},${r2(hy + 3 * s)} ${r2(hx - 10 * s)},${r2(hy + 7 * s)} ${r2(hx - 11 * s)},${r2(hy + 7 * s)} C ${r2(hx - 13 * s)},${r2(hy + 4 * s)} ${r2(hx - 14 * s)},${r2(hy - 4 * s)} ${r2(hx - 14 * s)},${r2(hy - 12 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 3 * s)},${r2(hy - 16 * s)} Q${hx},${r2(hy - 9 * s)} ${r2(hx + 4 * s)},${r2(hy - 4 * s)}`);
      } else {
        hair.setAttribute("d", `M ${hx},${r2(hy - 17 * s)} C ${r2(hx + 8 * s)},${r2(hy - 17 * s)} ${r2(hx + 14 * s)},${r2(hy - 12 * s)} ${r2(hx + 14 * s)},${r2(hy - 4 * s)} C ${r2(hx + 14 * s)},${r2(hy + 2 * s)} ${r2(hx + 12 * s)},${r2(hy + 7 * s)} ${r2(hx + 10.5 * s)},${r2(hy + 8.5 * s)} C ${r2(hx + 9 * s)},${r2(hy + 6 * s)} ${r2(hx + 10.5 * s)},${r2(hy + 2 * s)} ${r2(hx + 9.5 * s)},${r2(hy - 1 * s)} C ${r2(hx + 7 * s)},${r2(hy - 2.5 * s)} ${r2(hx + 4 * s)},${r2(hy - 2.5 * s)} ${r2(hx + 1.5 * s)},${r2(hy - 0.5 * s)} C ${r2(hx - 1 * s)},${r2(hy + 1.5 * s)} ${r2(hx - 3 * s)},${r2(hy - 0.5 * s)} ${r2(hx - 5.5 * s)},${r2(hy - 1.2 * s)} C ${r2(hx - 8 * s)},${r2(hy - 1.2 * s)} ${r2(hx - 9.5 * s)},${r2(hy + 1.5 * s)} ${r2(hx - 10.5 * s)},${r2(hy + 8 * s)} C ${r2(hx - 12.5 * s)},${r2(hy + 6.5 * s)} ${r2(hx - 14 * s)},${r2(hy + 2 * s)} ${r2(hx - 14 * s)},${r2(hy - 4 * s)} C ${r2(hx - 14 * s)},${r2(hy - 12 * s)} ${r2(hx - 8 * s)},${r2(hy - 17 * s)} ${hx},${r2(hy - 17 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 3 * s)},${r2(hy - 16 * s)} Q${r2(hx - 1.5 * s)},${r2(hy - 8 * s)} ${r2(hx - 3 * s)},${r2(hy - 0.5 * s)}`);
      }
      return { hx, hy };
    }

    const avHenry = createAvatar(gChars, N_HENRY, "henry");
    const avDavid = createAvatar(gChars, N_DAVID, "david");
    const avSarah = createAvatar(gChars, N_SARAH, "sarah");
    const avYou = createAvatar(gChars, N_YOU, "you");

    if (elHenry) {
      elHenry.style.left = ((avHenry.hx / 400) * 100) + "%";
      elHenry.style.top = (((avHenry.hy - 20) / 290) * 100) + "%";
    }
    if (elDavid) {
      elDavid.style.left = ((avDavid.hx / 400) * 100) + "%";
      elDavid.style.top = (((avDavid.hy - 20) / 290) * 100) + "%";
    }
    if (elSarah) {
      elSarah.style.left = ((avSarah.hx / 400) * 100) + "%";
      elSarah.style.top = (((avSarah.hy - 20) / 290) * 100) + "%";
    }
    if (elYou) {
      elYou.style.left = ((avYou.hx / 400) * 100) + "%";
      elYou.style.top = (((avYou.hy - 20) / 290) * 100) + "%";
    }

    const waypoints = [
      P(N_YOU.x, N_YOU.y, N_YOU.z + 4),
      P(N_DAVID.x, N_DAVID.y, N_DAVID.z + 4),
      P(N_HENRY.x, N_HENRY.y, N_HENRY.z + 4),
      P(N_SARAH.x, N_SARAH.y, N_SARAH.z + 4)
    ];

    poseFnRef.current = (t: number) => {
      if (t < 0.25) {
        if (elYou) elYou.classList.add("active");
        if (elDavid) elDavid.classList.remove("active");
        if (elHenry) elHenry.classList.remove("active");
        if (elSarah) elSarah.classList.remove("active");
        beamDavidYou.style.opacity = "0.2"; beamHenryDavid.style.opacity = "0.2"; beamHenrySarah.style.opacity = "0.2";
        pulseDot.setAttribute("cx", String(r2(waypoints[0][0])));
        pulseDot.setAttribute("cy", String(r2(waypoints[0][1])));
      } else if (t < 0.50) {
        if (elYou) elYou.classList.add("active");
        if (elDavid) elDavid.classList.add("active");
        if (elHenry) elHenry.classList.remove("active");
        if (elSarah) elSarah.classList.remove("active");
        beamDavidYou.style.opacity = "1"; beamHenryDavid.style.opacity = "0.2"; beamHenrySarah.style.opacity = "0.2";
        const lt = (t - 0.25) / 0.25;
        const px = waypoints[0][0] + (waypoints[1][0] - waypoints[0][0]) * lt;
        const py = waypoints[0][1] + (waypoints[1][1] - waypoints[0][1]) * lt;
        pulseDot.setAttribute("cx", String(r2(px)));
        pulseDot.setAttribute("cy", String(r2(py)));
      } else if (t < 0.75) {
        if (elYou) elYou.classList.add("active");
        if (elDavid) elDavid.classList.add("active");
        if (elHenry) elHenry.classList.add("active");
        if (elSarah) elSarah.classList.remove("active");
        beamDavidYou.style.opacity = "1"; beamHenryDavid.style.opacity = "1"; beamHenrySarah.style.opacity = "0.2";
        const lt = (t - 0.50) / 0.25;
        const px = waypoints[1][0] + (waypoints[2][0] - waypoints[1][0]) * lt;
        const py = waypoints[1][1] + (waypoints[2][1] - waypoints[1][1]) * lt;
        pulseDot.setAttribute("cx", String(r2(px)));
        pulseDot.setAttribute("cy", String(r2(py)));
      } else {
        if (elYou) elYou.classList.add("active");
        if (elDavid) elDavid.classList.add("active");
        if (elHenry) elHenry.classList.add("active");
        if (elSarah) elSarah.classList.add("active");
        beamDavidYou.style.opacity = "1"; beamHenryDavid.style.opacity = "1"; beamHenrySarah.style.opacity = "1";
        const lt = (t - 0.75) / 0.25;
        const px = waypoints[2][0] + (waypoints[3][0] - waypoints[2][0]) * lt;
        const py = waypoints[2][1] + (waypoints[3][1] - waypoints[2][1]) * lt;
        pulseDot.setAttribute("cx", String(r2(px)));
        pulseDot.setAttribute("cy", String(r2(py)));
      }
    };

    poseFnRef.current(0);
  }, []);

  useEffect(() => {
    if (poseFnRef.current) poseFnRef.current(progress);
  }, [progress]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[400/290] pointer-events-none select-none">
      <svg ref={svgRef} viewBox="0 0 400 290" className="w-full h-full block bg-transparent" />
      <div ref={lblHenryRef} className="node-label tag-blue" style={{ left: '51.2%', top: '2.4%' }}>{locale === 'id' ? 'Kakek Henry' : 'Grandpa Henry'}</div>
      <div ref={lblDavidRef} className="node-label tag-blue" style={{ left: '31.8%', top: '17.8%' }}>{locale === 'id' ? 'Ayah (David)' : 'Father (David)'}</div>
      <div ref={lblSarahRef} className="node-label tag-pink" style={{ left: '68.2%', top: '35.6%' }}>{locale === 'id' ? 'Tante Sarah' : 'Aunt Sarah'}</div>
      <div ref={lblYouRef} className="node-label tag-blue" style={{ left: '20.8%', top: '40.8%' }}>{locale === 'id' ? 'Anda' : 'You'}</div>
    </div>
  );
}
