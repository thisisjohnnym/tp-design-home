import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bindTeamHolo } from "./team-holo";
import {
  teamAccentOrb,
  teamFanLayouts,
  teamFanPeek,
  teamFanStoryWidth,
  teamFanTiming,
  teamLeadOrb,
  teamQueueTilt,
  type FanPose,
  type TeamLayout,
} from "./team-fan-tuning";

export type { TeamLayout };

gsap.registerPlugin(ScrollTrigger);

const introEase = gsap.parseEase(teamFanTiming.introEase);

function samplePose(poses: readonly FanPose[], slot: number): FanPose {
  const max = poses.length - 1;
  const clamped = gsap.utils.clamp(0, max, slot);
  const index = Math.floor(clamped);
  const next = Math.min(index + 1, max);
  const amount = clamped - index;
  const from = poses[index];
  const to = poses[next];

  return {
    x: gsap.utils.interpolate(from.x, to.x, amount),
    y: gsap.utils.interpolate(from.y, to.y, amount),
    rotation: gsap.utils.interpolate(from.rotation, to.rotation, amount),
    z: gsap.utils.interpolate(from.z, to.z, amount),
  };
}

function mixPose(from: FanPose, to: FanPose, amount: number): FanPose {
  return {
    x: gsap.utils.interpolate(from.x, to.x, amount),
    y: gsap.utils.interpolate(from.y, to.y, amount),
    rotation: gsap.utils.interpolate(from.rotation, to.rotation, amount),
    z: gsap.utils.interpolate(from.z, to.z, amount),
  };
}

/**
 * Park on the current station, then ease into the next one.
 * Keeps a card sitting in the centre for most of its step.
 */
function linger(slot: number) {
  if (slot <= 0) return slot;

  const base = Math.floor(slot);
  const fraction = slot - base;

  if (fraction < teamFanTiming.hold) {
    return base + (fraction / teamFanTiming.hold) * 0.08;
  }

  const travel = (fraction - teamFanTiming.hold) / (1 - teamFanTiming.hold);
  const eased = travel * travel * (3 - 2 * travel);
  return base + 0.08 + eased * 0.92;
}

/**
 * Pitch and yaw for a card that has not landed in the centre yet.
 * The centre card stays straight so the name stays easy to read.
 * Left of centre faces inward, and the right side does the same.
 */

function queueLean(slot: number, center: number) {
  const delta = slot - center;
  const distance = Math.abs(delta);
  const towardCenter = gsap.utils.clamp(
    0,
    1,
    (teamQueueTilt.fadeOutAt - distance) /
      (teamQueueTilt.fadeOutAt - teamQueueTilt.fullBy),
  );
  const clearOfCenter = gsap.utils.clamp(
    0,
    1,
    (distance - teamQueueTilt.flatWithin) /
      (teamQueueTilt.settledBy - teamQueueTilt.flatWithin),
  );
  const tilt = towardCenter * clearOfCenter * teamQueueTilt.degrees;
  const side = delta < 0 ? -1 : 1;

  return {
    x: tilt * teamQueueTilt.pitch,
    y: side * tilt,
  };
}

/**
 * Backs on the lower left, flip to the front as the card arrives in the
 * centre, then stay face-up through the upper-right exit.
 */
function rotationYFor(slot: number, center: number) {
  const start = center - 0.42;
  const end = center - 0.08;
  const amount = gsap.utils.clamp(0, 1, (slot - start) / (end - start));
  const eased = amount * amount * (3 - 2 * amount);
  return 180 - eased * 180;
}

function slotForCard(
  progress: number,
  index: number,
  count: number,
  center: number,
) {
  const introFrom = center - index - 3;
  const parked = center - index;

  if (progress <= teamFanTiming.intro) {
    const amount = introEase(progress / teamFanTiming.intro);
    if (index === 0) return { intro: amount, slot: center };
    return {
      intro: null,
      slot: gsap.utils.interpolate(introFrom, parked, amount),
    };
  }

  const cycle = (progress - teamFanTiming.intro) / (1 - teamFanTiming.intro);
  const head = gsap.utils.interpolate(center, center + (count - 1), cycle);
  return { intro: null, slot: linger(head - index) };
}

/** Progress that parks a middle card in the centre — the settled fan. */
export function settledFanProgress(count: number) {
  const featured = Math.min(3, count - 1);
  const cycle = count <= 1 ? 0 : featured / (count - 1);
  return teamFanTiming.intro + (1 - teamFanTiming.intro) * cycle;
}

export function bindTeamFan(
  root: HTMLElement,
  options: { reduceMotion: boolean; layout: TeamLayout },
) {
  const select = gsap.utils.selector(root);
  const section = select(".hs-team")[0] as HTMLElement | undefined;
  const pin = select(".hs-team__pin")[0] as HTMLElement | undefined;
  const cards = select(".hs-team__card") as HTMLElement[];
  const flips = select(".hs-team__flip") as HTMLElement[];
  const lead = select(".hs-team__orb--lead")[0] as HTMLElement | undefined;
  const accent = select(".hs-team__orb--accent")[0] as HTMLElement | undefined;
  const title = select(".hs-team__title")[0] as HTMLElement | undefined;

  if (!section || !pin || cards.length === 0) {
    return () => {};
  }

  const { poses, center } = teamFanLayouts[options.layout];
  const count = cards.length;

  gsap.set(cards, {
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "50% 50%",
    force3D: true,
  });
  gsap.set(flips, { transformOrigin: "50% 50%", force3D: true });
  if (lead) {
    gsap.set(lead, {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "50% 50%",
      force3D: true,
    });
  }
  if (accent) {
    gsap.set(accent, {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "50% 50%",
      force3D: true,
    });
  }
  if (title) {
    gsap.set(title, { xPercent: -50, yPercent: -50, y: 0 });
  }

  const setLeadX = lead ? gsap.quickSetter(lead, "x", "px") : null;
  const setLeadY = lead ? gsap.quickSetter(lead, "y", "px") : null;
  const setLeadScaleX = lead ? gsap.quickSetter(lead, "scaleX") : null;
  const setLeadScaleY = lead ? gsap.quickSetter(lead, "scaleY") : null;
  const setAccentX = accent ? gsap.quickSetter(accent, "x", "px") : null;
  const setAccentY = accent ? gsap.quickSetter(accent, "y", "px") : null;
  const setAccentScaleX = accent ? gsap.quickSetter(accent, "scaleX") : null;
  const setAccentScaleY = accent ? gsap.quickSetter(accent, "scaleY") : null;

  const setX = cards.map((card) => gsap.quickSetter(card, "x", "px"));
  const setY = cards.map((card) => gsap.quickSetter(card, "y", "px"));
  const setZ = cards.map((card) => gsap.quickSetter(card, "z", "px"));
  const setRotation = cards.map((card) =>
    gsap.quickSetter(card, "rotation", "deg"),
  );
  // "scale" is not a single property here. It expands to scaleX,scaleY and
  // the browser rejects that name. Set each axis on its own.
  const setScaleX = cards.map((card) => gsap.quickSetter(card, "scaleX"));
  const setScaleY = cards.map((card) => gsap.quickSetter(card, "scaleY"));
  const setZIndex = cards.map((card) => gsap.quickSetter(card, "zIndex"));
  const setFlip = flips.map((flip) => gsap.quickSetter(flip, "rotationY", "deg"));
  const holo = bindTeamHolo(section, cards, options.reduceMotion);

  const place = (progress: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let index = 0; index < count; index += 1) {
      const placed = slotForCard(progress, index, count, center);
      const pose =
        placed.intro === null
          ? samplePose(poses, placed.slot)
          : mixPose(teamFanPeek, samplePose(poses, center), placed.intro);
      const visual =
        placed.intro === null
          ? placed.slot
          : gsap.utils.interpolate(center - 0.85, center, placed.intro);
      const rotationY =
        placed.intro === null
          ? rotationYFor(placed.slot, center)
          : gsap.utils.interpolate(180, 0, placed.intro);
      const depth = Math.min(Math.abs(visual - center) / 3.2, 1);
      const scale = 1 - depth * 0.05;

      setX[index](pose.x * width);
      setY[index](pose.y * height);
      setZ[index](pose.z);
      setRotation[index](pose.rotation);
      setScaleX[index](scale);
      setScaleY[index](scale);
      const depthIndex = Math.round(200 - Math.abs(visual - center) * 24);
      if (cards[index].style.zIndex !== String(depthIndex)) {
        setZIndex[index](depthIndex);
      }
      setFlip[index](rotationY);
      const face = rotationY > 90 ? "back" : "front";
      if (flips[index].dataset.face !== face) flips[index].dataset.face = face;
      const lean = queueLean(
        placed.intro === null ? placed.slot : visual,
        center,
      );
      const facing = rotationY > 90 ? -1 : 1;
      holo.lean(index, lean.x * facing, lean.y);
    }

    const introT =
      progress <= teamFanTiming.intro
        ? introEase(progress / teamFanTiming.intro)
        : 1;
    const accentT =
      progress <= teamAccentOrb.travel
        ? introEase(progress / teamAccentOrb.travel)
        : 1;
    const unit = width / teamFanStoryWidth;

    if (setLeadX && setLeadY && setLeadScaleX && setLeadScaleY) {
      const leadScale = unit * teamLeadOrb.scale;
      setLeadX(teamLeadOrb.x * width);
      setLeadY(
        gsap.utils.interpolate(teamLeadOrb.yRest, teamLeadOrb.yFan, introT) *
          height,
      );
      setLeadScaleX(leadScale);
      setLeadScaleY(leadScale);
    }

    if (setAccentX && setAccentY && setAccentScaleX && setAccentScaleY) {
      const accentScale = unit * teamAccentOrb.scale;
      setAccentX(teamAccentOrb.x * width);
      setAccentY(
        gsap.utils.interpolate(
          teamAccentOrb.yRest,
          teamAccentOrb.yFan,
          accentT,
        ) * height,
      );
      setAccentScaleX(accentScale);
      setAccentScaleY(accentScale);
    }
  };

  const progress = options.reduceMotion ? settledFanProgress(count) : 0;
  place(progress);
  gsap.set(cards, { autoAlpha: 1 });

  const orbGroups = select(".hs-team__orbs") as HTMLElement[];

  /* Stay hidden through the hero. Fade in only as this scene takes the screen,
     then leave with the cards because the orbs live inside the scrolling pin. */
  const reveal =
    options.reduceMotion || orbGroups.length === 0
      ? undefined
      : gsap.fromTo(
          orbGroups,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top 55%",
              end: "top top",
              scrub: true,
            },
          },
        );

  if (options.reduceMotion && orbGroups.length > 0) {
    gsap.set(orbGroups, { autoAlpha: 1 });
  }

  const trigger = options.reduceMotion
    ? undefined
    : ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        endTrigger: section,
        end: "bottom bottom",
        pin,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => place(self.progress),
      });

  /* Lag the headline behind scroll until the scene locks. A fixed offset,
     scrubbed, so it does not read layout or whip ahead of the hero break. */
  const titleTween =
    options.reduceMotion || !title
      ? undefined
      : gsap.fromTo(
          title,
          { xPercent: -50, yPercent: -50, y: () => window.innerHeight * 0.42 },
          {
            xPercent: -50,
            yPercent: -50,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

  ScrollTrigger.refresh();

  return () => {
    trigger?.kill();
    reveal?.scrollTrigger?.kill();
    reveal?.kill();
    titleTween?.scrollTrigger?.kill();
    titleTween?.kill();
    holo.destroy();
    if (title) gsap.set(title, { xPercent: -50, yPercent: -50, y: 0 });
  };
}
