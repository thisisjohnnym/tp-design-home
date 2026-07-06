/**
 * Figma multiplayer cursor-chat labels for the v5 hero — mirrors the base
 * Figma frame (node 900:849). Positions are stored as percentages of the
 * reference frame (1401 x 724) so the scatter scales with the viewport.
 * `enter` is the px offset each cursor animates from when flying into frame.
 */

export type HeroV5CursorSide = "left" | "right";

export type HeroV5Cursor = {
  id: string;
  name: string;
  /** Pill fill colour. */
  fill: string;
  /** Pill border colour. */
  border: string;
  /** Pill drop-shadow colour (rgba). */
  shadow: string;
  /** Label text colour. */
  text: "white" | "black";
  /** Which side of the pill the cursor arrow sits on. */
  side: HeroV5CursorSide;
  /** Final position as % of the reference frame. */
  x: number;
  y: number;
  /** Entry offset (px) the cursor flies in from. */
  enter: { x: number; y: number };
  /** Stagger order for the fly-in. */
  order: number;
};

export const HERO_V5_CURSORS: HeroV5Cursor[] = [
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
    y: 67.0,
    enter: { x: -40, y: 190 },
    order: 7,
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
  },
];
