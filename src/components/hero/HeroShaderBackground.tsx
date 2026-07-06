"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Shader, Smoke, SolidColor } from "shaders/react";
import { INTRO_EASE, introTransitions } from "@/content/heroIntro";
import { SMOKESCREEN_1 } from "@/content/heroShader";

type HeroShaderBackgroundProps = {
  visible: boolean;
  exiting?: boolean;
};

export function HeroShaderBackground({ visible, exiting = false }: HeroShaderBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!visible) {
    return null;
  }

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ backgroundColor: SMOKESCREEN_1.background }}
      />
    );
  }

  if (reduceMotion) {
    return (
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: exiting ? introTransitions.tapestryToBanner.duration : 0.7,
          ease: INTRO_EASE,
        }}
        style={{ backgroundColor: SMOKESCREEN_1.background }}
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: exiting ? introTransitions.tapestryToBanner.duration : 0.7,
        ease: INTRO_EASE,
      }}
    >
      <Shader className="size-full" colorSpace="srgb">
        <SolidColor color={SMOKESCREEN_1.background} />
        <Smoke {...SMOKESCREEN_1.smoke} />
      </Shader>
    </motion.div>
  );
}
