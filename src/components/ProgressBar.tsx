import { memo } from "react";
import { formatTime } from "../lib/format";
import { PixelSlider } from "./ui/pixel-slider";

type ProgressBarProps = {
  progress: number;
  duration: number;
  isPlaying?: boolean;
  onSeek: (time: number) => void;
};

export const ProgressBar = memo(function ProgressBar({
  progress,
  duration,
  isPlaying,
  onSeek,
}: ProgressBarProps) {
  return (
    <div className="space-y-3">
      <PixelSlider
        min={0}
        max={duration || 0}
        step={0.1}
        value={progress}
        onChange={onSeek}
        className={isPlaying ? "wave-progress" : ""}
      />
      <div className="flex justify-between text-xs text-neon-cyan">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
});
