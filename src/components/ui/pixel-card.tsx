import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const PixelCard = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        "pixel-border border-neon-cyan bg-panel/95 shadow-pixel-cyan",
        className,
      )}
    />
  );
};
