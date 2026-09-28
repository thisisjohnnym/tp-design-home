import { gsap } from "gsap";

export type CurtainTiming = {
  ease: string;
  stagger: number;
  appearDuration: number;
  expandDuration: number;
  shrinkDuration: number;
};

export type CurtainLineState = {
  scale: number;
  maskOpacity: number;
  contentOpacity: number;
  origin: "right center" | "left center";
};

/** Apply curtain CSS vars on a `.hs-curtain` root. */
export function setCurtainState(
  line: HTMLElement,
  state: CurtainLineState,
) {
  line.style.setProperty("--hs-curtain-wipe", state.scale.toFixed(4));
  line.style.setProperty(
    "--hs-curtain-mask-opacity",
    state.maskOpacity.toFixed(4),
  );
  line.style.setProperty(
    "--hs-curtain-content-opacity",
    state.contentOpacity.toFixed(4),
  );
  line.style.setProperty("--hs-curtain-origin", state.origin);
}

export function clearCurtainState(line: HTMLElement) {
  line.style.removeProperty("--hs-curtain-wipe");
  line.style.removeProperty("--hs-curtain-mask-opacity");
  line.style.removeProperty("--hs-curtain-content-opacity");
  line.style.removeProperty("--hs-curtain-origin");
}

function minScaleFor(line: HTMLElement) {
  const width = Math.max(line.getBoundingClientRect().width, 1);
  return Math.min(1, 1 / width);
}

type AppendOptions = {
  /**
   * When true (default), content stays opacity 0 until the shrink phase.
   * When false, content stays visible under the growing curtain (word swaps).
   */
  hideContent?: boolean;
};

/**
 * Append the 1px → expand → shrink curtain onto `tl` for one line.
 */
export function appendCurtainLine(
  tl: gsap.core.Timeline,
  line: HTMLElement,
  at: number,
  timing: CurtainTiming,
  options: AppendOptions = {},
) {
  const hideContent = options.hideContent !== false;
  const minScale = minScaleFor(line);
  const proxy = { scale: minScale, maskOpacity: 0 };
  const coveredContent = hideContent ? 0 : 1;

  setCurtainState(line, {
    scale: minScale,
    maskOpacity: 0,
    contentOpacity: coveredContent,
    origin: "right center",
  });

  tl.to(
    proxy,
    {
      maskOpacity: 1,
      duration: timing.appearDuration,
      ease: timing.ease,
      onUpdate: () =>
        setCurtainState(line, {
          scale: minScale,
          maskOpacity: proxy.maskOpacity,
          contentOpacity: coveredContent,
          origin: "right center",
        }),
    },
    at,
  );

  tl.to(
    proxy,
    {
      scale: 1,
      duration: timing.expandDuration,
      ease: timing.ease,
      onUpdate: () =>
        setCurtainState(line, {
          scale: proxy.scale,
          maskOpacity: 1,
          contentOpacity: coveredContent,
          origin: "right center",
        }),
    },
    at + timing.appearDuration,
  );

  const shrinkAt = at + timing.appearDuration + timing.expandDuration;

  tl.add(() => {
    proxy.scale = 1;
    setCurtainState(line, {
      scale: 1,
      maskOpacity: 1,
      contentOpacity: 1,
      origin: "left center",
    });
  }, shrinkAt);

  tl.to(
    proxy,
    {
      scale: 0,
      duration: timing.shrinkDuration,
      ease: timing.ease,
      onUpdate: () =>
        setCurtainState(line, {
          scale: proxy.scale,
          maskOpacity: 1,
          contentOpacity: 1,
          origin: "left center",
        }),
    },
    shrinkAt,
  );
}

/** One-shot staggered curtain for a list of `.hs-curtain` roots. */
export function createCurtainReveal(
  lines: HTMLElement[],
  timing: CurtainTiming,
  options: { reduceMotion?: boolean; paused?: boolean } = {},
) {
  if (lines.length === 0) return undefined;

  if (options.reduceMotion) {
    lines.forEach((line) =>
      setCurtainState(line, {
        scale: 0,
        maskOpacity: 0,
        contentOpacity: 1,
        origin: "right center",
      }),
    );
    return undefined;
  }

  const tl = gsap.timeline({ paused: options.paused ?? true });
  lines.forEach((line, index) => {
    appendCurtainLine(tl, line, index * timing.stagger, timing, {
      hideContent: true,
    });
  });
  return tl;
}

function appendCoverSwap(
  tl: gsap.core.Timeline,
  line: HTMLElement,
  content: HTMLElement,
  nextWord: string,
  timing: CurtainTiming & { holdDuration: number },
  onWordChange?: () => void,
) {
  const minScale = minScaleFor(line);
  const proxy = { scale: minScale, maskOpacity: 0 };

  tl.to({}, { duration: timing.holdDuration });

  tl.call(() => {
    proxy.scale = minScaleFor(line);
    proxy.maskOpacity = 0;
  });

  tl.to(proxy, {
    maskOpacity: 1,
    duration: timing.appearDuration,
    ease: timing.ease,
    onUpdate: () =>
      setCurtainState(line, {
        scale: minScaleFor(line),
        maskOpacity: proxy.maskOpacity,
        contentOpacity: 1,
        origin: "right center",
      }),
  });

  tl.to(proxy, {
    scale: 1,
    duration: timing.expandDuration,
    ease: timing.ease,
    onUpdate: () =>
      setCurtainState(line, {
        scale: proxy.scale,
        maskOpacity: 1,
        contentOpacity: 1,
        origin: "right center",
      }),
  });

  tl.call(() => {
    content.textContent = nextWord;
    proxy.scale = 1;
    setCurtainState(line, {
      scale: 1,
      maskOpacity: 1,
      contentOpacity: 1,
      origin: "left center",
    });
    onWordChange?.();
  });

  tl.to(proxy, {
    scale: 0,
    duration: timing.shrinkDuration,
    ease: timing.ease,
    onUpdate: () =>
      setCurtainState(line, {
        scale: proxy.scale,
        maskOpacity: 1,
        contentOpacity: 1,
        origin: "left center",
      }),
  });
}

/** Resting state: current word visible, no yellow mask. */
export function restCurtainWord(line: HTMLElement) {
  setCurtainState(line, {
    scale: 0,
    maskOpacity: 0,
    contentOpacity: 1,
    origin: "left center",
  });
}

/**
 * Curtain cycle that swaps `words` inside `.hs-curtain__content`.
 * Flat repeating timeline (no nested repeat:-1) so pause/restart stays reliable.
 */
export function createCurtainWordCycle(
  line: HTMLElement,
  words: readonly string[],
  timing: CurtainTiming & { holdDuration: number },
  options: { reduceMotion?: boolean; onWordChange?: () => void } = {},
) {
  const content = line.querySelector(".hs-curtain__content") as
    | HTMLElement
    | undefined;
  if (!content || words.length === 0) return undefined;

  if (options.reduceMotion) {
    content.textContent = words[0] ?? "";
    restCurtainWord(line);
    return undefined;
  }

  content.textContent = words[0] ?? "";
  /* Hidden until the intro reveal plays once. */
  setCurtainState(line, {
    scale: 0,
    maskOpacity: 0,
    contentOpacity: 0,
    origin: "right center",
  });

  const cycle = gsap.timeline({ paused: true, repeat: -1 });
  words.forEach((_, index) => {
    const nextWord = words[(index + 1) % words.length] ?? "";
    appendCoverSwap(
      cycle,
      line,
      content,
      nextWord,
      timing,
      options.onWordChange,
    );
  });

  return cycle;
}

/** One-shot curtain reveal of the current word, then hands off to `cycle`. */
export function playCurtainWordIntro(
  line: HTMLElement,
  timing: CurtainTiming,
  cycle: gsap.core.Timeline,
  onWordChange?: () => void,
) {
  const intro = gsap.timeline({
    onComplete: () => {
      restCurtainWord(line);
      onWordChange?.();
      cycle.restart(true);
    },
  });
  appendCurtainLine(intro, line, 0, timing, { hideContent: true });
  return intro;
}
