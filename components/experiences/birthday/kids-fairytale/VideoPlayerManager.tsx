'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

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
    part1Desktop: '/images/kids_fairytale/stage_3/stage3_part1_desctop.mp4',
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }
    },
    pause: () => {
      videoRef.current?.pause();
    },
    videoEl: videoRef.current,
  }));

  useEffect(() => {
    const el = videoRef.current;
    if (el) {
      el.src = src;
      el.load();
      el.play().catch(() => {});
    }
  }, [src]);

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none ${className}`}>
      <video
        ref={videoRef}
        src={src}
        muted={true}
        playsInline={true}
        webkit-playsinline="true"
        autoPlay={true}
        controls={false}
        preload="auto"
        disablePictureInPicture={true}
        onEnded={onEnded}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover z-[1]"
      />
    </div>
  );
});

VideoPlayerManager.displayName = 'VideoPlayerManager';
export default VideoPlayerManager;
