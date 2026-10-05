import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hides the team scene while it is off screen. The carousel itself is React
 * (TeamCarousel.tsx) and runs its own loop.
 */
export function bindTeamScene(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>(".hs-team");
  if (!section) return () => {};

  const onstage = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => section.toggleAttribute("data-offstage", !self.isActive),
  });
  section.toggleAttribute("data-offstage", !onstage.isActive);

  return () => {
    onstage.kill();
    section.removeAttribute("data-offstage");
  };
}
