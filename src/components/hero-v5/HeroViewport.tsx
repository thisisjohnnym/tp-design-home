"use client";

import { useLayoutEffect, type CSSProperties, type ReactNode } from "react";

type HeroViewportProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function HeroViewport({ children, className, style }: HeroViewportProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;

    const updateViewportHeight = () => {
      root.style.setProperty("--hero-v2-viewport-h", `${window.innerHeight}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.visualViewport?.removeEventListener("resize", updateViewportHeight);
      root.style.removeProperty("--hero-v2-viewport-h");
    };
  }, []);

  return (
    <div
      className={["hero-v2-viewport", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
