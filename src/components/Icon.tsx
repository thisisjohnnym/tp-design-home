import type { HTMLAttributes } from "react";

/**
 * Google Material Symbols.
 *
 * Backed by the variable fonts shipped in `material-symbols`. Every Material
 * Symbols name from https://fonts.google.com/icons works as the `name` prop.
 *
 * The four Material Symbols design axes are exposed as props so you can
 * fine-tune icons without touching CSS:
 *  - `variant` Outlined (default), Rounded, or Sharp
 *  - `size`    px size (also drives the optical-size axis 20–48)
 *  - `weight`  100–700 stroke weight
 *  - `fill`    0 = outline, 1 = filled (or pass `filled` boolean)
 *  - `grade`   −50 to 200 fine weight grade
 */
export type IconVariant = "outlined" | "rounded" | "sharp";

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Material Symbols name, e.g. "home", "favorite", "arrow_forward". */
  name: string;
  /** Visual style. Defaults to outlined. */
  variant?: IconVariant;
  /** Pixel size. Defaults to 24. */
  size?: number;
  /** Stroke weight (100–700). Defaults to 400. */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** 0 = outline, 1 = filled. Defaults to 0. */
  fill?: 0 | 1;
  /** Convenience boolean equivalent to `fill={1}`. */
  filled?: boolean;
  /** Grade (−50 to 200). Defaults to 0. */
  grade?: -25 | 0 | 200;
}

const CLASS_BY_VARIANT: Record<IconVariant, string> = {
  outlined: "material-symbols-outlined",
  rounded: "material-symbols-rounded",
  sharp: "material-symbols-sharp",
};

export function Icon({
  name,
  variant = "outlined",
  size = 24,
  weight = 400,
  fill,
  filled,
  grade = 0,
  className = "",
  style,
  ...rest
}: IconProps) {
  const fillValue = fill ?? (filled ? 1 : 0);
  // Optical size pairs with pixel size; clamp to 20–48 like Material guidelines.
  const opsz = Math.min(48, Math.max(20, size));

  const fontVariationSettings = `'FILL' ${fillValue}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`;

  return (
    <span
      aria-hidden={rest["aria-label"] ? undefined : true}
      role={rest["aria-label"] ? "img" : undefined}
      className={`${CLASS_BY_VARIANT[variant]} select-none align-middle ${className}`}
      style={{
        fontSize: size,
        lineHeight: 1,
        fontVariationSettings,
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
}
