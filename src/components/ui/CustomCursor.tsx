"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LERP = 0.15;
const IDLE_DELAY_MS = 5000;

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="link"], input[type="button"], input[type="submit"], summary, label[for]';

const TEAM_CURSOR_SELECTOR = ".team-member-cursor, .hero-team-cursors";

const TEXT_INPUT_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]';

export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef(Date.now());
  const rafRef = useRef(0);
  const overTextInputRef = useRef(false);
  const overTeamCursorRef = useRef(false);
  const visibleRef = useRef(false);

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

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const setVisible = (visible: boolean) => {
      if (visibleRef.current === visible) return;
      visibleRef.current = visible;
      outer.dataset.visible = visible ? "true" : "false";
    };

    const setOverTeamCursor = (over: boolean) => {
      if (overTeamCursorRef.current === over) return;
      overTeamCursorRef.current = over;

      if (over || document.documentElement.dataset.teamCursorDragging === "true") {
        document.documentElement.dataset.customCursor = "off";
        setVisible(false);
      } else if (!overTextInputRef.current) {
        document.documentElement.dataset.customCursor = "on";
        setVisible(true);
      }
    };

    const setOverTextInput = (over: boolean) => {
      if (overTextInputRef.current === over) return;
      overTextInputRef.current = over;

      if (over) {
        document.documentElement.dataset.customCursor = "off";
        setVisible(false);
      } else if (!overTeamCursorRef.current && document.documentElement.dataset.teamCursorDragging !== "true") {
        document.documentElement.dataset.customCursor = "on";
        setVisible(true);
      }
    };

    const updateHitTest = (clientX: number, clientY: number) => {
      if (document.documentElement.dataset.teamCursorDragging === "true") {
        setVisible(false);
        return;
      }

      const element = document.elementFromPoint(clientX, clientY);
      if (!element) return;

      const isTextInput = Boolean(element.closest(TEXT_INPUT_SELECTOR));
      setOverTextInput(isTextInput);

      const isTeamCursor = Boolean(element.closest(TEAM_CURSOR_SELECTOR));
      setOverTeamCursor(isTeamCursor);

      if (isTextInput || isTeamCursor) {
        inner.dataset.hover = "false";
        inner.dataset.idle = "false";
        return;
      }

      const isInteractive = Boolean(element.closest(INTERACTIVE_SELECTOR));
      inner.dataset.hover = isInteractive ? "true" : "false";
    };

    const tick = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;

      outer.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

      const isIdle =
        !overTextInputRef.current &&
        !overTeamCursorRef.current &&
        document.documentElement.dataset.teamCursorDragging !== "true" &&
        visibleRef.current &&
        Date.now() - lastMoveTimeRef.current >= IDLE_DELAY_MS;

      inner.dataset.idle = isIdle ? "true" : "false";

      rafRef.current = requestAnimationFrame(tick);
    };

    const onMouseMove = (event: MouseEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      lastMoveTimeRef.current = Date.now();
      inner.dataset.idle = "false";

      if (
        !visibleRef.current &&
        !overTextInputRef.current &&
        !overTeamCursorRef.current &&
        document.documentElement.dataset.teamCursorDragging !== "true"
      ) {
        setVisible(true);
      }

      updateHitTest(event.clientX, event.clientY);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const onMouseEnter = () => {
      if (
        !overTextInputRef.current &&
        !overTeamCursorRef.current &&
        document.documentElement.dataset.teamCursorDragging !== "true"
      ) {
        setVisible(true);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setVisible(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={outerRef}
      className="custom-cursor-outer pointer-events-none fixed left-0 top-0 z-[9999]"
      data-visible="false"
      aria-hidden
    >
      <div ref={innerRef} className="custom-cursor" data-hover="false" data-idle="false" />
    </div>
  );
}
