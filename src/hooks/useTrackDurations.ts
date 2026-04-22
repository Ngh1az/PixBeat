import { useEffect, useMemo, useState } from "react";
import type { Track } from "../types/player";
import { formatTime } from "../lib/format";

const DURATION_CACHE_KEY = "pixel-player:track-durations:v1";

type DurationCacheValue = {
  src: string;
  seconds: number;
};

type DurationCache = Record<string, DurationCacheValue>;

const readDurationCache = (): DurationCache => {
  try {
    const raw = localStorage.getItem(DURATION_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as DurationCache;
  } catch {
    return {};
  }
};

const writeDurationCache = (cache: DurationCache) => {
  try {
    localStorage.setItem(DURATION_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore write failures (e.g. private mode quota errors)
  }
};

const readAudioDuration = (src: string) =>
  new Promise<number>((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "metadata";

    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
      audio.src = "";
    };

    const onLoadedMetadata = () => {
      const value = audio.duration;
      cleanup();
      resolve(Number.isFinite(value) ? value : 0);
    };

    const onError = () => {
      cleanup();
      reject(new Error("Failed to load audio metadata"));
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);
    audio.src = src;
    audio.load();
  });

export const useTrackDurations = (tracks: Track[]) => {
  const [secondsById, setSecondsById] = useState<Record<string, number>>(() => {
    const cache = readDurationCache();
    const initial: Record<string, number> = {};

    for (const track of tracks) {
      const cached = cache[track.id];
      if (cached && cached.src === track.src) {
        initial[track.id] = cached.seconds;
      }
    }

    return initial;
  });

  const trackIds = useMemo(
    () => tracks.map((track) => track.id).join("|"),
    [tracks],
  );

  useEffect(() => {
    let disposed = false;

    const unresolved = tracks.filter(
      (track) => secondsById[track.id] === undefined,
    );
    if (!unresolved.length) {
      return;
    }

    void Promise.all(
      unresolved.map(async (track) => {
        try {
          const seconds = await readAudioDuration(track.src);
          return { id: track.id, src: track.src, seconds };
        } catch {
          return { id: track.id, src: track.src, seconds: 0 };
        }
      }),
    ).then((results) => {
      if (disposed || !results.length) return;

      const cache = readDurationCache();
      setSecondsById((prev) => {
        const next = { ...prev };
        for (const item of results) {
          next[item.id] = item.seconds;
          cache[item.id] = {
            src: item.src,
            seconds: item.seconds,
          };
        }

        writeDurationCache(cache);
        return next;
      });
    });

    return () => {
      disposed = true;
    };
  }, [secondsById, trackIds, tracks]);

  const labelsById = useMemo(() => {
    const entries = Object.entries(secondsById).map(([id, seconds]) => [
      id,
      formatTime(seconds || 0),
    ]);
    return Object.fromEntries(entries) as Record<string, string>;
  }, [secondsById]);

  return {
    labelsById,
    secondsById,
  };
};
