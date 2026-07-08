"use client";

import { useLayoutEffect, useRef, useState } from "react";

type HeroV5RollingWordProps = {
  words: readonly string[];
  wordIndex: number;
  onReady?: () => void;
};

const NBSP = "\u00A0";

type LetterBox = {
  left: number;
  width: number;
};

type WordMetrics = {
  wordWidths: number[];
  letters: LetterBox[][];
};

function graphemeAt(word: string, index: number): string {
  return [...word][index] ?? NBSP;
}

/** Measure each grapheme from a single text node so kerning is preserved. */
function measureWordLetters(el: HTMLElement): LetterBox[] {
  const textNode = el.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return [];

  const graphemes = [...(textNode.textContent ?? "")];
  const base = el.getBoundingClientRect();
  let utf16 = 0;

  return graphemes.map((grapheme) => {
    const range = document.createRange();
    range.setStart(textNode, utf16);
    utf16 += grapheme.length;
    range.setEnd(textNode, utf16);
    const rect = range.getBoundingClientRect();
    return {
      left: rect.left - base.left,
      width: rect.width,
    };
  });
}

function measureAll(root: HTMLElement, words: readonly string[]): WordMetrics | null {
  const letters = words.map((_, wi) => {
    const el = root.querySelector<HTMLElement>(`[data-word-index="${wi}"]`);
    return el ? measureWordLetters(el) : [];
  });

  const wordWidths = letters.map((boxes) =>
    boxes.length > 0 ? boxes[boxes.length - 1].left + boxes[boxes.length - 1].width : 0,
  );

  if (!wordWidths.some((width) => width > 0)) return null;

  return { wordWidths, letters };
}

/**
 * Per-letter vertical slot machine with Range-measured positions — letters sit
 * exactly where the browser would set them in the full word (natural kerning).
 * Slot width follows the active word so the headline centers on visible text.
 */
export function HeroV5RollingWord({ words, wordIndex, onReady }: HeroV5RollingWordProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const [metrics, setMetrics] = useState<WordMetrics | null>(null);
  const [motionReady, setMotionReady] = useState(false);
  const measuredRef = useRef(false);

  useLayoutEffect(() => {
    const root = measureRef.current;
    if (!root) return;

    let cancelled = false;

    const apply = () => {
      if (cancelled || measuredRef.current) return;
      const next = measureAll(root, words);
      if (!next) return;
      measuredRef.current = true;
      setMetrics(next);
    };

    if (document.fonts?.status === "loaded") {
      apply();
    } else {
      document.fonts?.ready.then(apply);
    }

    const onResize = () => {
      if (!measuredRef.current) return;
      const next = measureAll(root, words);
      if (next) setMetrics(next);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [words]);

  useLayoutEffect(() => {
    if (!metrics) return;
    onReadyRef.current?.();
    const id = requestAnimationFrame(() => setMotionReady(true));
    return () => cancelAnimationFrame(id);
  }, [metrics]);

  const safeIndex = Math.min(wordIndex, words.length - 1);
  const current = words[safeIndex] ?? words[0];
  const currentLetters = metrics?.letters[safeIndex] ?? [];
  const currentWidth = metrics?.wordWidths[safeIndex] ?? 0;

  return (
    <span
      className="hero-v5__slot"
      data-ready={motionReady ? "true" : "false"}
      data-measured={metrics ? "true" : "false"}
      style={currentWidth ? { width: currentWidth } : undefined}
    >
      <span className="hero-v5__slot-lane" aria-hidden>
        {current}
      </span>

      <span ref={measureRef} className="hero-v5__slot-measure" aria-hidden>
        {words.map((word, wi) => (
          <span key={word} data-word-index={wi} className="hero-v5__slot-measure-word">
            {word}
          </span>
        ))}
      </span>

      {metrics && (
        <span className="hero-v5__slot-stage">
          <span
            className="hero-v5__slot-word"
            style={currentWidth ? { width: currentWidth } : undefined}
          >
            {currentLetters.map((box, index) => (
              <span
                key={index}
                className="hero-v5__slot-col"
                style={
                  {
                    left: box.left,
                    width: box.width,
                    "--col-index": index,
                    "--slot-index": safeIndex,
                  } as React.CSSProperties
                }
              >
                <span className="hero-v5__slot-col-drum">
                  {words.map((word, wi) => (
                    <span
                      key={word}
                      className="hero-v5__slot-col-face"
                      data-empty={graphemeAt(word, index) === NBSP ? "true" : "false"}
                    >
                      {graphemeAt(word, index)}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        </span>
      )}

      <span className="hero-v5__sr-only">{current}</span>
    </span>
  );
}
