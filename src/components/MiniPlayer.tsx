import { memo } from "react";
import { Pause, Play, SkipForward } from "lucide-react";
import type { Track } from "../types/player";
import { PixelButton } from "./ui/button";

type MiniPlayerProps = {
  track: Track;
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
};

export const MiniPlayer = memo(function MiniPlayer({
  track,
  isPlaying,
  isLoading,
  onTogglePlay,
  onNext,
}: MiniPlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pixel-border-green bg-bg px-3 py-2.5 sm:hidden hud-flicker">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`truncate text-[10px] ${isPlaying ? "active-track" : "text-neon-green"}`}
          >
            {track.title}
          </p>
          <p
            className={`truncate text-[9px] ${isPlaying ? "text-neon-magenta" : "text-neon-cyan"}`}
          >
            {track.artist}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <PixelButton onClick={onTogglePlay} size="sm">
            {isLoading ? (
              "..."
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </PixelButton>
          <PixelButton onClick={onNext} size="sm">
            <SkipForward className="h-4 w-4" />
          </PixelButton>
        </div>
      </div>
    </div>
  );
});
