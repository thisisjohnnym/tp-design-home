"use client";

import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { designStatementChars } from "@/content/statement";

export function StatementRevealSection() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const [revealedCount, setRevealedCount] = useState(
    reduceMotion ? designStatementChars.length : 0,
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const revealIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, designStatementChars.length],
  );

  useMotionValueEvent(revealIndex, "change", (latest) => {
    if (reduceMotion) return;
    setRevealedCount(Math.min(designStatementChars.length, Math.floor(latest)));
  });

  return (
    <section
      ref={containerRef}
      aria-label="Design statement"
      className={reduceMotion ? "statement-reveal statement-reveal--static" : "statement-reveal"}
    >
      <div className="statement-reveal__sticky">
        <p className="statement-reveal__sentence px-[var(--grid-margin)]">
          {designStatementChars.map((char, index) => {
            const bright = index < revealedCount;

            if (char === "i" && bright) {
              return (
                <span
                  key={index}
                  className="statement-reveal__char statement-reveal__char-i statement-reveal__char-i--bright"
                >
                  <span className="statement-reveal__char-i-dot" aria-hidden />
                  <span className="statement-reveal__char-i-stem">ı</span>
                </span>
              );
            }

            return (
              <span
                key={index}
                className={
                  bright
                    ? "statement-reveal__char statement-reveal__char--bright"
                    : "statement-reveal__char statement-reveal__char--dim"
                }
              >
                {char}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
