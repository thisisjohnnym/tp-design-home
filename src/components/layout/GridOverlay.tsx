"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "grid-overlay";

function getColumnCount() {
  return window.matchMedia("(min-width: 768px)").matches ? 24 : 12;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]'),
  );
}

function readInitialVisible() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("grid") === "1") return true;
  if (params.get("grid") === "0") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "on";
}

export function GridOverlay() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [columnCount, setColumnCount] = useState(24);

  useEffect(() => {
    setMounted(true);
    setVisible(readInitialVisible());
    setColumnCount(getColumnCount());

    const media = window.matchMedia("(min-width: 768px)");
    const onMediaChange = () => setColumnCount(getColumnCount());
    media.addEventListener("change", onMediaChange);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "g" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isEditableTarget(event.target)) return;

      event.preventDefault();
      setVisible((current) => {
        const next = !current;
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
        document.documentElement.dataset.gridOverlay = next ? "on" : "off";
        return next;
      });
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.gridOverlay = visible ? "on" : "off";
    window.localStorage.setItem(STORAGE_KEY, visible ? "on" : "off");
  }, [mounted, visible]);

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="grid-overlay-toggle"
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        Grid {visible ? "On" : "Off"}
        <span className="grid-overlay-toggle__hint">G</span>
      </button>

      {visible ? (
        <div className="grid-overlay" aria-hidden>
          <div
            className="grid-overlay__inner"
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columnCount }, (_, index) => (
              <div key={index} className="grid-overlay__column" />
            ))}
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  );
}
