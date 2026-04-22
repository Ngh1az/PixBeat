import { memo, type CSSProperties } from "react";
import type { Track } from "../types/player";
import { PixelCard } from "./ui/pixel-card";
import { VisualizerBars } from "./VisualizerBars";

type NowPlayingPanelProps = {
  track: Track;
  isPlaying: boolean;
  isLoading: boolean;
};

export const NowPlayingPanel = memo(function NowPlayingPanel({
  track,
  isPlaying,
  isLoading,
}: NowPlayingPanelProps) {
  const discStateClass = isPlaying && !isLoading ? "vinyl-spin" : "vinyl-idle";
  const tonearmStateClass =
    isPlaying && !isLoading ? "tonearm-play" : "tonearm-rest";
  const simulatedBpm = track.bpm ?? 118;
  const spinDurationSeconds = Math.max(
    6.8,
    Math.min(8.2, 7.5 - (simulatedBpm - 118) * 0.01),
  );
  const discStyle = {
    "--vinyl-spin-duration": `${spinDurationSeconds.toFixed(2)}s`,
  } as CSSProperties;

  return (
    <PixelCard className="h-full w-full flex flex-col p-4 sm:p-6">
      <p className="blink mb-4 text-xs text-neon-magenta">NOW PLAYING</p>
      <div className="relative mb-5 pixel-border-green bg-black p-3 sm:p-4">
        <div className="turntable-shell">
          <div className="turntable-platter">
            <div className={`vinyl-disc ${discStateClass}`} style={discStyle}>
              <img
                src={track.cover}
                alt={`${track.title} cover`}
                className="vinyl-cover"
              />
              <span aria-hidden className="vinyl-hole" />
            </div>
          </div>
          <span aria-hidden className={`tonearm ${tonearmStateClass}`} />
          <span aria-hidden className="turntable-led" />
        </div>
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 grid place-items-center bg-black/75 text-sm text-neon-magenta">
            PAUSED
          </div>
        )}
      </div>
      <h2
        className={`mb-2 text-sm sm:text-base ${isPlaying ? "active-track title-beat" : "text-neon-green"}`}
      >
        {track.title}
      </h2>
      <p className="mb-5 text-[10px] sm:text-xs text-neon-cyan">
        {track.artist}
      </p>
      <VisualizerBars isPlaying={isPlaying} />
    </PixelCard>
  );
});
