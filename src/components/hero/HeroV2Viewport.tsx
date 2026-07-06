"use client";

import { useLayoutEffect, type ReactNode } from "react";

type HeroV2ViewportProps = {
  children: ReactNode;
  className?: string;
};

/** Locks hero shell to the visible viewport — avoids dvh/svh mismatches eating bottom margin. */
export function HeroV2Viewport({ children, className }: HeroV2ViewportProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;

    const syncViewportHeight = () => {
      root.style.setProperty("--hero-v2-viewport-h", `${window.innerHeight}px`);
    };

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("resize", syncViewportHeight);

    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      root.style.removeProperty("--hero-v2-viewport-h");
    };
  }, []);

  return <div className={["hero-v2-viewport", className].filter(Boolean).join(" ")}>{children}</div>;
}
