import { memo } from "react";
import { cn } from "../../lib/utils";

type PixelSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export const PixelSlider = memo(function PixelSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className,
}: PixelSliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className={cn(
        "pixel-slider h-4 w-full cursor-pointer appearance-none bg-transparent",
        className,
      )}
    />
  );
});
