"use client";

import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { workCards } from "@/content/work";

const MAX_ROTATE_Y = 52;
const MAX_TRANSLATE_Z = -120;
const MIN_SCALE = 0.86;
const CLAMP = 1.35;
const AUTO_SPEED = 0.55;
const LOOP_SETS = 3;
const MOMENTUM_FRICTION = 0.94;
const MIN_VELOCITY = 0.02;
const MAX_VELOCITY = 3.5;
const VELOCITY_SAMPLES = 6;

type LoopedCard = (typeof workCards)[number] & { loopKey: string };

export function WorkArcGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const velocityRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, time: 0 });
  const velocitySamplesRef = useRef<Array<{ dx: number; dt: number }>>([]);
  const lastFrameTimeRef = useRef(0);

  const loopedCards = useMemo<LoopedCard[]>(
    () =>
      Array.from({ length: LOOP_SETS }, (_, setIndex) =>
        workCards.map((card) => ({
          ...card,
          loopKey: `${card.id}-${setIndex}`,
        })),
      ).flat(),
    [],
  );

  useEffect(() => {
    const gallery = galleryRef.current;
    const track = trackRef.current;
    if (!gallery || !track) return;

    const measureSetWidth = () => {
      const first = cardsRef.current[0];
      const nextSet = cardsRef.current[workCards.length];
      if (!first || !nextSet) return;
      setWidthRef.current = nextSet.offsetLeft - first.offsetLeft;
    };

    const normalizeOffset = () => {
      const setWidth = setWidthRef.current;
      if (setWidth <= 0) return;

      if (offsetRef.current < setWidth * 0.25) {
        offsetRef.current += setWidth;
      } else if (offsetRef.current > setWidth * 1.75) {
        offsetRef.current -= setWidth;
      }
    };

    const applyTransform = () => {
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    };

    const applyPerspective = () => {
      const scrollCenter = offsetRef.current + gallery.clientWidth / 2;

      for (const card of cardsRef.current) {
        if (!card) continue;

        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const delta = cardCenter - scrollCenter;
        const norm = Math.max(-CLAMP, Math.min(CLAMP, delta / (gallery.clientWidth / 2)));
        const abs = Math.abs(norm);

        const rotateY = -norm * MAX_ROTATE_Y;
        const scale = 1 - abs * (1 - MIN_SCALE);
        const translateZ = abs * MAX_TRANSLATE_Z;

        card.style.transform = `translateZ(${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(
          2,
        )}deg) scale(${scale.toFixed(3)})`;
        card.style.zIndex = String(100 - Math.round(abs * 100));
      }
    };

    const render = () => {
      normalizeOffset();
      applyTransform();
      applyPerspective();
    };

    const clampVelocity = (velocity: number) =>
      Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));

    const tick = (time: number) => {
      frameRef.current = null;

      const frameDelta = lastFrameTimeRef.current ? Math.min(time - lastFrameTimeRef.current, 32) : 16;
      lastFrameTimeRef.current = time;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!draggingRef.current) {
        const velocity = velocityRef.current;

        if (Math.abs(velocity) > MIN_VELOCITY) {
          offsetRef.current += velocity * frameDelta;
          velocityRef.current = clampVelocity(
            velocity * Math.pow(MOMENTUM_FRICTION, frameDelta / 16),
          );
        } else {
          velocityRef.current = 0;
          if (!reduceMotion) {
            offsetRef.current += AUTO_SPEED;
          }
        }
      }

      render();
      frameRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      measureSetWidth();
      if (setWidthRef.current > 0) {
        offsetRef.current = setWidthRef.current;
      }
      render();
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    start();

    const resizeObserver = new ResizeObserver(() => {
      measureSetWidth();
      render();
    });
    resizeObserver.observe(gallery);
    resizeObserver.observe(track);

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault();
      }
    };
    gallery.addEventListener("wheel", onWheel, { passive: false });

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      draggingRef.current = true;
      velocityRef.current = 0;
      velocitySamplesRef.current = [];
      lastPointerRef.current = { x: event.clientX, time: performance.now() };
      gallery.setPointerCapture(event.pointerId);
      gallery.dataset.dragX = String(event.clientX);
      gallery.dataset.dragOffset = String(offsetRef.current);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;

      const now = performance.now();
      const last = lastPointerRef.current;
      const dt = now - last.time;

      if (dt > 0) {
        const dx = event.clientX - last.x;
        const samples = velocitySamplesRef.current;
        samples.push({ dx, dt });
        if (samples.length > VELOCITY_SAMPLES) samples.shift();
      }

      lastPointerRef.current = { x: event.clientX, time: now };

      const startX = Number(gallery.dataset.dragX ?? event.clientX);
      const startOffset = Number(gallery.dataset.dragOffset ?? offsetRef.current);
      offsetRef.current = startOffset - (event.clientX - startX);
      render();
    };

    const releaseVelocity = () => {
      const samples = velocitySamplesRef.current;
      if (samples.length === 0) return;

      let totalDx = 0;
      let totalDt = 0;
      for (const sample of samples) {
        totalDx += sample.dx;
        totalDt += sample.dt;
      }

      if (totalDt <= 0) return;

      // Drag right moves content right → decrease offset
      velocityRef.current = clampVelocity(-(totalDx / totalDt));
      velocitySamplesRef.current = [];
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      releaseVelocity();
      if (gallery.hasPointerCapture(event.pointerId)) {
        gallery.releasePointerCapture(event.pointerId);
      }
    };

    gallery.addEventListener("pointerdown", onPointerDown);
    gallery.addEventListener("pointermove", onPointerMove);
    gallery.addEventListener("pointerup", onPointerUp);
    gallery.addEventListener("pointercancel", onPointerUp);

    return () => {
      resizeObserver.disconnect();
      gallery.removeEventListener("wheel", onWheel);
      gallery.removeEventListener("pointerdown", onPointerDown);
      gallery.removeEventListener("pointermove", onPointerMove);
      gallery.removeEventListener("pointerup", onPointerUp);
      gallery.removeEventListener("pointercancel", onPointerUp);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={galleryRef}
      className="our-work__gallery"
      role="group"
      aria-label="Our work gallery"
    >
      <div ref={trackRef} className="our-work__track">
        {loopedCards.map((card, index) => (
          <div
            key={card.loopKey}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="our-work__card"
            style={
              {
                "--card-color": card.color,
                "--card-ink": card.ink,
              } as CSSProperties
            }
            aria-label={card.label}
            aria-hidden={index < workCards.length || index >= workCards.length * 2}
          >
            <span className="our-work__card-label">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
