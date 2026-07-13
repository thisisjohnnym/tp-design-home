"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import { InteractiveDotsScene } from "@/lib/interactiveDots/InteractiveDotsScene";

function getCanvasPoint(section: HTMLElement, clientX: number, clientY: number) {
  const canvas = section.querySelector("canvas");
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
}

export function InteractiveDots() {
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLElement>(null);
  const physicsRef = useRef<InteractiveDotsScene | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const section = sceneRef.current;
    if (!section) return;

    const physics = new InteractiveDotsScene(section);
    physicsRef.current = physics;

    let cancelled = false;
    let frame = 0;

    const startWhenReady = () => {
      frame = window.requestAnimationFrame(async () => {
        if (cancelled) return;

        if (section.clientWidth > 0 && section.clientHeight > 0) {
          await physics.start();
          return;
        }

        startWhenReady();
      });
    };

    startWhenReady();

    const handleWindowMouseUp = () => {
      physics.handleMouseUp();
    };

    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      physics.stop();
      physicsRef.current = null;
    };
  }, [reduceMotion]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const section = sceneRef.current;
    if (!section) return;

    const point = getCanvasPoint(section, event.clientX, event.clientY);
    if (!point) return;

    physicsRef.current?.handleMouseMove(point.x, point.y);
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const section = sceneRef.current;
    if (!section) return;

    const point = getCanvasPoint(section, event.clientX, event.clientY);
    if (!point) return;

    physicsRef.current?.handleMouseDown(point.x, point.y);
  }, []);

  const handleMouseUp = useCallback(() => {
    physicsRef.current?.handleMouseUp();
  }, []);

  if (reduceMotion) {
    return (
      <section
        className="interactive-dots interactive-dots--static"
        aria-label="Design Tapestry brand mark"
      >
        <div className="interactive-dots__static-logo" aria-hidden="true" />
      </section>
    );
  }

  return (
    <section
      ref={sceneRef}
      className="interactive-dots"
      data-component-name="section-interactive-dots"
      aria-label="Interactive particle field"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
}
