"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  colorPalettes,
  DEFAULT_MODE,
  DEFAULT_PALETTE_ID,
  STORAGE_KEYS,
  getNextPaletteId,
  type ThemeMode,
} from "@/content/themes";

type ThemeContextValue = {
  paletteId: string;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  shufflePalette: () => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(paletteId: string, mode: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute("data-palette", paletteId);
  root.setAttribute("data-mode", mode);
  root.style.colorScheme = mode;
}

function withThemeTransition(action: () => void) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  action();
  window.setTimeout(() => root.classList.remove("theme-transition"), 500);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedPalette = localStorage.getItem(STORAGE_KEYS.palette);
    const storedMode = localStorage.getItem(STORAGE_KEYS.mode) as ThemeMode | null;
    const palette =
      storedPalette && colorPalettes.some((p) => p.id === storedPalette)
        ? storedPalette
        : DEFAULT_PALETTE_ID;
    const nextMode = storedMode === "dark" || storedMode === "light" ? storedMode : DEFAULT_MODE;
    setPaletteId(palette);
    setModeState(nextMode);
    applyTheme(palette, nextMode);
    setReady(true);
  }, []);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      withThemeTransition(() => {
        applyTheme(paletteId, next);
        localStorage.setItem(STORAGE_KEYS.mode, next);
      });
    },
    [paletteId],
  );

  const shufflePalette = useCallback(() => {
    const nextId = getNextPaletteId(paletteId);
    setPaletteId(nextId);
    withThemeTransition(() => {
      applyTheme(nextId, mode);
      localStorage.setItem(STORAGE_KEYS.palette, nextId);
    });
  }, [paletteId, mode]);

  const value = useMemo(
    () => ({ paletteId, mode, setMode, shufflePalette, ready }),
    [paletteId, mode, setMode, shufflePalette, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
