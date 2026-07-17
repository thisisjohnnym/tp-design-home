"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroCursorConfig } from "@/content/heroCursors";
import { disableCustomCursor, enableCustomCursor } from "@/lib/customCursor";
import { useHeroPaint } from "./HeroPaintContext";

const BOUNDS_PADDING = 8;
/** Arrow hotspot offset from the cursor widget's top-left corner */
const CURSOR_HOTSPOT = { x: 6, y: 6 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type TeamMemberCursorProps = {
  config: HeroCursorConfig;
  containerRef: React.RefObject<HTMLElement | null>;
  interactive: boolean;
  zIndex: number;
  onActivate: () => void;
};

export function TeamMemberCursor({
  config,
  containerRef,
  interactive,
  zIndex,
  onActivate,
}: TeamMemberCursorProps) {
  const { paintAtPoint, clearPaint } = useHeroPaint();
  const elementRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const computeDefaultPosition = useCallback(() => {
    const container = containerRef.current;
    const element = elementRef.current;
    if (!container || !element) {
      return { x: 0, y: 0 };
    }

    const { width, height } = container.getBoundingClientRect();
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    return {
      x: clamp(
        (config.position.xPercent / 100) * width,
        BOUNDS_PADDING,
        width - elementWidth - BOUNDS_PADDING,
      ),
      y: clamp(
        (config.position.yPercent / 100) * height,
        BOUNDS_PADDING,
        height - elementHeight - BOUNDS_PADDING,
      ),
    };
  }, [config.position.xPercent, config.position.yPercent, containerRef]);

  useEffect(() => {
    if (draggingRef.current) return;
    setPosition(computeDefaultPosition());
  }, [computeDefaultPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (!draggingRef.current) {
        setPosition(computeDefaultPosition());
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [computeDefaultPosition, containerRef]);

  const clampToBounds = useCallback(
    (x: number, y: number) => {
      const container = containerRef.current;
      const element = elementRef.current;
      if (!container || !element) {
        return { x, y };
      }

      const { width, height } = container.getBoundingClientRect();
      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;

      return {
        x: clamp(x, BOUNDS_PADDING, width - elementWidth - BOUNDS_PADDING),
        y: clamp(y, BOUNDS_PADDING, height - elementHeight - BOUNDS_PADDING),
      };
    },
    [containerRef],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;

    event.preventDefault();
    draggingRef.current = true;
    onActivate();
    document.documentElement.dataset.teamCursorDragging = "true";
    disableCustomCursor();

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const current = position ?? computeDefaultPosition();

    dragOffsetRef.current = {
      x: event.clientX - containerRect.left - current.x,
      y: event.clientY - containerRect.top - current.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const next = clampToBounds(
      event.clientX - containerRect.left - dragOffsetRef.current.x,
      event.clientY - containerRect.top - dragOffsetRef.current.y,
    );

    setPosition(next);

    paintAtPoint(
      containerRect.left + next.x + CURSOR_HOTSPOT.x,
      containerRect.top + next.y + CURSOR_HOTSPOT.y,
      config.color,
    );
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    delete document.documentElement.dataset.teamCursorDragging;
    clearPaint();
    enableCustomCursor();
  };

  const displayName =
    config.name === "Jonathan Martinez" ? "Johnny Martinez" : config.name;

  return (
    <div
      ref={elementRef}
      className="team-member-cursor"
      style={{
        transform: position ? `translate3d(${position.x}px, ${position.y}px, 0)` : undefined,
        zIndex,
        visibility: position ? "visible" : "hidden",
      }}
      role="img"
      aria-label={`${displayName}'s cursor`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Image
        src={config.cursorIcon}
        alt=""
        width={26}
        height={26}
        className="team-member-cursor__icon"
        aria-hidden
        draggable={false}
        unoptimized
      />
      <span
        className="team-member-cursor__label"
        style={{ backgroundColor: config.color }}
      >
        {displayName}
      </span>
    </div>
  );
}
