import type { HeroCursorConfig } from "./heroCursors";
import { heroCursors } from "./heroCursors";

/** Experimental hero cursor layout — fork from `heroCursors` and adjust freely. */
export const heroCursorsV2: HeroCursorConfig[] = heroCursors.map((cursor) => ({
  ...cursor,
}));
