'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DualVideoPlayerProps {
  src: string;
  onEnded?: () => void;
  onPlaying?: () => void;
  onActiveVideoRef?: (el: HTMLVideoElement | null) => void;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  // When false, an incoming buffer still preloads and crossfades in (so there's
  // never a black frame), but freezes on its first frame right away instead of
  // playing through — the caller resumes it later via the ref from onActiveVideoRef.
  autoPlayOnSwap?: boolean;
}

export function DualVideoPlayer({ src, onEnded, onPlaying, onActiveVideoRef, className = '', autoPlay = true, loop = false, muted = true, autoPlayOnSwap = true }: DualVideoPlayerProps) {
  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A');
  const [sourceA, setSourceA] = useState(src);
  const [sourceB, setSourceB] = useState('');

  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (activeBuffer === 'A' && src !== sourceA) {
      setSourceB(src);
    } else if (activeBuffer === 'B' && src !== sourceB) {
      setSourceA(src);
    }
  }, [src]);

  useEffect(() => {
    onActiveVideoRef?.(activeBuffer === 'A' ? videoARef.current : videoBRef.current);
  }, [activeBuffer, onActiveVideoRef]);

  // The incoming buffer preloads and plays muted in the background while hidden;
  // we only swap it to visible once IT fires `onPlaying`, so the outgoing buffer's
  // last frame is never hidden before the new video is actually rendering a frame.
  useEffect(() => {
    if (activeBuffer === 'A' && sourceB && videoBRef.current) {
      videoBRef.current.play().catch(() => {});
    }
  }, [sourceB, activeBuffer]);

  useEffect(() => {
    if (activeBuffer === 'B' && sourceA && videoARef.current) {
      videoARef.current.play().catch(() => {});
    }
  }, [sourceA, activeBuffer]);

  const handlePlayingA = () => {
    if (activeBuffer === 'B' && sourceA === src) setActiveBuffer('A');
    if (!autoPlayOnSwap && videoARef.current) videoARef.current.pause();
    onPlaying?.();
  };

  const handlePlayingB = () => {
    if (activeBuffer === 'A' && sourceB === src) setActiveBuffer('B');
    if (!autoPlayOnSwap && videoBRef.current) videoBRef.current.pause();
    onPlaying?.();
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoARef}
        src={sourceA}
        preload="auto"
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        loop={loop}
        onEnded={activeBuffer === 'A' ? onEnded : undefined}
        onPlaying={handlePlayingA}
        onError={(e) => console.error("Video A Error:", e.currentTarget.error, e.currentTarget.src)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
          activeBuffer === 'A' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
        }`}
      />
      <video
        ref={videoBRef}
        {...(sourceB ? { src: sourceB } : {})}
        preload="auto"
        autoPlay={false}
        muted={muted}
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        loop={loop}
        onEnded={activeBuffer === 'B' ? onEnded : undefined}
        onPlaying={handlePlayingB}
        onError={(e) => console.error("Video B Error:", e.currentTarget.error, e.currentTarget.src)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
          activeBuffer === 'B' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
        }`}
      />
    </div>
  );
}
