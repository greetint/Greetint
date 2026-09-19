'use client';

import React from 'react';

interface VideoPreloaderProps {
  src: string;
}

// Silently warms the browser's media cache for an upcoming clip while the
// current stage is still playing, so when the real player for it mounts the
// bytes are already local and playback can start without a network stall.
export function VideoPreloader({ src }: VideoPreloaderProps) {
  return (
    <video
      src={src}
      preload="auto"
      muted
      playsInline
      // @ts-ignore
      webkit-playsinline="true"
      aria-hidden="true"
      tabIndex={-1}
      style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
    />
  );
}
