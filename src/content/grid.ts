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

/** Who we are / values (Figma 234:12, 234:26) — desktop column spans on 24-col grid */
export const teamLayout = {
  titleSpan: 13,
  indexOffset: 12,
  indexSpan: 1,
  contentSpan: 11,
} as const;
