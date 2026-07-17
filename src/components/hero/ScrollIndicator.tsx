"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";

type ScrollIndicatorProps = {
  targetId?: string;
  className?: string;
  visible?: boolean;
};

export function ScrollIndicator({
  targetId = "team",
  className = "",
  visible = true,
}: ScrollIndicatorProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={`editorial-scroll-cta group flex items-center gap-4 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      aria-label="Scroll to team section"
    >
      <span>Continue reading</span>
      <span className="editorial-scroll-cta__line" aria-hidden />
      <Icon
        name="arrow_downward"
        size={18}
        weight={300}
        className="transition-transform duration-300 motion-safe:group-hover:translate-y-0.5"
      />
    </motion.button>
  );
}
