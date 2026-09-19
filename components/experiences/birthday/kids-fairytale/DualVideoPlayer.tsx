'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DualVideoPlayerProps {
  src: string;
  onEnded?: () => void;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export function DualVideoPlayer({ src, onEnded, className = '', autoPlay = true, loop = false, muted = true }: DualVideoPlayerProps) {
  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A');
  const [sourceA, setSourceA] = useState(src);
  const [sourceB, setSourceB] = useState('');

  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (activeBuffer === 'A') {
      if (src !== sourceA) {
        setSourceB(src);
        const t = setTimeout(() => {
          if (videoBRef.current && sourceB) {
            setActiveBuffer('B');
            videoBRef.current.play().catch(() => {});
          }
        }, 1500);
        return () => clearTimeout(t);
      }
    } else {
      if (src !== sourceB) {
        setSourceA(src);
        const t = setTimeout(() => {
          if (videoARef.current && sourceA) {
            setActiveBuffer('A');
            videoARef.current.play().catch(() => {});
          }
        }, 1500);
        return () => clearTimeout(t);
      }
    }
  }, [src]);

  const handleLoadedDataB = () => {
    if (activeBuffer === 'A' && sourceB) {
      setActiveBuffer('B');
      if (videoBRef.current) {
        videoBRef.current.play().catch(() => {});
      }
    }
  };

  const handleLoadedDataA = () => {
    if (activeBuffer === 'B' && sourceA) {
      setActiveBuffer('A');
      if (videoARef.current) {
        videoARef.current.play().catch(() => {});
      }
    }
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
        onLoadedData={handleLoadedDataA}
        onError={(e) => console.error("Video A Error:", e.currentTarget.error, e.currentTarget.src)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
          activeBuffer === 'A' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
        }`}
      />
      <video
        ref={videoBRef}
        src={sourceB}
        preload="auto"
        autoPlay={false}
        muted={muted}
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        loop={loop}
        onEnded={activeBuffer === 'B' ? onEnded : undefined}
        onLoadedData={handleLoadedDataB}
        onError={(e) => console.error("Video B Error:", e.currentTarget.error, e.currentTarget.src)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
          activeBuffer === 'B' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
        }`}
      />
    </div>
  );
}
