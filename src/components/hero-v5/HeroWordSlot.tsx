"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { HERO_V5_WORDS } from "@/content/heroV5";

type LetterBox = { left: number; width: number };

type SlotMetrics = {
  wordWidths: number[];
  letters: LetterBox[][];
};

type HeroWordSlotProps = {
  words: readonly string[];
  wordIndex: number;
};

function getCharAt(word: string, columnIndex: number) {
  return [...word][columnIndex] ?? "\u00a0";
}

function measureWordLetters(element: HTMLElement): LetterBox[] {
  const textNode = element.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return [];

  const chars = [...(textNode.textContent ?? "")];
  const bounds = element.getBoundingClientRect();
  let offset = 0;

  return chars.map((char) => {
    const range = document.createRange();
    range.setStart(textNode, offset);
    offset += char.length;
    range.setEnd(textNode, offset);
    const rect = range.getBoundingClientRect();

    return {
      left: rect.left - bounds.left,
      width: rect.width,
    };
  });
}

function measureSlot(root: HTMLElement, words: readonly string[]): SlotMetrics | null {
  const letters = words.map((_, index) => {
    const wordNode = root.querySelector<HTMLElement>(`[data-word-index="${index}"]`);
    return wordNode ? measureWordLetters(wordNode) : [];
  });

  const wordWidths = letters.map((boxes) =>
    boxes.length > 0 ? boxes[boxes.length - 1]!.left + boxes[boxes.length - 1]!.width : 0,
  );

  if (!wordWidths.some((width) => width > 0)) return null;

  return { wordWidths, letters };
}

export function HeroWordSlot({ words, wordIndex }: HeroWordSlotProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState<SlotMetrics | null>(null);
  const [ready, setReady] = useState(false);
  const measuredRef = useRef(false);

  useLayoutEffect(() => {
    const root = measureRef.current;
    if (!root) return;

    let cancelled = false;

    const captureMetrics = () => {
      if (cancelled || measuredRef.current) return;
      const next = measureSlot(root, words);
      if (!next) return;
      measuredRef.current = true;
      setMetrics(next);
    };

    if (document.fonts?.status === "loaded") {
      captureMetrics();
    } else {
      void document.fonts?.ready.then(captureMetrics);
    }

    const onResize = () => {
      if (!measuredRef.current) return;
      const next = measureSlot(root, words);
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

    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [metrics]);

  const activeIndex = Math.min(wordIndex, words.length - 1);
  const activeWord = words[activeIndex] ?? words[0]!;
  const activeLetters = metrics?.letters[activeIndex] ?? [];
  const activeWidth = metrics?.wordWidths[activeIndex] ?? 0;

  return (
    <span
      className="hero-v5__slot"
      data-ready={ready ? "true" : "false"}
      data-measured={metrics ? "true" : "false"}
      style={activeWidth ? { width: activeWidth } : undefined}
    >
      <span className="hero-v5__slot-lane" aria-hidden>
        {activeWord}
      </span>

      <span ref={measureRef} className="hero-v5__slot-measure" aria-hidden>
        {words.map((word, index) => (
          <span key={word} data-word-index={index} className="hero-v5__slot-measure-word">
            {word}
          </span>
        ))}
      </span>

      {metrics ? (
        <span className="hero-v5__slot-stage">
          <span className="hero-v5__slot-word" style={activeWidth ? { width: activeWidth } : undefined}>
            {activeLetters.map((letter, columnIndex) => (
              <span
                key={columnIndex}
                className="hero-v5__slot-col"
                style={
                  {
                    left: letter.left,
                    width: letter.width,
                    "--col-index": columnIndex,
                    "--slot-index": activeIndex,
                  } as CSSProperties
                }
              >
                <span className="hero-v5__slot-col-drum">
                  {words.map((word) => {
                    const char = getCharAt(word, columnIndex);
                    return (
                      <span
                        key={word}
                        className="hero-v5__slot-col-face"
                        data-empty={char === "\u00a0" ? "true" : "false"}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              </span>
            ))}
          </span>
        </span>
      ) : null}

      <span className="hero-v5__sr-only">{activeWord}</span>
    </span>
  );
}
