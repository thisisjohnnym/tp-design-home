"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

/** Gap between the pointer and the top-left of the frame, toward the bottom right. */
const OFFSET_X = 22;
const OFFSET_Y = 28;

type PreviewItem = {
  id: string;
  image: string;
  title: string;
};

type Point = { x: number; y: number };

type Follow = {
  retarget: (frame: HTMLElement) => void;
  xTo: (value: number) => void;
  yTo: (value: number) => void;
};

function slideHeight(track: HTMLElement, frame: HTMLElement) {
  const slide = track.children[0] as HTMLElement | undefined;
  return slide?.getBoundingClientRect().height || frame.clientHeight;
}

/**
 * One 16:9 still that trails the pointer. Swapping rows slides the reel up or
 * down; leaving a row fades the frame out through a blur.
 * Portaled to the body because ScrollSmoother transforms its content, which
 * would pin a `position: fixed` frame to the scrolling layer.
 */
export function CapabilityPreview({
  activeId,
  origin,
  items,
}: {
  activeId: string | null;
  origin: Point | null;
  items: readonly PreviewItem[];
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef(activeId);
  const originRef = useRef(origin);
  const indexRef = useRef(-1);
  const settledRef = useRef(false);
  const followRef = useRef<Follow | null>(null);
  const [mounted, setMounted] = useState(false);

  activeIdRef.current = activeId;
  originRef.current = origin;

  const index = activeId
    ? items.findIndex((item) => item.id === activeId)
    : -1;
  indexRef.current = index;

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!mounted || !frame) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const retarget = (node: HTMLElement) => {
        /* quickTo keeps one tween alive. Snapping on show kills that tween,
           so the follower has to be built again or the frame stops moving. */
        const xTo = reduced
          ? (value: number) => gsap.set(node, { x: value })
          : gsap.quickTo(node, "x", { duration: 0.38, ease: "power3.out" });
        const yTo = reduced
          ? (value: number) => gsap.set(node, { y: value })
          : gsap.quickTo(node, "y", { duration: 0.38, ease: "power3.out" });

        followRef.current = { retarget, xTo, yTo };
      };

      retarget(frame);

      const follow = (event: PointerEvent) => {
        const api = followRef.current;
        if (!api || !activeIdRef.current || event.pointerType === "touch") return;
        api.xTo(event.clientX + OFFSET_X);
        api.yTo(event.clientY + OFFSET_Y);
      };

      window.addEventListener("pointermove", follow);
      return () => {
        followRef.current = null;
        window.removeEventListener("pointermove", follow);
      };
    },
    { dependencies: [mounted], scope: frameRef },
  );

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!mounted || !frame || !track) return;

    if (index < 0) {
      settledRef.current = false;
      return;
    }

    const height = slideHeight(track, frame);
    const y = -index * height;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    /* Coming back from hidden snaps, so the fade-in does not play a slide. */
    const wasHidden = !settledRef.current;

    if (wasHidden || reduced) {
      gsap.killTweensOf(frame, "x,y");
      gsap.set(track, { y });
      const point = originRef.current;
      if (point) {
        gsap.set(frame, {
          x: point.x + OFFSET_X,
          y: point.y + OFFSET_Y,
        });
        followRef.current?.retarget(frame);
      }
    } else {
      gsap.to(track, {
        y,
        duration: 0.52,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    settledRef.current = true;
  }, [index, mounted]);

  useEffect(() => {
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!mounted || !frame || !track) return;

    const observer = new ResizeObserver(() => {
      const current = indexRef.current;
      if (current < 0) return;
      gsap.set(track, { y: -current * slideHeight(track, frame) });
    });

    observer.observe(frame);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden="true"
      className="hs-caps-preview"
      data-on={index >= 0}
      ref={frameRef}
    >
      <div className="hs-caps-preview__clip">
        <div className="hs-caps-preview__track" ref={trackRef}>
          {items.map((item) => (
            <img
              alt=""
              className="hs-caps-preview__image"
              draggable={false}
              key={item.id}
              src={item.image}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
