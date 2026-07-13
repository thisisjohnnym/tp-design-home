"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import {
  howWeDoItSteps,
  type HowWeDoItArrow as HowWeDoItArrowConfig,
} from "@/content/howWeDoIt";

type HowWeDoItArrowProps = {
  arrow: HowWeDoItArrowConfig;
};

export function HowWeDoItArrow({ arrow }: HowWeDoItArrowProps) {
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const triggerStep = howWeDoItSteps.find((s) => s.id === arrow.triggerStepId);

  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start 0.92", "start 0.5"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const clipRight = useTransform(progress, [0, 1], ["100%", "0%"]);
  const clipPath = useMotionTemplate`inset(0 ${clipRight} 0 0)`;
  const opacity = useTransform(progress, [0, 0.06, 1], [0, 1, 1]);

  if (!triggerStep) return null;

  const arrowStyle = {
    top: `${arrow.top}%`,
    left: `${arrow.left}%`,
    width: `${arrow.width}%`,
    height: `${arrow.height}%`,
    rotate: arrow.rotate !== undefined ? `${arrow.rotate}deg` : undefined,
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="how-we-do-it__arrow-trigger"
        style={{
          top: `${triggerStep.titlePos.top}%`,
          left: `${triggerStep.titlePos.left}%`,
        }}
        aria-hidden
      />
      {reduceMotion ? (
        <div className="how-we-do-it__arrow-part" style={arrowStyle} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={arrow.src} alt="" className="how-we-do-it__arrow-image" />
        </div>
      ) : (
        <motion.div
          className="how-we-do-it__arrow-part"
          style={{ ...arrowStyle, opacity, clipPath }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={arrow.src} alt="" className="how-we-do-it__arrow-image" />
        </motion.div>
      )}
    </>
  );
}
