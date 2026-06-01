import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Full-width container with 20px horizontal margin (desktop grid spec).
 * Matches Figma grid: 24 cols · margin 20px · gutter 8px · stretch/auto.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={cn("w-full px-[20px]", className)}>
      {children}
    </Tag>
  );
}
