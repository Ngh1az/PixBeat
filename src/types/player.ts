export type LoopMode = "off" | "one" | "all";

export type LyricLine = {
  time: number;
  text: string;
};

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  bpm?: number;
}
