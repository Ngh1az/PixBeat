import { memo, useEffect, useMemo, useRef } from "react";
import type { LyricLine } from "../types/player";

type LyricsPanelProps = {
  lines: LyricLine[];
  currentTime: number;
  isPlaying: boolean;
  trackTitle: string;
  expanded?: boolean;
};

export const LyricsPanel = memo(function LyricsPanel({
  lines,
  currentTime,
  isPlaying,
  trackTitle,
  expanded = false,
}: LyricsPanelProps) {
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  const activeLineIndex = useMemo(() => {
    if (lines.length === 0) return -1;
    for (let index = lines.length - 1; index >= 0; index -= 1) {
      if (currentTime >= lines[index].time) {
        return index;
      }
    }
    return 0;
  }, [currentTime, lines]);

  useEffect(() => {
    if (!isPlaying || activeLineIndex < 0) return;

    const activeNode = lineRefs.current[activeLineIndex];
    activeNode?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [activeLineIndex, isPlaying]);

  if (lines.length === 0) {
    return (
      <div className="pixel-border border-neon-cyan bg-panel p-3 sm:h-full sm:flex sm:flex-col">
        <p className="mb-2 text-[10px] text-neon-magenta">LYRICS</p>
        <p className="text-[10px] text-neon-cyan">
          Chua co loi bai hat dong bo cho {trackTitle}.
        </p>
      </div>
    );
  }

  return (
    <div className="pixel-border border-neon-cyan bg-panel p-3 sm:h-full sm:flex sm:flex-col">
      <p className="mb-2 text-[10px] text-neon-magenta">LYRICS</p>
      <div
        className={`pixel-scrollbar space-y-2 overflow-y-auto pr-1 ${expanded ? "max-h-52 sm:max-h-none sm:flex-1 sm:min-h-0" : "max-h-52 sm:max-h-72"}`}
      >
        {lines.map((line, index) => {
          const isActive = index === activeLineIndex;

          return (
            <p
              key={`${line.time}-${line.text}`}
              ref={(node) => {
                lineRefs.current[index] = node;
              }}
              className={
                isActive
                  ? "lyrics-line lyrics-line-active text-xs text-neon-magenta"
                  : "lyrics-line text-[10px] text-neon-cyan/85"
              }
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
});
