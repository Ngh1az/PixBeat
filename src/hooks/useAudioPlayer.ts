import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePlayerStore } from "../store/playerStore";

let sharedAudio: HTMLAudioElement | null = null;

const getSharedAudio = () => {
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "metadata";
  }
  return sharedAudio;
};

export const useAudioPlayer = () => {
  const audio = useMemo(() => getSharedAudio(), []);
  const pendingPlayRef = useRef(false);
  const loadedTrackSrcRef = useRef<string | null>(null);

  const {
    playlist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isLoading,
    volume,
    progress,
    duration,
    loop,
    shuffle,
    setCurrentTrackByIndex,
    setIsPlaying,
    setIsLoading,
    setDuration,
    setProgress,
    setVolume,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleLoop,
  } = usePlayerStore();

  useEffect(() => {
    audio.volume = volume;
  }, [audio, volume]);

  useEffect(() => {
    if (loadedTrackSrcRef.current !== currentTrack.src) {
      loadedTrackSrcRef.current = currentTrack.src;
      audio.src = currentTrack.src;
      audio.load();
      setIsLoading(true);
    }

    if (isPlaying) {
      void (async () => {
        if (pendingPlayRef.current || !audio.paused) return;
        pendingPlayRef.current = true;
        try {
          await audio.play();
        } catch {
          setIsPlaying(false);
        } finally {
          pendingPlayRef.current = false;
        }
      })();
    } else if (!audio.paused) {
      audio.pause();
    }
  }, [audio, currentTrack.src, isPlaying, setIsLoading, setIsPlaying]);

  useEffect(() => {
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setProgress(audio.currentTime || 0);
      setIsLoading(false);
    };

    const onTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onCanPlay = () => {
      setIsLoading(false);
    };

    const onEnded = () => {
      if (loop === "one") {
        audio.currentTime = 0;
        void audio.play();
        return;
      }

      nextTrack();
      setIsPlaying(true);
    };

    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [
    audio,
    currentTrackIndex,
    loop,
    nextTrack,
    playlist.length,
    setDuration,
    setIsLoading,
    setIsPlaying,
    setProgress,
    shuffle,
  ]);

  const play = useCallback(async () => {
    if (pendingPlayRef.current || !audio.paused) return;
    pendingPlayRef.current = true;
    setIsLoading(true);
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    } finally {
      pendingPlayRef.current = false;
      setIsLoading(false);
    }
  }, [audio, setIsLoading, setIsPlaying]);

  const pause = useCallback(() => {
    if (!audio.paused) {
      audio.pause();
    }
  }, [audio]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    void play();
  }, [isPlaying, pause, play]);

  const seek = useCallback(
    (time: number) => {
      audio.currentTime = Math.max(0, Math.min(time, duration || 0));
      setProgress(audio.currentTime);
    },
    [audio, duration, setProgress],
  );

  const replayCurrent = useCallback(() => {
    audio.currentTime = 0;
    setProgress(0);

    if (audio.paused) {
      setIsPlaying(true);
      void play();
    }
  }, [audio, play, setIsPlaying, setProgress]);

  const setTrackVolume = useCallback(
    (value: number) => {
      setVolume(value);
      audio.volume = value;
    },
    [audio, setVolume],
  );

  const playIndex = useCallback(
    (index: number) => {
      setCurrentTrackByIndex(index);
      setIsPlaying(true);
    },
    [setCurrentTrackByIndex, setIsPlaying],
  );

  return {
    playlist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isLoading,
    volume,
    progress,
    duration,
    loop,
    shuffle,
    play,
    pause,
    togglePlay,
    replayCurrent,
    seek,
    setTrackVolume,
    playIndex,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleLoop,
  };
};
