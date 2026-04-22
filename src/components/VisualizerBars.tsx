import { memo } from "react";
import { cn } from "../lib/utils";

type VisualizerBarsProps = {
  isPlaying: boolean;
};

const barHeights = ["h-3", "h-8", "h-5", "h-10", "h-6", "h-9", "h-4", "h-7"];

export const VisualizerBars = memo(function VisualizerBars({
  isPlaying,
}: VisualizerBarsProps) {
  return (
    <div className="pixel-border border-neon-cyan bg-bg p-2">
      <p className="mb-2 text-[10px] text-neon-cyan">AUDIO LEVEL</p>
      <div className="relative flex h-16 items-end justify-center gap-1 border-2 border-neon-cyan bg-black px-3 pb-2 pt-1">
        <div className="absolute bottom-[6px] left-3 right-3 h-[2px] bg-neon-cyan" />
        {barHeights.concat([...barHeights].reverse()).map((height, index) => (
          <div
            key={`${height}-${index}`}
            className={cn(
              "equalizer-bar w-[6px]",
              index % 2 === 0 ? "bg-neon-cyan" : "bg-neon-green",
              height,
              isPlaying ? "equalizer-on" : "equalizer-off",
            )}
            style={{ animationDelay: `${index * 70}ms` }}
          />
        ))}
      </div>
    </div>
  );
});
