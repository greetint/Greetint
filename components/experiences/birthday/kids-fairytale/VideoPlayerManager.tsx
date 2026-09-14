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
    part3Desktop: '/images/kids_fairytale/stage_2/stage_2_part3_desktop.mp4',
    part3Phone: '/images/kids_fairytale/stage_2/stage_2_part3_phone.mp4',
  },
  stage3: {
    part1Desktop: '/images/kids_fairytale/stage_3/stage3_part1_desctop.mp4', // Внимание: `desctop` с 'c'!
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
  videoSrc: string;
  audioSrc?: string;
  poster?: string;
  isActive: boolean;
  onVideoEnded?: () => void;
  onAudioEnded?: () => void;
  className?: string;
}

export const VideoPlayerManager = forwardRef<{
  play: () => Promise<void>;
  pause: () => void;
  videoEl: HTMLVideoElement | null;
  audioEl: HTMLAudioElement | null;
}, VideoPlayerManagerProps>(({
  videoSrc,
  audioSrc,
  poster,
  isActive,
  onVideoEnded,
  onAudioEnded,
  className = ''
}, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    play: async () => {
      try {
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
        if (audioRef.current && isVideoReady) {
          await audioRef.current.play();
        }
        setHasStartedPlaying(true);
      } catch (err) {
        console.log("Autoplay prevented, waiting for user gesture", err);
      }
    },
    pause: () => {
      videoRef.current?.pause();
      audioRef.current?.pause();
    },
    videoEl: videoRef.current,
    audioEl: audioRef.current,
  }));

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc, isActive]);

  const handleCanPlayThrough = () => {
    setIsVideoReady(true);
    if (isActive && !hasStartedPlaying) {
      videoRef.current?.play().then(() => {
        setHasStartedPlaying(true);
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }).catch((err) => {
        console.log("Play failed on canplaythrough:", err);
      });
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black select-none pointer-events-none ${className}`}>
      {audioSrc && (
        <audio 
          ref={audioRef} 
          src={audioSrc} 
          preload="auto" 
          muted={false}
          onEnded={onAudioEnded} 
        />
      )}

      {!isVideoReady && poster && (
        <img 
          src={poster} 
          alt="Loading frame..." 
          className="absolute inset-0 w-full h-full object-cover filter blur-[2px] opacity-80 z-0 select-none" 
        />
      )}

      <video
        ref={videoRef}
        id="main-video-player"
        src={videoSrc}
        muted={true}
        playsInline={true}
        webkit-playsinline="true"
        autoPlay={isActive}
        controls={false}
        preload="auto"
        disablePictureInPicture={true}
        onCanPlayThrough={handleCanPlayThrough}
        onLoadedData={handleCanPlayThrough}
        onEnded={onVideoEnded}
        onError={(e) => console.error("Video load error for path:", e.currentTarget.src)}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 ${isActive && isVideoReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
});

VideoPlayerManager.displayName = 'VideoPlayerManager';
export default VideoPlayerManager;
