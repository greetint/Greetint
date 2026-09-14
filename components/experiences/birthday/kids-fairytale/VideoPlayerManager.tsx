'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export const STAGE_VIDEOS = {
  stage1: {
    desktop: '/images/kids_fairytale/stage_1/stage1_part1_desktop.mp4',
    phone: '/images/kids_fairytale/stage_1/stage1_part1_phone.mp4',
    part2Desktop: '/images/kids_fairytale/stage_1/stage1_part2_desktop.mp4',
    part2Phone: '/images/kids_fairytale/stage_1/stage1_part2_phone.mp4',
  },
  stage2: {
    part1Desktop: '/images/kids_fairytale/stage_2/stage2_part1_desktop.mp4',
    part1Phone: '/images/kids_fairytale/stage_2/stage2_part1_phone.mp4',
    part2Desktop: '/images/kids_fairytale/stage_2/stage2_part2_desktop.mp4',
    part2Phone: '/images/kids_fairytale/stage_2/stage2_part2_phone.mp4',
    part3Desktop: '/images/kids_fairytale/stage_2/stage2_part3_desktop.mp4',
    part3Phone: '/images/kids_fairytale/stage_2/stage2_part3_phone.mp4',
  },
  stage3: {
    part1Desktop: '/images/kids_fairytale/stage_3/stage3_part1_desctop.mp4', // With 'c' as per file path rule
    part1Phone: '/images/kids_fairytale/stage_3/stage3_part1_phone.mp4',
    part2Desktop: '/images/kids_fairytale/stage_3/stage3_part2_desctop.mp4',
    part2Phone: '/images/kids_fairytale/stage_3/stage3_part2_phone.mp4',
    part3Desktop: '/images/kids_fairytale/stage_3/stage3_part3_desctop.mp4',
    part3Phone: '/images/kids_fairytale/stage_3/stage3_part3_phone.mp4',
    part4Desktop: '/images/kids_fairytale/stage_3/stage3_part4_desctop.mp4',
    part4Phone: '/images/kids_fairytale/stage_3/stage3_part4_phone.mp4',
    part5Desktop: '/images/kids_fairytale/stage_3/stage3_part5_desctop.mp4',
    part5Phone: '/images/kids_fairytale/stage_3/stage3_part5_phone.mp4',
    part6Desktop: '/images/kids_fairytale/stage_3/stage3_part6_desctop.mp4',
    part6Phone: '/images/kids_fairytale/stage_3/stage3_part6_phone.mp4',
  },
};

interface DualBufferVideoPlayerProps {
  currentVideoSrc: string;
  nextVideoSrc?: string;
  onVideoEnded?: () => void;
  className?: string;
}

export const VideoPlayerManager = forwardRef<{
  play: () => Promise<void>;
  pause: () => void;
  videoEl: HTMLVideoElement | null;
}, DualBufferVideoPlayerProps>(({
  currentVideoSrc,
  nextVideoSrc,
  onVideoEnded,
  className = ''
}, ref) => {
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);

  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A');
  const [sourceA, setSourceA] = useState<string>(currentVideoSrc);
  const [sourceB, setSourceB] = useState<string>(nextVideoSrc || currentVideoSrc);

  useImperativeHandle(ref, () => ({
    play: async () => {
      const activeEl = activeBuffer === 'A' ? videoARef.current : videoBRef.current;
      if (activeEl) {
        activeEl.muted = true;
        await activeEl.play().catch(() => {});
      }
    },
    pause: () => {
      videoARef.current?.pause();
      videoBRef.current?.pause();
    },
    videoEl: activeBuffer === 'A' ? videoARef.current : videoBRef.current,
  }));

  useEffect(() => {
    // Switch or update buffer when currentVideoSrc changes
    const nextBuf = activeBuffer === 'A' ? 'B' : 'A';
    if (nextBuf === 'B') {
      setSourceB(currentVideoSrc);
    } else {
      setSourceA(currentVideoSrc);
    }
    setActiveBuffer(nextBuf);

    const activeEl = nextBuf === 'A' ? videoARef.current : videoBRef.current;
    if (activeEl) {
      activeEl.currentTime = 0;
      activeEl.muted = true;
      activeEl.play().catch(() => {});
    }

    // Preload next video in background buffer
    if (nextVideoSrc) {
      const preloadBuf = nextBuf === 'A' ? 'B' : 'A';
      if (preloadBuf === 'B') {
        setSourceB(nextVideoSrc);
      } else {
        setSourceA(nextVideoSrc);
      }
    }
  }, [currentVideoSrc]);

  useEffect(() => {
    if (nextVideoSrc) {
      const preloadBuf = activeBuffer === 'A' ? 'B' : 'A';
      if (preloadBuf === 'B') {
        setSourceB(nextVideoSrc);
      } else {
        setSourceA(nextVideoSrc);
      }
    }
  }, [nextVideoSrc, activeBuffer]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black select-none pointer-events-none ${className}`}>
      <video
        ref={videoARef}
        src={sourceA}
        muted={true}
        playsInline={true}
        webkit-playsinline="true"
        autoPlay={true}
        controls={false}
        preload="auto"
        disablePictureInPicture={true}
        onEnded={activeBuffer === 'A' ? onVideoEnded : undefined}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-75 ${activeBuffer === 'A' ? 'opacity-100' : 'opacity-0'}`}
      />
      <video
        ref={videoBRef}
        src={sourceB}
        muted={true}
        playsInline={true}
        webkit-playsinline="true"
        autoPlay={true}
        controls={false}
        preload="auto"
        disablePictureInPicture={true}
        onEnded={activeBuffer === 'B' ? onVideoEnded : undefined}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-75 ${activeBuffer === 'B' ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
});

VideoPlayerManager.displayName = 'VideoPlayerManager';
export default VideoPlayerManager;



