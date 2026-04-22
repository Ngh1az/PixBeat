import { memo, useMemo } from "react";
import type { Track } from "../types/player";
import { cn } from "../lib/utils";
import { PixelCard } from "./ui/pixel-card";

type PlaylistPanelProps = {
  tracks: Track[];
  currentTrackIndex: number;
  durationLabels: Record<string, string>;
  onPlayIndex: (index: number) => void;
};

export const PlaylistPanel = memo(function PlaylistPanel({
  tracks,
  currentTrackIndex,
  durationLabels,
  onPlayIndex,
}: PlaylistPanelProps) {
  const totalTracks = useMemo(() => tracks.length, [tracks.length]);

  return (
    <PixelCard className="flex h-full flex-col overflow-hidden p-3 sm:p-5">
      <div className="sticky top-0 z-10 -mx-1 mb-3 border-b-2 border-neon-cyan bg-panel px-1 pb-3 pt-1">
        <p className="text-xs text-neon-green">PLAYLIST [{totalTracks}]</p>
      </div>
      <ul className="pixel-scrollbar flex-1 overflow-y-auto pr-1 min-h-0">
        {tracks.map((track, index) => {
          const active = index === currentTrackIndex;
          return (
            <li key={track.id}>
              <button
                type="button"
                onClick={() => onPlayIndex(index)}
                className={cn(
                  "w-full p-2.5 sm:p-3 text-left transition-all duration-100 track-item",
                  "pixel-border-green bg-bg hover:pixel-border-cyan hover:text-neon-cyan",
                  active &&
                    "active-track pixel-border-magenta text-neon-magenta",
                )}
              >
                <p className="truncate text-[10px] sm:text-xs">{track.title}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-[9px] sm:text-[10px] text-neon-cyan">
                  <span className="truncate">{track.artist}</span>
                  <span>{durationLabels[track.id] ?? "--:--"}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </PixelCard>
  );
});
