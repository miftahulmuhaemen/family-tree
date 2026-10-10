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

export function StorySlide2({ progress, locale }: StorySlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const badgeQRef = useRef<HTMLDivElement>(null);
  const lblSarahRef = useRef<HTMLDivElement>(null);
  const lblYouRef = useRef<HTMLDivElement>(null);
  const lblMaternalRef = useRef<HTMLDivElement>(null);
  const lblPaternalRef = useRef<HTMLDivElement>(null);
  const poseFnRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const badgeQ = badgeQRef.current;
    const lblSarah = lblSarahRef.current;
    const lblYou = lblYouRef.current;
    const lblMaternal = lblMaternalRef.current;
    const lblPaternal = lblPaternalRef.current;
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

    const pYou = { x: -24, y: 16, z: 0 };
    const pSarah = { x: 26, y: -4, z: 0 };
    const pCenter = { x: 0, y: 4, z: 6 };
    const pMaternal = { x: -20, y: -16, z: 24 };
    const pPaternal = { x: 18, y: -20, z: 24 };

    [pYou, pSarah, pMaternal, pPaternal].forEach((pos) => {
      const [r0, r1] = storyRings(pos.x - 9, pos.y - 9, pos.x + 9, pos.y + 9, 3.8, 0.9);
      const geom = storyPrism(P, front, r0, r1, pos.z, pos.z + 3.2);
      const g = createStorySvgEl("g", {}, gPedestals);
      createStorySvgEl("path", { d: geom.sil, class: "pedestal" }, g);
      createStorySvgEl("path", { d: geom.crease, class: "lo nf" }, g);
    });

    const [q0, q1] = storyRings(pCenter.x - 6, pCenter.y - 6, pCenter.x + 6, pCenter.y + 6, 2.8, 0.7);
    const qGeom = storyPrism(P, front, q0, q1, 0, pCenter.z);
    const gQ = createStorySvgEl("g", {}, gPedestals);
    createStorySvgEl("path", { d: qGeom.sil, class: "pedestal" }, gQ);
    createStorySvgEl("path", { d: qGeom.crease, class: "lo nf" }, gQ);

    const dYouCenter = openPath([P(pYou.x, pYou.y, 4), P(pCenter.x, pCenter.y, pCenter.z)]);
    const dCenterSarah = openPath([P(pCenter.x, pCenter.y, pCenter.z), P(pSarah.x, pSarah.y, 4)]);
    const dMaternal = openPath([P(pCenter.x, pCenter.y, pCenter.z), P(pMaternal.x, pMaternal.y, pMaternal.z)]);
    createStorySvgEl("path", { d: dYouCenter, class: "beam-dashed" }, gBeams);
    createStorySvgEl("path", { d: dCenterSarah, class: "beam-dashed" }, gBeams);
    createStorySvgEl("path", { d: dMaternal, class: "beam-dashed" }, gBeams);

    const beamMaternal = createStorySvgEl("path", {
      d: openPath([P(pYou.x, pYou.y, 4), P(pCenter.x, pCenter.y, pCenter.z), P(pMaternal.x, pMaternal.y, pMaternal.z)]),
      class: "beam-active", opacity: "0"
    }, gBeams);
    const beamActive = createStorySvgEl("path", {
      d: openPath([P(pYou.x, pYou.y, 4), P(pCenter.x, pCenter.y, pCenter.z), P(pPaternal.x, pPaternal.y, pPaternal.z), P(pSarah.x, pSarah.y, 4)]),
      class: "beam-active"
    }, gBeams);

    const pulseDot = createStorySvgEl("circle", { r: 3.0, fill: "#ffffff", class: "hi" }, gBeams);
    pulseDot.setAttribute("filter", "drop-shadow(0 0 6px #60a5fa)");

    function createAvatar(parent: SVGGElement, pos: { x: number; y: number; z: number }, type: string) {
      const g = createStorySvgEl("g", {}, parent);
      const x = pos.x, y = pos.y, z0 = pos.z + 3.2;
      const body = createStorySolid(g), armL = createStorySolid(g), armR = createStorySolid(g);
      const handL = createStorySolid(g), handR = createStorySolid(g), neck = createStorySolid(g);
      const head = createStorySvgEl("path", { class: "sil" }, g);
      const hair = createStorySvgEl("path", { class: "sil" }, g);
      const hairCr = createStorySvgEl("path", { class: "lo nf" }, g);
      const eyeL = createStorySvgEl("circle", { r: 1.1, class: "dot" }, g);
      const eyeR = createStorySvgEl("circle", { r: 1.1, class: "dot" }, g);
      const smile = createStorySvgEl("path", { class: "lo nf" }, g);

      const [tr, ti] = storyRings(x - 4.2, y - 3.8, x + 4.2, y + 3.8, 2.5, 0.7);
      putStorySolid(body, storyPrism(P, front, tr, ti, z0, z0 + 10));
      const shL: [number, number, number] = [x - 3.8, y + 2.2, z0 + 8.5], hL: [number, number, number] = [x - 5.0, y + 3.0, z0 + 2.0];
      const shR: [number, number, number] = [x + 3.8, y - 2.2, z0 + 8.5], hR: [number, number, number] = [x + 5.0, y - 3.0, z0 + 2.0];
      putStorySolid(armL, storyArmSolid(P, shL, 2.0, hL, 1.4));
      putStorySolid(armR, storyArmSolid(P, shR, 2.0, hR, 1.4));
      const [hlr, hli] = storyRings(hL[0] - 1.2, hL[1] - 1.2, hL[0] + 1.2, hL[1] + 1.2, 0.8, 0.3);
      const [hrr, hri] = storyRings(hR[0] - 1.2, hR[1] - 1.2, hR[0] + 1.2, hR[1] + 1.2, 0.8, 0.3);
      putStorySolid(handL, storyPrism(P, front, hlr, hli, z0 + 0.8, z0 + 2.5));
      putStorySolid(handR, storyPrism(P, front, hrr, hri, z0 + 0.8, z0 + 2.5));

      const [nr, ni] = storyRings(x - 1.8, y - 1.8, x + 1.8, y + 1.8, 1.2, 0.4);
      putStorySolid(neck, storyPrism(P, front, nr, ni, z0 + 10, z0 + 11.5));

      const pH = P(x, y, z0 + 15.5);
      const hx = r2(pH[0]), hy = r2(pH[1]), s = 0.65;
      head.setAttribute("d", `M ${r2(hx - 11.5 * s)},${r2(hy - 6 * s)} C ${r2(hx - 11.5 * s)},${r2(hy - 13 * s)} ${r2(hx - 7 * s)},${r2(hy - 15 * s)} ${hx},${r2(hy - 15 * s)} C ${r2(hx + 7 * s)},${r2(hy - 15 * s)} ${r2(hx + 11.5 * s)},${r2(hy - 13 * s)} ${r2(hx + 11.5 * s)},${r2(hy - 6 * s)} L ${r2(hx + 11.5 * s)},${r2(hy + 6 * s)} C ${r2(hx + 11.5 * s)},${r2(hy + 13 * s)} ${r2(hx + 7 * s)},${r2(hy + 15 * s)} ${hx},${r2(hy + 15 * s)} C ${r2(hx - 7 * s)},${r2(hy + 15 * s)} ${r2(hx - 11.5 * s)},${r2(hy + 13 * s)} ${r2(hx - 11.5 * s)},${r2(hy + 6 * s)} Z`);
      eyeL.setAttribute("cx", String(r2(hx - 4.2 * s)));
      eyeL.setAttribute("cy", String(r2(hy + 2.5 * s)));
      eyeR.setAttribute("cx", String(r2(hx + 4.2 * s)));
      eyeR.setAttribute("cy", String(r2(hy + 2.5 * s)));
      smile.setAttribute("d", `M${r2(hx - 3.2 * s)},${r2(hy + 7 * s)} Q${hx},${r2(hy + 10.5 * s)} ${r2(hx + 3.2 * s)},${r2(hy + 7 * s)}`);

      if (type === "sarah") {
        hair.setAttribute("d", `M ${hx},${r2(hy - 18 * s)} C ${r2(hx + 10 * s)},${r2(hy - 18 * s)} ${r2(hx + 17 * s)},${r2(hy - 13 * s)} ${r2(hx + 19 * s)},${r2(hy - 7 * s)} C ${r2(hx + 24 * s)},${r2(hy + 3 * s)} ${r2(hx + 20 * s)},${r2(hy + 15 * s)} ${r2(hx + 16 * s)},${r2(hy + 24 * s)} C ${r2(hx + 11 * s)},${r2(hy + 20 * s)} ${r2(hx + 12 * s)},${r2(hy + 8 * s)} ${r2(hx + 10 * s)},${r2(hy + 1 * s)} C ${r2(hx + 8 * s)},${r2(hy - 2 * s)} ${r2(hx + 4 * s)},${r2(hy - 2 * s)} ${r2(hx + 1.5 * s)},${r2(hy + 0.5 * s)} C ${r2(hx - 1.5 * s)},${r2(hy + 0.5 * s)} ${r2(hx - 4 * s)},${r2(hy - 2 * s)} ${r2(hx - 8 * s)},${r2(hy - 2 * s)} C ${r2(hx - 10 * s)},${r2(hy + 1 * s)} ${r2(hx - 12 * s)},${r2(hy + 8 * s)} ${r2(hx - 11 * s)},${r2(hy + 20 * s)} C ${r2(hx - 16 * s)},${r2(hy + 24 * s)} ${r2(hx - 20 * s)},${r2(hy + 15 * s)} ${r2(hx - 24 * s)},${r2(hy + 3 * s)} C ${r2(hx - 19 * s)},${r2(hy - 7 * s)} ${r2(hx - 17 * s)},${r2(hy - 13 * s)} ${r2(hx - 10 * s)},${r2(hy - 18 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 2 * s)},${r2(hy - 16 * s)} Q${hx},${r2(hy - 8 * s)} ${r2(hx - 2 * s)},${r2(hy)}`);
      } else {
        hair.setAttribute("d", `M ${hx},${r2(hy - 17 * s)} C ${r2(hx + 8 * s)},${r2(hy - 17 * s)} ${r2(hx + 14 * s)},${r2(hy - 12 * s)} ${r2(hx + 14 * s)},${r2(hy - 4 * s)} C ${r2(hx + 14 * s)},${r2(hy + 2 * s)} ${r2(hx + 12 * s)},${r2(hy + 7 * s)} ${r2(hx + 10.5 * s)},${r2(hy + 8.5 * s)} C ${r2(hx + 9 * s)},${r2(hy + 6 * s)} ${r2(hx + 10.5 * s)},${r2(hy + 2 * s)} ${r2(hx + 9.5 * s)},${r2(hy - 1 * s)} C ${r2(hx + 7 * s)},${r2(hy - 2.5 * s)} ${r2(hx + 4 * s)},${r2(hy - 2.5 * s)} ${r2(hx + 1.5 * s)},${r2(hy - 0.5 * s)} C ${r2(hx - 1 * s)},${r2(hy + 1.5 * s)} ${r2(hx - 3 * s)},${r2(hy - 0.5 * s)} ${r2(hx - 5.5 * s)},${r2(hy - 1.2 * s)} C ${r2(hx - 8 * s)},${r2(hy - 1.2 * s)} ${r2(hx - 9.5 * s)},${r2(hy + 1.5 * s)} ${r2(hx - 10.5 * s)},${r2(hy + 8 * s)} C ${r2(hx - 12.5 * s)},${r2(hy + 6.5 * s)} ${r2(hx - 14 * s)},${r2(hy + 2 * s)} ${r2(hx - 14 * s)},${r2(hy - 4 * s)} C ${r2(hx - 14 * s)},${r2(hy - 12 * s)} ${r2(hx - 8 * s)},${r2(hy - 17 * s)} ${hx},${r2(hy - 17 * s)} Z`);
        hairCr.setAttribute("d", `M${r2(hx - 3 * s)},${r2(hy - 16 * s)} Q${r2(hx - 1.5 * s)},${r2(hy - 8 * s)} ${r2(hx - 3 * s)},${r2(hy - 0.5 * s)}`);
      }
      return { hx, hy };
    }

    const avYou = createAvatar(gChars, pYou, "you");
    const avSarah = createAvatar(gChars, pSarah, "sarah");

    if (lblYou) {
      lblYou.style.left = ((avYou.hx / 400) * 100) + "%";
      lblYou.style.top = (((avYou.hy - 24) / 290) * 100) + "%";
    }
    if (lblSarah) {
      lblSarah.style.left = ((avSarah.hx / 400) * 100) + "%";
      lblSarah.style.top = (((avSarah.hy - 24) / 290) * 100) + "%";
    }

    const pCenterScreen = P(pCenter.x, pCenter.y, pCenter.z + 1.5);
    if (badgeQ) {
      badgeQ.style.left = ((pCenterScreen[0] / 400) * 100) + "%";
      badgeQ.style.top = ((pCenterScreen[1] / 290) * 100) + "%";
    }

    const pMatScreen = P(pMaternal.x, pMaternal.y, pMaternal.z + 4);
    if (lblMaternal) {
      lblMaternal.style.left = ((pMatScreen[0] / 400) * 100) + "%";
      lblMaternal.style.top = (((pMatScreen[1] - 14) / 290) * 100) + "%";
    }

    const pPatScreen = P(pPaternal.x, pPaternal.y, pPaternal.z + 4);
    if (lblPaternal) {
      lblPaternal.style.left = ((pPatScreen[0] / 400) * 100) + "%";
      lblPaternal.style.top = (((pPatScreen[1] - 14) / 290) * 100) + "%";
    }

    const waypointsM = [P(pYou.x, pYou.y, 4), P(pCenter.x, pCenter.y, pCenter.z), P(pMaternal.x, pMaternal.y, pMaternal.z)];
    const waypointsP = [P(pYou.x, pYou.y, 4), P(pCenter.x, pCenter.y, pCenter.z), P(pPaternal.x, pPaternal.y, pPaternal.z), P(pSarah.x, pSarah.y, 4)];

    poseFnRef.current = (t: number) => {
      if (t < 0.35) {
        if (badgeQ) {
          badgeQ.textContent = "?";
          badgeQ.classList.remove("unlocked");
        }
        beamMaternal.style.opacity = "0.2";
        beamActive.style.opacity = "0.2";
        if (lblSarah) {
          lblSarah.style.borderColor = "rgba(255, 255, 255, 0.15)";
          lblSarah.style.boxShadow = "none";
        }
        if (lblMaternal) {
          lblMaternal.style.borderColor = "rgba(255, 255, 255, 0.15)";
          lblMaternal.style.boxShadow = "none";
        }
        if (lblPaternal) {
          lblPaternal.style.borderColor = "rgba(255, 255, 255, 0.15)";
          lblPaternal.style.boxShadow = "none";
        }
        const lt = t / 0.35;
        const px = waypointsM[0][0] + (waypointsM[1][0] - waypointsM[0][0]) * lt;
        const py = waypointsM[0][1] + (waypointsM[1][1] - waypointsM[0][1]) * lt;
        pulseDot.setAttribute("cx", String(r2(px)));
        pulseDot.setAttribute("cy", String(r2(py)));
      } else if (t < 0.65) {
        if (badgeQ) {
          badgeQ.textContent = "?";
          badgeQ.classList.remove("unlocked");
        }
        beamMaternal.style.opacity = "0.9";
        beamActive.style.opacity = "0.15";
        if (lblSarah) {
          lblSarah.style.borderColor = "rgba(255, 255, 255, 0.15)";
          lblSarah.style.boxShadow = "none";
        }
        if (lblMaternal) {
          lblMaternal.style.borderColor = "rgba(244, 63, 94, 0.8)";
          lblMaternal.style.boxShadow = "0 0 10px rgba(244, 63, 94, 0.3)";
        }
        if (lblPaternal) {
          lblPaternal.style.borderColor = "rgba(255, 255, 255, 0.15)";
          lblPaternal.style.boxShadow = "none";
        }
        const lt = (t - 0.35) / 0.30;
        const px = waypointsM[1][0] + (waypointsM[2][0] - waypointsM[1][0]) * lt;
        const py = waypointsM[1][1] + (waypointsM[2][1] - waypointsM[1][1]) * lt;
        pulseDot.setAttribute("cx", String(r2(px)));
        pulseDot.setAttribute("cy", String(r2(py)));
      } else {
        if (badgeQ) {
          badgeQ.textContent = "✓";
          badgeQ.classList.add("unlocked");
        }
        beamMaternal.style.opacity = "0.1";
        beamActive.style.opacity = "1";
        if (lblMaternal) {
          lblMaternal.style.borderColor = "rgba(255, 255, 255, 0.15)";
          lblMaternal.style.boxShadow = "none";
        }
        if (lblPaternal) {
          lblPaternal.style.borderColor = "#3b82f6";
          lblPaternal.style.boxShadow = "0 0 12px rgba(59, 130, 246, 0.5)";
        }
        if (lblSarah) {
          lblSarah.style.borderColor = "#3b82f6";
          lblSarah.style.boxShadow = "0 0 12px rgba(59, 130, 246, 0.5)";
        }
        const segT = (t - 0.65) / 0.35;
        let pA = waypointsP[0], pB = waypointsP[1], localT = 0;
        if (segT < 0.33) { pA = waypointsP[0]; pB = waypointsP[1]; localT = segT / 0.33; }
        else if (segT < 0.66) { pA = waypointsP[1]; pB = waypointsP[2]; localT = (segT - 0.33) / 0.33; }
        else { pA = waypointsP[2]; pB = waypointsP[3]; localT = (segT - 0.66) / 0.34; }
        const px = pA[0] + (pB[0] - pA[0]) * localT;
        const py = pA[1] + (pB[1] - pA[1]) * localT;
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
      <div ref={badgeQRef} className="question-badge" style={{ left: '47.6%', top: '59.5%' }}>?</div>
      <div ref={lblMaternalRef} className="char-label" style={{ left: '47.6%', top: '16.8%' }}>{locale === 'id' ? 'Jalur Ibu' : 'Maternal Line'}</div>
      <div ref={lblPaternalRef} className="char-label" style={{ left: '73.1%', top: '31.1%' }}>{locale === 'id' ? 'Jalur Ayah' : 'Paternal Line'}</div>
      <div ref={lblYouRef} className="char-label tag-blue" style={{ left: '25.7%', top: '37.4%' }}>{locale === 'id' ? 'Anda' : 'You'}</div>
      <div ref={lblSarahRef} className="char-label tag-pink" style={{ left: '68.2%', top: '50.0%' }}>{locale === 'id' ? 'Tante Sarah' : 'Aunt Sarah'}</div>
    </div>
  );
}
