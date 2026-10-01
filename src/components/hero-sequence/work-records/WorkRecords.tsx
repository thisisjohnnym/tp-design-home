"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroSequenceWorks } from "../content";
import type { RecordsMotionState } from "./RecordScene";
import {
  arrivalIndex,
  recordsLayouts,
  recordsMotion,
  recordsQueries,
  type RecordsLayout,
} from "./tuning";
import "./work-records.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* three.js only loads in the browser, and only in this chunk. */
const RecordScene = dynamic(
  () => import("./RecordScene").then((mod) => mod.RecordScene),
  { ssr: false },
);

const works = heroSequenceWorks;
const last = works.length - 1;
const startAt = arrivalIndex(works.length);
const { arrivalDrop, liftShare } = recordsMotion;

/* Where the wheel and the lowered centre line stand at `progress` through the
   pin: the line lifts to the middle first, the wheel keeps turning to the end. */
function poseAt(progress: number) {
  const lift = Math.min(1, progress / liftShare);
  return {
    target: startAt + progress * (last - startAt),
    drop: arrivalDrop * (1 - lift * lift * (3 - 2 * lift)),
  };
}

function layoutForViewport(): RecordsLayout {
  if (window.matchMedia(recordsQueries.phone).matches) return "phone";
  if (window.matchMedia(recordsQueries.tablet).matches) return "tablet";
  return "desktop";
}

/**
 * Record browser (Paper 9L3-0 → 9UQ-0 → 9RA-0): the work as a wheel of slabs,
 * pinned while the stack lifts from its arrival pose and the wheel turns. Click a slab to open it flat to the screen;
 * scrolling, Esc, or a click outside puts it back. The scene is a canvas, so
 * the screen-reader list below carries the same works as buttons.
 */
export function WorkRecords() {
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const motion = useRef<RecordsMotionState>({
    ...poseAt(0),
    intro: 0,
  });
  const kick = useRef<() => void>(() => {});
  const labels = useRef<(HTMLElement | null)[]>([]);
  const title = useRef<HTMLHeadingElement>(null);

  const [layout, setLayout] = useState<RecordsLayout>("desktop");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const config = recordsLayouts[layout];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setLayout(layoutForViewport());
      setReducedMotion(reduced.matches);
    };
    sync();
    const queries = [
      reduced,
      window.matchMedia(recordsQueries.phone),
      window.matchMedia(recordsQueries.tablet),
    ];
    queries.forEach((q) => q.addEventListener("change", sync));
    return () => queries.forEach((q) => q.removeEventListener("change", sync));
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);

  const show = useCallback((index: number) => setOpenIndex(index), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${Math.round(recordsMotion.pinScreens * window.innerHeight)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          Object.assign(motion.current, poseAt(self.progress));
          kick.current();
        },
      });
      triggerRef.current = trigger;

      /* Until the section reaches the top, scroll unfurls the fan. */
      const intro = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "top top",
        onUpdate: (self) => {
          motion.current.intro = 1 - Math.pow(1 - self.progress, 2);
          kick.current();
        },
      });
      motion.current.intro = 1 - Math.pow(1 - intro.progress, 2);
      Object.assign(motion.current, poseAt(trigger.progress));

      return () => {
        trigger.kill();
        intro.kill();
        triggerRef.current = null;
      };
    },
    { scope: rootRef },
  );

  /* Scrolling by hand lets go of an open slab. */
  useEffect(() => {
    if (openIndex === null) return;
    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });
    return () => {
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
    };
  }, [openIndex, close]);

  /* Esc lets go of an open slab. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <section
      id="works"
      className="hs-records"
      ref={rootRef}
      aria-labelledby="hs-records-heading"
      data-open={openIndex !== null ? "" : undefined}
      style={
        {
          "--hs-records-offset": config.panelOffsetX,
          "--hs-records-panel": config.panelSize,
        } as React.CSSProperties
      }
    >
      <h2 className="hs-records__title" id="hs-records-heading" ref={title}>
        Our Work
      </h2>

      <div className="hs-records__stage">
        <RecordScene
          works={works}
          config={config}
          motion={motion}
          openIndex={openIndex}
          reducedMotion={reducedMotion}
          kick={kick}
          labels={labels}
          title={title}
          onSelect={show}
          onMiss={close}
        />
      </div>

      <ul className="hs-records__labels" aria-hidden="true">
        {works.map((work, index) => (
          <li
            className="hs-records__label"
            key={work.id}
            ref={(el) => {
              labels.current[index] = el;
            }}
          >
            <span className="hs-records__leader" />
            <span className="hs-records__text">
              <span className="hs-records__name">{work.title}</span>
              <span className="hs-records__meta">
                <span>{work.tags.join(" · ")}</span>
                <span>{work.year}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Sits over the opened slab's top-right corner; the slab is drawn in the scene. */}
      <div className="hs-records__panel">
        {openIndex !== null && (
          <button
            type="button"
            className="hs-records__close"
            aria-label="Close"
            onClick={close}
          >
            X
          </button>
        )}
      </div>

      <ul className="hs-sr-only">
        {works.map((work, index) => (
          <li key={work.id}>
            <button type="button" onClick={() => show(index)}>
              {work.title} — {work.tags.join(", ")}, {work.year}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
