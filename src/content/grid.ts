/** Layout grid tokens — keep in sync with design system / Figma */
export const grid = {
  desktop: {
    columns: 24,
    margin: "20px",
    gutter: "8px",
  },
  mobile: {
    columns: 12,
    margin: "12px",
    gutter: "4px",
  },
} as const;

/** Breakpoint where desktop grid applies (matches Tailwind `md`) */
export const GRID_DESKTOP_MIN_WIDTH = "768px";

/** Minimum vertical space between major page sections */
export const SECTION_GAP = "120px";

/** Hero headline — left-aligned editorial spread on 24-col grid */
export const heroLayout = {
  headlineSpan: 15,
  headlineOffset: 1,
} as const;

/** Hero v3 banner (Figma 233:21) — desktop column spans on 24-col grid */
export const heroV3Layout = {
  headlineSpan: 13,
  bodySpan: 11,
  /** Right-rail top offset — body at top 561px, row ~166px on 1024 artboard (~38.5vh) */
  bodyOffset: "clamp(8rem,38.5vh,24.6875rem)",
} as const;

/** Who we are / values — editorial margin-note layout on 24-col grid */
export const teamLayout = {
  titleSpan: 13,
  indexSpan: 2,
  contentSpan: 10,
  contentOffset: 0,
} as const;

/** How we do it — zigzag step placement on 24-col grid (mobile stacks full width) */
export const howWeDoItLayout = {
  steps: [
    { colStart: 3, colSpan: 10 },
    { colStart: 15, colSpan: 9 },
    { colStart: 8, colSpan: 10 },
    { colStart: 2, colSpan: 10 },
    { colStart: 11, colSpan: 10 },
    { colStart: 17, colSpan: 8 },
  ],
} as const;
