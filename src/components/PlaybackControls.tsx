import { memo, useCallback } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  LoaderCircle,
} from "lucide-react";
import { playHoverClick } from "../lib/sfx";
import type { LoopMode } from "../types/player";
import { PixelButton } from "./ui/button";
import { PixelSlider } from "./ui/pixel-slider";

type PlaybackControlsProps = {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  shuffle: boolean;
  loop: LoopMode;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onVolume: (value: number) => void;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
};

export const PlaybackControls = memo(function PlaybackControls({
  isPlaying,
  isLoading,
  volume,
  shuffle,
  loop,
  onTogglePlay,
  onPrev,
  onNext,
  onVolume,
  onToggleShuffle,
  onToggleLoop,
}: PlaybackControlsProps) {
  const playSfx = useCallback(() => {
    playHoverClick();
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="flex items-center justify-center gap-2 sm:justify-start sm:gap-3">
          <PixelButton
            onMouseEnter={playSfx}
            onClick={onToggleShuffle}
            active={shuffle}
            className="min-w-12 sm:min-w-14"
          >
            <Shuffle className="h-4 w-4" />
          </PixelButton>
          <PixelButton
            onMouseEnter={playSfx}
            onClick={onPrev}
            className="min-w-12 sm:min-w-14"
          >
            <SkipBack className="h-4 w-4" />
          </PixelButton>
        </div>

        <div className="flex justify-center">
          <PixelButton
            onMouseEnter={playSfx}
            onClick={onTogglePlay}
            size="lg"
            className="min-w-24 sm:min-w-32"
          >
            {isLoading ? (
              <LoaderCircle className="mx-auto h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="mx-auto h-5 w-5" />
            ) : (
              <Play className="mx-auto h-5 w-5" />
            )}
          </PixelButton>
        </div>

        <div className="flex items-center justify-center gap-2 sm:justify-end sm:gap-3">
          <PixelButton
            onMouseEnter={playSfx}
            onClick={onNext}
            className="min-w-12 sm:min-w-14"
          >
            <SkipForward className="h-4 w-4" />
          </PixelButton>
          <PixelButton
            onMouseEnter={playSfx}
            onClick={onToggleLoop}
            active={loop !== "off"}
            className={
              loop === "one"
                ? "min-w-12 sm:min-w-14 text-neon-magenta"
                : "min-w-12 sm:min-w-14"
            }
          >
            <Repeat className="h-4 w-4" />
          </PixelButton>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-neon-cyan">
          VOLUME {Math.round(volume * 100)}%
        </p>
        <PixelSlider
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={onVolume}
        />
      </div>
    </div>
  );
});
