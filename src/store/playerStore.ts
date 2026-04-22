import { create } from "zustand";
import { playlistData } from "../data/playlist";
import type { LoopMode, Track } from "../types/player";

const LAST_TRACK_KEY = "pixel-player:last-track-id";

const getInitialIndex = (playlist: Track[]) => {
  const savedTrackId = localStorage.getItem(LAST_TRACK_KEY);
  const index = playlist.findIndex((track) => track.id === savedTrackId);
  return index >= 0 ? index : 0;
};

const getRandomIndex = (max: number, exclude: number) => {
  if (max <= 1) return 0;
  let next = exclude;
  while (next === exclude) {
    next = Math.floor(Math.random() * max);
  }
  return next;
};

interface PlayerState {
  playlist: Track[];
  currentTrackIndex: number;
  currentTrack: Track;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  loop: LoopMode;
  setCurrentTrackByIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  seekTo: (time: number) => void;
  nextTrack: () => number;
  previousTrack: () => number;
  toggleShuffle: () => void;
  toggleLoop: () => void;
}

const initialTrackIndex = getInitialIndex(playlistData);

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playlist: playlistData,
  currentTrackIndex: initialTrackIndex,
  currentTrack: playlistData[initialTrackIndex],
  isPlaying: false,
  isLoading: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  shuffle: false,
  loop: "off",
  setCurrentTrackByIndex: (index) => {
    set((state) => {
      const bounded = Math.max(0, Math.min(index, state.playlist.length - 1));
      const currentTrack = state.playlist[bounded];
      localStorage.setItem(LAST_TRACK_KEY, currentTrack.id);
      return {
        currentTrackIndex: bounded,
        currentTrack,
        progress: 0,
        duration: 0,
      };
    });
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setProgress: (progress) => set({ progress: Math.max(0, progress) }),
  setDuration: (duration) => set({ duration: Math.max(0, duration) }),
  seekTo: (time) => set({ progress: Math.max(0, time) }),
  nextTrack: () => {
    const state = get();
    const lastIndex = state.playlist.length - 1;
    const nextIndex = state.shuffle
      ? getRandomIndex(state.playlist.length, state.currentTrackIndex)
      : state.currentTrackIndex >= lastIndex
        ? 0
        : state.currentTrackIndex + 1;

    state.setCurrentTrackByIndex(nextIndex);
    return nextIndex;
  },
  previousTrack: () => {
    const state = get();
    const lastIndex = state.playlist.length - 1;
    const previousIndex =
      state.currentTrackIndex <= 0 ? lastIndex : state.currentTrackIndex - 1;

    state.setCurrentTrackByIndex(previousIndex);
    return previousIndex;
  },
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  toggleLoop: () =>
    set((state) => ({
      // Toggle only between off and one to make Repeat=1 behavior explicit
      // Click once -> enable loop-one; click again -> disable.
      loop: state.loop === "one" ? "off" : "one",
    })),
}));
