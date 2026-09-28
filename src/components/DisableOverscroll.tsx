"use client";

import { useEffect } from "react";
import { initDisableOverscroll } from "@/lib/overscroll/disableOverscroll";

/** Boots the Safari touch overscroll guard; CSS hook ships on `<html>` from SSR. */
export function DisableOverscroll() {
  useEffect(() => initDisableOverscroll(), []);
  return null;
}
