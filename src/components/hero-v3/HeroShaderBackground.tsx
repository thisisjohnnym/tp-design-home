"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Shader, Smoke, SolidColor } from "shaders/react";
import { HERO_V3_INTRO_EASE, heroV3IntroTransitions } from "@/content/heroIntroV3";
import { HERO_V3_SMOKESCREEN } from "@/content/heroShaderV3";

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
        style={{ backgroundColor: HERO_V3_SMOKESCREEN.background }}
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
          duration: exiting ? heroV3IntroTransitions.tapestryToBanner.duration : 0.7,
          ease: HERO_V3_INTRO_EASE,
        }}
        style={{ backgroundColor: HERO_V3_SMOKESCREEN.background }}
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
        duration: exiting ? heroV3IntroTransitions.tapestryToBanner.duration : 0.7,
        ease: HERO_V3_INTRO_EASE,
      }}
    >
      <Shader className="size-full" colorSpace="srgb">
        <SolidColor color={HERO_V3_SMOKESCREEN.background} />
        <Smoke {...HERO_V3_SMOKESCREEN.smoke} />
      </Shader>
    </motion.div>
  );
}
