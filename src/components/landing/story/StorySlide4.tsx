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

export function StorySlide4({ progress, locale }: StorySlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tagHenryRef = useRef<HTMLDivElement>(null);
  const tagEleanorRef = useRef<HTMLDivElement>(null);
  const tagDavidRef = useRef<HTMLDivElement>(null);
  const tagSarahRef = useRef<HTMLDivElement>(null);
  const tagYouRef = useRef<HTMLDivElement>(null);
  const poseFnRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const tagH = tagHenryRef.current;
    const tagE = tagEleanorRef.current;
    const tagD = tagDavidRef.current;
    const tagS = tagSarahRef.current;
    const tagY = tagYouRef.current;
    if (!svg) return;

    svg.replaceChildren();

    // Standardized camera matching all 4 slides: S=3.44, ox=200, oy=190
    const C = createStoryCam(45, 0.5, 3.44);
    C.ox = 200;
    C.oy = 190;
    const P = storyProj(C), front = storyFacing(C);

    const gGrid = createStorySvgEl("g", {}, svg);
    const gLines = createStorySvgEl("g", {}, svg);
    const gPlates = createStorySvgEl("g", {}, svg);
    const gAvatars = createStorySvgEl("g", {}, svg);

    for (let i = -36; i <= 36; i += 12) {
      createStorySvgEl("path", { d: seg(P(i, -36, 0), P(i, 36, 0)), class: "lo nf", opacity: "0.18" }, gGrid);
      createStorySvgEl("path", { d: seg(P(-36, i, 0), P(36, i, 0)), class: "lo nf", opacity: "0.18" }, gGrid);
    }

    const PEOPLE = {
      sarah: { id: "sarah", gender: "female", pos: { x: 8, y: -10, z: 9 }, tagEl: tagS },
      henry: { id: "henry", gender: "male", pos: { x: -14, y: -14, z: 18 }, tagEl: tagH },
      eleanor: { id: "eleanor", gender: "female", pos: { x: 4, y: -32, z: 18 }, tagEl: tagE },
      david: { id: "david", gender: "male", pos: { x: -24, y: 4, z: 9 }, tagEl: tagD },
      you: { id: "you", gender: "male", pos: { x: -24, y: 22, z: 0 }, tagEl: tagY }
    };

    const pHenry = PEOPLE.henry.pos, pEleanor = PEOPLE.eleanor.pos;
    const dMarriage = openPath([P(pHenry.x, pHenry.y, pHenry.z + 1.6), P(pEleanor.x, pEleanor.y, pEleanor.z + 1.6)]);
    const lineMarriage = createStorySvgEl("path", { d: dMarriage, class: "marriage-line active" }, gLines);

    const midMarr = [(pHenry.x + pEleanor.x)/2, (pHenry.y + pEleanor.y)/2, pHenry.z + 1.6];
    const pDavid = PEOPLE.david.pos, pSarah = PEOPLE.sarah.pos, pYou = PEOPLE.you.pos;

    const dStem = openPath([
      P(midMarr[0], midMarr[1], midMarr[2]),
      P(midMarr[0], midMarr[1], pDavid.z + 5),
      P(pDavid.x, midMarr[1], pDavid.z + 5),
      P(pDavid.x, pDavid.y, pDavid.z + 2)
    ]);
    const dStemSarah = openPath([
      P(midMarr[0], midMarr[1], pDavid.z + 5),
      P(pSarah.x, midMarr[1], pSarah.z + 5),
      P(pSarah.x, pSarah.y, pSarah.z + 2)
    ]);
    const dStemYou = openPath([
      P(pDavid.x, pDavid.y, pDavid.z + 1.6),
      P(pDavid.x, (pDavid.y + pYou.y)/2, pDavid.z + 1.6),
      P(pYou.x, (pDavid.y + pYou.y)/2, pYou.z + 4),
      P(pYou.x, pYou.y, pYou.z + 2)
    ]);

    const lineStemDavid = createStorySvgEl("path", { d: dStem, class: "tree-line" }, gLines);
    const lineStemSarah = createStorySvgEl("path", { d: dStemSarah, class: "tree-line" }, gLines);
    const lineStemYou = createStorySvgEl("path", { d: dStemYou, class: "tree-line" }, gLines);

    const plateEls: Record<string, SVGPathElement> = {};
    Object.values(PEOPLE).forEach((p) => {
      const [r0, r1] = storyRings(p.pos.x - 7.5, p.pos.y - 6.5, p.pos.x + 7.5, p.pos.y + 6.5, 3.2, 0.8);
      const geom = storyPrism(P, front, r0, r1, p.pos.z, p.pos.z + 2.5);
      const g = createStorySvgEl("g", {}, gPlates);
      const sil = createStorySvgEl("path", { d: geom.sil, class: "node-plate " + p.gender + (p.id === "sarah" ? " active" : "") }, g);
      createStorySvgEl("path", { d: geom.crease, class: "lo nf" }, g);
      plateEls[p.id] = sil;
    });

    function createAvatar(parent: SVGGElement, p: { pos: { x: number; y: number; z: number } }, type: string) {
      const g = createStorySvgEl("g", {}, parent);
      const x = p.pos.x, y = p.pos.y, z0 = p.pos.z + 2.5;
      const body = createStorySolid(g), armL = createStorySolid(g), armR = createStorySolid(g);
      const handL = createStorySolid(g), handR = createStorySolid(g), neck = createStorySolid(g);
      const head = createStorySvgEl("path", { class: "sil" }, g);
      const hair = createStorySvgEl("path", { class: "sil" }, g);
      const hairCr = createStorySvgEl("path", { class: "lo nf" }, g);
      const eyeL = createStorySvgEl("circle", { r: 1.0, class: "dot" }, g);
      const eyeR = createStorySvgEl("circle", { r: 1.0, class: "dot" }, g);
      const smile = createStorySvgEl("path", { class: "lo nf" }, g);

      const [tr, ti] = storyRings(x - 3.4, y - 3.0, x + 3.4, y + 3.0, 2.0, 0.5);
      putStorySolid(body, storyPrism(P, front, tr, ti, z0, z0 + 8.5));
      const shL: [number, number, number] = [x - 3.0, y + 1.8, z0 + 7.0], hL: [number, number, number] = [x - 4.0, y + 2.5, z0 + 1.5];
      const shR: [number, number, number] = [x + 3.0, y - 1.8, z0 + 7.0], hR: [number, number, number] = [x + 4.0, y - 2.5, z0 + 1.5];
      putStorySolid(armL, storyArmSolid(P, shL, 1.6, hL, 1.2));
      putStorySolid(armR, storyArmSolid(P, shR, 1.6, hR, 1.2));
      const [hlr, hli] = storyRings(hL[0] - 0.9, hL[1] - 0.9, hL[0] + 0.9, hL[1] + 0.9, 0.6, 0.2);
      const [hrr, hri] = storyRings(hR[0] - 0.9, hR[1] - 0.9, hR[0] + 0.9, hR[1] + 0.9, 0.6, 0.2);
      putStorySolid(handL, storyPrism(P, front, hlr, hli, z0 + 0.5, z0 + 1.8));
      putStorySolid(handR, storyPrism(P, front, hrr, hri, z0 + 0.5, z0 + 1.8));

      const [nr, ni] = storyRings(x - 1.4, y - 1.4, x + 1.4, y + 1.4, 0.9, 0.3);
      putStorySolid(neck, storyPrism(P, front, nr, ni, z0 + 8.5, z0 + 9.8));

      const pH = P(x, y, z0 + 13.0);
      const hx = r2(pH[0]), hy = r2(pH[1]), s = 0.52;
      head.setAttribute("d", `M ${r2(hx - 11.5 * s)},${r2(hy - 6 * s)} C ${r2(hx - 11.5 * s)},${r2(hy - 13 * s)} ${r2(hx - 7 * s)},${r2(hy - 15 * s)} ${hx},${r2(hy - 15 * s)} C ${r2(hx + 7 * s)},${r2(hy - 15 * s)} ${r2(hx + 11.5 * s)},${r2(hy - 13 * s)} ${r2(hx + 11.5 * s)},${r2(hy - 6 * s)} L ${r2(hx + 11.5 * s)},${r2(hy + 6 * s)} C ${r2(hx + 11.5 * s)},${r2(hy + 13 * s)} ${r2(hx + 7 * s)},${r2(hy + 15 * s)} ${hx},${r2(hy + 15 * s)} C ${r2(hx - 7 * s)},${r2(hy + 15 * s)} ${r2(hx - 11.5 * s)},${r2(hy + 13 * s)} ${r2(hx - 11.5 * s)},${r2(hy + 6 * s)} Z`);
      eyeL.setAttribute("cx", String(r2(hx - 4.2 * s)));
      eyeL.setAttribute("cy", String(r2(hy + 2.5 * s)));
      eyeR.setAttribute("cx", String(r2(hx + 4.2 * s)));
      eyeR.setAttribute("cy", String(r2(hy + 2.5 * s)));
      smile.setAttribute("d", `M${r2(hx - 3.2 * s)},${r2(hy + 7 * s)} Q${hx},${r2(hy + 10.5 * s)} ${r2(hx + 3.2 * s)},${r2(hy + 7 * s)}`);

      if (type === "sarah") {
        hair.setAttribute("d", `M ${hx},${r2(hy - 18 * s)} C ${r2(hx + 10 * s)},${r2(hy - 18 * s)} ${r2(hx + 17 * s)},${r2(hy - 13 * s)} ${r2(hx + 19 * s)},${r2(hy - 7 * s)} C ${r2(hx + 24 * s)},${r2(hy + 3 * s)} ${r2(hx + 20 * s)},${r2(hy + 15 * s)} ${r2(hx + 16 * s)},${r2(hy + 24 * s)} C ${r2(hx + 11 * s)},${r2(hy + 20 * s)} ${r2(hx + 12 * s)},${r2(hy + 8 * s)} ${r2(hx + 10 * s)},${r2(hy + 1 * s)} C ${r2(hx + 8 * s)},${r2(hy - 2 * s)} ${r2(hx + 4 * s)},${r2(hy - 2 * s)} ${r2(hx + 1.5 * s)},${r2(hy + 0.5 * s)} C ${r2(hx - 1.5 * s)},${r2(hy + 0.5 * s)} ${r2(hx - 4 * s)},${r2(hy - 2 * s)} ${r2(hx - 8 * s)},${r2(hy - 2 * s)} C ${r2(hx - 10 * s)},${r2(hy + 1 * s)} ${r2(hx - 12 * s)},${r2(hy + 8 * s)} ${r2(hx - 11 * s)},${r2(hy + 20 * s)} C ${r2(hx - 16 * s)},${r2(hy + 24 * s)} ${r2(hx - 20 * s)},${r2(hy + 15 * s)} ${r2(hx - 24 * s)},${r2(hy + 3 * s)} C ${r2(hx - 19 * s)},${r2(hy - 7 * s)} ${r2(hx - 17 * s)},${r2(hy - 13 * s)} ${r2(hx - 10 * s)},${r2(hy - 18 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 2 * s)},${r2(hy - 16 * s)} Q${hx},${r2(hy - 8 * s)} ${r2(hx - 2 * s)},${r2(hy)}`);
      } else if (type === "eleanor") {
        hair.setAttribute("d", `M ${hx},${r2(hy - 22 * s)} C ${r2(hx + 6 * s)},${r2(hy - 22 * s)} ${r2(hx + 7 * s)},${r2(hy - 17 * s)} ${hx},${r2(hy - 17 * s)} C ${r2(hx + 11 * s)},${r2(hy - 17 * s)} ${r2(hx + 14 * s)},${r2(hy - 10 * s)} ${r2(hx + 14 * s)},${r2(hy - 2 * s)} C ${r2(hx + 14 * s)},${r2(hy + 6 * s)} ${r2(hx + 11 * s)},${r2(hy + 9 * s)} ${r2(hx + 10 * s)},${r2(hy + 9 * s)} C ${r2(hx + 10 * s)},${r2(hy + 2 * s)} ${r2(hx + 8 * s)},${r2(hy - 3 * s)} ${r2(hx + 4 * s)},${r2(hy - 5 * s)} C ${r2(hx - 4 * s)},${r2(hy - 5 * s)} ${r2(hx - 8 * s)},${r2(hy - 3 * s)} ${r2(hx - 10 * s)},${r2(hy + 2 * s)} C ${r2(hx - 10 * s)},${r2(hy + 9 * s)} ${r2(hx - 11 * s)},${r2(hy + 6 * s)} ${r2(hx - 14 * s)},${r2(hy - 2 * s)} C ${r2(hx - 14 * s)},${r2(hy - 10 * s)} ${r2(hx - 11 * s)},${r2(hy - 17 * s)} ${hx},${r2(hy - 17 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 5 * s)},${r2(hy - 18 * s)} Q${hx},${r2(hy - 21 * s)} ${r2(hx + 5 * s)},${r2(hy - 18 * s)}`);
      } else if (type === "henry") {
        hair.setAttribute("d", `M ${hx},${r2(hy - 16 * s)} C ${r2(hx + 10 * s)},${r2(hy - 16 * s)} ${r2(hx + 14 * s)},${r2(hy - 10 * s)} ${r2(hx + 14 * s)},${r2(hy - 3 * s)} C ${r2(hx + 14 * s)},${r2(hy + 6 * s)} ${r2(hx + 11 * s)},${r2(hy + 10 * s)} ${r2(hx + 10 * s)},${r2(hy + 9 * s)} C ${r2(hx + 10 * s)},${r2(hy + 2 * s)} ${r2(hx + 10 * s)},${r2(hy - 4 * s)} ${r2(hx + 7 * s)},${r2(hy - 8 * s)} C ${r2(hx + 4 * s)},${r2(hy - 10 * s)} ${r2(hx - 4 * s)},${r2(hy - 10 * s)} ${r2(hx - 7 * s)},${r2(hy - 8 * s)} C ${r2(hx - 10 * s)},${r2(hy - 4 * s)} ${r2(hx - 10 * s)},${r2(hy + 2 * s)} ${r2(hx - 10 * s)},${r2(hy + 9 * s)} C ${r2(hx - 11 * s)},${r2(hy + 10 * s)} ${r2(hx - 14 * s)},${r2(hy + 6 * s)} ${r2(hx - 14 * s)},${r2(hy - 3 * s)} C ${r2(hx - 14 * s)},${r2(hy - 10 * s)} ${r2(hx - 10 * s)},${r2(hy - 16 * s)} ${hx},${r2(hy - 16 * s)} Z`);
        hairCr.setAttribute("d", `M ${r2(hx - 5 * s)},${r2(hy + 2 * s)} L ${r2(hx - 2 * s)},${r2(hy + 2 * s)} M ${r2(hx + 2 * s)},${r2(hy + 2 * s)} L ${r2(hx + 5 * s)},${r2(hy + 2 * s)}`);
      } else if (type === "david") {
        hair.setAttribute("d", `M ${hx},${r2(hy - 17 * s)} C ${r2(hx + 8 * s)},${r2(hy - 17 * s)} ${r2(hx + 14 * s)},${r2(hy - 12 * s)} ${r2(hx + 14 * s)},${r2(hy - 4 * s)} C ${r2(hx + 14 * s)},${r2(hy + 4 * s)} ${r2(hx + 11 * s)},${r2(hy + 8 * s)} ${r2(hx + 9.5 * s)},${r2(hy + 7 * s)} C ${r2(hx + 9.5 * s)},${r2(hy + 1 * s)} ${r2(hx + 8 * s)},${r2(hy - 3 * s)} ${r2(hx + 5 * s)},${r2(hy - 4 * s)} C ${r2(hx + 2 * s)},${r2(hy - 4 * s)} ${r2(hx - 3 * s)},${r2(hy - 2 * s)} ${r2(hx - 7 * s)},${r2(hy - 0.5 * s)} C ${r2(hx - 9 * s)},${r2(hy + 3 * s)} ${r2(hx - 10 * s)},${r2(hy + 7 * s)} ${r2(hx - 11 * s)},${r2(hy + 7 * s)} C ${r2(hx - 13 * s)},${r2(hy + 4 * s)} ${r2(hx - 14 * s)},${r2(hy - 4 * s)} ${r2(hx - 14 * s)},${r2(hy - 12 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 3 * s)},${r2(hy - 16 * s)} Q${hx},${r2(hy - 9 * s)} ${r2(hx + 4 * s)},${r2(hy - 4 * s)}`);
      } else {
        hair.setAttribute("d", `M ${hx},${r2(hy - 17 * s)} C ${r2(hx + 8 * s)},${r2(hy - 17 * s)} ${r2(hx + 14 * s)},${r2(hy - 12 * s)} ${r2(hx + 14 * s)},${r2(hy - 4 * s)} C ${r2(hx + 14 * s)},${r2(hy + 2 * s)} ${r2(hx + 12 * s)},${r2(hy + 7 * s)} ${r2(hx + 10.5 * s)},${r2(hy + 8.5 * s)} C ${r2(hx + 9 * s)},${r2(hy + 6 * s)} ${r2(hx + 10.5 * s)},${r2(hy + 2 * s)} ${r2(hx + 9.5 * s)},${r2(hy - 1 * s)} C ${r2(hx + 7 * s)},${r2(hy - 2.5 * s)} ${r2(hx + 4 * s)},${r2(hy - 2.5 * s)} ${r2(hx + 1.5 * s)},${r2(hy - 0.5 * s)} C ${r2(hx - 1 * s)},${r2(hy + 1.5 * s)} ${r2(hx - 3 * s)},${r2(hy - 0.5 * s)} ${r2(hx - 5.5 * s)},${r2(hy - 1.2 * s)} C ${r2(hx - 8 * s)},${r2(hy - 1.2 * s)} ${r2(hx - 9.5 * s)},${r2(hy + 1.5 * s)} ${r2(hx - 10.5 * s)},${r2(hy + 8 * s)} C ${r2(hx - 12.5 * s)},${r2(hy + 6.5 * s)} ${r2(hx - 14 * s)},${r2(hy + 2 * s)} ${r2(hx - 14 * s)},${r2(hy - 4 * s)} C ${r2(hx - 14 * s)},${r2(hy - 12 * s)} ${r2(hx - 8 * s)},${r2(hy - 17 * s)} ${hx},${r2(hy - 17 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 3 * s)},${r2(hy - 16 * s)} Q${r2(hx - 1.5 * s)},${r2(hy - 8 * s)} ${r2(hx - 3 * s)},${r2(hy - 0.5 * s)}`);
      }
      return { hx, hy };
    }

    const avs = {
      henry: createAvatar(gAvatars, PEOPLE.henry, "henry"),
      eleanor: createAvatar(gAvatars, PEOPLE.eleanor, "eleanor"),
      david: createAvatar(gAvatars, PEOPLE.david, "david"),
      sarah: createAvatar(gAvatars, PEOPLE.sarah, "sarah"),
      you: createAvatar(gAvatars, PEOPLE.you, "you")
    };

    Object.values(PEOPLE).forEach((p) => {
      const av = avs[p.id as keyof typeof avs];
      const yOff = p.id === "sarah" ? 22 : 20;
      if (p.tagEl) {
        p.tagEl.style.left = ((av.hx / 400) * 100) + "%";
        p.tagEl.style.top = (((av.hy - yOff) / 290) * 100) + "%";
      }
    });

    function setActive(activeIds: string[], activeLines: string[]) {
      Object.values(PEOPLE).forEach((p) => {
        const isActive = activeIds.includes(p.id);
        if (plateEls[p.id]) {
          plateEls[p.id].classList.toggle("active", isActive);
        }
        if (p.tagEl) {
          p.tagEl.classList.toggle("active", isActive);
        }
      });
      lineMarriage.classList.toggle("active", activeLines.includes("marriage"));
      lineStemDavid.classList.toggle("active", activeLines.includes("david"));
      lineStemSarah.classList.toggle("active", activeLines.includes("sarah"));
      lineStemYou.classList.toggle("active", activeLines.includes("you"));
    }

    poseFnRef.current = (t: number) => {
      if (t < 0.25) {
        setActive(["henry", "eleanor"], ["marriage"]);
      } else if (t < 0.50) {
        setActive(["david"], ["david"]);
      } else if (t < 0.75) {
        setActive(["sarah"], ["sarah"]);
      } else if (t < 0.90) {
        setActive(["you"], ["you"]);
      } else {
        setActive(["henry", "eleanor", "david", "sarah", "you"], ["marriage", "david", "sarah", "you"]);
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
      <div ref={tagHenryRef} className="canvas-tag tag-blue" style={{ left: '50.0%', top: '10.5%' }}>{locale === 'id' ? 'Kakek Henry' : 'Grandpa Henry'}</div>
      <div ref={tagEleanorRef} className="canvas-tag tag-pink" style={{ left: '71.9%', top: '10.5%' }}>{locale === 'id' ? 'Nenek Eleanor' : 'Grandma Eleanor'}</div>
      <div ref={tagDavidRef} className="canvas-tag tag-blue" style={{ left: '33.0%', top: '23.1%' }}>{locale === 'id' ? 'Ayah (David)' : 'David (Father)'}</div>
      <div ref={tagSarahRef} className="canvas-tag tag-pink" style={{ left: '61.0%', top: '30.7%' }}>{locale === 'id' ? 'Tante Sarah' : 'Aunt Sarah'}</div>
      <div ref={tagYouRef} className="canvas-tag tag-blue" style={{ left: '22.0%', top: '39.9%' }}>{locale === 'id' ? 'Anda' : 'You'}</div>
    </div>
  );
}
