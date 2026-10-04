import { gsap } from "gsap";
import { heroSequenceFan } from "./content";

/**
 * Ease whose speed follows t^a · (1-t)^b: a soft start and a tail that dies
 * off smoothly rather than in a straight line. Built as a lookup of the
 * integrated curve, so it is cheap to call every frame.
 */
function betaEase(a: number, b: number, steps = 400) {
  const cumulative = [0];
  for (let i = 1; i <= steps; i += 1) {
    const x0 = (i - 1) / steps;
    const x1 = i / steps;
    const speed = (x: number) => x ** a * (1 - x) ** b;
    cumulative.push(cumulative[i - 1] + ((speed(x0) + speed(x1)) / 2) / steps);
  }
  const total = cumulative[steps];
  return (t: number) => {
    const position = Math.min(Math.max(t, 0), 1) * steps;
    const index = Math.min(Math.floor(position), steps - 1);
    const fraction = position - index;
    return (
      (cumulative[index] +
        (cumulative[index + 1] - cumulative[index]) * fraction) /
      total
    );
  };
}

const zoomEase = betaEase(heroSequenceFan.easeStart, heroSequenceFan.easeTail);

/** Resting camera tilt (Paper I8-0). */
const REST_TILT = { rotationX: -28, rotationZ: -20 } as const;

/**
 * Drives the hero fan. The loader camera starts so the lead slide fills the
 * viewport (same yellow as the loader) with the other slides opened like a book
 * behind it, then pulls back to the resting frame and closes the fan
 * while the fan spins up. Scale is exponential in progress so the pull-back
 * reads as constant-speed dolly rather than a late rush.
 */
export function bindHeroFan(root: HTMLElement, reduceMotion: boolean) {
  const fan = root.querySelector<HTMLElement>(".hs-fan");
  const loader = root.querySelector<HTMLElement>(".hs-loader");
  const stage = root.querySelector<HTMLElement>(".hs-fan__stage");
  const tilt = root.querySelector<HTMLElement>(".hs-fan__tilt");
  const spin = root.querySelector<HTMLElement>(".hs-fan__spin");
  const lead = root.querySelector<HTMLElement>(".hs-fan__card--lead");
  /* The loader's own drum, paused on the logo face. It is moved onto the lead
     slide at the reveal (no copy, no swap), so it zooms out with the fan. */
  const mark = root.querySelector<HTMLElement>(".hs-loader-mark");
  const markHome = mark?.parentElement ?? null;
  const markNext = mark?.nextSibling ?? null;

  if (!fan || !loader || !stage || !tilt || !spin || !lead || !mark) {
    return { rest() {}, prepare() {}, zoomOut: () => gsap.timeline(), kill() {} };
  }

  let spinTween: gsap.core.Tween | undefined;
  const createMotion = () =>
    gsap.to(spin, {
      rotationY: "+=360",
      duration: heroSequenceFan.spinSeconds,
      ease: "none",
      repeat: -1,
    });
  const ensureSpin = (timeScale: number) => {
    if (reduceMotion) return;
    spinTween ??= createMotion();
    spinTween.timeScale(timeScale);
  };

  /* The lead slide is zoomed until it covers the loader; the carried drum is
     shrunk by that same factor so it starts at its loader size. */
  const coverScale = (width: number, height: number) => {
    const loaderRect = loader.getBoundingClientRect();
    return (
      Math.max(loaderRect.width / width, loaderRect.height / height) * 1.01
    );
  };
  /* Sizes via layout (offset*) so tilt and zoom don't affect them. */
  let markScale = 1 / coverScale(lead.offsetWidth, lead.offsetHeight);
  /* Flat marks on the other yellow faces read this. */
  fan.style.setProperty("--fan-mark-scale", String(markScale));

  const adoptMark = () => {
    if (mark.parentElement === lead) return;
    lead.appendChild(mark);
    /* Inside the transformed slide, fixed positioning resolves against the
       slide, so top/left 50% and the -50% translate still centre it. */
    gsap.set(mark, { scale: markScale, z: 1 });
    mark.style.backfaceVisibility = "hidden";
  };

  let dx = 0;
  let dy = 0;
  let scale = 1;

  const apply = (p: number) => {
    gsap.set(stage, {
      x: dx * (1 - p),
      y: dy * (1 - p),
      scale: Math.pow(scale, 1 - p),
    });
    gsap.set(tilt, {
      rotationX: REST_TILT.rotationX * p,
      rotationZ: REST_TILT.rotationZ * p,
    });
  };

  return {
    /** Resting frame, no intro (reduced motion or scrolled load). */
    rest() {
      gsap.set(stage, { x: 0, y: 0, scale: 1 });
      gsap.set(tilt, { ...REST_TILT, rotationY: 0 });
      gsap.set(fan, { "--fan-open": 0 });
      adoptMark();
      ensureSpin(1);
    },

    /** Camera inside the lead slide, other slides hidden. */
    prepare() {
      gsap.set(stage, { x: 0, y: 0, scale: 1, transformOrigin: "0px 0px" });
      gsap.set(tilt, { rotationX: 0, rotationY: 0, rotationZ: 0 });
      gsap.set(spin, { rotationY: 0 });

      const stageRect = stage.getBoundingClientRect();
      const loaderRect = loader.getBoundingClientRect();
      const leadRect = lead.getBoundingClientRect();
      const cx = leadRect.left + leadRect.width / 2;
      const cy = leadRect.top + leadRect.height / 2;

      dx = loaderRect.left + loaderRect.width / 2 - cx;
      dy = loaderRect.top + loaderRect.height / 2 - cy;
      /* Cover, not fit: the lead is a flat colour, so scaling it until it
         overflows the screen on one axis crops it to the preloader's shape
         without the slide ever changing aspect ratio. */
      scale = coverScale(leadRect.width, leadRect.height);

      markScale = 1 / scale;
      fan.style.setProperty("--fan-mark-scale", String(markScale));

      gsap.set(stage, {
        transformOrigin: `${cx - stageRect.left}px ${cy - stageRect.top}px`,
      });
      gsap.set(fan, { "--fan-open": 1 });
      apply(0);
      ensureSpin(0);
    },

    zoomOut() {
      const zoom = heroSequenceFan.zoomDuration;
      const progress = { p: 0 };
      const tl = gsap.timeline();

      /* Hand the paused drum from the loader to the lead slide. */
      tl.call(adoptMark, [], 0);
      tl.to(progress, {
        p: 1,
        duration: zoom,
        ease: zoomEase,
        onUpdate: () => apply(progress.p),
      });
      /* Close the fan: the open-book slides swing round to their places. */
      tl.to(
        fan,
        { "--fan-open": 0, duration: zoom * 0.9, ease: zoomEase },
        zoom * 0.1,
      );
      if (spinTween) {
        tl.to(
          spinTween,
          { timeScale: 1, duration: zoom, ease: zoomEase },
          0,
        );
      }
      return tl;
    },

    kill() {
      spinTween?.kill();
      /* Give the node back to React so its unmount can remove it. */
      if (markHome && mark.parentElement !== markHome) {
        markHome.insertBefore(mark, markNext);
      }
    },
  };
}
