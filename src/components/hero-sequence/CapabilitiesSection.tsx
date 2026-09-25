"use client";

import { useEffect, useRef, useState } from "react";
import { CapabilityPreview } from "./CapabilityPreview";
import { heroSequenceCapabilities } from "./content";
import "./capabilities-section.css";

/** Long enough to cross the gap between rows without the frame blinking off. */
const PREVIEW_LEAVE_MS = 160;

/**
 * A row counts as on screen once it is this far inside the viewport. Both edges
 * are inset so a row never toggles while it straddles the very edge.
 */
const ON_SCREEN_INSET = "-8% 0px -8% 0px";

export function CapabilitiesSection() {
  const listRef = useRef<HTMLDivElement>(null);
  /* Hover picks one row; the last hovered stays open when the pointer leaves. */
  const [hoveredId, setHoveredId] = useState<string>(
    heroSequenceCapabilities[0].id,
  );
  /* Touch has no hover, so a row opens while it is on screen instead. */
  const [scrollDriven, setScrollDriven] = useState(false);
  const [onScreenIds, setOnScreenIds] = useState<string[]>([]);
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
    const list = listRef.current;
    if (!scrollDriven || !list) return;

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
  }, [scrollDriven]);

  return (
    <section className="hs-caps" aria-labelledby="hs-caps-heading">
      <h2 className="hs-caps__heading" id="hs-caps-heading">
        Our Capabilities
      </h2>

      <div className="hs-caps__list" ref={listRef}>
        {heroSequenceCapabilities.map((capability) => {
          const open = scrollDriven
            ? onScreenIds.includes(capability.id)
            : hoveredId === capability.id;
          const panelId = `hs-caps-panel-${capability.id}`;

          return (
            <div
              className="hs-caps__row"
              data-capability={capability.id}
              data-open={open}
              key={capability.id}
              onPointerEnter={(event) => {
                if (scrollDriven || event.pointerType === "touch") return;
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
              <span className="hs-caps__number" aria-hidden="true">
                {capability.number}
              </span>

              <div className="hs-caps__body">
                <h3 className="hs-caps__title">
                  {scrollDriven ? (
                    /* Scrolling drives the panel, so there is nothing to press. */
                    capability.title
                  ) : (
                    <button
                      aria-controls={panelId}
                      aria-expanded={open}
                      className="hs-caps__trigger"
                      onClick={() => setHoveredId(capability.id)}
                      onFocus={() => setHoveredId(capability.id)}
                      type="button"
                    >
                      {capability.title}
                    </button>
                  )}
                </h3>

                <div
                  className="hs-caps__panel"
                  id={panelId}
                  inert={!open && !scrollDriven}
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
            </div>
          );
        })}
      </div>

      {scrollDriven ? null : (
        <CapabilityPreview
          activeId={previewId}
          items={heroSequenceCapabilities}
          origin={previewOrigin}
        />
      )}
    </section>
  );
}
