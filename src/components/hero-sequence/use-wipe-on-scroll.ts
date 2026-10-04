import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createRowWipe } from "./wipe-reveal";
import { curtainReveal } from "./team-scene-tuning";

/** Headlines that have already wiped in stay revealed if their markup remounts. */
const played = new Set<string>();

/**
 * Wipes in every `[data-wipe]` headline under `scope` the first time it scrolls
 * into view. Headlines stay plain visible text until armed, so nothing is lost
 * if this never runs. Re-arms when `key` changes (markup may have remounted).
 */
export function useWipeOnScroll(
  scope: RefObject<HTMLElement | null>,
  key: string,
) {
  useEffect(() => {
    const container = scope.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: (() => void)[] = [];

    container.querySelectorAll<HTMLElement>("[data-wipe]").forEach((root) => {
      const id = root.dataset.wipe ?? "";
      if (played.has(id)) return;

      const wipe = createRowWipe(root, { timing: curtainReveal });
      wipe.arm();
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top 88%",
        once: true,
        onEnter: () => {
          played.add(id);
          wipe.play();
        },
      });

      cleanups.push(() => {
        trigger.kill();
        wipe.kill();
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [scope, key]);
}
