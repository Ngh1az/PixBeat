import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type PixelButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<PixelButtonProps["size"]>, string> = {
  sm: "h-10 px-3 text-[11px]",
  md: "h-12 px-4 text-[11px]",
  lg: "h-14 px-5 text-sm",
};

export const PixelButton = ({
  className,
  active,
  size = "md",
  children,
  ...props
}: PixelButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "pixel-border border-neon-green bg-panel text-neon-green shadow-pixel transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed",
        active && "border-neon-magenta text-neon-magenta shadow-pixel-magenta",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </button>
  );
};
