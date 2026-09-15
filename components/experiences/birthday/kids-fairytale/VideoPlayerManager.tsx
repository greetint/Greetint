'use client';

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

export const STAGE_VIDEOS = {
  stage1: {
    desktop: '/videos/birthday/kids_fairytale/stage_1/stage1_part1_desktop.mp4',
    phone: '/videos/birthday/kids_fairytale/stage_1/stage1_part1_phone.mp4',
    part2Desktop: '/videos/birthday/kids_fairytale/stage_1/stage1_part2_desktop.mp4',
    part2Phone: '/videos/birthday/kids_fairytale/stage_1/stage1_part2_phone.mp4',
  },
  stage2: {
    part1Desktop: '/videos/birthday/kids_fairytale/stage_2/stage2_part1_desktop.mp4',
    part1Phone: '/videos/birthday/kids_fairytale/stage_2/stage2_part1_phone.mp4',
    part2Desktop: '/videos/birthday/kids_fairytale/stage_2/stage2_part2_desktop.mp4',
    part2Phone: '/videos/birthday/kids_fairytale/stage_2/stage2_part2_phone.mp4',
    part3Desktop: '/videos/birthday/kids_fairytale/stage_2/stage2_part3_desktop.mp4',
    part3Phone: '/videos/birthday/kids_fairytale/stage_2/stage2_part3_phone.mp4',
  },
  stage3: {
    part1Desktop: '/videos/birthday/kids_fairytale/stage_3/stage3_part1_desctop.mp4',
    part1Phone: '/videos/birthday/kids_fairytale/stage_3/stage3_part1_phone.mp4',
    part2Desktop: '/videos/birthday/kids_fairytale/stage_3/stage3_part2_desctop.mp4',
    part2Phone: '/videos/birthday/kids_fairytale/stage_3/stage3_part2_phone.mp4',
    part3Desktop: '/videos/birthday/kids_fairytale/stage_3/stage3_part3_desctop.mp4',
    part3Phone: '/videos/birthday/kids_fairytale/stage_3/stage3_part3_phone.mp4',
    part4Desktop: '/videos/birthday/kids_fairytale/stage_3/stage3_part4_desctop.mp4',
    part4Phone: '/videos/birthday/kids_fairytale/stage_3/stage3_part4_phone.mp4',
    part5Desktop: '/videos/birthday/kids_fairytale/stage_3/stage3_part5_desctop.mp4',
    part5Phone: '/videos/birthday/kids_fairytale/stage_3/stage3_part5_phone.mp4',
    part6Desktop: '/videos/birthday/kids_fairytale/stage_3/stage3_part6_desctop.mp4',
    part6Phone: '/videos/birthday/kids_fairytale/stage_3/stage3_part6_phone.mp4',
  },
  stage4: {
    part1Desktop: '/videos/birthday/kids_fairytale/stage_4/stage4_part1_desctop.mp4',
    part2Desktop: '/videos/birthday/kids_fairytale/stage_4/stage4_part2_desctop.mp4',
  }
};

interface VideoPlayerManagerProps {
  src: string;
  poster?: string;
  onEnded?: () => void;
  className?: string;
}

export const VideoPlayerManager = forwardRef<{
  play: () => Promise<void>;
  pause: () => void;
  videoEl: HTMLVideoElement | null;
}, VideoPlayerManagerProps>(({
  src,
  poster,
  onEnded,
  className = ''
}, ref) => {
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);

  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');
  const [sourceA, setSourceA] = useState<string>(src);
  const [sourceB, setSourceB] = useState<string>('');

  useImperativeHandle(ref, () => ({
    play: async () => {
      const activeEl = activeSlot === 'A' ? videoARef.current : videoBRef.current;
      if (activeEl) {
        activeEl.muted = true;
        await activeEl.play().catch(() => {});
      }
      if (videoARef.current) {
        videoARef.current.muted = true;
        await videoARef.current.play().catch(() => {});
      }
      if (videoBRef.current) {
        videoBRef.current.muted = true;
        await videoBRef.current.play().catch(() => {});
      }
    },
    pause: () => {
      videoARef.current?.pause();
      videoBRef.current?.pause();
    },
    videoEl: activeSlot === 'A' ? videoARef.current : videoBRef.current,
  }));

  useEffect(() => {
    if (!src) return;
    if (activeSlot === 'A') {
      setSourceB(src);
    } else {
      setSourceA(src);
    }
  }, [src]);

  const handleLoadedDataOrPlaying = (slot: 'A' | 'B') => {
    if (slot === 'B' && sourceB === src) {
      setActiveSlot('B');
      if (videoBRef.current) {
        videoBRef.current.muted = true;
        videoBRef.current.play().catch(() => {});
      }
    } else if (slot === 'A' && sourceA === src) {
      setActiveSlot('A');
      if (videoARef.current) {
        videoARef.current.muted = true;
        videoARef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none ${className}`}>
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
        onPlaying={() => handleLoadedDataOrPlaying('A')}
        onLoadedData={() => handleLoadedDataOrPlaying('A')}
        onEnded={activeSlot === 'A' ? onEnded : undefined}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${activeSlot === 'A' ? 'opacity-100 z-[2]' : 'opacity-100 z-[1]'}`}
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
        onPlaying={() => handleLoadedDataOrPlaying('B')}
        onLoadedData={() => handleLoadedDataOrPlaying('B')}
        onEnded={activeSlot === 'B' ? onEnded : undefined}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${activeSlot === 'B' ? 'opacity-100 z-[2]' : 'opacity-100 z-[1]'}`}
      />
    </div>
  );
});

VideoPlayerManager.displayName = 'VideoPlayerManager';
export default VideoPlayerManager;

