/**
 * Disable rubber-band / glow overscroll when the document hits scroll extremes.
 *
 * - CSS `overscroll-behavior: none` (via `no-overscroll` on `<html>`) covers Chrome,
 *   Firefox, Edge, and Safari 16+ on macOS.
 * - Touch `preventDefault` at scroll extremes covers legacy iOS Safari document bounce.
 */

export const NO_OVERSCROLL_HTML_CLASS = "no-overscroll";

export type DisableOverscrollOptions = {
  /** Element that receives the CSS hook (default: `document.documentElement`). */
  root?: HTMLElement;
  /**
   * Block touch rubber-band at document extremes when CSS is ignored (default: true).
   * Nested `overflow: auto` regions are left alone.
   */
  touchFallback?: boolean;
};

function isVerticalScrollContainer(style: CSSStyleDeclaration): boolean {
  const { overflowY, overflow } = style;
  return (
    overflowY === "auto" ||
    overflowY === "scroll" ||
    overflowY === "overlay" ||
    overflow === "auto" ||
    overflow === "scroll"
  );
}

/**
 * Whether `element` can absorb vertical touch drag in direction `deltaY`
 * (positive = finger moved down, content shifts toward top).
 */
export function elementCanScrollY(element: HTMLElement, deltaY: number): boolean {
  const style = getComputedStyle(element);
  if (!isVerticalScrollContainer(style)) return false;
  return canElementScrollY(
    element.scrollTop,
    element.clientHeight,
    element.scrollHeight,
    deltaY,
  );
}

/** Nearest scrollable ancestor that can absorb this drag before the document bounces. */
export function findScrollableAncestor(
  start: EventTarget | null,
  deltaY: number,
  stopAt: HTMLElement,
): HTMLElement | null {
  let node = start instanceof Element ? start : null;
  while (node && node !== stopAt) {
    if (node instanceof HTMLElement && elementCanScrollY(node, deltaY)) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

export function getDocumentScrollExtents(): { scrollTop: number; maxScroll: number } {
  const scrollingElement = document.scrollingElement ?? document.documentElement;
  return {
    scrollTop: window.scrollY,
    maxScroll: Math.max(0, scrollingElement.scrollHeight - window.innerHeight),
  };
}

/** Pure boundary check — unit-tested without a DOM. */
export function wouldViewportOverscroll(
  scrollTop: number,
  maxScroll: number,
  deltaY: number,
): boolean {
  if (deltaY === 0) return false;
  if (deltaY > 0 && scrollTop <= 0) return true;
  if (deltaY < 0 && scrollTop >= maxScroll - 1) return true;
  return false;
}

/** True when a vertical touch drag would rubber-band the document. */
export function wouldDocumentOverscroll(deltaY: number): boolean {
  const { scrollTop, maxScroll } = getDocumentScrollExtents();
  return wouldViewportOverscroll(scrollTop, maxScroll, deltaY);
}

/** Pure scroll-sink check — unit-tested without layout. */
export function canElementScrollY(
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  deltaY: number,
): boolean {
  if (scrollHeight <= clientHeight + 1) return false;
  if (deltaY > 0) return scrollTop > 0;
  return scrollTop + clientHeight < scrollHeight - 1;
}

function attachTouchOverscrollGuard(root: HTMLElement): () => void {
  let lastTouchY = 0;

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    lastTouchY = event.touches[0].clientY;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1 || !event.cancelable) return;

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - lastTouchY;
    lastTouchY = currentY;
    if (deltaY === 0) return;

    if (findScrollableAncestor(event.target, deltaY, root)) return;
    if (wouldDocumentOverscroll(deltaY)) {
      event.preventDefault();
    }
  };

  document.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
  document.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });

  return () => {
    document.removeEventListener("touchstart", onTouchStart, true);
    document.removeEventListener("touchmove", onTouchMove, true);
  };
}

/** Apply the CSS hook and optional touch guard; returns cleanup. */
export function attachDisableOverscroll(options: DisableOverscrollOptions = {}): () => void {
  const root = options.root ?? document.documentElement;
  const touchFallback = options.touchFallback !== false;

  root.classList.add(NO_OVERSCROLL_HTML_CLASS);
  const detachTouch = touchFallback ? attachTouchOverscrollGuard(root) : () => {};

  return () => {
    detachTouch();
    root.classList.remove(NO_OVERSCROLL_HTML_CLASS);
  };
}

/** Root-layout singleton — pairs with `no-overscroll` on `<html>` from SSR. */
export function initDisableOverscroll(): () => void {
  if (typeof document === "undefined") return () => {};
  document.documentElement.classList.add(NO_OVERSCROLL_HTML_CLASS);
  return attachTouchOverscrollGuard(document.documentElement);
}
