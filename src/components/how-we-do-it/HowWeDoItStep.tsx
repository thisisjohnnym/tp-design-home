"use client";

import { Reveal } from "@/components/Reveal";
import type { HowWeDoItStep as HowWeDoItStepConfig } from "@/content/howWeDoIt";

type HowWeDoItStepProps = {
  step: HowWeDoItStepConfig;
  variant?: "stage" | "stack";
};

function posStyle(rect: {
  top: number;
  left: number;
  width?: number;
  height?: number;
  rotate?: number;
}) {
  return {
    top: `${rect.top}%`,
    left: `${rect.left}%`,
    width: rect.width !== undefined ? `${rect.width}%` : undefined,
    height: rect.height !== undefined ? `${rect.height}%` : undefined,
    rotate: rect.rotate !== undefined ? `${rect.rotate}deg` : undefined,
  };
}

export function HowWeDoItStep({ step, variant = "stage" }: HowWeDoItStepProps) {
  if (variant === "stack") {
    return (
      <Reveal>
        <article
          id={`how-we-do-it-${step.id}`}
          className="how-we-do-it__step how-we-do-it__step--stack"
        >
          <div className="how-we-do-it__step-shape-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={step.shapeSrc} alt="" className="how-we-do-it__shape" />
          </div>
          <h3 className="how-we-do-it__step-title">{step.title}</h3>
          <p className="how-we-do-it__step-body">{step.description}</p>
        </article>
      </Reveal>
    );
  }

  return (
    <article className="how-we-do-it__step how-we-do-it__step--stage">
      <div
        className="how-we-do-it__step-shape"
        style={posStyle(step.shape)}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={step.shapeSrc} alt="" className="how-we-do-it__shape" />
      </div>
      <Reveal
        className="how-we-do-it__step-title-wrap"
        style={posStyle(step.titlePos)}
      >
        <h3 id={`how-we-do-it-${step.id}`} className="how-we-do-it__step-title">
          {step.title}
        </h3>
      </Reveal>
      <Reveal
        className="how-we-do-it__step-body-wrap"
        delay={0.05}
        style={posStyle(step.body)}
      >
        <p className="how-we-do-it__step-body">{step.description}</p>
      </Reveal>
    </article>
  );
}
