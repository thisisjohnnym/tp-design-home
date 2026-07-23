"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { getPalette } from "@/content/themes";
import { useTheme } from "./ThemeProvider";

function ControlButton({
  label,
  pressed,
  onClick,
  children,
  variant = "default",
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "nav";
}) {
  const isNav = variant === "nav";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={`theme-control group transition-colors ${
        isNav ? "flex items-center" : "flex flex-col items-center gap-1"
      }`}
    >
      <span
        className={`flex items-center justify-center transition-colors ${
          isNav ? "size-5" : "h-7 w-7"
        } ${
          pressed
            ? "text-[var(--foreground)]"
            : isNav
              ? "text-[var(--foreground)]"
              : "text-[var(--control-inactive)]"
        }`}
      >
        {children}
      </span>
      {!isNav ? (
        <span
          className={`h-[2px] w-6 rounded-full transition-opacity ${
            pressed ? "bg-[var(--foreground)] opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
      ) : null}
    </button>
  );
}

export function ThemeControls({ variant = "default" }: { variant?: "default" | "nav" }) {
  const { paletteId, mode, setMode, shufflePalette, ready } = useTheme();

  if (!ready) return null;

  const palette = getPalette(paletteId);
  const isNav = variant === "nav";

  return (
    <div
      className={
        isNav
          ? "site-header-pill__theme"
          : "flex items-end gap-3 border-l border-[var(--rule)] pl-4"
      }
      role="group"
      aria-label="Theme controls"
    >
      {isNav ? <span className="site-header-pill__divider" aria-hidden /> : null}
      <ControlButton
        label="Light mode"
        pressed={mode === "light"}
        onClick={() => setMode("light")}
        variant={variant}
      >
        <Icon
          name="light_mode"
          size={isNav ? 20 : 22}
          weight={mode === "light" ? 600 : 400}
        />
      </ControlButton>
      <ControlButton
        label="Dark mode"
        pressed={mode === "dark"}
        onClick={() => setMode("dark")}
        variant={variant}
      >
        <Icon
          name="dark_mode"
          size={isNav ? 20 : 22}
          weight={mode === "dark" ? 600 : 400}
          fill={mode === "dark" ? 1 : 0}
        />
      </ControlButton>
      <button
        type="button"
        onClick={shufflePalette}
        aria-label={`Shuffle color palette. Current: ${palette.name}`}
        className={`theme-control group transition-colors ${
          isNav ? "flex items-center" : "flex flex-col items-center gap-1"
        }`}
      >
        <span
          className={`relative flex items-center justify-center ${
            isNav ? "size-5" : "h-7 w-7"
          }`}
        >
          {isNav ? (
            <Icon
              name="palette"
              size={20}
              weight={400}
              className="text-[var(--foreground)] transition-opacity group-hover:opacity-70"
            />
          ) : (
            <>
              <span
                className="absolute size-3.5 rounded-full border border-[var(--rule)] transition-colors"
                style={{ backgroundColor: palette.swatch }}
                aria-hidden
              />
              <Icon
                name="shuffle"
                size={20}
                weight={400}
                className="relative text-[var(--control-inactive)] transition-colors group-hover:text-[var(--foreground)]"
              />
            </>
          )}
        </span>
        {!isNav ? <span className="h-[2px] w-6 rounded-full opacity-0" aria-hidden /> : null}
      </button>
    </div>
  );
}
