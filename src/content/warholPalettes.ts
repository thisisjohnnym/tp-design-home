import { howWeDoItShapeColors as c } from "@/content/howWeDoIt";

export type WarholPalette = {
  background: string;
  skin: string;
  shadow: string;
  highlight: string;
  leafA: string;
  leafB: string;
};

export const warholPalettes: Record<string, WarholPalette> = {
  "Sean Kelly": {
    background: c.frame,
    skin: c.test,
    shadow: c.align,
    highlight: c.iterate,
    leafA: c.explore,
    leafB: c.deliver,
  },
  "Wendy Chan": {
    background: c.frame,
    skin: c.explore,
    shadow: c.test,
    highlight: c.iterate,
    leafA: c.align,
    leafB: c.deliver,
  },
  "Cong Kim": {
    background: c.align,
    skin: c.test,
    shadow: c.frame,
    highlight: c.iterate,
    leafA: c.explore,
    leafB: c.deliver,
  },
  "Jonathan Martinez": {
    background: c.test,
    skin: c.iterate,
    shadow: c.align,
    highlight: c.deliver,
    leafA: c.frame,
    leafB: c.explore,
  },
  "Mitra Raveendran": {
    background: c.iterate,
    skin: c.test,
    shadow: c.align,
    highlight: c.deliver,
    leafA: c.explore,
    leafB: c.frame,
  },
  "Juliana Botero": {
    background: c.test,
    skin: c.iterate,
    shadow: c.align,
    highlight: c.deliver,
    leafA: c.frame,
    leafB: c.explore,
  },
  "Gulsheen Bhatia": {
    background: c.frame,
    skin: c.explore,
    shadow: c.test,
    highlight: c.iterate,
    leafA: c.align,
    leafB: c.deliver,
  },
  "Kat Guzman": {
    background: c.align,
    skin: c.test,
    shadow: c.frame,
    highlight: c.deliver,
    leafA: c.explore,
    leafB: c.iterate,
  },
};

export const defaultWarholPalette: WarholPalette = {
  background: c.frame,
  skin: c.test,
  shadow: c.align,
  highlight: c.iterate,
  leafA: c.explore,
  leafB: c.deliver,
};

export function getWarholPalette(name: string): WarholPalette {
  return warholPalettes[name] ?? defaultWarholPalette;
}
