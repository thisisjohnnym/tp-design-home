/** Color palettes inspired by https://www.michelegre.co (Indie print paper) */
export type ThemeMode = "light" | "dark";

export type ColorPalette = {
  id: string;
  name: string;
  swatch: string;
  light: ThemeTokens;
  dark: ThemeTokens;
};

export type ThemeTokens = {
  background: string;
  foreground: string;
  foregroundSecondary: string;
  foregroundMuted: string;
  rule: string;
  accent: string;
  controlInactive: string;
};

export const colorPalettes: ColorPalette[] = [
  {
    id: "studio",
    name: "Studio",
    swatch: "#f0f0f0",
    light: {
      background: "#f0f0f0",
      foreground: "#000000",
      foregroundSecondary: "#1a1a1a",
      foregroundMuted: "#5c5c5c",
      rule: "rgba(0, 0, 0, 0.12)",
      accent: "#ffcb00",
      controlInactive: "#a3a3a3",
    },
    dark: {
      background: "#000000",
      foreground: "#f0f0f0",
      foregroundSecondary: "#e0e0e0",
      foregroundMuted: "#9a9a9a",
      rule: "rgba(240, 240, 240, 0.14)",
      accent: "#ffcb00",
      controlInactive: "#4a4a4a",
    },
  },
  {
    id: "sage",
    name: "Sage",
    swatch: "#EAF2E7",
    light: {
      background: "#EAF2E7",
      foreground: "#5C0036",
      foregroundSecondary: "#4a2a45",
      foregroundMuted: "#8a6a82",
      rule: "rgba(92, 0, 54, 0.22)",
      accent: "#5C0036",
      controlInactive: "#b8a0b0",
    },
    dark: {
      background: "#2a1830",
      foreground: "#EAF2E7",
      foregroundSecondary: "#d4e8d0",
      foregroundMuted: "#9ab896",
      rule: "rgba(234, 242, 231, 0.2)",
      accent: "#EAF2E7",
      controlInactive: "#6a5a68",
    },
  },
  {
    id: "plum",
    name: "Plum",
    swatch: "#5C0036",
    light: {
      background: "#F4EDF1",
      foreground: "#5C0036",
      foregroundSecondary: "#3d0024",
      foregroundMuted: "#7a4a68",
      rule: "rgba(92, 0, 54, 0.18)",
      accent: "#5C0036",
      controlInactive: "#c4a8b8",
    },
    dark: {
      background: "#5C0036",
      foreground: "#F4EDF1",
      foregroundSecondary: "#E8DCE4",
      foregroundMuted: "#c9a8bc",
      rule: "rgba(244, 237, 241, 0.22)",
      accent: "#F4EDF1",
      controlInactive: "#8a5070",
    },
  },
  {
    id: "flame",
    name: "Flame",
    swatch: "#F05400",
    light: {
      background: "#FFF4ED",
      foreground: "#3D1800",
      foregroundSecondary: "#5c2808",
      foregroundMuted: "#9a6848",
      rule: "rgba(240, 84, 0, 0.2)",
      accent: "#F05400",
      controlInactive: "#d4a890",
    },
    dark: {
      background: "#2a1206",
      foreground: "#FFE8D6",
      foregroundSecondary: "#FFD0B0",
      foregroundMuted: "#c09070",
      rule: "rgba(255, 232, 214, 0.2)",
      accent: "#F05400",
      controlInactive: "#8a5840",
    },
  },
  {
    id: "basel",
    name: "Basel",
    swatch: "#F5F5F0",
    light: {
      background: "#F5F5F0",
      foreground: "#1A1A1A",
      foregroundSecondary: "#2D2D2D",
      foregroundMuted: "#6B6B6B",
      rule: "rgba(26, 26, 26, 0.12)",
      accent: "#E30613",
      controlInactive: "#A0A0A0",
    },
    dark: {
      background: "#141414",
      foreground: "#F5F5F0",
      foregroundSecondary: "#E0E0DB",
      foregroundMuted: "#9A9A95",
      rule: "rgba(245, 245, 240, 0.14)",
      accent: "#E30613",
      controlInactive: "#505050",
    },
  },
  {
    id: "zurich",
    name: "Zürich",
    swatch: "#EEF2F5",
    light: {
      background: "#EEF2F5",
      foreground: "#0D1B2A",
      foregroundSecondary: "#1B2838",
      foregroundMuted: "#5C6B7A",
      rule: "rgba(13, 27, 42, 0.14)",
      accent: "#0066CC",
      controlInactive: "#9AABB8",
    },
    dark: {
      background: "#0D1B2A",
      foreground: "#EEF2F5",
      foregroundSecondary: "#C8D4E0",
      foregroundMuted: "#7A8A9A",
      rule: "rgba(238, 242, 245, 0.16)",
      accent: "#4DA3FF",
      controlInactive: "#3A4A5A",
    },
  },
  {
    id: "grid",
    name: "Grid",
    swatch: "#FAFAFA",
    light: {
      background: "#FAFAFA",
      foreground: "#111111",
      foregroundSecondary: "#222222",
      foregroundMuted: "#666666",
      rule: "rgba(0, 0, 0, 0.1)",
      accent: "#FFD100",
      controlInactive: "#BBBBBB",
    },
    dark: {
      background: "#0A0A0A",
      foreground: "#FAFAFA",
      foregroundSecondary: "#E5E5E5",
      foregroundMuted: "#999999",
      rule: "rgba(255, 255, 255, 0.12)",
      accent: "#FFD100",
      controlInactive: "#444444",
    },
  },
  {
    id: "case-study",
    name: "Case Study",
    swatch: "#F7F2E8",
    light: {
      background: "#F7F2E8",
      foreground: "#2C1810",
      foregroundSecondary: "#4A3020",
      foregroundMuted: "#8A6A58",
      rule: "rgba(44, 24, 16, 0.18)",
      accent: "#2A7B7B",
      controlInactive: "#C4B0A0",
    },
    dark: {
      background: "#1E1410",
      foreground: "#F7F2E8",
      foregroundSecondary: "#E8DCC8",
      foregroundMuted: "#A89078",
      rule: "rgba(247, 242, 232, 0.2)",
      accent: "#3AADAD",
      controlInactive: "#6A5048",
    },
  },
  {
    id: "palm-springs",
    name: "Palm Springs",
    swatch: "#F5E6DC",
    light: {
      background: "#F5E6DC",
      foreground: "#3D2018",
      foregroundSecondary: "#5C3828",
      foregroundMuted: "#9A7060",
      rule: "rgba(61, 32, 24, 0.18)",
      accent: "#008B8B",
      controlInactive: "#D4B8A8",
    },
    dark: {
      background: "#2A1A14",
      foreground: "#F5E6DC",
      foregroundSecondary: "#E8CFC0",
      foregroundMuted: "#B89080",
      rule: "rgba(245, 230, 220, 0.2)",
      accent: "#40C4C4",
      controlInactive: "#6A4838",
    },
  },
  {
    id: "atomic",
    name: "Atomic",
    swatch: "#FFF8E7",
    light: {
      background: "#FFF8E7",
      foreground: "#2A2218",
      foregroundSecondary: "#4A3820",
      foregroundMuted: "#8A7858",
      rule: "rgba(42, 34, 24, 0.16)",
      accent: "#D4A017",
      controlInactive: "#D0C0A0",
    },
    dark: {
      background: "#1A1408",
      foreground: "#FFF8E7",
      foregroundSecondary: "#F0E0C0",
      foregroundMuted: "#B0A080",
      rule: "rgba(255, 248, 231, 0.18)",
      accent: "#E8B830",
      controlInactive: "#5A4830",
    },
  },
];

export const DEFAULT_PALETTE_ID = "studio";
export const DEFAULT_MODE: ThemeMode = "light";

export const STORAGE_KEYS = {
  palette: "tapestry-design-palette",
  mode: "tapestry-design-mode",
} as const;

export function getPalette(id: string): ColorPalette {
  return colorPalettes.find((p) => p.id === id) ?? colorPalettes[0];
}

export function getNextPaletteId(currentId: string): string {
  const index = colorPalettes.findIndex((p) => p.id === currentId);
  const next = index < 0 ? 0 : (index + 1) % colorPalettes.length;
  return colorPalettes[next].id;
}
