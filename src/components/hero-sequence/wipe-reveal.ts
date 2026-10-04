import { gsap } from "gsap";
import type { CurtainTiming } from "./curtain-reveal";

type Row = {
  words: HTMLElement[];
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Group words into the visual rows the browser laid out. Rects are read in the
 * root's own coordinate space (any ancestor scale is divided out), so this
 * works for fitted headlines, wrapped paragraphs and `display: contents` lines.
 */
function measureRows(root: HTMLElement, words: HTMLElement[]): Row[] {
  const rootRect = root.getBoundingClientRect();
  const scale = root.offsetWidth > 0 ? rootRect.width / root.offsetWidth : 1;

  const items = words
    .map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        left: (rect.left - rootRect.left) / scale,
        top: (rect.top - rootRect.top) / scale,
        width: rect.width / scale,
        height: rect.height / scale,
      };
    })
    .filter((item) => item.width > 0 && item.height > 0)
    .sort((a, b) => a.top - b.top || a.left - b.left);

  const rows: (typeof items)[] = [];
  for (const item of items) {
    const row = rows[rows.length - 1];
    if (row && Math.abs(item.top - row[0].top) < item.height * 0.5) {
      row.push(item);
    } else {
      rows.push([item]);
    }
  }

  return rows.map((row) => {
    const left = Math.min(...row.map((i) => i.left));
    const right = Math.max(...row.map((i) => i.left + i.width));
    /* A word with padding bleed (the cycling verb) is taller than the line;
       the bar follows the shortest word, i.e. the real line box. */
    const line = row.reduce((a, b) => (b.height < a.height ? b : a));
    return {
      words: row.map((i) => i.el),
      left,
      top: line.top,
      width: right - left,
      height: line.height,
    };
  });
}

type WipeOptions = {
  timing: CurtainTiming;
  /** Words to wipe in; defaults to every `.hs-wipe__word` inside `root`. */
  words?: HTMLElement[];
  /** A row has just been covered and its words revealed. */
  onCover?: (words: HTMLElement[]) => void;
  onComplete?: () => void;
};

/**
 * Per-row yellow wipe for a block of text: a bar appears on each row, sweeps
 * across right to left covering it, the words switch on, and the bar retracts
 * left to right. Rows are staggered. `root` must be positioned.
 *
 * `arm()` hides the words; `play()` runs the wipe; `kill()` puts everything
 * back to plain visible text.
 */
export function createRowWipe(root: HTMLElement, options: WipeOptions) {
  const { timing } = options;
  const words =
    options.words ??
    Array.from(root.querySelectorAll<HTMLElement>(".hs-wipe__word"));
  const masks: HTMLElement[] = [];
  let timeline: gsap.core.Timeline | undefined;

  const removeMasks = () => {
    masks.forEach((mask) => mask.remove());
    masks.length = 0;
  };

  return {
    arm() {
      gsap.set(words, { autoAlpha: 0 });
    },

    play() {
      timeline?.kill();
      removeMasks();

      const rows = measureRows(root, words);
      if (rows.length === 0) {
        gsap.set(words, { autoAlpha: 1 });
        options.onComplete?.();
        return;
      }

      timeline = gsap.timeline({
        onComplete: () => {
          removeMasks();
          options.onComplete?.();
        },
      });

      rows.forEach((row, index) => {
        const mask = document.createElement("span");
        mask.className = "hs-wipe__mask";
        mask.setAttribute("aria-hidden", "true");
        mask.style.left = `${row.left}px`;
        mask.style.top = `${row.top}px`;
        mask.style.width = `${row.width}px`;
        mask.style.height = `${row.height}px`;
        root.appendChild(mask);
        masks.push(mask);

        gsap.set(mask, {
          scaleX: Math.min(1, 1 / Math.max(row.width, 1)),
          autoAlpha: 0,
          transformOrigin: "100% 50%",
        });

        const at = index * timing.stagger;
        const shrinkAt = at + timing.appearDuration + timing.expandDuration;

        timeline!
          .to(
            mask,
            { autoAlpha: 1, duration: timing.appearDuration, ease: timing.ease },
            at,
          )
          .to(
            mask,
            { scaleX: 1, duration: timing.expandDuration, ease: timing.ease },
            at + timing.appearDuration,
          )
          .call(
            () => {
              gsap.set(row.words, { autoAlpha: 1 });
              gsap.set(mask, { transformOrigin: "0% 50%" });
              options.onCover?.(row.words);
            },
            [],
            shrinkAt,
          )
          .to(
            mask,
            { scaleX: 0, duration: timing.shrinkDuration, ease: timing.ease },
            shrinkAt,
          );
      });
    },

    kill() {
      timeline?.kill();
      removeMasks();
      gsap.set(words, { clearProps: "opacity,visibility" });
    },
  };
}
