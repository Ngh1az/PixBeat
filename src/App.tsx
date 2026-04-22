import { useCallback, useEffect, useMemo, useState } from "react";
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

function App() {
  const [booting, setBooting] = useState(true);
  const [showPlaylistMobile, setShowPlaylistMobile] = useState(false);
  const [mobileCenterTab, setMobileCenterTab] = useState<"controls" | "lyrics">(
    "controls",
  );

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
