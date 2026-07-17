"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const ZOOM = 2;
const LENS_SIZE = 112;
const LENS_RADIUS = LENS_SIZE / 2;
const HOTSPOT_SIZE = 3;
const LENS_OFFSET_X = -48;
const LENS_OFFSET_Y = -48;

const SPRING_CONFIG = { stiffness: 500, damping: 40, mass: 0.4 };

function sanitizeClone(root: HTMLElement) {
  root.querySelectorAll("script").forEach((el) => el.remove());
  root.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  root.querySelectorAll("[data-magnifier-cursor]").forEach((el) => el.remove());
  root.querySelectorAll("a").forEach((el) => {
    el.removeAttribute("href");
  });
  root.style.pointerEvents = "none";
  root.style.userSelect = "none";
}

function syncStickyHeaderPosition(source: HTMLElement, clone: HTMLElement) {
  const rect = source.getBoundingClientRect();
  clone.style.position = "absolute";
  clone.style.top = `${window.scrollY + rect.top}px`;
  clone.style.left = `${window.scrollX + rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.zIndex = "50";
}

function buildPageClone(): HTMLElement | null {
  const header = document.querySelector<HTMLElement>("header.site-header");
  const main = document.getElementById("main");
  if (!header || !main) return null;

  const bodyStyle = getComputedStyle(document.body);
  const wrapper = document.createElement("div");
  wrapper.className = document.documentElement.className;
  wrapper.setAttribute("data-palette", document.documentElement.getAttribute("data-palette") ?? "");
  wrapper.setAttribute("data-mode", document.documentElement.getAttribute("data-mode") ?? "");
  wrapper.style.position = "relative";
  wrapper.style.width = `${Math.max(document.documentElement.scrollWidth, window.innerWidth)}px`;
  wrapper.style.minHeight = `${document.documentElement.scrollHeight}px`;
  wrapper.style.backgroundColor = bodyStyle.backgroundColor;
  wrapper.style.color = bodyStyle.color;
  wrapper.style.fontFamily = bodyStyle.fontFamily;
  wrapper.style.fontSize = bodyStyle.fontSize;
  wrapper.style.lineHeight = bodyStyle.lineHeight;
  wrapper.style.letterSpacing = bodyStyle.letterSpacing;
  wrapper.style.setProperty("-webkit-font-smoothing", "antialiased");

  const headerClone = header.cloneNode(true) as HTMLElement;
  const mainClone = main.cloneNode(true) as HTMLElement;

  syncStickyHeaderPosition(header, headerClone);

  wrapper.appendChild(headerClone);
  wrapper.appendChild(mainClone);
  sanitizeClone(wrapper);

  return wrapper;
}

export function MagnifierCursor() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const cloneInnerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);

  const springDotX = useSpring(dotX, SPRING_CONFIG);
  const springDotY = useSpring(dotY, SPRING_CONFIG);
  const springLensX = useSpring(lensX, SPRING_CONFIG);
  const springLensY = useSpring(lensY, SPRING_CONFIG);

  const refreshClone = useCallback(() => {
    const inner = cloneInnerRef.current;
    if (!inner) return;
    inner.replaceChildren();
    const clone = buildPageClone();
    if (clone) inner.appendChild(clone);
  }, []);

  const updateLensTransform = useCallback((clientX: number, clientY: number) => {
    const inner = cloneInnerRef.current;
    if (!inner) return;

    const pageX = clientX + window.scrollX;
    const pageY = clientY + window.scrollY;
    inner.style.transform = `translate(${LENS_RADIUS - pageX * ZOOM}px, ${LENS_RADIUS - pageY * ZOOM}px) scale(${ZOOM})`;
    inner.style.transformOrigin = "0 0";

    const headerSource = document.querySelector<HTMLElement>("header.site-header");
    const headerClone = inner.querySelector<HTMLElement>("header.site-header");
    if (headerSource && headerClone) {
      syncStickyHeaderPosition(headerSource, headerClone);
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setEnabled(false);
      return;
    }

    const coarseQuery = window.matchMedia("(pointer: coarse)");
    if (coarseQuery.matches) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    document.documentElement.dataset.customCursor = "on";

    return () => {
      delete document.documentElement.dataset.customCursor;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;

    refreshClone();
  }, [enabled, pathname, refreshClone]);

  useEffect(() => {
    if (!enabled) return;

    const html = document.documentElement;
    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-palette" || mutation.attributeName === "data-mode") {
          refreshClone();
          break;
        }
      }
    });
    themeObserver.observe(html, { attributes: true, attributeFilter: ["data-palette", "data-mode"] });

    const main = document.getElementById("main");
    const header = document.querySelector("header.site-header");

    let resizeTimer: ReturnType<typeof setTimeout>;
    let mutationTimer: ReturnType<typeof setTimeout>;
    const debouncedRefresh = () => {
      clearTimeout(mutationTimer);
      mutationTimer = setTimeout(refreshClone, 80);
    };
    const debouncedContentObserver = new MutationObserver(debouncedRefresh);
    if (main) {
      debouncedContentObserver.observe(main, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }
    if (header) {
      debouncedContentObserver.observe(header, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshClone, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      themeObserver.disconnect();
      debouncedContentObserver.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      clearTimeout(mutationTimer);
    };
  }, [enabled, refreshClone]);

  useEffect(() => {
    if (!enabled) return;

    const applyPointer = () => {
      const { x, y } = pointerRef.current;
      dotX.set(x);
      dotY.set(y);
      lensX.set(x + LENS_OFFSET_X);
      lensY.set(y + LENS_OFFSET_Y);
      updateLensTransform(x, y);
      rafRef.current = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (!visible) setVisible(true);
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(applyPointer);
      }
    };

    const onScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(applyPointer);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setVisible(false);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, visible, dotX, dotY, lensX, lensY, updateLensTransform]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      data-magnifier-cursor
      aria-hidden
    >
      <motion.div
        className="absolute rounded-full bg-accent"
        style={{
          width: HOTSPOT_SIZE,
          height: HOTSPOT_SIZE,
          x: springDotX,
          y: springDotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      />

      <motion.div
        className="absolute"
        style={{
          width: LENS_SIZE,
          height: LENS_SIZE,
          x: springLensX,
          y: springLensY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-full border-2 border-accent shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
          style={{ width: LENS_SIZE, height: LENS_SIZE }}
        >
          <div
            ref={cloneInnerRef}
            className="absolute left-0 top-0"
            style={{ transformOrigin: "0 0", width: "max-content" }}
          />
        </div>

        <svg
          className="absolute text-foreground"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          style={{
            right: -8,
            bottom: -8,
          }}
          aria-hidden
        >
          <line
            x1="8"
            y1="28"
            x2="28"
            y2="8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
