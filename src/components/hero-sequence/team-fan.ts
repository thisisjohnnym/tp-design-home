import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  clearCurtainState,
  createCurtainReveal,
} from "./curtain-reveal";
import { bindTeamHolo } from "./team-holo";
import {
  curtainReveal,
  teamEntrance,
  teamExit,
  teamFanLayouts,
  teamFanReadyOffset,
  teamFanTiming,
  teamOrbLayouts,
  teamOrbMomentum,
  teamQueueTilt,
  teamTitleReveal,
  type FanPose,
  type TeamLayout,
} from "./team-fan-tuning";

export type { TeamLayout };

gsap.registerPlugin(ScrollTrigger);

const introEase = gsap.parseEase(teamFanTiming.introEase);
const accentPanEase = gsap.parseEase(teamOrbMomentum.accentPanEase);
const exitEase = gsap.parseEase(teamExit.ease);
const fadeEase = gsap.parseEase(teamExit.fadeEase);

/** Frame 1 → 2 → 3 of the exit storyboard, with frame 2 at `orbitAt`. */
function throughFrames(values: readonly number[], amount: number) {
  const split = teamExit.orbitAt;
  return amount <= split
    ? gsap.utils.interpolate(values[0], values[1], amount / split)
    : gsap.utils.interpolate(
        values[1],
        values[2],
        (amount - split) / (1 - split),
      );
}

/** Scale through the frames in log space so the zoom reads as a steady push. */
function zoomThroughFrames(values: readonly number[], amount: number) {
  return Math.exp(throughFrames(values.map(Math.log), amount));
}

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
  const titleLines = select(".hs-team__title-line") as HTMLElement[];
  const progress = select(".hs-team__progress")[0] as HTMLElement | undefined;
  /* The next section is hidden while the spheres are still orbiting so it
     never shows through the gaps. It appears once the accent covers the view. */
  const nextSection = section?.nextElementSibling as HTMLElement | null;

  if (!section || !pin || cards.length === 0) {
    return () => {};
  }

  const sectionEl = section;
  const pinEl = pin;
  const { poses, center } = teamFanLayouts[options.layout];
  const readyOffset = teamFanReadyOffset[options.layout];
  const orbs = teamOrbLayouts[options.layout];
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

  const accentArt = accent?.querySelector<HTMLElement>(".hs-sphere--accent");

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
  let titleRevealStarted = false;
  let pinAlpha = 1;
  let pinCovered = false;
  let progressRevealStarted = false;
  const titleRevealTl = createCurtainReveal(titleLines, teamTitleReveal, {
    reduceMotion: options.reduceMotion,
    paused: true,
  });
  const progressRevealTl = progress
    ? createCurtainReveal([progress], curtainReveal, {
        reduceMotion: options.reduceMotion,
        paused: true,
      })
    : undefined;

  function place() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pan = introEase(gsap.utils.clamp(0, 1, arrive));
    /* Fan uses the pin up to exitAt; the rest is the orbit → zoom → fade. */
    const exitAt = teamEntrance.exitAt;
    const cycleFan = Math.min(1, fan / exitAt);
    const leave =
      fan <= exitAt
        ? 0
        : gsap.utils.clamp(0, 1, (fan - exitAt) / (1 - exitAt));
    const orbit = exitEase(Math.min(1, leave / teamExit.fadeAt));
    const fade = fadeEase(
      gsap.utils.clamp(
        0,
        1,
        (leave - teamExit.fadeAt) / (teamExit.fadeEnd - teamExit.fadeAt),
      ),
    );

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
      setY[index](pose.y * height);
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

    const unit = width / orbs.storyWidth;

    if (setTitleY) {
      setTitleY(
        (1 - pan) * teamEntrance.titleFrom * height,
      );
    }

    if (
      titleRevealTl &&
      !titleRevealStarted &&
      arrive >= teamTitleReveal.playAt
    ) {
      titleRevealStarted = true;
      titleRevealTl.play(0);
    }

    if (setLeadX && setLeadScaleX && setLeadScaleY) {
      const leadScale = unit * zoomThroughFrames(orbs.lead.scale, orbit);
      const leadY =
        (gsap.utils.interpolate(orbs.lead.yRest, orbs.lead.yFan, pan) -
          cycleFan * teamOrbMomentum.fanDrift -
          Math.sin(orbit * Math.PI) * teamExit.lead.lift) *
        height;
      setLeadX(throughFrames(orbs.lead.x, orbit) * width);
      setLeadScaleX(leadScale);
      setLeadScaleY(leadScale);
      if (leadYTo) leadYTo(leadY);
      else setLeadY?.(leadY);
    }

    if (setAccentX && setAccentScaleX && setAccentScaleY) {
      const accentScale =
        unit * zoomThroughFrames(orbs.accent.scale, orbit);
      const accentY =
        (gsap.utils.interpolate(
          orbs.accent.yRest,
          orbs.accent.yFan,
          accentPanEase(pan),
        ) -
          cycleFan * teamOrbMomentum.fanDrift * 1.25) *
        height;
      setAccentX(throughFrames(orbs.accent.x, orbit) * width);
      setAccentScaleX(accentScale);
      setAccentScaleY(accentScale);
      if (accentYTo) accentYTo(accentY);
      else setAccentY?.(accentY);
    }

    /* Sit above the next section while exiting so the zoom covers it, then
       fade out to reveal it. autoAlpha frees the pointer once it's gone. */
    const exiting = leave > 0;
    const zIndex = exiting ? "4" : "";
    if (sectionEl.style.zIndex !== zIndex) sectionEl.style.zIndex = zIndex;
    sectionEl.toggleAttribute("data-exiting", exiting);
    /* Once the zoom fills the screen, hide the rest of the scene and fade
       only the sphere. Fading the whole pin made iOS Safari render the zoomed
       scene offscreen as one group, which ran it out of memory. */
    const covered = leave >= teamExit.fadeAt;
    if (covered !== pinCovered) {
      pinCovered = covered;
      sectionEl.toggleAttribute("data-covered", covered);
    }
    if (accentArt) {
      const opacity = covered ? String(1 - fade) : "";
      if (accentArt.style.opacity !== opacity) accentArt.style.opacity = opacity;
    }
    const alpha = fade >= 1 ? 0 : 1;
    if (alpha !== pinAlpha) {
      pinAlpha = alpha;
      gsap.set(pinEl, { autoAlpha: alpha });
    }
    if (nextSection) {
      const hidden = exiting && leave < teamExit.fadeAt ? "hidden" : "";
      if (nextSection.style.visibility !== hidden) {
        nextSection.style.visibility = hidden;
      }
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
      /* Show while cycling; curtain plays once the first time it turns on. */
      const on = cycleFan > cycleAt && leave <= 0 ? "true" : "false";
      if (progress.dataset.on !== on) progress.dataset.on = on;

      if (
        on === "true" &&
        !progressRevealStarted &&
        progressRevealTl
      ) {
        progressRevealStarted = true;
        progress.dataset.revealed = "true";
        progressRevealTl.play(0);
      } else if (
        on === "true" &&
        !progressRevealStarted &&
        options.reduceMotion
      ) {
        progressRevealStarted = true;
        progress.dataset.revealed = "true";
      }
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
        /* No anticipatePin: under ScrollSmoother it snaps the pin early,
           which reads as the section jumping ahead of the scroll. */
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

  /* Keep the fan's GPU layers out of memory until the section is on screen. */
  const onstage = ScrollTrigger.create({
    trigger: sectionEl,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) =>
      sectionEl.toggleAttribute("data-offstage", !self.isActive),
  });
  sectionEl.toggleAttribute("data-offstage", !onstage.isActive);

  ScrollTrigger.refresh();

  return () => {
    onstage.kill();
    sectionEl.removeAttribute("data-offstage");
    entrance?.kill();
    trigger?.kill();
    reveal?.scrollTrigger?.kill();
    reveal?.kill();
    titleRevealTl?.kill();
    progressRevealTl?.kill();
    holo.destroy();
    if (title) gsap.set(title, { xPercent: -50, yPercent: -50, y: 0 });
    gsap.set(pinEl, { clearProps: "opacity,visibility" });
    if (accentArt) accentArt.style.opacity = "";
    sectionEl.removeAttribute("data-covered");
    sectionEl.style.zIndex = "";
    sectionEl.removeAttribute("data-exiting");
    if (nextSection) nextSection.style.visibility = "";
    titleLines.forEach(clearCurtainState);
    if (progress) clearCurtainState(progress);
  };
}
