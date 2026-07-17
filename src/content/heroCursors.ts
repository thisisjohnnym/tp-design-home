export type HeroCursorConfig = {
  name: string;
  color: string;
  cursorIcon: string;
  position: { xPercent: number; yPercent: number };
};

/** Figma 732:5 — team member cursor positions and colors */
export const heroCursors: HeroCursorConfig[] = [
  {
    name: "Kat Guzman",
    color: "#a342ff",
    cursorIcon: "/hero/cursors/cursor-1.svg",
    position: { xPercent: 25, yPercent: 22 },
  },
  {
    name: "Mitra Raveendran",
    color: "#262673",
    cursorIcon: "/hero/cursors/cursor-4.svg",
    position: { xPercent: 82, yPercent: 22 },
  },
  {
    name: "Jonathan Martinez",
    color: "#f9434b",
    cursorIcon: "/hero/cursors/cursor-7.svg",
    position: { xPercent: 57, yPercent: 26 },
  },
  {
    name: "Gulsheen Bhatia",
    color: "#f9be1a",
    cursorIcon: "/hero/cursors/cursor-6.svg",
    position: { xPercent: 23, yPercent: 65 },
  },
  {
    name: "Juliana Botero",
    color: "#f943cf",
    cursorIcon: "/hero/cursors/cursor-3.svg",
    position: { xPercent: 9, yPercent: 77 },
  },
  {
    name: "Cong Kim",
    color: "#0c7736",
    cursorIcon: "/hero/cursors/cursor-5.svg",
    position: { xPercent: 36, yPercent: 81 },
  },
  {
    name: "Sean Kelly",
    color: "#a342ff",
    cursorIcon: "/hero/cursors/cursor-1.svg",
    position: { xPercent: 50, yPercent: 72 },
  },
  {
    name: "Wendy Chan",
    color: "#028eca",
    cursorIcon: "/hero/cursors/cursor-2.svg",
    position: { xPercent: 51, yPercent: 89 },
  },
];
