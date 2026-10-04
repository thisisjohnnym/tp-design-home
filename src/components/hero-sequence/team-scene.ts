import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clearCurtainState, createCurtainReveal } from "./curtain-reveal";
import {
  teamOrbArtScale,
  teamOrbLayouts,
  teamTitleReveal,
  type TeamLayout,
} from "./team-scene-tuning";

export type { TeamLayout };

gsap.registerPlugin(ScrollTrigger);

/**
 * The team section around the card ring: sphere art at rest, the one-shot
 * headline curtain, and hiding the scene while it is off screen. The ring
 * itself is React (team-ring/TeamRing.tsx) and runs its own loop.
 */
export function bindTeamScene(
  root: HTMLElement,
  options: { reduceMotion: boolean; layout: TeamLayout },
) {
  const select = gsap.utils.selector(root);
  const section = select(".hs-team")[0] as HTMLElement | undefined;
  const lead = select(".hs-team__orb--lead")[0] as HTMLElement | undefined;
  const accent = select(".hs-team__orb--accent")[0] as HTMLElement | undefined;
  const titleLines = select(".hs-team__title-line") as HTMLElement[];
  const orbGroups = select(".hs-team__orbs") as HTMLElement[];

  if (!section) return () => {};

  const sectionEl = section;
  const { reduceMotion, layout } = options;
  const orbArt = teamOrbArtScale[layout];
  const orbs = teamOrbLayouts[layout];
  sectionEl.style.setProperty("--hs-orb-art", String(orbArt));

  function placeOrbs() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const unit = width / orbs.storyWidth;
    for (const [node, rest] of [
      [lead, orbs.lead],
      [accent, orbs.accent],
    ] as const) {
      if (!node) continue;
      gsap.set(node, {
        xPercent: -50,
        yPercent: -50,
        x: rest.x * width,
        y: rest.y * height,
        scale: (unit * rest.scale) / orbArt,
        force3D: true,
      });
    }
  }

  placeOrbs();
  gsap.set(orbGroups, { autoAlpha: 1 });
  window.addEventListener("resize", placeOrbs);

  const titleRevealTl = createCurtainReveal(titleLines, teamTitleReveal, {
    reduceMotion,
    paused: true,
  });
  const titleTrigger = ScrollTrigger.create({
    trigger: sectionEl,
    start: teamTitleReveal.start,
    once: true,
    onEnter: () => titleRevealTl?.play(0),
  });

  /* Off screen, hide the scene so its sphere layers drop their backing stores. */
  const onstage = ScrollTrigger.create({
    trigger: sectionEl,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) =>
      sectionEl.toggleAttribute("data-offstage", !self.isActive),
  });
  sectionEl.toggleAttribute("data-offstage", !onstage.isActive);

  return () => {
    onstage.kill();
    titleTrigger.kill();
    titleRevealTl?.kill();
    window.removeEventListener("resize", placeOrbs);
    sectionEl.removeAttribute("data-offstage");
    sectionEl.style.removeProperty("--hs-orb-art");
    titleLines.forEach(clearCurtainState);
  };
}
