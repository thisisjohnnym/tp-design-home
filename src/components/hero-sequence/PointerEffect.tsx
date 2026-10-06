"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { heroSequenceMotion } from "./content";

gsap.registerPlugin(useGSAP);

/**
 * Rest offset from the system cursor's tip to the yellow dot’s top-left
 * (Paper 6FY-0: tip ≈ 154.4/150.9, dot at 177/178).
 */
const DOT_OFFSET_X = 23;
const DOT_OFFSET_Y = 27;

/**
 * Custom pointer: the system cursor stays; a studio-yellow dot trails it.
 * Portaled to body so ScrollSmoother transforms do not trap `position: fixed`.
 */
export function PointerEffect() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, [mounted]);

  useGSAP(
    () => {
      const dot = dotRef.current;
      if (!mounted || !enabled || !dot) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const lag = heroSequenceMotion.pointerLag;

      const dotX = reduced
        ? (value: number) => gsap.set(dot, { x: value })
        : gsap.quickTo(dot, "x", { duration: lag, ease: "power3.out" });
      const dotY = reduced
        ? (value: number) => gsap.set(dot, { y: value })
        : gsap.quickTo(dot, "y", { duration: lag, ease: "power3.out" });

      let visible = false;

      const show = () => {
        if (visible) return;
        visible = true;
        gsap.to(dot, {
          opacity: 1,
          duration: reduced ? 0 : 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const hide = () => {
        if (!visible) return;
        visible = false;
        gsap.to(dot, {
          opacity: 0,
          duration: reduced ? 0 : 0.16,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        show();
        const tipX = event.clientX;
        const tipY = event.clientY;
        dotX(tipX + DOT_OFFSET_X);
        dotY(tipY + DOT_OFFSET_Y);
      };

      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("mouseleave", hide);
      window.addEventListener("blur", hide);

      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("mouseleave", hide);
        window.removeEventListener("blur", hide);
      };
    },
    { dependencies: [mounted, enabled] },
  );

  if (!mounted || !enabled) return null;

  return createPortal(
    <div aria-hidden="true" className="hs-pointer">
      <div className="hs-pointer__dot" ref={dotRef}>
        <span className="hs-pointer__label">Drag</span>
      </div>
    </div>,
    document.body,
  );
}
