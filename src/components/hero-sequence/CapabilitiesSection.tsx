"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CapabilityPreview } from "./CapabilityPreview";
import {
  heroSequenceCapabilities,
  heroSequenceCapabilitiesIntro,
} from "./content";
import "./capabilities-section.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Where the lead locks while the rows scroll past, as a share of viewport height. */
const INTRO_PIN_TOP = 0.18;

/** Long enough to cross the gap between rows without the frame blinking off. */
const PREVIEW_LEAVE_MS = 160;

/**
 * A row counts as on screen once it is this far inside the viewport. Both edges
 * are inset so a row never toggles while it straddles the very edge.
 */
const ON_SCREEN_INSET = "-8% 0px -8% 0px";

/* Phones (Paper 7WI-0) swap the accordion for a swipeable row of columns. */
const PHONE_QUERY = "(max-width: 699px)";

/* Phone carousel feel. */
const SETTLE_DURATION = 0.85;
/* Picks up the finger's speed and glides to a stop. */
const FLICK_EASE = "power3.out";
/* Arrow taps start from rest, so ease in as well as out. */
const ARROW_EASE = "power3.inOut";
/* How far ahead a flick is projected when choosing the column to land on. */
const FLICK_PROJECTION_MS = 220;
/* Movement before a press counts as a drag (keeps taps as taps). */
const DRAG_THRESHOLD = 6;

function TitleLines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, index) => (
    <span className="hs-caps__title-line" key={index}>
      {line}
    </span>
  ));
}

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  /* Hover picks one row; the last hovered stays open when the pointer leaves. */
  const [hoveredId, setHoveredId] = useState<string>(
    heroSequenceCapabilities[0].id,
  );
  /* Touch has no hover, so a row opens while it is on screen instead. */
  const [scrollDriven, setScrollDriven] = useState(false);
  const [onScreenIds, setOnScreenIds] = useState<string[]>([]);
  const [phone, setPhone] = useState(false);
  /* The column snapped to the start of the phone row. */
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewOrigin, setPreviewOrigin] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const clearPreviewLeave = () => {
    if (leaveTimer.current == null) return;
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  };

  useEffect(() => () => clearPreviewLeave(), []);

  useEffect(() => {
    if (!scrollDriven) return;
    clearPreviewLeave();
    setPreviewId(null);
  }, [scrollDriven]);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setScrollDriven(!hover.matches);

    sync();
    hover.addEventListener("change", sync);
    return () => hover.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const sync = () => setPhone(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* Phone carousel controls, set while the phone layout is mounted. */
  const carouselRef = useRef<{ go: (direction: number) => void } | null>(
    null,
  );

  /*
   * Phone carousel: a GSAP-driven loop instead of native scroll. Every column
   * is placed at `index * step + offset`, wrapped into [-step, (n - 1) * step),
   * so the column that leaves one edge re-enters at the other off screen and
   * the row never runs out. Drags follow the finger 1:1, then a flick settles
   * on the nearest column with an eased tween; the arrows use the same tween.
   */
  useEffect(() => {
    const list = listRef.current;
    if (!phone || !list) return;

    const rows = Array.from(
      list.querySelectorAll<HTMLElement>("[data-capability]"),
    );
    const count = rows.length;
    if (count === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const state = { offset: 0 };
    let step = 0;
    let wrapX = gsap.utils.wrap(0, 1);
    let lastIndex = -1;
    let settle: gsap.core.Tween | undefined;

    const measure = () => {
      const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
      step = rows[0].offsetWidth + gap;
      wrapX = gsap.utils.wrap(-step, (count - 1) * step);
    };

    const render = () => {
      if (step <= 0) return;
      rows.forEach((row, index) => {
        const x = wrapX(index * step + state.offset);
        /* Fade with distance so the dim reads continuously mid-drag. */
        const distance = Math.min(1, Math.abs(x) / step);
        gsap.set(row, { x, opacity: 1 - distance * 0.7 });
      });
      const index = gsap.utils.wrap(0, count, Math.round(-state.offset / step));
      if (index !== lastIndex) {
        lastIndex = index;
        setActiveIndex(index);
      }
    };

    const settleTo = (slot: number, ease: string) => {
      settle?.kill();
      settle = gsap.to(state, {
        offset: -slot * step,
        duration: reduceMotion ? 0 : SETTLE_DURATION,
        ease,
        onUpdate: render,
      });
    };

    /* The slot the row is resting on, or heading to mid-tween. */
    const targetSlot = () =>
      Math.round(
        -(settle?.isActive() ? (settle.vars.offset as number) : state.offset) /
          step,
      );

    carouselRef.current = {
      go: (direction) => settleTo(targetSlot() + direction, ARROW_EASE),
    };

    let pointerId: number | null = null;
    let startX = 0;
    let startOffset = 0;
    let dragging = false;
    let samples: { x: number; t: number }[] = [];

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || pointerId !== null) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startOffset = state.offset;
      dragging = false;
      samples = [{ x: event.clientX, t: event.timeStamp }];
      settle?.kill();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        list.setPointerCapture(event.pointerId);
        list.dataset.dragging = "true";
      }
      state.offset = startOffset + dx;
      samples.push({ x: event.clientX, t: event.timeStamp });
      if (samples.length > 6) samples.shift();
      render();
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      delete list.dataset.dragging;
      if (!dragging) return;
      dragging = false;

      const first = samples[0];
      const last = samples[samples.length - 1];
      const elapsed = Math.max(1, last.t - first.t);
      /* px per ms, only if the finger was still moving at release. */
      const velocity =
        event.timeStamp - last.t < 80 ? (last.x - first.x) / elapsed : 0;
      const projected = state.offset + velocity * FLICK_PROJECTION_MS;
      const base = Math.round(-state.offset / step);
      const slot = gsap.utils.clamp(
        base - 1,
        base + 1,
        Math.round(-projected / step),
      );
      settleTo(slot, FLICK_EASE);
    };

    /* Swallow the click that ends a drag so nothing inside fires. */
    const onClick = (event: MouseEvent) => {
      if (list.dataset.dragged === "true") {
        event.preventDefault();
        event.stopPropagation();
      }
      delete list.dataset.dragged;
    };
    const markDragged = () => {
      if (dragging) list.dataset.dragged = "true";
    };

    const resize = new ResizeObserver(() => {
      const slot = step > 0 ? Math.round(-state.offset / step) : 0;
      settle?.kill();
      measure();
      state.offset = -slot * step;
      render();
    });

    measure();
    render();
    resize.observe(list);
    list.addEventListener("pointerdown", onDown);
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerup", markDragged, true);
    list.addEventListener("pointerup", onUp);
    list.addEventListener("pointercancel", onUp);
    list.addEventListener("click", onClick, true);

    return () => {
      carouselRef.current = null;
      settle?.kill();
      resize.disconnect();
      list.removeEventListener("pointerdown", onDown);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerup", markDragged, true);
      list.removeEventListener("pointerup", onUp);
      list.removeEventListener("pointercancel", onUp);
      list.removeEventListener("click", onClick, true);
      delete list.dataset.dragging;
      gsap.set(rows, { clearProps: "x,opacity" });
    };
  }, [phone]);

  useEffect(() => {
    const list = listRef.current;
    if (!scrollDriven || phone || !list) return;

    const rows = Array.from(
      list.querySelectorAll<HTMLElement>("[data-capability]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        setOnScreenIds((current) => {
          const next = new Set(current);

          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.capability;
            if (!id) continue;
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
          }

          return rows
            .map((row) => row.dataset.capability!)
            .filter((id) => next.has(id));
        });
      },
      { rootMargin: ON_SCREEN_INSET },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [scrollDriven, phone]);

  /* ScrollSmoother transforms the page, so CSS sticky can't hold the lead;
     pin it until its foot meets the end of the list. Stacked layouts scroll it away. */
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 900px)", () => {
        const intro = sectionRef.current?.querySelector<HTMLElement>(
          ".hs-caps__intro",
        );
        if (!intro || !listRef.current) return;

        const pinTop = () => window.innerHeight * INTRO_PIN_TOP;

        ScrollTrigger.create({
          trigger: intro,
          start: () => `top ${pinTop()}px`,
          endTrigger: listRef.current,
          end: () => `bottom ${pinTop() + intro.offsetHeight}px`,
          pin: intro,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      className="hs-caps"
      aria-labelledby="hs-caps-heading"
      ref={sectionRef}
    >
      <div className="hs-caps__intro">
        <h2 className="hs-sr-only" id="hs-caps-heading">
          Capabilities
        </h2>
        <p className="hs-caps__lead">{heroSequenceCapabilitiesIntro}</p>
      </div>

      <div
        className="hs-caps__list"
        ref={listRef}
      >
        {heroSequenceCapabilities.map((capability, index) => {
          const open = phone
            ? activeIndex === index
            : scrollDriven
              ? onScreenIds.includes(capability.id)
              : hoveredId === capability.id;
          /* Phone columns show every service; arrows and swipes do the choosing. */
          const staticTitle = scrollDriven || phone;
          const panelId = `hs-caps-panel-${capability.id}`;

          return (
            <div
              className="hs-caps__row"
              data-capability={capability.id}
              data-open={open}
              key={capability.id}
              onPointerEnter={(event) => {
                if (staticTitle || event.pointerType === "touch") return;
                setHoveredId(capability.id);
                clearPreviewLeave();
                setPreviewId(capability.id);
                setPreviewOrigin({ x: event.clientX, y: event.clientY });
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "touch") return;
                clearPreviewLeave();
                leaveTimer.current = window.setTimeout(() => {
                  setPreviewId(null);
                }, PREVIEW_LEAVE_MS);
              }}
            >
              <div className="hs-caps__head">
                <span
                  className="hs-caps__number"
                  aria-hidden="true"
                  style={
                    {
                      "--hs-caps-line": capability.lineColor,
                      "--hs-caps-line-ink": capability.lineInk,
                    } as CSSProperties
                  }
                >
                  {capability.number}
                </span>
                <h3 className="hs-caps__title">
                  {staticTitle ? (
                    /* Scrolling drives the panel, so there is nothing to press. */
                    <TitleLines lines={capability.titleLines} />
                  ) : (
                    <button
                      aria-controls={panelId}
                      aria-expanded={open}
                      className="hs-caps__trigger"
                      onClick={() => setHoveredId(capability.id)}
                      onFocus={() => setHoveredId(capability.id)}
                      type="button"
                    >
                      <TitleLines lines={capability.titleLines} />
                    </button>
                  )}
                </h3>
              </div>

              <div
                className="hs-caps__panel"
                id={panelId}
                inert={!open && !staticTitle}
              >
                <div className="hs-caps__panel-inner">
                  <ul className="hs-caps__services">
                    {capability.services.map((service) => (
                      <li className="hs-caps__service" key={service}>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {phone ? (
        <div className="hs-caps__nav">
          <button
            aria-label="Previous capability"
            className="hs-caps__arrow"
            onClick={() => carouselRef.current?.go(-1)}
            type="button"
          >
            ←
          </button>
          <button
            aria-label="Next capability"
            className="hs-caps__arrow"
            onClick={() => carouselRef.current?.go(1)}
            type="button"
          >
            →
          </button>
        </div>
      ) : null}

      {scrollDriven || phone ? null : (
        <CapabilityPreview
          activeId={previewId}
          items={heroSequenceCapabilities}
          origin={previewOrigin}
        />
      )}
    </section>
  );
}
