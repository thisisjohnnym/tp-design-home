export const howWeDoItShapeColors = {
  frame: "#46A2FF",
  explore: "#65C9B7",
  align: "#B491E2",
  test: "#FF777C",
  iterate: "#FBBE18",
  deliver: "#95D6FF",
} as const;

export const howWeDoItIntro = {
  eyebrow: "HOW WE WORK",
  title:
    "We partner across product, engineering, and leadership to shape experiences that are useful, consistent, accessible, and thoughtfully crafted.",
} as const;

/** Percent positions on the 1401×1890 Figma artboard */
export type CanvasRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  rotate?: number;
};

export type HowWeDoItStep = {
  id: string;
  title: string;
  description: string;
  shapeSrc: string;
  shape: CanvasRect;
  titlePos: Pick<CanvasRect, "top" | "left">;
  body: Pick<CanvasRect, "top" | "left" | "width">;
};

export const howWeDoItSteps: HowWeDoItStep[] = [
  {
    id: "frame",
    title: "Frame",
    description:
      "We align on what matters. By understanding your users, business goals, constraints, and what success looks like, we build a shared foundation before the design work begins.",
    shapeSrc: "/how-we-do-it/shapes/frame.svg",
    shape: { top: 16.3, left: 17.7, width: 21.8, height: 12.6 },
    titlePos: { top: 18.84, left: 10.78 },
    body: { top: 23.02, left: 9.78, width: 25.62 },
  },
  {
    id: "explore",
    title: "Explore",
    description:
      "We think in possibilities. Through concepts, user flows, prototypes, and design patterns, we test ideas rapidly—finding the strongest direction before committing to it.",
    shapeSrc: "/how-we-do-it/shapes/explore.svg",
    shape: { top: 23.49, left: 56.75, width: 29.5, height: 17.5 },
    titlePos: { top: 28.89, left: 66 },
    body: { top: 33.07, left: 66.24, width: 25.62 },
  },
  {
    id: "align",
    title: "Align",
    description:
      "We get everyone on the same page. Through collaborative reviews with stakeholders, engineering, product, and design peers, we catch issues early and build momentum toward launch.",
    shapeSrc: "/how-we-do-it/shapes/align.svg",
    shape: { top: 37.5, left: 24.5, width: 27, height: 17 },
    titlePos: { top: 41.96, left: 29.84 },
    body: { top: 46.14, left: 30.05, width: 25.62 },
  },
  {
    id: "test",
    title: "Test",
    description:
      "We validate with real users. Testing reveals what works, what confuses, and what needs refinement—so we ship experiences people actually want to use.",
    shapeSrc: "/how-we-do-it/shapes/test.svg",
    shape: { top: 56.03, left: -8.35, width: 26.3, height: 17.4 },
    titlePos: { top: 56.83, left: 5.5 },
    body: { top: 60.95, left: 5.71, width: 25.62 },
  },
  {
    id: "iterate",
    title: "Iterate",
    description:
      "We improve what we learn. Feedback becomes fuel. We refine interactions, fix friction points, and strengthen the experience until it's ready.",
    shapeSrc: "/how-we-do-it/shapes/iterate.svg",
    shape: { top: 64.23, left: 49.75, width: 18.8, height: 13.5 },
    titlePos: { top: 63.76, left: 42.11 },
    body: { top: 67.94, left: 42.33, width: 25.62 },
  },
  {
    id: "deliver",
    title: "Deliver",
    description:
      "We hand it off with clarity. Complete specs, guidelines, and support ensure your team can build and maintain the experience we designed—together.",
    shapeSrc: "/how-we-do-it/shapes/deliver.svg",
    shape: { top: 83.07, left: 79.09, width: 22, height: 9.6 },
    titlePos: { top: 82.43, left: 66.6 },
    body: { top: 86.61, left: 66.81, width: 27.7 },
  },
];

export type HowWeDoItArrow = CanvasRect & {
  id: string;
  triggerStepId: string;
  src: string;
};

/** Bounds include former head area so shaft SVGs span the full connector path */
export const howWeDoItArrows: HowWeDoItArrow[] = [
  {
    id: "frame-to-explore",
    triggerStepId: "explore",
    src: "/how-we-do-it/arrows/frame-to-explore-shaft.svg",
    top: 16.49,
    left: 35.42,
    width: 19.03,
    height: 12.84,
    rotate: 41.12,
  },
  {
    id: "explore-to-align",
    triggerStepId: "align",
    src: "/how-we-do-it/arrows/explore-to-align-shaft.svg",
    top: 43.07,
    left: 54.2,
    width: 15.5,
    height: 9.78,
    rotate: 65.46,
  },
  {
    id: "align-to-test",
    triggerStepId: "test",
    src: "/how-we-do-it/arrows/align-to-test-shaft.svg",
    top: 46.88,
    left: 9.6,
    width: 14,
    height: 8.28,
    rotate: 99.18,
  },
  {
    id: "test-to-iterate",
    triggerStepId: "iterate",
    src: "/how-we-do-it/arrows/test-to-iterate-shaft.svg",
    top: 69.52,
    left: 17.1,
    width: 18.7,
    height: 4.81,
    rotate: -27.48,
  },
  {
    id: "iterate-to-deliver",
    triggerStepId: "deliver",
    src: "/how-we-do-it/arrows/iterate-to-deliver-shaft.svg",
    top: 67.04,
    left: 65.1,
    width: 19.1,
    height: 13.03,
    rotate: 31.43,
  },
];

export const HOW_WE_DO_IT_CANVAS = { width: 1401, height: 1890 } as const;
