"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

const WAVE_HEIGHT_FALLBACK = 120;
const DESKTOP_BREAKPOINT = 768;

function isInViewport(rect: DOMRect) {
  return rect.bottom >= 0 && rect.top <= window.innerHeight;
}

function getWaveHeight(el: HTMLElement) {
  const raw = getComputedStyle(el).getPropertyValue("--wave-height").trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : WAVE_HEIGHT_FALLBACK;
}

function getDimensions(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const width = rect.width > 0 ? rect.width : el.offsetWidth || window.innerWidth;
  const height = getWaveHeight(el);
  return { width, height };
}

function buildWavePath(time: number, width: number, height: number) {
  const delta = width > DESKTOP_BREAKPOINT ? 22 : 11;
  const speed = 0.12;
  const points = 3;

  const pts: { x: number; y: number }[] = [];
  for (let n = 0; n <= points; n += 1) {
    const x = (n / points) * width;
    const phase = (time + (n + (n % points))) * speed * 100;
    const primary = Math.sin(phase / 100) * delta;
    const secondary = Math.sin(phase / 65 + 0.6) * (delta * 0.22);
    const y = Math.sin(phase / 100) * primary + secondary;
    pts.push({ x, y });
  }

  let d = `M ${pts[0].x} ${pts[0].y}`;
  let prev = {
    x: (pts[1].x - pts[0].x) / 2,
    y: pts[1].y - pts[0].y + pts[0].y + (pts[1].y - pts[0].y),
  };
  d += ` C ${prev.x} ${prev.y} ${prev.x} ${prev.y} ${pts[1].x} ${pts[1].y}`;

  for (let n = 1; n < pts.length - 1; n += 1) {
    const cp = {
      x: pts[n].x - prev.x + pts[n].x,
      y: pts[n].y - prev.y + pts[n].y,
    };
    d += ` C ${cp.x} ${cp.y} ${cp.x} ${cp.y} ${pts[n + 1].x} ${pts[n + 1].y}`;
    prev = cp;
  }

  d += ` L ${width} ${height} L 0 ${height} Z`;
  return d;
}

function getInitialWaveState() {
  return { path: "M 0 0", width: 0, height: WAVE_HEIGHT_FALLBACK };
}

type SectionWaveProps = {
  fill?: string;
  position?: "top" | "bottom";
  className?: string;
};

export function SectionWave({
  fill = "#000000",
  position = "top",
  className = "",
}: SectionWaveProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ path, width, height }, setWaveState] = useState(getInitialWaveState);

  const updatePath = useCallback((time: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { width: w, height: h } = getDimensions(el);
    if (w <= 0) return;
    setWaveState({
      path: buildWavePath(time, w, h),
      width: w,
      height: h,
    });
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    let totalTime = 0;
    let lastUpdate: number | null = null;

    const syncRect = () => {
      updatePath(reduceMotion ? 0 : totalTime * Math.PI);
    };

    const loop = () => {
      const rect = el.getBoundingClientRect();
      if (isInViewport(rect)) {
        if (!reduceMotion) {
          const now = Date.now();
          if (lastUpdate !== null) {
            totalTime += (now - lastUpdate) / 1000;
          }
          lastUpdate = now;
          updatePath(totalTime * Math.PI);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    syncRect();
    if (getDimensions(el).width <= 0) {
      requestAnimationFrame(syncRect);
    }
    loop();

    const resizeObserver = new ResizeObserver(syncRect);
    resizeObserver.observe(el);
    window.addEventListener("scroll", syncRect, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", syncRect);
    };
  }, [reduceMotion, updatePath]);

  return (
    <div
      ref={containerRef}
      className={`section-wave ${position === "top" ? "section-wave--top" : "section-wave--bottom"} ${className}`}
      aria-hidden
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={width > 0 ? `0 0 ${width} ${height}` : undefined}
        preserveAspectRatio="none"
      >
        <path d={path} fill={fill} />
      </svg>
    </div>
  );
}
