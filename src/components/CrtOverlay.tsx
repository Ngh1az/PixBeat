import { memo } from "react";

export const CrtOverlay = memo(function CrtOverlay() {
  return (
    <div
      className="crt-overlay pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    />
  );
});
