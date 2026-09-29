/**
 * Crash triage: `?autoscroll` (or `?autoscroll=<seconds per leg>`) scrolls the
 * page to the bottom and back up in a loop, so a simulator or script can soak
 * the page with no touch input. Progress lands in `document.title`, e.g.
 * "[pass 3 · reloads 1] Tapestry Design". Reloads are counted in
 * sessionStorage, which survives Safari's silent reload after a tab crash.
 */
const RELOADS_KEY = "hs-autoscroll-reloads";

export function startAutoscroll(): () => void {
  const param = new URLSearchParams(window.location.search).get("autoscroll");
  if (param === null) return () => {};

  const legSeconds = Number(param) > 0 ? Number(param) : 20;
  const baseTitle = document.title;

  let reloads = 0;
  try {
    const seen = sessionStorage.getItem(RELOADS_KEY);
    reloads = seen === null ? 0 : Number(seen) + 1;
    sessionStorage.setItem(RELOADS_KEY, String(reloads));
  } catch {
    // Storage blocked: the pass count still works.
  }

  let passes = 0;
  let down = true;
  let legStart = performance.now();
  let frame = 0;

  const report = () => {
    document.title = `[pass ${passes} · reloads ${reloads}] ${baseTitle}`;
    console.info(`[autoscroll] pass ${passes}, reloads ${reloads}`);
  };
  report();

  const step = (now: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = Math.min(1, (now - legStart) / (legSeconds * 1000));
    window.scrollTo(0, (down ? amount : 1 - amount) * max);

    if (amount >= 1) {
      if (!down) {
        passes += 1;
        report();
      }
      down = !down;
      legStart = now;
    }
    frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(frame);
    document.title = baseTitle;
  };
}
