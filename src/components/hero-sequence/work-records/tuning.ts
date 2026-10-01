/**
 * Work record browser — numbers from Paper 9DZ-0 / 9L3-0 / 9UQ-0 / 9RA-0
 * (1512 × 982). Lengths are a percentage of the screen height, widths and
 * offsets a fraction of the screen width, so the composition scales.
 */

export type RecordsLayout = "desktop" | "tablet" | "phone";

export type RecordsConfig = {
  /** Distance between neighbouring slabs (Paper: 144px of 982). */
  spacing: number;
  /** Slab length, outer edge to inner edge. */
  length: number;
  /** Slab width (Paper: 1018px of 1512). */
  width: number;
  /** Shows as the band along a slab's outer edge when it is edge-on. */
  thickness: number;
  /** How quickly slabs open up towards the screen away from the centre. */
  open: number;
  /** How dark the inner edge falls: 0 not at all, 1 to black. */
  shade: number;
  /** Camera distance in px at a 900px-tall viewport; lower exaggerates the taper. */
  perspective: number;
  /** Width of an opened slab (Paper: 966px of 1512). */
  panelSize: number;
  /** Shift of the stack from centre, as a fraction of the width. The stack
      runs off the left edge (Paper 9L3-0: −320px of 1512). */
  offsetX: number;
  /** Shift of an opened slab's panel from centre (Paper 9RA-0: −243px of 1512). */
  panelOffsetX: number;
  /** How far the neighbours slide left while a slab is open (Paper 9RA-0: −10px of 1512). */
  openShiftX: number;
  /** Print title and tags on the spine (phone, where the side labels are dropped). */
  spineText: boolean;
};

export const recordsLayouts: Record<RecordsLayout, RecordsConfig> = {
  desktop: {
    spacing: 18,
    length: 21.2,
    width: 1080 / 1512,
    thickness: 0.7,
    open: 0.26,
    shade: 1,
    perspective: 825,
    panelSize: 966 / 1512,
    offsetX: -320 / 1512,
    panelOffsetX: -243 / 1512,
    openShiftX: -10 / 1512,
    spineText: false,
  },
  tablet: {
    spacing: 18,
    length: 21.2,
    width: 1080 / 1512,
    thickness: 0.7,
    open: 0.26,
    shade: 1,
    perspective: 825,
    panelSize: 0.56,
    offsetX: -320 / 1512,
    panelOffsetX: -0.15,
    openShiftX: -10 / 1512,
    spineText: false,
  },
  phone: {
    spacing: 15,
    length: 22,
    width: 0.88,
    thickness: 3.4,
    open: 0.26,
    shade: 1,
    perspective: 825,
    panelSize: 0.92,
    offsetX: 0,
    panelOffsetX: 0,
    openShiftX: 0,
    spineText: true,
  },
};

export const recordsQueries = {
  phone: "(max-width: 699px)",
  tablet: "(max-width: 1279px)",
} as const;

export const recordsMotion = {
  /** While the section scrolls into view the fan unfurls: it starts this many
      slabs further down, squeezed to `introSqueeze` of its spacing. */
  introTravel: 2.2,
  introSqueeze: 0.25,
  /** Screens of scroll the pinned section is held for. */
  pinScreens: 2,
  /** Arrival pose (Paper 9L3-0): the stack hangs above a centre line that
      sits this many slabs below the middle of the screen, so the slabs
      shorten towards the bottom edge. Scrolling lifts the line to the middle
      over the first `liftShare` of the pin. */
  arrivalDrop: 3,
  liftShare: 0.7,
  /** Damping rates (per second) for the wheel and for slabs opening. */
  scrollDamp: 9,
  openDamp: 7,
  /** Slabs further than this many steps from the centre line fade out. */
  fadeFrom: 5,
  fadeOver: 0.7,
  /** An opened slab is 966 × 537 in Paper. */
  cardAspect: 966 / 537,
  maxOpenHeight: 0.74,
  /** Gap left between an opened slab and its neighbours, in scene units. */
  openClearance: 0.046,
};

/** The slab that rests on the centre line on arrival: the last two slabs are
    the one on the line and the one below it, as in Paper 9L3-0. */
export const arrivalIndex = (count: number) => Math.max(0, Math.min(count - 2, 4));
