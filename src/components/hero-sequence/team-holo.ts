import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Glint = { x: number; y: number };

type Axis = {
  (value: number): void;
  tween?: gsap.core.Tween;
};

export type TeamHoloApi = {
  lean: (index: number, x: number, y: number) => void;
  destroy: () => void;
};

const restLight = 0;
const hoverLight = 1;
const tiltMax = 7;
const glareRestY = 50;
/* How far a full bottom tilt slides the painted card, as a share of its height.
   Face-up cards slide about twice as far as face-down ones under this perspective. */
const tiltSlide = { front: 0.031, back: 0.016 };
/* Stay on the current card this far past its box, so a lower card cannot steal
   the pointer and snap the tilt. */
const stickyPad = 36;

/**
 * Soft pointer light for the team cards.
 * GSAP slides the glare with transform, and only while the pointer is on a card.
 */
export function bindTeamHolo(
  section: HTMLElement,
  cards: HTMLElement[],
  reduceMotion: boolean,
): TeamHoloApi {
  if (reduceMotion || cards.length === 0) {
    return {
      lean(index: number, x: number, y: number) {
        const tilt = cards[index]?.querySelector(".hs-team__tilt");
        if (!tilt) return;
        gsap.set(tilt, { rotationX: x, rotationY: y });
      },
      destroy() {},
    };
  }

  const glares = cards.map(
    (card) => [...card.querySelectorAll(".hs-team__glare-spot")] as HTMLElement[],
  );
  const glareSize = cards.map(() => [] as Glint[]);
  const measure = (index: number) => {
    glareSize[index] = glares[index].map((node) => ({
      x: node.parentElement?.clientWidth || 1,
      y: node.parentElement?.clientHeight || 1,
    }));
  };
  cards.forEach((_, index) => measure(index));
  for (const node of glares.flat()) gsap.set(node, { force3D: true });

  const setGlareX = glares.map((nodes) => nodes.map((node) => gsap.quickSetter(node, "x", "px")));
  const setGlareY = glares.map((nodes) => nodes.map((node) => gsap.quickSetter(node, "y", "px")));

  const live = cards.map(() => ({
    glareX: 0,
    glareY: 0,
    light: restLight,
  }));

  const axes = cards.map((card, index) => {
    const current = live[index];
    const write = () => {
      const spots = glareSize[index];
      for (let layer = 0; layer < glares[index].length; layer += 1) {
        const box = spots[layer] ?? { x: 1, y: 1 };
        setGlareX[index][layer](current.glareX * box.x);
        setGlareY[index][layer](current.glareY * box.y);
      }
      card.style.setProperty("--hs-glare", current.light.toFixed(3));
    };
    const glide = {
      duration: 0.55,
      ease: "power3.out",
      onUpdate: write,
    };
    write();
    return {
      glareX: gsap.quickTo(current, "glareX", glide) as Axis,
      glareY: gsap.quickTo(current, "glareY", glide) as Axis,
      light: gsap.quickTo(current, "light", {
        duration: 0.35,
        ease: "power2.out",
        onUpdate: write,
      }) as Axis,
    };
  });

  const base = cards.map(() => ({ x: 0, y: 0 }));
  const hoverTilt = cards.map(() => ({ x: 0, y: 0 }));
  const tiltNodes = cards.map(
    (card) => card.querySelector(".hs-team__tilt") as HTMLElement | null,
  );
  const setTiltX = tiltNodes.map((node) =>
    node ? gsap.quickSetter(node, "rotationX", "deg") : () => {},
  );
  const setTiltY = tiltNodes.map((node) =>
    node ? gsap.quickSetter(node, "rotationY", "deg") : () => {},
  );
  const setTiltLift = tiltNodes.map((node) =>
    node ? gsap.quickSetter(node, "y", "px") : () => {},
  );
  const cardHeight = cards.map((card) => card.offsetHeight || 1);
  const flips = cards.map(
    (card) => card.querySelector(".hs-team__flip") as HTMLElement | null,
  );
  const writeTilt = (index: number) => {
    const hoverX = hoverTilt[index].x;
    let lift = 0;
    if (hoverX !== 0) {
      const facing = flips[index]?.getAttribute("data-face") === "back" ? -1 : 1;
      const slide = facing < 0 ? tiltSlide.back : tiltSlide.front;
      // Pointer-down tilts slide the face downward. Lift by that amount so the
      // bottom edge stays under the cursor instead of jumping past it.
      lift = (-hoverX / (tiltMax * facing)) * cardHeight[index] * slide;
    }
    setTiltX[index](base[index].x + hoverX);
    setTiltY[index](base[index].y + hoverTilt[index].y);
    setTiltLift[index](lift);
  };
  const tiltEase = { duration: 0.45, ease: "power3.out" };
  const tilts = tiltNodes.map((node, index) => {
    if (!node) {
      return { x: (() => {}) as Axis, y: (() => {}) as Axis };
    }
    gsap.set(node, { transformOrigin: "50% 50%", force3D: true, y: 0 });
    return {
      x: gsap.quickTo(hoverTilt[index], "x", {
        ...tiltEase,
        onUpdate: () => writeTilt(index),
      }) as Axis,
      y: gsap.quickTo(hoverTilt[index], "y", {
        ...tiltEase,
        onUpdate: () => writeTilt(index),
      }) as Axis,
    };
  });

  let hovered = -1;
  let listening = false;

  const release = () => {
    if (hovered < 0) return;
    const index = hovered;
    hovered = -1;
    axes[index].glareX(0);
    axes[index].glareY(0);
    axes[index].light(restLight);
    tilts[index].x(0);
    tilts[index].y(0);
  };

  const depthOf = (index: number) =>
    Number.parseFloat(cards[index].style.zIndex) || 0;

  const cardUnder = (clientX: number, clientY: number) => {
    let best = -1;
    let bestZ = -Infinity;
    for (let index = 0; index < cards.length; index += 1) {
      const rect = cards[index].getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        continue;
      }
      const depth = depthOf(index);
      if (depth >= bestZ) {
        bestZ = depth;
        best = index;
      }
    }
    return best;
  };

  const nearCard = (
    card: HTMLElement,
    clientX: number,
    clientY: number,
    pad: number,
  ) => {
    const rect = card.getBoundingClientRect();
    return (
      clientX >= rect.left - pad &&
      clientX <= rect.right + pad &&
      clientY >= rect.top - pad &&
      clientY <= rect.bottom + pad
    );
  };

  const onMove = (event: PointerEvent) => {
    if (!listening || event.pointerType !== "mouse") return;
    const direct = cardUnder(event.clientX, event.clientY);
    let index = direct;
    if (
      hovered >= 0 &&
      direct !== hovered &&
      nearCard(cards[hovered], event.clientX, event.clientY, stickyPad) &&
      depthOf(hovered) >= (direct >= 0 ? depthOf(direct) : -Infinity)
    ) {
      index = hovered;
    }
    if (index !== hovered) release();
    if (index < 0) return;
    hovered = index;
    const rect = cards[index].getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;
    cardHeight[index] = height;
    const pointerX = gsap.utils.clamp(
      0,
      100,
      ((event.clientX - rect.left) / width) * 100,
    );
    const pointerY = gsap.utils.clamp(
      0,
      100,
      ((event.clientY - rect.top) / height) * 100,
    );
    axes[index].glareX((pointerX - 50) / 100);
    axes[index].glareY((pointerY - glareRestY) / 100);
    axes[index].light(hoverLight);
    const fromCenterX = (pointerX - 50) / 50;
    const fromCenterY = (pointerY - 50) / 50;
    const facing = flips[index]?.getAttribute("data-face") === "back" ? -1 : 1;
    tilts[index].y(-fromCenterX * tiltMax * facing);
    tilts[index].x(fromCenterY * tiltMax * facing);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  const onResize = () => {
    cards.forEach((_, index) => measure(index));
  };
  window.addEventListener("resize", onResize);

  const gate = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      listening = self.isActive;
      if (!listening) release();
    },
  });
  listening = gate.isActive;

  return {
    lean(index: number, x: number, y: number) {
      base[index].x = x;
      base[index].y = y;
      writeTilt(index);
    },
    destroy() {
      gate.kill();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      for (const axis of axes) {
        axis.glareX.tween?.kill();
        axis.glareY.tween?.kill();
        axis.light.tween?.kill();
      }
      for (const tilt of tilts) {
        tilt.x.tween?.kill();
        tilt.y.tween?.kill();
      }
    },
  };
}
