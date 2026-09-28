"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { heroSequenceMotion } from "./content";

gsap.registerPlugin(useGSAP);

/** Tip of the Mac-style cursor inside the SVG box. */
const TIP_X = 1;
const TIP_Y = 1;

/**
 * Rest offset from the tip to the yellow dot’s top-left (Paper 6FY-0:
 * tip ≈ 154.4/150.9, dot at 177/178).
 */
const DOT_OFFSET_X = 23;
const DOT_OFFSET_Y = 27;

/**
 * Custom pointer: Mac arrow tracks the real tip; studio-yellow dot lags.
 * Portaled to body so ScrollSmoother transforms do not trap `position: fixed`.
 */
export function PointerEffect() {
  const arrowRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("hs-has-pointer");
    return () => {
      document.documentElement.classList.remove("hs-has-pointer");
    };
  }, [enabled]);

  useGSAP(
    () => {
      const arrow = arrowRef.current;
      const dot = dotRef.current;
      if (!mounted || !enabled || !arrow || !dot) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const lag = heroSequenceMotion.pointerLag;

      const arrowX = reduced
        ? (value: number) => gsap.set(arrow, { x: value })
        : gsap.quickTo(arrow, "x", {
            duration: heroSequenceMotion.pointerArrowLag,
            ease: "power3.out",
          });
      const arrowY = reduced
        ? (value: number) => gsap.set(arrow, { y: value })
        : gsap.quickTo(arrow, "y", {
            duration: heroSequenceMotion.pointerArrowLag,
            ease: "power3.out",
          });
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
        gsap.to([arrow, dot], {
          opacity: 1,
          duration: reduced ? 0 : 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const hide = () => {
        if (!visible) return;
        visible = false;
        gsap.to([arrow, dot], {
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
        arrowX(tipX - TIP_X);
        arrowY(tipY - TIP_Y);
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
      <div className="hs-pointer__dot" ref={dotRef} />
      <div className="hs-pointer__arrow" ref={arrowRef}>
        {/* Mac-style pointer — black rim + white face, tip at ~0,0 of the box. */}
        <svg
          className="hs-pointer__svg"
          fill="none"
          height="24"
          viewBox="0 0 18 24"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.5 0.5V17.25L4.85 13.55L7.6 20.9L11.05 19.55L8.2 12.35H14.75L0.5 0.5Z"
            fill="#000000"
          />
          <path
            d="M1.75 2.6V14.35L4.95 11.55L7.75 19L9.35 18.35L6.5 10.8H11.85L1.75 2.6Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </div>,
    document.body,
  );
}
