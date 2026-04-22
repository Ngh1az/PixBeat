import { memo } from "react";

export const BootScreen = memo(function BootScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="pixel-border border-neon-green bg-panel p-6 text-center text-neon-green shadow-pixel">
        <p className="blink text-xs sm:text-sm">PIXEL PLAYER v1.0 LOADING...</p>
      </div>
    </div>
  );
});
