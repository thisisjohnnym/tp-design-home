import type { HTMLAttributes } from "react";

/**
 * Google Material Symbols.
 *
 * Backed by the variable fonts shipped in `material-symbols`. Every Material
 * Symbols name from https://fonts.google.com/icons works as the `name` prop.
 */
export type IconVariant = "outlined" | "rounded" | "sharp";

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  name: string;
  variant?: IconVariant;
  size?: number;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  fill?: 0 | 1;
  filled?: boolean;
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
