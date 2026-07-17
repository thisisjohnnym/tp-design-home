import type { CSSProperties } from "react";

export type HeroV5Phase = "bloom" | "cursors" | "settled";

export type HeroV5CursorSide = "left" | "right";
export type HeroV5CursorText = "white" | "black";

export type HeroV5CursorDriftPoint = { x: number; y: number };

export type HeroV5CursorDrift = {
  points: HeroV5CursorDriftPoint[];
  durationSec: number;
};

export type HeroV5CursorConfig = {
  id: string;
  name: string;
  fill: string;
  border: string;
  shadow: string;
  text: HeroV5CursorText;
  side: HeroV5CursorSide;
  x: number;
  y: number;
  enter: { x: number; y: number };
  order: number;
  drift: HeroV5CursorDrift;
};

export const HERO_V5_WORDS = ["Craft", "Design", "Build", "Strategize"] as const;

export const heroV5Copy = {
  suffix: "Experiences",
  line2: "That Shape Retail",
  subhead: "Uniting brand, product, and customer insight across Coach & Kate Spade.",
} as const;

export const heroV5Motion = {
  bloomDurationMs: 1100,
  bloomDelayMs: 80,
  textStartMs: 885,
  phases: [
    { at: 0, phase: "bloom" as const },
    { at: 885, phase: "cursors" as const },
    { at: 2085, phase: "settled" as const },
  ],
  wordRotateIntervalMs: 1500,
  wordRotateInitialDelayMs: 750,
  cursorEnterDurationMs: 650,
  cursorEnterStaggerMs: 70,
  cursorDriftStartOffsetMs: 200,
} as const;

const SPREAD_CENTER = { x: 50, y: 50 };
const SPREAD_FACTOR = 1.3;

const POSITION_OVERRIDES: Partial<Record<string, { x: number; y: number }>> = {
  mitra: { x: 7, y: -7 },
  gulsheen: { x: 5, y: 8 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function spreadPosition(x: number, y: number) {
  return {
    x: clamp(SPREAD_CENTER.x + (x - SPREAD_CENTER.x) * SPREAD_FACTOR, 4, 94),
    y: clamp(SPREAD_CENTER.y + (y - SPREAD_CENTER.y) * SPREAD_FACTOR, 8, 90),
  };
}

const BASE_CURSORS: HeroV5CursorConfig[] = [
  {
    id: "kat",
    name: "Kat Guzman",
    fill: "#14AE5C",
    border: "#108B4A",
    shadow: "rgba(20,174,92,0.25)",
    text: "white",
    side: "right",
    x: 15.8,
    y: 21.6,
    enter: { x: -180, y: -130 },
    order: 0,
    drift: {
      points: [
        { x: 0, y: 0 },
        { x: 14, y: -8 },
        { x: -6, y: 12 },
        { x: 18, y: 4 },
        { x: 0, y: 0 },
      ],
      durationSec: 8.5,
    },
  },
  {
    id: "johnny",
    name: "Johnny Martinez",
    fill: "#9747FF",
    border: "#7939CC",
    shadow: "rgba(151,71,255,0.25)",
    text: "white",
    side: "left",
    x: 47.4,
    y: 21.6,
    enter: { x: 0, y: -170 },
    order: 2,
    drift: {
      points: [
        { x: 0, y: 0 },
        { x: -10, y: 14 },
        { x: 12, y: -6 },
        { x: -4, y: -12 },
        { x: 0, y: 0 },
      ],
      durationSec: 10.2,
    },
  },
  {
    id: "mitra",
    name: "Mitra Raveendran",
    fill: "#0D99FF",
    border: "#0A7ACC",
    shadow: "rgba(13,153,255,0.25)",
    text: "white",
    side: "left",
    x: 73.2,
    y: 29.8,
    enter: { x: 190, y: -120 },
    order: 4,
    drift: {
      points: [
        { x: 0, y: 0 },
        { x: -16, y: 10 },
        { x: 8, y: 18 },
        { x: -12, y: -4 },
        { x: 0, y: 0 },
      ],
      durationSec: 9.8,
    },
  },
  {
    id: "wendy",
    name: "Wendy Chan",
    fill: "#F24822",
    border: "#C23A1B",
    shadow: "rgba(242,72,34,0.25)",
    text: "white",
    side: "left",
    x: 77.8,
    y: 64.9,
    enter: { x: 210, y: 60 },
    order: 6,
    drift: {
      points: [
        { x: 0, y: 0 },
        { x: -14, y: -10 },
        { x: 10, y: -16 },
        { x: -6, y: 8 },
        { x: 0, y: 0 },
      ],
      durationSec: 11.5,
    },
  },
  {
    id: "sean",
    name: "Sean Kelly",
    fill: "#FFA629",
    border: "#CC8521",
    shadow: "rgba(255,166,41,0.25)",
    text: "black",
    side: "left",
    x: 62.9,
    y: 82.9,
    enter: { x: 70, y: 190 },
    order: 5,
    drift: {
      points: [
        { x: 0, y: 0 },
        { x: 12, y: -14 },
        { x: -8, y: -6 },
        { x: 16, y: -10 },
        { x: 0, y: 0 },
      ],
      durationSec: 7.8,
    },
  },
  {
    id: "cong",
    name: "Cong Kim",
    fill: "#FFCD29",
    border: "#CCA421",
    shadow: "rgba(255,205,41,0.25)",
    text: "black",
    side: "right",
    x: 26.3,
    y: 81.5,
    enter: { x: -120, y: 190 },
    order: 3,
    drift: {
      points: [
        { x: 0, y: 0 },
        { x: -12, y: -8 },
        { x: 6, y: -14 },
        { x: -18, y: 6 },
        { x: 0, y: 0 },
      ],
      durationSec: 9.2,
    },
  },
  {
    id: "gulsheen",
    name: "Gulsheen Bhatia",
    fill: "#0D99FF",
    border: "#0A7ACC",
    shadow: "rgba(13,153,255,0.25)",
    text: "white",
    side: "right",
    x: 40.7,
    y: 67,
    enter: { x: -40, y: 190 },
    order: 7,
    drift: {
      points: [
        { x: 0, y: 0 },
        { x: 10, y: -12 },
        { x: -14, y: -4 },
        { x: 8, y: 10 },
        { x: 0, y: 0 },
      ],
      durationSec: 10.8,
    },
  },
  {
    id: "juliana",
    name: "Juliana Botero",
    fill: "#9747FF",
    border: "#7939CC",
    shadow: "rgba(151,71,255,0.25)",
    text: "white",
    side: "right",
    x: 10.9,
    y: 68.9,
    enter: { x: -210, y: 130 },
    order: 1,
    drift: {
      points: [
        { x: 0, y: 0 },
        { x: 16, y: -12 },
        { x: -8, y: 8 },
        { x: 12, y: 14 },
        { x: 0, y: 0 },
      ],
      durationSec: 8.9,
    },
  },
];

export function heroV5CursorDriftDelaySec(order: number) {
  const {
    cursorEnterDurationMs,
    cursorEnterStaggerMs,
    cursorDriftStartOffsetMs,
  } = heroV5Motion;

  return (
    (order * cursorEnterStaggerMs + cursorEnterDurationMs + cursorDriftStartOffsetMs) / 1000
  );
}

export function heroV5CursorDriftTimes(pointCount: number) {
  if (pointCount <= 1) return [0];
  return Array.from({ length: pointCount }, (_, index) => index / (pointCount - 1));
}

export const heroV5Cursors: HeroV5CursorConfig[] = BASE_CURSORS.map((cursor) => {
  const spread = spreadPosition(cursor.x, cursor.y);
  const offset = POSITION_OVERRIDES[cursor.id] ?? { x: 0, y: 0 };

  return {
    ...cursor,
    x: Number(clamp(spread.x + offset.x, 4, 94).toFixed(1)),
    y: Number(clamp(spread.y + offset.y, 8, 90).toFixed(1)),
  };
});

export const heroV5CssVars = {
  "--hero-v5-bloom-duration": `${heroV5Motion.bloomDurationMs}ms`,
  "--hero-v5-bloom-delay": `${heroV5Motion.bloomDelayMs}ms`,
  "--hero-v5-text-start": `${heroV5Motion.textStartMs}ms`,
} as CSSProperties;
