"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { heroV3 } from "@/content/heroV3";
import { HERO_V3_EASE, heroV3Motion } from "@/content/heroV3Motion";
import { HeroNav } from "./HeroNav";

export function HeroSectionV3() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Tapestry Design Team"
      className="hero-v3 relative w-full overflow-hidden bg-[#a07855]"
    >
      <div className="relative min-h-[100svh] w-full">
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src={heroV3.assets.heroBackground}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <motion.div
          className="absolute left-[var(--grid-margin)] top-8 z-20 md:top-10"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: heroV3Motion.logo.duration,
            ease: HERO_V3_EASE,
          }}
        >
          <Link href="/" className="relative block h-[27px] w-[120px]" aria-label="Tapestry home">
            <Image
              src={heroV3.assets.tapestryLogo}
              alt=""
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
        </motion.div>

        <motion.div
          className="absolute right-[var(--grid-margin)] top-8 z-20 md:top-[30px]"
          initial={
            reduceMotion ? false : { opacity: 0, x: 32, clipPath: "inset(0 100% 0 0 round 9999px)" }
          }
          animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0 round 9999px)" }}
          transition={{
            duration: heroV3Motion.nav.duration,
            ease: HERO_V3_EASE,
            delay: reduceMotion ? 0 : heroV3Motion.nav.delay,
          }}
        >
          <HeroNav />
        </motion.div>
      </div>
    </section>
  );
}
