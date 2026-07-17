"use client";

import { useEffect, useState } from "react";

type TypewriterTextProps = {
  text: string;
  /** Milliseconds between each character */
  speed?: number;
  /** Delay before typing starts */
  startDelay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
};

export function TypewriterText({
  text,
  speed = 45,
  startDelay = 400,
  className = "",
  showCursor = true,
  onComplete,
}: TypewriterTextProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started || visibleCount >= text.length) return;

    const timer = window.setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, speed);

    return () => window.clearTimeout(timer);
  }, [started, visibleCount, text.length, speed]);

  useEffect(() => {
    if (visibleCount === text.length && started && !complete) {
      setComplete(true);
      onComplete?.();
    }
  }, [visibleCount, text.length, started, complete, onComplete]);

  const visibleText = text.slice(0, visibleCount);

  return (
    <span className={className}>
      {visibleText}
      {showCursor && (
        <span
          className={`animate-blink ml-0.5 inline-block w-[0.08em] max-w-[4px] min-w-[2px] align-baseline`}
          style={{ height: "0.9em" }}
          aria-hidden
        />
      )}
    </span>
  );
}
