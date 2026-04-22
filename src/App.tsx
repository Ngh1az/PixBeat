import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListMusic, X } from "lucide-react";
import { BootScreen } from "./components/BootScreen";
import { CrtOverlay } from "./components/CrtOverlay";
import { LyricsPanel } from "./components/LyricsPanel";
import { MiniPlayer } from "./components/MiniPlayer";
import { NowPlayingPanel } from "./components/NowPlayingPanel";
import { PixBeatHeader } from "./components/PixBeatHeader";
import { PlaybackControls } from "./components/PlaybackControls";
import { PlaylistPanel } from "./components/PlaylistPanel";
import { ProgressBar } from "./components/ProgressBar";
import { lyricsByTrackId } from "./data/lyrics";
import { PixelButton } from "./components/ui/button";
import { PixelCard } from "./components/ui/pixel-card";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useTrackDurations } from "./hooks/useTrackDurations";
import { formatTime } from "./lib/format";

type FloatingPlayerElements = {
  cover: HTMLImageElement;
  title: HTMLParagraphElement;
  artist: HTMLParagraphElement;
  status: HTMLSpanElement;
  progressFill: HTMLSpanElement;
  time: HTMLSpanElement;
  playButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
};

function App() {
  const [booting, setBooting] = useState(true);
  const [showPlaylistMobile, setShowPlaylistMobile] = useState(false);
  const [mobileCenterTab, setMobileCenterTab] = useState<"controls" | "lyrics">(
    "controls",
  );
  const [isFloatingPlayerOpen, setIsFloatingPlayerOpen] = useState(false);
  const floatingWindowRef = useRef<Window | null>(null);
  const floatingElementsRef = useRef<FloatingPlayerElements | null>(null);

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
    togglePlay,
    seek,
    setTrackVolume,
    playIndex,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleLoop,
  } = useAudioPlayer();

  const { labelsById } = useTrackDurations(playlist);

  const mobileDrawerClass = useMemo(
    () =>
      showPlaylistMobile
        ? "translate-y-0 opacity-100 pointer-events-auto"
        : "translate-y-full opacity-0 pointer-events-none",
    [showPlaylistMobile],
  );

  const remainingTime = useMemo(
    () => Math.max(duration - progress, 0),
    [duration, progress],
  );

  const progressPercent = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.round((progress / duration) * 100));
  }, [duration, progress]);

  const loopStatusLabel =
    loop === "one" ? "LOOP ONE" : loop === "all" ? "LOOP ALL" : "LOOP OFF";

  const lyricLines = useMemo(
    () => lyricsByTrackId[currentTrack.id] ?? [],
    [currentTrack.id],
  );

  const floatingSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    const maybeApi = (
      window as Window & {
        documentPictureInPicture?: {
          requestWindow: (options?: {
            width?: number;
            height?: number;
          }) => Promise<Window>;
        };
      }
    ).documentPictureInPicture;
    return typeof maybeApi?.requestWindow === "function";
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setBooting(false), 1700);
    return () => clearTimeout(timeout);
  }, []);

  const closeMobileDrawer = useCallback(() => {
    setShowPlaylistMobile(false);
  }, []);

  const onPlayIndex = useCallback(
    (index: number) => {
      playIndex(index);
      closeMobileDrawer();
    },
    [closeMobileDrawer, playIndex],
  );

  const closeFloatingPlayer = useCallback(() => {
    const activeWindow = floatingWindowRef.current;
    if (activeWindow && !activeWindow.closed) {
      activeWindow.close();
    }
    floatingWindowRef.current = null;
    floatingElementsRef.current = null;
    setIsFloatingPlayerOpen(false);
  }, []);

  const openFloatingPlayer = useCallback(async () => {
    if (!floatingSupported) return;

    const activeWindow = floatingWindowRef.current;
    if (activeWindow && !activeWindow.closed) {
      activeWindow.focus();
      return;
    }

    const api = (
      window as Window & {
        documentPictureInPicture?: {
          requestWindow: (options?: {
            width?: number;
            height?: number;
          }) => Promise<Window>;
        };
      }
    ).documentPictureInPicture;

    if (!api?.requestWindow) return;

    try {
      const pipWindow = await api.requestWindow({ width: 380, height: 180 });
      const pipDocument = pipWindow.document;
      pipDocument.title = "PixBeat Floating Player";
      pipDocument.body.innerHTML = "";

      const style = pipDocument.createElement("style");
      style.textContent = `
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background:
            radial-gradient(130% 110% at 100% 0%, rgba(255, 79, 216, 0.16), transparent 55%),
            radial-gradient(120% 120% at 0% 100%, rgba(0, 255, 159, 0.14), transparent 58%),
            linear-gradient(140deg, #031313, #0c1d1d 70%);
          color: #7fffd4;
          min-height: 100vh;
          padding: 10px;
        }
        .shell {
          height: 100%;
          border: 1px solid rgba(0, 255, 159, 0.5);
          border-radius: 14px;
          background: rgba(4, 14, 14, 0.9);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(0, 255, 159, 0.15);
          display: grid;
          grid-template-rows: 1fr auto auto;
          gap: 9px;
          padding: 10px 11px;
        }
        .top {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 10px;
          align-items: center;
          min-width: 0;
        }
        .cover {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          border: 1px solid rgba(0, 255, 159, 0.42);
          object-fit: cover;
          background: #0d2222;
        }
        .meta {
          min-width: 0;
        }
        .title {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          color: #00ff9f;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .artist {
          margin: 4px 0 0;
          font-size: 10px;
          color: #36f9f6;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .status {
          display: inline-block;
          margin-top: 8px;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.06em;
          border: 1px solid rgba(0, 255, 159, 0.48);
          color: #00ff9f;
          background: rgba(0, 255, 159, 0.08);
        }
        .progress {
          display: grid;
          gap: 5px;
        }
        .progress-track {
          height: 5px;
          border-radius: 999px;
          background: rgba(0, 255, 159, 0.2);
          overflow: hidden;
        }
        .progress-fill {
          display: block;
          height: 100%;
          width: 0%;
          border-radius: inherit;
          background: linear-gradient(90deg, #00ff9f, #3df5ff 70%);
          transition: width 140ms linear;
        }
        .time {
          justify-self: end;
          font-size: 10px;
          color: #8ffefb;
        }
        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .btn {
          border: 1px solid rgba(0, 255, 159, 0.55);
          border-radius: 10px;
          background: linear-gradient(180deg, rgba(0, 255, 159, 0.12), rgba(0, 255, 159, 0.02));
          color: #00ff9f;
          font-weight: 700;
          font-size: 10px;
          min-height: 34px;
          cursor: pointer;
          transition: all 120ms ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          border-color: #ff4fd8;
          color: #ff4fd8;
          box-shadow: 0 0 0 1px rgba(255, 79, 216, 0.3), 0 6px 14px rgba(255, 79, 216, 0.16);
        }
      `;
      pipDocument.head.append(style);

      const shell = pipDocument.createElement("div");
      shell.className = "shell";

      const top = pipDocument.createElement("div");
      top.className = "top";
      const cover = pipDocument.createElement("img");
      cover.className = "cover";
      cover.alt = "Track cover";

      const infoWrap = pipDocument.createElement("div");
      infoWrap.className = "meta";
      const title = pipDocument.createElement("p");
      title.className = "title";
      const artist = pipDocument.createElement("p");
      artist.className = "artist";
      const status = pipDocument.createElement("span");
      status.className = "status";
      infoWrap.append(title, artist, status);
      top.append(cover, infoWrap);

      const progressWrap = pipDocument.createElement("div");
      progressWrap.className = "progress";
      const progressTrack = pipDocument.createElement("div");
      progressTrack.className = "progress-track";
      const progressFill = pipDocument.createElement("span");
      progressFill.className = "progress-fill";
      progressTrack.append(progressFill);
      const time = pipDocument.createElement("span");
      time.className = "time";
      progressWrap.append(progressTrack, time);

      const actions = pipDocument.createElement("div");
      actions.className = "actions";
      const playButton = pipDocument.createElement("button");
      playButton.className = "btn";
      playButton.onclick = () => togglePlay();
      const nextButton = pipDocument.createElement("button");
      nextButton.className = "btn";
      nextButton.textContent = "NEXT";
      nextButton.onclick = () => nextTrack();
      actions.append(playButton, nextButton);

      shell.append(top, progressWrap, actions);
      pipDocument.body.append(shell);

      pipWindow.addEventListener(
        "pagehide",
        () => {
          floatingWindowRef.current = null;
          floatingElementsRef.current = null;
          setIsFloatingPlayerOpen(false);
        },
        { once: true },
      );

      floatingWindowRef.current = pipWindow;
      floatingElementsRef.current = {
        cover,
        title,
        artist,
        status,
        progressFill,
        time,
        playButton,
        nextButton,
      };
      setIsFloatingPlayerOpen(true);
    } catch {
      setIsFloatingPlayerOpen(false);
    }
  }, [floatingSupported, nextTrack, togglePlay]);

  const toggleFloatingPlayer = useCallback(() => {
    if (isFloatingPlayerOpen) {
      closeFloatingPlayer();
      return;
    }
    void openFloatingPlayer();
  }, [closeFloatingPlayer, isFloatingPlayerOpen, openFloatingPlayer]);

  useEffect(() => {
    const elements = floatingElementsRef.current;
    if (!elements) return;

    const pct =
      duration > 0
        ? Math.min(100, Math.max(0, (progress / duration) * 100))
        : 0;

    elements.cover.src = currentTrack.cover;
    elements.title.textContent = currentTrack.title;
    elements.artist.textContent = currentTrack.artist;
    elements.status.textContent = isLoading
      ? "BUFFERING"
      : isPlaying
        ? "PLAYING"
        : "PAUSED";
    elements.progressFill.style.width = `${pct}%`;
    elements.time.textContent = `${formatTime(progress)} / ${formatTime(duration)}`;
    elements.playButton.textContent = isLoading
      ? "LOADING"
      : isPlaying
        ? "PAUSE"
        : "PLAY";
  }, [
    currentTrack.artist,
    currentTrack.cover,
    currentTrack.title,
    duration,
    isLoading,
    isPlaying,
    progress,
  ]);

  useEffect(() => {
    return () => {
      closeFloatingPlayer();
    };
  }, [closeFloatingPlayer]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;

      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      }

      if (event.code === "ArrowRight") {
        event.preventDefault();
        nextTrack();
      }

      if (event.code === "ArrowLeft") {
        event.preventDefault();
        previousTrack();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextTrack, previousTrack, togglePlay]);

  if (booting) {
    return <BootScreen />;
  }

  return (
    <div className="retro-bg relative min-h-screen bg-bg pb-24 sm:pb-10">
      <CrtOverlay />

      <main className="relative z-10 mx-auto flex w-full max-w-[1720px] flex-col gap-4 p-3 sm:gap-6 sm:p-5 lg:gap-7 lg:p-7">
        <PixBeatHeader username="Nghia" showNotifications />

        <section className="grid gap-3 sm:gap-4 xl:min-h-[calc(100vh-8.25rem)] xl:grid-cols-[minmax(280px,320px)_minmax(560px,1fr)_minmax(300px,360px)] xl:items-stretch xl:gap-4 2xl:gap-5">
          <div className="panel-reveal panel-delay-1">
            <NowPlayingPanel
              track={currentTrack}
              isPlaying={isPlaying}
              isLoading={isLoading}
            />
          </div>

          <PixelCard
            className={`panel-reveal panel-delay-2 panel-scan cyber-border-animated flex h-full flex-col gap-5 p-4 sm:gap-6 sm:p-6 ${isPlaying ? "panel-live" : ""}`}
          >
            <p className="text-xs text-neon-magenta">PLAYER CONTROLS</p>
            <div className="space-y-3 border-2 border-neon-green bg-bg p-4 pixel-border-green">
              <p
                className={`text-sm ${isPlaying ? "active-track" : "text-neon-green"}`}
              >
                {currentTrack.title}
              </p>

              <p className="text-xs text-neon-cyan">{currentTrack.artist}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:hidden">
              <PixelButton
                size="sm"
                active={mobileCenterTab === "controls"}
                onClick={() => setMobileCenterTab("controls")}
                className="justify-center"
              >
                CONTROLS
              </PixelButton>
              <PixelButton
                size="sm"
                active={mobileCenterTab === "lyrics"}
                onClick={() => setMobileCenterTab("lyrics")}
                className="justify-center"
              >
                LYRICS
              </PixelButton>
            </div>

            <div
              className={`${mobileCenterTab === "controls" ? "space-y-5" : "hidden"} sm:block sm:space-y-5`}
            >
              <div className="hidden space-y-3 sm:block">
                <LyricsPanel
                  lines={lyricLines}
                  currentTime={progress}
                  isPlaying={isPlaying}
                  trackTitle={currentTrack.title}
                />

                <ProgressBar
                  progress={progress}
                  duration={duration}
                  isPlaying={isPlaying}
                  onSeek={seek}
                />
              </div>

              <PlaybackControls
                isPlaying={isPlaying}
                isLoading={isLoading}
                volume={volume}
                shuffle={shuffle}
                loop={loop}
                onTogglePlay={togglePlay}
                onPrev={previousTrack}
                onNext={nextTrack}
                onVolume={setTrackVolume}
                onToggleShuffle={toggleShuffle}
                onToggleLoop={toggleLoop}
                floatingEnabled={isFloatingPlayerOpen}
                floatingSupported={floatingSupported}
                onToggleFloating={toggleFloatingPlayer}
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="pixel-border border-neon-cyan bg-panel p-2.5">
                  <p className="mb-2 text-[9px] text-neon-magenta">NOW STATS</p>
                  <div className="space-y-1.5 text-[9px] leading-[1.1] text-neon-cyan">
                    <p className="grid grid-cols-[1fr_102px] items-baseline gap-x-2">
                      <span className="leading-none">TRACK</span>
                      <span className="justify-self-end text-right leading-none text-neon-green">
                        {currentTrackIndex + 1}/{playlist.length}
                      </span>
                    </p>
                    <p className="grid grid-cols-[1fr_102px] items-baseline gap-x-2">
                      <span className="leading-none">PROGRESS</span>
                      <span className="justify-self-end text-right leading-none text-neon-green">
                        {progressPercent}%
                      </span>
                    </p>
                    <p className="grid grid-cols-[1fr_102px] items-baseline gap-x-2">
                      <span className="leading-none">REMAIN</span>
                      <span className="justify-self-end text-right leading-none text-neon-green">
                        {formatTime(remainingTime)}
                      </span>
                    </p>
                    <p className="grid grid-cols-[1fr_102px] items-baseline gap-x-2">
                      <span className="leading-none">TEMPO</span>
                      <span className="justify-self-end text-right leading-none text-neon-green">
                        {currentTrack.bpm ?? 118} BPM
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pixel-border border-neon-cyan bg-panel p-2.5">
                  <p className="mb-2 text-[9px] text-neon-magenta">
                    QUICK HELP
                  </p>
                  <div className="space-y-1.5 text-[9px] leading-[1.1] text-neon-cyan">
                    <p className="grid grid-cols-[1fr_102px] items-baseline gap-x-2">
                      <span className="leading-none">SPACE</span>
                      <span className="justify-self-end text-right leading-none text-neon-green">
                        PLAY/PAUSE
                      </span>
                    </p>
                    <p className="grid grid-cols-[1fr_102px] items-baseline gap-x-2">
                      <span className="leading-none">LEFT / RIGHT</span>
                      <span className="justify-self-end text-right leading-none text-neon-green">
                        PREV / NEXT
                      </span>
                    </p>
                    <p className="grid grid-cols-[1fr_102px] items-baseline gap-x-2">
                      <span className="leading-none">SHUFFLE</span>
                      <span className="justify-self-end text-right leading-none text-neon-green">
                        {shuffle ? "ON" : "OFF"}
                      </span>
                    </p>
                    <p className="grid grid-cols-[1fr_102px] items-baseline gap-x-2">
                      <span className="leading-none">LOOP</span>
                      <span className="justify-self-end text-right leading-none text-neon-green">
                        {loopStatusLabel}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${mobileCenterTab === "lyrics" ? "block" : "hidden"} sm:hidden`}
            >
              <LyricsPanel
                lines={lyricLines}
                currentTime={progress}
                isPlaying={isPlaying}
                trackTitle={currentTrack.title}
              />
            </div>
          </PixelCard>

          <section className="panel-reveal panel-delay-3 hidden xl:block xl:h-full xl:sticky xl:top-7">
            <PlaylistPanel
              tracks={playlist}
              currentTrackIndex={currentTrackIndex}
              durationLabels={labelsById}
              onPlayIndex={onPlayIndex}
            />
          </section>
        </section>

        <section className="hidden sm:block xl:hidden">
          <PlaylistPanel
            tracks={playlist}
            currentTrackIndex={currentTrackIndex}
            durationLabels={labelsById}
            onPlayIndex={onPlayIndex}
          />
        </section>

        <section className="sm:hidden">
          <PixelButton
            onClick={() => setShowPlaylistMobile(true)}
            className="w-full justify-center text-xs cyber-btn pixel-border-green hover:text-neon-cyan"
          >
            <ListMusic className="mr-2 h-4 w-4" />
            OPEN PLAYLIST
          </PixelButton>
        </section>
      </main>

      <div
        className={`fixed inset-x-0 bottom-0 top-14 z-20 bg-bg p-3 transition-all duration-300 sm:hidden ${mobileDrawerClass}`}
      >
        <div className="mb-3 flex justify-end">
          <PixelButton size="sm" onClick={closeMobileDrawer}>
            <X className="h-4 w-4" />
          </PixelButton>
        </div>
        <PlaylistPanel
          tracks={playlist}
          currentTrackIndex={currentTrackIndex}
          durationLabels={labelsById}
          onPlayIndex={onPlayIndex}
        />
      </div>

      <MiniPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        isLoading={isLoading}
        onTogglePlay={togglePlay}
        onNext={nextTrack}
      />
    </div>
  );
}

export default App;
