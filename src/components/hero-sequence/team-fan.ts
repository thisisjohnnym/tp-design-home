import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bindTeamHolo } from "./team-holo";
import {
  teamAccentOrb,
  teamEntrance,
  teamFanLayouts,
  teamFanReadyOffset,
  teamFanStoryWidth,
  teamFanTiming,
  teamLeadOrb,
  teamOrbMomentum,
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

/**
 * One continuous ease between stations. Soft arrival, soft departure —
 * no mid-step pause that felt like a second stop before the centre.
 */
function linger(slot: number) {
  if (slot <= 0) return slot;

  const base = Math.floor(slot);
  const fraction = slot - base;
  const strength = teamFanTiming.stationEase;
  const eased =
    fraction < 0.5
      ? Math.pow(2 * fraction, strength) / 2
      : 1 - Math.pow(2 * (1 - fraction), strength) / 2;

  return base + eased;
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
 * Face-down on the left, flip up as the card reaches centre, then stay
 * face-up through the upper-right exit. Sean waits on the left still backed.
 */
function rotationYFor(slot: number, center: number) {
  const start = center - 0.5;
  const end = center - 0.08;
  const amount = gsap.utils.clamp(0, 1, (slot - start) / (end - start));
  const eased = amount * amount * (3 - 2 * amount);
  return 180 - eased * 180;
}

/**
 * Assemble parks Sean (card 0) on the left of the arc as the section enters.
 * Cycling only starts after pin progress clears `cycleAt`.
 */
function slotForCard(
  arrive: number,
  fan: number,
  index: number,
  count: number,
  center: number,
  readyOffset: number,
) {
  const readyHead = center + readyOffset;
  const readySlot = readyHead - index;
  /* Start further down the entry arc so assemble reads as travel, not a pop. */
  const introFrom = readySlot - 2.4;

  /* Into view: scrub into the ready fan. Sean ends left, waiting to flip. */
  if (arrive < 1) {
    if (arrive <= teamFanTiming.cardAt) {
      return introFrom;
    }

    const local =
      (arrive - teamFanTiming.cardAt) / (1 - teamFanTiming.cardAt);
    return gsap.utils.interpolate(introFrom, readySlot, introEase(local));
  }

  /* Scene locked — hold until cycling is allowed. */
  if (fan <= teamFanTiming.cycleAt) {
    return readySlot;
  }

  const cycle =
    (fan - teamFanTiming.cycleAt) / (1 - teamFanTiming.cycleAt);
  const head = gsap.utils.interpolate(
    readyHead,
    center + (count - 1),
    cycle,
  );
  return linger(head - index);
}

/** Progress that parks the ready fan — centre card plus neighbours both sides. */
export function settledFanProgress(_count: number) {
  return 0;
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
  const progress = select(".hs-team__progress")[0] as HTMLElement | undefined;

  if (!section || !pin || cards.length === 0) {
    return () => {};
  }

  const { poses, center } = teamFanLayouts[options.layout];
  const readyOffset = teamFanReadyOffset[options.layout];
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
    gsap.set(title, {
      xPercent: -50,
      yPercent: -50,
      y: options.reduceMotion
        ? 0
        : window.innerHeight * teamEntrance.titleFrom,
    });
  }

  const setLeadX = lead ? gsap.quickSetter(lead, "x", "px") : null;
  const setLeadScaleX = lead ? gsap.quickSetter(lead, "scaleX") : null;
  const setLeadScaleY = lead ? gsap.quickSetter(lead, "scaleY") : null;
  const setAccentX = accent ? gsap.quickSetter(accent, "x", "px") : null;
  const setAccentScaleX = accent ? gsap.quickSetter(accent, "scaleX") : null;
  const setAccentScaleY = accent ? gsap.quickSetter(accent, "scaleY") : null;
  const setTitleY = title ? gsap.quickSetter(title, "y", "px") : null;
  /* Soft catch-up on Y so the spheres keep a little momentum after scroll. */
  const leadYTo =
    lead && !options.reduceMotion
      ? gsap.quickTo(lead, "y", {
          duration: teamOrbMomentum.lead,
          ease: "power3.out",
        })
      : null;
  const accentYTo =
    accent && !options.reduceMotion
      ? gsap.quickTo(accent, "y", {
          duration: teamOrbMomentum.accent,
          ease: "power3.out",
        })
      : null;
  const setLeadY = lead ? gsap.quickSetter(lead, "y", "px") : null;
  const setAccentY = accent ? gsap.quickSetter(accent, "y", "px") : null;

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

  let arrive = options.reduceMotion ? 1 : 0;
  let fan = options.reduceMotion ? settledFanProgress(count) : 0;

  function place() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pan = introEase(gsap.utils.clamp(0, 1, arrive));
    /* Fan uses the pin up to exitAt; the rest keeps the camera rising out. */
    const exitAt = teamEntrance.exitAt;
    const cycleFan = Math.min(1, fan / exitAt);
    const leave =
      fan <= exitAt ? 0 : introEase((fan - exitAt) / (1 - exitAt));

    for (let index = 0; index < count; index += 1) {
      const slot = slotForCard(
        arrive,
        cycleFan,
        index,
        count,
        center,
        readyOffset,
      );
      const pose = samplePose(poses, slot);
      const rotationY = rotationYFor(slot, center);
      const depth = Math.min(Math.abs(slot - center) / 3.2, 1);
      const scale = 1 - depth * 0.05;

      setX[index](pose.x * width);
      setY[index](
        pose.y * height - leave * teamEntrance.cardLeave * height,
      );
      setZ[index](pose.z);
      setRotation[index](pose.rotation);
      setScaleX[index](scale);
      setScaleY[index](scale);
      const depthIndex = Math.round(200 - Math.abs(slot - center) * 24);
      if (cards[index].style.zIndex !== String(depthIndex)) {
        setZIndex[index](depthIndex);
      }
      setFlip[index](rotationY);
      const face = rotationY > 90 ? "back" : "front";
      if (flips[index].dataset.face !== face) flips[index].dataset.face = face;
      const lean = queueLean(slot, center);
      const facing = rotationY > 90 ? -1 : 1;
      holo.lean(index, lean.x * facing, lean.y);
    }

    const unit = width / teamFanStoryWidth;

    if (setTitleY) {
      setTitleY(
        ((1 - pan) * teamEntrance.titleFrom -
          leave * teamEntrance.titleLeave) *
          height,
      );
    }

    if (setLeadX && setLeadScaleX && setLeadScaleY) {
      const leadScale = unit * teamLeadOrb.scale;
      const leadY =
        (gsap.utils.interpolate(teamLeadOrb.yRest, teamLeadOrb.yFan, pan) -
          cycleFan * teamOrbMomentum.fanDrift -
          leave * teamEntrance.leadLeave) *
        height;
      setLeadX(teamLeadOrb.x * width);
      setLeadScaleX(leadScale);
      setLeadScaleY(leadScale);
      if (leadYTo) leadYTo(leadY);
      else setLeadY?.(leadY);
    }

    if (setAccentX && setAccentScaleX && setAccentScaleY) {
      const accentScale = unit * teamAccentOrb.scale;
      const accentY =
        (gsap.utils.interpolate(
          teamAccentOrb.yRest,
          teamAccentOrb.yFan,
          pan,
        ) -
          cycleFan * teamOrbMomentum.fanDrift * 1.25 -
          leave * teamEntrance.accentLeave) *
        height;
      setAccentX(teamAccentOrb.x * width);
      setAccentScaleX(accentScale);
      setAccentScaleY(accentScale);
      if (accentYTo) accentYTo(accentY);
      else setAccentY?.(accentY);
    }

    if (progress) {
      const cycleAt = teamFanTiming.cycleAt;
      const amount =
        cycleFan <= cycleAt
          ? 0
          : gsap.utils.clamp(
              0,
              1,
              (cycleFan - cycleAt) / (1 - cycleAt),
            );
      progress.style.setProperty("--hs-team-progress", String(amount));
      /* Show once cycling starts; fade out when the exit pan begins. */
      const on = cycleFan > cycleAt && leave <= 0 ? "true" : "false";
      if (progress.dataset.on !== on) progress.dataset.on = on;
    }
  }

  place();
  gsap.set(cards, { autoAlpha: 1 });

  const orbGroups = select(".hs-team__orbs") as HTMLElement[];

  /* Fade in with the camera pan so the spheres are visible as the scene rises. */
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
              start: teamEntrance.start,
              end: "top top",
              scrub: true,
            },
          },
        );

  if (options.reduceMotion && orbGroups.length > 0) {
    gsap.set(orbGroups, { autoAlpha: 1 });
  }

  const entrance =
    options.reduceMotion
      ? undefined
      : ScrollTrigger.create({
          trigger: pin,
          start: teamEntrance.start,
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            arrive = self.progress;
            fan = 0;
            place();
          },
          onRefresh: (self) => {
            arrive = self.progress;
            if (self.progress < 1) fan = 0;
            place();
          },
        });

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
        onUpdate: (self) => {
          arrive = 1;
          fan = self.progress;
          place();
        },
        onRefresh: (self) => {
          if (self.progress > 0 || self.isActive) arrive = 1;
          fan = self.progress;
          place();
        },
      });

  ScrollTrigger.refresh();

  return () => {
    entrance?.kill();
    trigger?.kill();
    reveal?.scrollTrigger?.kill();
    reveal?.kill();
    holo.destroy();
    if (title) gsap.set(title, { xPercent: -50, yPercent: -50, y: 0 });
  };
}
