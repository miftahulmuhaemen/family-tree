import { useEffect, useRef } from 'react';
import {
  createStoryCam, storyProj, storyFacing,
  storyRings, storyPrism, storyArmSolid, storyTaperPrism,
  storyCircRing, createStorySvgEl, createStorySolid, putStorySolid,
  poly, r2, seg
} from './storyCommon';

export interface StorySlideProps {
  progress: number;
  locale: 'en' | 'id';
}

export function StorySlide1({ progress, locale }: StorySlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bubbleElderRef = useRef<HTMLDivElement>(null);
  const bubbleYouRef = useRef<HTMLDivElement>(null);
  const poseFnRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const bubbleElder = bubbleElderRef.current;
    const bubbleYou = bubbleYouRef.current;
    if (!svg) return;

    svg.replaceChildren();

    // Standardized camera matching all 4 slides: S=3.44, ox=200, oy=190
    const C = createStoryCam(45, 0.5, 3.44);
    C.ox = 200;
    C.oy = 190;
    const P = storyProj(C), front = storyFacing(C);

    const gRoom = createStorySvgEl("g", {}, svg);

    // Floor plinth & planks
    const pBL = P(-36, 36, 0);
    const pBR = P(36, -36, 0);
    const pBF = P(36, 36, 0);
    const pBB = P(-36, -36, 0);
    const pBL3 = P(-36, 36, -3);
    const pBR3 = P(36, -36, -3);
    const pBF3 = P(36, 36, -3);

    // Floor top surface
    createStorySvgEl("path", { d: poly([pBB, pBR, pBF, pBL]), class: "sil" }, gRoom);

    // Floor front & right bevel faces
    createStorySvgEl("path", { d: poly([pBL, pBF, pBF3, pBL3]), class: "lo nf" }, gRoom);
    createStorySvgEl("path", { d: poly([pBF, pBR, pBR3, pBF3]), class: "lo nf" }, gRoom);

    // Floor wood planks
    for (let y = -28; y <= 28; y += 7) {
      createStorySvgEl("path", { d: seg(P(-36, y, 0), P(36, y, 0)), class: "lo nf", opacity: "0.35" }, gRoom);
    }

    // Left Wall
    const pWLTopL = P(-36, 36, 24);
    const pWLTopB = P(-36, -36, 24);
    createStorySvgEl("path", {
      d: poly([pBB, pBL, pWLTopL, pWLTopB]),
      class: "wall"
    }, gRoom);
    createStorySvgEl("path", { d: seg(pWLTopB, pWLTopL), class: "lo nf" }, gRoom);

    // Right Wall
    const pWRTopR = P(36, -36, 24);
    createStorySvgEl("path", {
      d: poly([pBB, pBR, pWRTopR, pWLTopB]),
      class: "wall"
    }, gRoom);
    createStorySvgEl("path", { d: seg(pWLTopB, pWRTopR), class: "lo nf" }, gRoom);

    // Corner back seam & baseboards
    createStorySvgEl("path", { d: seg(pBB, pWLTopB), class: "lo nf", opacity: "0.6" }, gRoom);
    createStorySvgEl("path", { d: seg(pBB, pBL), class: "lo nf", opacity: "0.6" }, gRoom);
    createStorySvgEl("path", { d: seg(pBB, pBR), class: "lo nf", opacity: "0.6" }, gRoom);

    // Picture frame on Left Wall
    const pf1 = P(-36, 2, 10), pf2 = P(-36, 16, 10), pf3 = P(-36, 16, 20), pf4 = P(-36, 2, 20);
    createStorySvgEl("path", { d: poly([pf1, pf2, pf3, pf4]), class: "sil" }, gRoom);
    const pfI1 = P(-36, 4, 11.5), pfI2 = P(-36, 14, 11.5), pfI3 = P(-36, 14, 18.5), pfI4 = P(-36, 4, 18.5);
    createStorySvgEl("path", { d: poly([pfI1, pfI2, pfI3, pfI4]), class: "lo nf" }, gRoom);

    // Window on Right Wall
    const w1 = P(8, -36, 9), w2 = P(24, -36, 9), w3 = P(24, -36, 20), w4 = P(8, -36, 20);
    createStorySvgEl("path", { d: poly([w1, w2, w3, w4]), class: "sil" }, gRoom);
    createStorySvgEl("path", { d: seg(P(16, -36, 9), P(16, -36, 20)), class: "sil" }, gRoom);
    for (let z = 11; z <= 18; z += 2.2) {
      createStorySvgEl("path", { d: seg(P(8, -36, z), P(24, -36, z)), class: "lo nf", opacity: "0.45" }, gRoom);
    }

    // Center floor dot
    const cDot = createStorySvgEl("ellipse", { rx: 3.5, ry: 1.8, class: "dot" }, gRoom);
    const cPt = P(0, 0, 0.1);
    cDot.setAttribute("cx", String(r2(cPt[0])));
    cDot.setAttribute("cy", String(r2(cPt[1])));

    // Characters Group
    const gChars = createStorySvgEl("g", {}, svg);
    const gBoy = createStorySvgEl("g", {}, gChars);
    const boyArmOther = createStorySolid(gBoy);
    const boyHandOther = createStorySolid(gBoy);
    const boyPants = createStorySolid(gBoy);
    const boyTorso = createStorySolid(gBoy);
    const boyShirt = createStorySvgEl("path", { class: "lo nf" }, gBoy);
    const boyNeck = createStorySolid(gBoy);
    const boyHead = createStorySvgEl("path", { class: "sil" }, gBoy);
    const boyHair = createStorySvgEl("path", { class: "sil" }, gBoy);
    const boyHairCr = createStorySvgEl("path", { class: "lo nf" }, gBoy);
    const boyEyeL = createStorySvgEl("circle", { r: 1.3, class: "dot" }, gBoy);
    const boyEyeR = createStorySvgEl("circle", { r: 1.3, class: "dot" }, gBoy);
    const boySmile = createStorySvgEl("path", { class: "lo nf" }, gBoy);
    const boyArmGreet = createStorySolid(gBoy);
    const boyHandGreet = createStorySolid(gBoy);

    const gClasp = createStorySvgEl("g", {}, gChars);
    const claspSolid = createStorySolid(gClasp);

    const gGirl = createStorySvgEl("g", {}, gChars);
    const girlHairBack = createStorySvgEl("path", { class: "sil" }, gGirl);
    const girlHairBackLines = createStorySvgEl("path", { class: "lo nf" }, gGirl);
    const girlArmOther = createStorySolid(gGirl);
    const girlHandOther = createStorySolid(gGirl);
    const girlSkirt = createStorySolid(gGirl);
    const girlTorso = createStorySolid(gGirl);
    const pearls = Array.from({ length: 6 }, () => createStorySvgEl("circle", { r: 1.15, class: "dot m" }, gGirl));
    const girlNeck = createStorySolid(gGirl);
    const girlHead = createStorySvgEl("path", { class: "sil" }, gGirl);
    const girlHair = createStorySvgEl("path", { class: "sil" }, gGirl);
    const girlHairCr = createStorySvgEl("path", { class: "lo nf" }, gGirl);
    const girlEyeL = createStorySvgEl("circle", { r: 1.3, class: "dot" }, gGirl);
    const girlEyeR = createStorySvgEl("circle", { r: 1.3, class: "dot" }, gGirl);
    const girlSmile = createStorySvgEl("path", { class: "lo nf" }, gGirl);
    const girlArmGreet = createStorySolid(gGirl);
    const girlHandGreet = createStorySolid(gGirl);

    const BX0 = -16, BY0 = 16, GX0 = 16, GY0 = -16;

    poseFnRef.current = (t: number) => {
      const reach = t * 20;
      const bx = BX0 + reach * 0.22, by = BY0 - reach * 0.22;
      const gx = GX0 - reach * 0.22, gy = GY0 + reach * 0.22;

      // Boy Pose
      const bShOther: [number, number, number] = [bx - 4.5, by + 3.0, 21.0];
      const bHOther: [number, number, number] = [bx - 6.0, by + 4.2, 12.0];
      putStorySolid(boyArmOther, storyArmSolid(P, bShOther, 2.7, bHOther, 1.9));
      const [bhdrO, bhdiO] = storyRings(bHOther[0] - 1.5, bHOther[1] - 1.5, bHOther[0] + 1.5, bHOther[1] + 1.5, 1.1, 0.4);
      putStorySolid(boyHandOther, storyPrism(P, front, bhdrO, bhdiO, bHOther[2] - 1.0, bHOther[2] + 1.0));

      const [bpr, bpi] = storyRings(bx - 5.2, by - 5.0, bx + 5.2, by + 5.0, 3.4, 0.8);
      putStorySolid(boyPants, storyPrism(P, front, bpr, bpi, 0, 11));
      const [btr, bti] = storyRings(bx - 6.8, by - 6.0, bx + 6.8, by + 6.0, 4.4, 1.1);
      putStorySolid(boyTorso, storyPrism(P, front, btr, bti, 11, 25));

      const p1 = P(bx + 3.0, by + 1.2, 24.5), p2 = P(bx + 3.2, by + 3.2, 18.0), p3 = P(bx + 1.2, by + 3.0, 24.5);
      boyShirt.setAttribute("d", seg(p1, p2) + seg(p3, p2));

      const [bnr, bni] = storyRings(bx - 2.5, by - 2.5, bx + 2.5, by + 2.5, 1.8, 0.5);
      putStorySolid(boyNeck, storyPrism(P, front, bnr, bni, 25, 27));

      const pBHead = P(bx, by, 32);
      const bHx = r2(pBHead[0]), bHy = r2(pBHead[1]), bS = 0.82;
      boyHead.setAttribute("d", `M ${r2(bHx - 11.5 * bS)},${r2(bHy - 6 * bS)} C ${r2(bHx - 11.5 * bS)},${r2(bHy - 13 * bS)} ${r2(bHx - 7 * bS)},${r2(bHy - 15 * bS)} ${bHx},${r2(bHy - 15 * bS)} C ${r2(bHx + 7 * bS)},${r2(bHy - 15 * bS)} ${r2(bHx + 11.5 * bS)},${r2(bHy - 13 * bS)} ${r2(bHx + 11.5 * bS)},${r2(bHy - 6 * bS)} L ${r2(bHx + 11.5 * bS)},${r2(bHy + 6 * bS)} C ${r2(bHx + 11.5 * bS)},${r2(bHy + 13 * bS)} ${r2(bHx + 7 * bS)},${r2(bHy + 15 * bS)} ${bHx},${r2(bHy + 15 * bS)} C ${r2(bHx - 7 * bS)},${r2(bHy + 15 * bS)} ${r2(bHx - 11.5 * bS)},${r2(bHy + 13 * bS)} ${r2(bHx - 11.5 * bS)},${r2(bHy + 6 * bS)} Z`);
      boyHair.setAttribute("d", `M ${bHx},${r2(bHy - 17 * bS)} C ${r2(bHx + 8 * bS)},${r2(bHy - 17 * bS)} ${r2(bHx + 14 * bS)},${r2(bHy - 12 * bS)} ${r2(bHx + 14 * bS)},${r2(bHy - 4 * bS)} C ${r2(bHx + 14 * bS)},${r2(bHy + 2 * bS)} ${r2(bHx + 12 * bS)},${r2(bHy + 7 * bS)} ${r2(bHx + 10.5 * bS)},${r2(bHy + 8.5 * bS)} C ${r2(bHx + 9 * bS)},${r2(bHy + 6 * bS)} ${r2(bHx + 10.5 * bS)},${r2(bHy + 2 * bS)} ${r2(bHx + 9.5 * bS)},${r2(bHy - 1 * bS)} C ${r2(bHx + 7 * bS)},${r2(bHy - 2.5 * bS)} ${r2(bHx + 4 * bS)},${r2(bHy - 2.5 * bS)} ${r2(bHx + 1.5 * bS)},${r2(bHy - 0.5 * bS)} C ${r2(bHx - 1 * bS)},${r2(bHy + 1.5 * bS)} ${r2(bHx - 3 * bS)},${r2(bHy - 0.5 * bS)} ${r2(bHx - 5.5 * bS)},${r2(bHy - 1.2 * bS)} C ${r2(bHx - 8 * bS)},${r2(bHy - 1.2 * bS)} ${r2(bHx - 9.5 * bS)},${r2(bHy + 1.5 * bS)} ${r2(bHx - 10.5 * bS)},${r2(bHy + 8 * bS)} C ${r2(bHx - 12.5 * bS)},${r2(bHy + 6.5 * bS)} ${r2(bHx - 14 * bS)},${r2(bHy + 2 * bS)} ${r2(bHx - 14 * bS)},${r2(bHy - 4 * bS)} C ${r2(bHx - 14 * bS)},${r2(bHy - 12 * bS)} ${r2(bHx - 8 * bS)},${r2(bHy - 17 * bS)} ${bHx},${r2(bHy - 17 * bS)} Z`);
      boyHairCr.setAttribute("d", `M ${r2(bHx - 3 * bS)},${r2(bHy - 16 * bS)} Q ${r2(bHx - 1.5 * bS)},${r2(bHy - 8 * bS)} ${r2(bHx - 3 * bS)},${r2(bHy - 0.5 * bS)} M ${r2(bHx + 3 * bS)},${r2(bHy - 16 * bS)} Q ${r2(bHx + 4 * bS)},${r2(bHy - 8 * bS)} ${r2(bHx + 1.5 * bS)},${r2(bHy - 0.5 * bS)}`);
      boyEyeL.setAttribute("cx", String(r2(bHx - 4.2 * bS)));
      boyEyeL.setAttribute("cy", String(r2(bHy + 2.5 * bS)));
      boyEyeR.setAttribute("cx", String(r2(bHx + 4.2 * bS)));
      boyEyeR.setAttribute("cy", String(r2(bHy + 2.5 * bS)));
      boySmile.setAttribute("d", `M${r2(bHx - 3.2 * bS)},${r2(bHy + 7 * bS)} Q${bHx},${r2(bHy + 10.5 * bS)} ${r2(bHx + 3.2 * bS)},${r2(bHy + 7 * bS)}`);

      const bSh: [number, number, number] = [bx + 4.5, by - 3.0, 21.0];
      const bH0: [number, number, number] = [bx + 6.4, by - 4.8, 12.0];
      const bH1: [number, number, number] = [-1.4, 1.4, 17.0];
      const bH: [number, number, number] = [bH0[0] + (bH1[0] - bH0[0]) * t, bH0[1] + (bH1[1] - bH0[1]) * t, bH0[2] + (bH1[2] - bH0[2]) * t];
      putStorySolid(boyArmGreet, storyArmSolid(P, bSh, 2.8, bH, 2.0));
      const [bhdr, bhdi] = storyRings(bH[0] - 1.6, bH[1] - 1.6, bH[0] + 1.6, bH[1] + 1.6, 1.2, 0.4);
      putStorySolid(boyHandGreet, storyPrism(P, front, bhdr, bhdi, bH[2] - 1.0, bH[2] + 1.0));

      // Girl Pose
      const pGHead = P(gx, gy, 32);
      const gHx = r2(pGHead[0]), gHy = r2(pGHead[1]), gS = 0.82;
      girlHairBack.setAttribute("d", `M ${r2(gHx - 14 * gS)},${r2(gHy - 5 * gS)} C ${r2(gHx - 22 * gS)},${r2(gHy + 5 * gS)} ${r2(gHx - 25 * gS)},${r2(gHy + 16 * gS)} ${r2(gHx - 20 * gS)},${r2(gHy + 27 * gS)} C ${r2(gHx - 24 * gS)},${r2(gHy + 34 * gS)} ${r2(gHx - 19 * gS)},${r2(gHy + 41 * gS)} ${r2(gHx - 11 * gS)},${r2(gHy + 41 * gS)} C ${r2(gHx - 5 * gS)},${r2(gHy + 41 * gS)} ${gHx},${r2(gHy + 38 * gS)} ${r2(gHx + 5 * gS)},${r2(gHy + 41 * gS)} C ${r2(gHx + 11 * gS)},${r2(gHy + 41 * gS)} ${r2(gHx + 19 * gS)},${r2(gHy + 41 * gS)} ${r2(gHx + 24 * gS)},${r2(gHy + 34 * gS)} C ${r2(gHx + 20 * gS)},${r2(gHy + 27 * gS)} ${r2(gHx + 25 * gS)},${r2(gHy + 16 * gS)} ${r2(gHx + 22 * gS)},${r2(gHy + 5 * gS)} C ${r2(gHx + 14 * gS)},${r2(gHy - 5 * gS)} ${gHx},${r2(gHy - 7 * gS)} ${r2(gHx - 14 * gS)},${r2(gHy - 5 * gS)} Z`);
      girlHairBackLines.setAttribute("d", `M ${r2(gHx - 18 * gS)},${r2(gHy + 14 * gS)} Q ${r2(gHx - 21 * gS)},${r2(gHy + 25 * gS)} ${r2(gHx - 14 * gS)},${r2(gHy + 35 * gS)} M ${r2(gHx + 18 * gS)},${r2(gHy + 14 * gS)} Q ${r2(gHx + 21 * gS)},${r2(gHy + 25 * gS)} ${r2(gHx + 14 * gS)},${r2(gHy + 35 * gS)}`);

      const gShOther: [number, number, number] = [gx + 3.0, gy - 4.5, 21.0];
      const gHOther: [number, number, number] = [gx + 4.2, gy - 6.0, 12.0];
      putStorySolid(girlArmOther, storyArmSolid(P, gShOther, 2.7, gHOther, 1.9));
      const [ghdrO, ghdiO] = storyRings(gHOther[0] - 1.5, gHOther[1] - 1.5, gHOther[0] + 1.5, gHOther[1] + 1.5, 1.1, 0.4);
      putStorySolid(girlHandOther, storyPrism(P, front, ghdrO, ghdiO, gHOther[2] - 1.0, gHOther[2] + 1.0));

      const skirtFoot = storyCircRing(gx, gy, 8.4, 20), skirtTop = storyCircRing(gx, gy, 6.0, 20);
      putStorySolid(girlSkirt, storyTaperPrism(P, skirtFoot, skirtTop, 0, 12));
      const [gtr, gti] = storyRings(gx - 6.5, gy - 6.5, gx + 6.5, gy + 6.5, 4.4, 1.1);
      putStorySolid(girlTorso, storyPrism(P, front, gtr, gti, 12, 25));

      for (let k = 0; k < 6; k++) {
        const u = (k - 2.5) * 1.5;
        const qp = P(gx + 3.4 + u * 0.7, gy + 3.4 - u * 0.7, 23.8 - Math.cos((u / 4.8) * Math.PI) * 1.8);
        pearls[k].setAttribute("cx", String(r2(qp[0])));
        pearls[k].setAttribute("cy", String(r2(qp[1])));
      }

      const [gnr, gni] = storyRings(gx - 2.5, gy - 2.5, gx + 2.5, gy + 2.5, 1.8, 0.5);
      putStorySolid(girlNeck, storyPrism(P, front, gnr, gni, 25, 27));

      girlHead.setAttribute("d", `M ${r2(gHx - 11.5 * gS)},${r2(gHy - 6 * gS)} C ${r2(gHx - 11.5 * gS)},${r2(gHy - 13 * gS)} ${r2(gHx - 7 * gS)},${r2(gHy - 15 * gS)} ${gHx},${r2(gHy - 15 * gS)} C ${r2(gHx + 7 * gS)},${r2(gHy - 15 * gS)} ${r2(gHx + 11.5 * gS)},${r2(gHy - 13 * gS)} ${r2(gHx + 11.5 * gS)},${r2(gHy - 6 * gS)} L ${r2(gHx + 11.5 * gS)},${r2(gHy + 6 * gS)} C ${r2(gHx + 11.5 * gS)},${r2(gHy + 13 * gS)} ${r2(gHx + 7 * gS)},${r2(gHy + 15 * gS)} ${gHx},${r2(gHy + 15 * gS)} C ${r2(gHx - 7 * gS)},${r2(gHy + 15 * gS)} ${r2(gHx - 11.5 * gS)},${r2(gHy + 13 * gS)} ${r2(gHx - 11.5 * gS)},${r2(gHy + 6 * gS)} Z`);
      girlHair.setAttribute("d", `M ${gHx},${r2(gHy - 18 * gS)} C ${r2(gHx + 10 * gS)},${r2(gHy - 18 * gS)} ${r2(gHx + 16 * gS)},${r2(gHy - 13 * gS)} ${r2(gHx + 18.5 * gS)},${r2(gHy - 7 * gS)} C ${r2(gHx + 23 * gS)},${r2(gHy - 1 * gS)} ${r2(gHx + 23 * gS)},${r2(gHy + 6 * gS)} ${r2(gHx + 18.5 * gS)},${r2(gHy + 12 * gS)} C ${r2(gHx + 24 * gS)},${r2(gHy + 17 * gS)} ${r2(gHx + 22 * gS)},${r2(gHy + 24 * gS)} ${r2(gHx + 18.5 * gS)},${r2(gHy + 28 * gS)} C ${r2(gHx + 22 * gS)},${r2(gHy + 33 * gS)} ${r2(gHx + 18.5 * gS)},${r2(gHy + 38 * gS)} ${r2(gHx + 13 * gS)},${r2(gHy + 36 * gS)} C ${r2(gHx + 9.5 * gS)},${r2(gHy + 34 * gS)} ${r2(gHx + 11.5 * gS)},${r2(gHy + 27 * gS)} ${r2(gHx + 13 * gS)},${r2(gHy + 19 * gS)} C ${r2(gHx + 14 * gS)},${r2(gHy + 12 * gS)} ${r2(gHx + 12 * gS)},${r2(gHy + 6 * gS)} ${r2(gHx + 11.5 * gS)},${r2(gHy + 1 * gS)} C ${r2(gHx + 9 * gS)},${r2(gHy - 2.5 * gS)} ${r2(gHx + 5.5 * gS)},${r2(gHy - 1.8 * gS)} ${r2(gHx + 2.5 * gS)},${r2(gHy + 0.5 * gS)} C ${r2(gHx + 0.5 * gS)},${r2(gHy + 1.8 * gS)} ${r2(gHx - 1.5 * gS)},${r2(gHy + 0.5 * gS)} ${r2(gHx - 3 * gS)},${r2(gHy - 1.2 * gS)} C ${r2(gHx - 5 * gS)},${r2(gHy + 0.5 * gS)} ${r2(gHx - 8 * gS)},${r2(gHy + 1.2 * gS)} ${r2(gHx - 10 * gS)},${r2(gHy + 0.5 * gS)} C ${r2(gHx - 12 * gS)},${r2(gHy + 6 * gS)} ${r2(gHx - 13.5 * gS)},${r2(gHy + 12 * gS)} ${r2(gHx - 12.5 * gS)},${r2(gHy + 19 * gS)} C ${r2(gHx - 10.5 * gS)},${r2(gHy + 27 * gS)} ${r2(gHx - 8.5 * gS)},${r2(gHy + 34 * gS)} ${r2(gHx - 12 * gS)},${r2(gHy + 36 * gS)} C ${r2(gHx - 17.5 * gS)},${r2(gHy + 38 * gS)} ${r2(gHx - 21 * gS)},${r2(gHy + 33 * gS)} ${r2(gHx - 17.5 * gS)},${r2(gHy + 28 * gS)} C ${r2(gHx - 21 * gS)},${r2(gHy + 24 * gS)} ${r2(gHx - 23 * gS)},${r2(gHy + 17 * gS)} ${r2(gHx - 17.5 * gS)},${r2(gHy + 12 * gS)} C ${r2(gHx - 22 * gS)},${r2(gHy + 6 * gS)} ${r2(gHx - 22 * gS)},${r2(gHy - 1 * gS)} ${r2(gHx - 17.5 * gS)},${r2(gHy - 7 * gS)} C ${r2(gHx - 15 * gS)},${r2(gHy - 13 * gS)} ${r2(gHx - 9 * gS)},${r2(gHy - 18 * gS)} ${gHx},${r2(gHy - 18 * gS)} Z`);
      girlHairCr.setAttribute("d", `M ${r2(gHx - 1.5 * gS)},${r2(gHy - 17 * gS)} Q ${r2(gHx - 1 * gS)},${r2(gHy - 8 * gS)} ${r2(gHx - 3 * gS)},${r2(gHy - 1.2 * gS)} M ${r2(gHx + 15 * gS)},${r2(gHy - 4 * gS)} C ${r2(gHx + 19 * gS)},${r2(gHy + 3 * gS)} ${r2(gHx + 15 * gS)},${r2(gHy + 12 * gS)} ${r2(gHx + 19 * gS)},${r2(gHy + 21 * gS)} M ${r2(gHx - 15 * gS)},${r2(gHy - 4 * gS)} C ${r2(gHx - 19 * gS)},${r2(gHy + 3 * gS)} ${r2(gHx - 15 * gS)},${r2(gHy + 12 * gS)} ${r2(gHx - 19 * gS)},${r2(gHy + 21 * gS)}`);
      girlEyeL.setAttribute("cx", String(r2(gHx - 4.2 * gS)));
      girlEyeL.setAttribute("cy", String(r2(gHy + 2.5 * gS)));
      girlEyeR.setAttribute("cx", String(r2(gHx + 4.2 * gS)));
      girlEyeR.setAttribute("cy", String(r2(gHy + 2.5 * gS)));
      girlSmile.setAttribute("d", `M${r2(gHx - 3.2 * gS)},${r2(gHy + 7 * gS)} Q${gHx},${r2(gHy + 10.5 * gS)} ${r2(gHx + 3.2 * gS)},${r2(gHy + 7 * gS)}`);

      const gSh: [number, number, number] = [gx - 3.0, gy + 4.5, 21.0];
      const gH0: [number, number, number] = [gx - 4.8, gy + 6.4, 12.0];
      const gH1: [number, number, number] = [1.4, -1.4, 17.0];
      const gH: [number, number, number] = [gH0[0] + (gH1[0] - gH0[0]) * t, gH0[1] + (gH1[1] - gH0[1]) * t, gH0[2] + (gH1[2] - gH0[2]) * t];
      putStorySolid(girlArmGreet, storyArmSolid(P, gSh, 2.8, gH, 2.0));
      const [ghdr, ghdi] = storyRings(gH[0] - 1.6, gH[1] - 1.6, gH[0] + 1.6, gH[1] + 1.6, 1.2, 0.4);
      putStorySolid(girlHandGreet, storyPrism(P, front, ghdr, ghdi, gH[2] - 1.0, gH[2] + 1.0));

      if (t > 0.05) {
        const [cr, ci] = storyRings(-3.2 * t, -3.2 * t, 3.2 * t, 3.2 * t, 2.2 * t, 0.7 * t);
        putStorySolid(claspSolid, storyPrism(P, front, cr, ci, 17.0 - 1.6 * t, 17.0 + 1.6 * t));
      } else {
        putStorySolid(claspSolid, { sil: "", crease: "" });
      }

      claspSolid.sil.classList.toggle("hi", t > 0.55);

      if (bubbleElder) {
        bubbleElder.style.left = (((gHx + 8) / 400) * 100) + "%";
        bubbleElder.style.top = (((gHy - 24) / 290) * 100) + "%";
        bubbleElder.classList.toggle("show", t > 0.25);
      }
      if (bubbleYou) {
        bubbleYou.style.left = (((bHx - 8) / 400) * 100) + "%";
        bubbleYou.style.top = (((bHy - 4) / 290) * 100) + "%";
        bubbleYou.classList.toggle("show", t > 0.55);
      }
    };

    poseFnRef.current(0);
  }, []);

  useEffect(() => {
    if (poseFnRef.current) {
      poseFnRef.current(progress);
    }
  }, [progress]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[400/290] pointer-events-none select-none">
      <svg ref={svgRef} viewBox="0 0 400 290" className="w-full h-full block bg-transparent" />

      <div
        ref={bubbleElderRef}
        className="story-chat-wrap story-elder story-hl-f"
        style={{ left: '70%', top: '20%' }}
      >
        <span className="story-chat-name">{locale === 'id' ? 'Tante Sarah' : 'Aunt Sarah'}</span>
        <div className="story-chat-box">
          {locale === 'id'
            ? 'Wah, sudah besar sekali! Mirip sekali dengan Henry!'
            : "Look how big you've grown! You look just like Henry!"}
        </div>
      </div>

      <div
        ref={bubbleYouRef}
        className="story-chat-wrap story-you story-hl-m"
        style={{ left: '30%', top: '30%' }}
      >
        <span className="story-chat-name">{locale === 'id' ? 'Anda' : 'You'}</span>
        <div className="story-chat-box">
          {locale === 'id'
            ? 'Maaf... tante siapa ya?'
            : "Um... I'm so sorry, who are you again?"}
        </div>
      </div>
    </div>
  );
}
