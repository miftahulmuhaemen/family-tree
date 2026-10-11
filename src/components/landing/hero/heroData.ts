// Genealogy Data & Person Models for Hero Crowd Stand

import type { SpringVal } from './heroGeometry';

export const NAMES =
  "Charles Bennett,Victoria Sterling,Julian Bennett,Clara Bennett,Oliver Bennett,William Sterling,Margaret Hayes,George Pendleton,Harold Finch,Edward Pendleton,Susan Clarke,Lucas Pendleton,Charlotte Pendleton,Hannah Pendleton,Grace Pendleton,Robert Sterling,David Sterling,Henry Sterling,Elizabeth Thorne,Catherine Sterling,Richard Cole,Benjamin Morris,Daniel Morris,Alicia Vance,Rebecca Stone,Sophia Morris,Liam Brooks,Ethan Morris,Emma Morris,Evelyn Pendleton,James Harrison,Alexander Harrison,Laura Mitchell,Mia Harrison,Noah Harrison,Marcus Harrison".split(",");

export const PARS: Record<string, number[]> = {
  "1": [5, 6], "2": [0, 1], "3": [0, 1], "4": [0, 1], "9": [7], "11": [9, 10],
  "12": [9, 10], "13": [9, 10], "14": [9, 10], "15": [5], "16": [5], "17": [5, 18],
  "19": [5], "22": [21, 19], "25": [21, 19], "27": [22], "28": [22], "29": [7],
  "31": [30, 29], "33": [31], "34": [31, 32], "35": [30, 29],
};

export const SPS: Record<string, number[]> = {
  "0": [1], "1": [0], "5": [6, 18], "6": [5, 7, 8], "7": [6], "8": [6],
  "9": [10], "10": [9], "18": [5], "19": [20, 21], "20": [19], "21": [19],
  "22": [23, 24], "23": [22], "24": [22], "25": [26], "26": [25],
  "29": [30], "30": [29], "31": [32], "32": [31],
};

export const SEX = "101011011101000111001110001100110011";

export function getRel(a: number, b: number): string {
  if (a === b) return "Self";
  const m = SEX[b] === "1";
  if (SPS[a]?.includes(b)) return m ? "Husband" : "Wife";
  if (PARS[b]?.includes(a)) return m ? "Son" : "Daughter";
  if (PARS[a]?.includes(b)) return m ? "Father" : "Mother";
  const pA = PARS[a] || [];
  const pB = PARS[b] || [];
  if (pA.some((p) => pB.includes(p))) return m ? "Brother" : "Sister";
  for (const p of pA) {
    if (PARS[p]?.includes(b)) return m ? "Grandfather" : "Grandmother";
  }
  for (const p of pB) {
    if (PARS[p]?.includes(a)) return m ? "Grandson" : "Granddaughter";
  }
  return "Relative";
}

export interface SolidEl {
  g: SVGGElement;
  sil: SVGPathElement;
  cr: SVGPathElement;
}

export interface PersonNode {
  idx: number;
  i: number;
  j: number;
  isFemale: boolean;
  name: string;
  cx: number;
  cy: number;
  pG: SVGGElement;
  elTorso: SolidEl;
  elArmL: SolidEl;
  elArmR: SolidEl;
  elLegL: SolidEl;
  elLegR: SolidEl;
  elNeck: SolidEl;
  elHairBack: SVGPathElement | null;
  elHeadCircle: SVGCircleElement;
  elChin: SVGPathElement;
  elHairFront: SVGPathElement | null;
  sp: SpringVal;
  spDrop: SpringVal;
  headPos: [number, number];
  visible: boolean;
}
