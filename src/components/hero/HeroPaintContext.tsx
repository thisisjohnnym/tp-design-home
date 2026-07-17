"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type HeroPaintContextValue = {
  registerLetter: (index: number, element: HTMLSpanElement | null) => void;
  paintAtPoint: (clientX: number, clientY: number, color: string) => void;
  clearPaint: () => void;
  getLetterColor: (index: number) => string | undefined;
};

const HeroPaintContext = createContext<HeroPaintContextValue | null>(null);

export function useHeroPaint() {
  const context = useContext(HeroPaintContext);
  if (!context) {
    throw new Error("useHeroPaint must be used within HeroPaintProvider");
  }
  return context;
}

export function HeroPaintProvider({ children }: { children: ReactNode }) {
  const letterRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const [letterColors, setLetterColors] = useState<Record<number, string>>({});

  const registerLetter = useCallback((index: number, element: HTMLSpanElement | null) => {
    if (element) {
      letterRefs.current.set(index, element);
      return;
    }
    letterRefs.current.delete(index);
  }, []);

  const paintAtPoint = useCallback((clientX: number, clientY: number, color: string) => {
    for (const [index, element] of letterRefs.current.entries()) {
      const rect = element.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        setLetterColors((current) => {
          if (Object.keys(current).length === 1 && current[index] === color) return current;
          return { [index]: color };
        });
        return;
      }
    }

    setLetterColors((current) => (Object.keys(current).length === 0 ? current : {}));
  }, []);

  const clearPaint = useCallback(() => {
    setLetterColors((current) => (Object.keys(current).length === 0 ? current : {}));
  }, []);

  const getLetterColor = useCallback(
    (index: number) => letterColors[index],
    [letterColors],
  );

  const value = useMemo(
    () => ({ registerLetter, paintAtPoint, clearPaint, getLetterColor }),
    [registerLetter, paintAtPoint, clearPaint, getLetterColor],
  );

  return <HeroPaintContext.Provider value={value}>{children}</HeroPaintContext.Provider>;
}
