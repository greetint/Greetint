'use client';
import React, { useState, useRef, useEffect } from 'react';
import { VideoPreloader } from './VideoPreloader';

interface RibbonProps {
  deviceType: 'desktop' | 'phone';
  isMuted: boolean;
  onUnlocked: () => void;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
  onPlaying?: () => void;
}

export function RibbonSubScene({ deviceType, isMuted, onUnlocked, onVideoRef, onPlaying }: RibbonProps) {
  const [holdProg, setHoldProg] = useState(0);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);

  const startRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const v1 = `/videos/birthday/kids-fairytale/stage_4/stage4_part1_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const nextClipSrc = `/videos/birthday/kids-fairytale/stage_4/stage4_part2_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const voice1 = `/audio/kids-fairytale/stage4_voice_part1.mp3`;

  useEffect(() => {
    audioRef.current = new Audio(voice1);
    audioRef.current.muted = isMuted; audioRef.current.play().catch(() => {});
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  useEffect(() => { if (audioRef.current) audioRef.current.muted = isMuted; }, [isMuted]);

  const startHold = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    setTouchPos({ x: clientX, y: clientY });
    startRef.current = Date.now();

    const update = () => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(elapsed / 1500, 1);
      setHoldProg(progress);
      if (progress >= 1) {
        if (audioRef.current) audioRef.current.pause();
        onUnlocked();
      } else {
        animRef.current = requestAnimationFrame(update);
      }
    };
    animRef.current = requestAnimationFrame(update);
  };

  const endHold = () => {
    setHoldProg(0); setTouchPos(null);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <video ref={(el: HTMLVideoElement | null) => onVideoRef?.(el)} onPlaying={onPlaying} src={v1} autoPlay muted playsInline webkit-playsinline="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      {/* Warm the cache for the scratch scene's clip while the ribbon plays. */}
      <VideoPreloader src={nextClipSrc} />
      <div onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} onTouchStart={startHold} onTouchEnd={endHold} className="absolute z-30 w-36 h-36 rounded-full flex items-center justify-center cursor-pointer touch-none">
        {touchPos && (
          <div className="absolute rounded-full pointer-events-none transition-all duration-200" style={{ width: `${Math.max(90, holdProg * 280)}px`, height: `${Math.max(90, holdProg * 280)}px`, background: 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(245,158,11,0.5) 50%, transparent 80%)', boxShadow: '0 0 50px #fbbf24', opacity: 0.3 + holdProg * 0.7 }} />
        )}
        <div className="w-20 h-20 rounded-full bg-amber-500/30 border-2 border-amber-200 backdrop-blur-sm flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-3xl">🎀</span>
        </div>
      </div>
      <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none px-4 z-30">
        <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow animate-pulse">✨ Докосни и задръж възела, за да развържеш панделката!</p>
      </div>
    </div>
  );
}
