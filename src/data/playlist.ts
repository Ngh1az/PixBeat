import type { Track } from "../types/player";

import stayMp3 from "../assets/music/The Kid LAROI, Justin Bieber - STAY (Official Video) - (320 Kbps).mp3";
import strikesMp3 from "../assets/music/Terror Jr - 3 Strikes - (320 Kbps).mp3";
import harleysMp3 from "../assets/music/katy perry - harleys in hawaii (s l o w e d) - (320 Kbps).mp3";
import milkyMp3 from "../assets/music/Milky - Just The Way You Are - (320 Kbps).mp3";
import eenieMeenieMp3 from "../assets/music/Sean Kingston, Justin Bieber - Eenie Meenie (Official Video) - (320 Kbps).mp3";
import afterHoursMp3 from "../assets/music/The Weeknd - After Hours (Audio) - (320 Kbps).mp3";
import saveYourTearsMp3 from "../assets/music/The Weeknd - Save Your Tears (Official Music Video) - (320 Kbps).mp3";
import oneOfTheGirlsMp3 from "../assets/music/The Weeknd, JENNIE & Lily Rose Depp - One Of The Girls (Official Audio) - (320 Kbps).mp3";
import timelessMp3 from "../assets/music/The Weeknd, Playboi Carti - Timeless (Official Lyric Video) - (320 Kbps).mp3";
import istheresomeoneelseMp3 from "../assets/music/is-there-someone-else.mp3";
import myjealousyMp3 from "../assets/music/vivi baby & ovg! - MY JEALOUSY (Slowed) - (320 Kbps).mp3";

import stayCover from "../assets/images/covers/1695164249576_300.jpg";
import strikesCover from "../assets/images/covers/3 strikes.jpg";
import harleysCover from "../assets/images/covers/harley.jpg";
import milkyCover from "../assets/images/covers/Just The Way You Are.jpg";
import eenieMeenieCover from "../assets/images/covers/Eenie Meenie.jpg";
import afterHoursCover from "../assets/images/covers/after hours.jpg";
import saveYourTearsCover from "../assets/images/covers/save your.jpg";
import oneOfTheGirlsCover from "../assets/images/covers/the idol.jpg";
import timelessCover from "../assets/images/covers/timeless.jpg";
import istheresomeoneelseCover from "../assets/images/covers/0.jpg";
import myjealousyCover from "../assets/images/covers/myjealousy.jpg";

export const playlistData: Track[] = [
  {
    id: "stay",
    title: "STAY",
    artist: "The Kid LAROI, Justin Bieber",
    src: stayMp3,
    cover: stayCover,
    bpm: 170,
  },
  {
    id: "3-strikes",
    title: "3 Strikes",
    artist: "Terror Jr",
    src: strikesMp3,
    cover: strikesCover,
    bpm: 100,
  },
  {
    id: "harleys-hawaii",
    title: "Harleys In Hawaii (Slowed)",
    artist: "Katy Perry",
    src: harleysMp3,
    cover: harleysCover,
    bpm: 96,
  },
  {
    id: "just-the-way-you-are",
    title: "Just The Way You Are",
    artist: "Milky",
    src: milkyMp3,
    cover: milkyCover,
    bpm: 110,
  },
  {
    id: "Eenie-Meenie",
    title: "Eenie Meenie",
    artist: "Sean Kingston, Justin Bieber",
    src: eenieMeenieMp3,
    cover: eenieMeenieCover,
    bpm: 121,
  },
  {
    id: "after-hours",
    title: "After Hours",
    artist: "The Weeknd",
    src: afterHoursMp3,
    cover: afterHoursCover,
    bpm: 108,
  },
  {
    id: "save-your-tears",
    title: "Save Your Tears",
    artist: "The Weeknd",
    src: saveYourTearsMp3,
    cover: saveYourTearsCover,
    bpm: 118,
  },
  {
    id: "one-of-the-girls",
    title: "One Of The Girls",
    artist: "The Weeknd, JENNIE, Lily-Rose Depp",
    src: oneOfTheGirlsMp3,
    cover: oneOfTheGirlsCover,
    bpm: 96,
  },
  {
    id: "timeless",
    title: "Timeless",
    artist: "The Weeknd, Playboi Carti",
    src: timelessMp3,
    cover: timelessCover,
    bpm: 140,
  },
  {
    id: "is-there-someone-else",
    title: "Is There Someone Else",
    artist: "The Weeknd",
    src: istheresomeoneelseMp3,
    cover: istheresomeoneelseCover,
    bpm: 116,
  },
  {
    id: "my-jealousy",
    title: "My Jealousy",
    artist: "Vivi baby & ovg!",
    src: myjealousyMp3,
    cover: myjealousyCover,
    bpm: 120,
  },
];
