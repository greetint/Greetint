'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stage1SceneProps {
  deviceType: 'desktop' | 'phone';
  isMuted: boolean;
  onComplete: () => void;
}

export function Stage1Scene({ deviceType, isMuted, onComplete }: Stage1SceneProps) {
  const [phase, setPhase] = useState<'part1' | 'pausedAtKey' | 'part2' | 'unlocked'>('part1');
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);

  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const video1Src = `/videos/birthday/kids-fairytale/stage_1/stage1_part1_${deviceType}.mp4`;
  const video2Src = `/videos/birthday/kids-fairytale/stage_1/stage1_part2_${deviceType}.mp4`;
  const audioSrc = `/audio/kids-fairytale/stage1_voice.mp3`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleVideo1Ended = () => {
    if (phase === 'part1') {
      setPhase('pausedAtKey');
    }
  };

  const handleVideo2Ended = () => {
    setPhase('unlocked');
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  const startHold = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    if (phase !== 'pausedAtKey') return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    setTouchPos({ x: clientX, y: clientY });

    startTimeRef.current = Date.now();

    const updateHold = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / 1500, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        setPhase('part2');
        audioRef.current = new Audio(audioSrc);
        audioRef.current.muted = isMuted;
        audioRef.current.play().catch(() => {});
      } else {
        animFrameRef.current = requestAnimationFrame(updateHold);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateHold);
  };

  const endHold = () => {
    if (phase === 'part2' || phase === 'unlocked') return;
    setHoldProgress(0);
    setTouchPos(null);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden bg-black select-none flex items-center justify-center">
      <video
        key={phase === 'part2' || phase === 'unlocked' ? 'v2' : 'v1'}
        src={phase === 'part2' || phase === 'unlocked' ? video2Src : video1Src}
        autoPlay={phase !== 'pausedAtKey'}
        muted={true}
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        onEnded={phase === 'part1' ? handleVideo1Ended : handleVideo2Ended}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {phase === 'pausedAtKey' && (
        <div
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className="absolute inset-0 z-30 cursor-pointer touch-none flex items-center justify-center"
        >
          <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center">
            {touchPos && (
              <div
                className="absolute rounded-full pointer-events-none transition-all duration-200"
                style={{
                  left: `${touchPos.x}px`,
                  top: `${touchPos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: `${Math.max(80, holdProgress * 300)}px`,
                  height: `${Math.max(80, holdProgress * 300)}px`,
                  background: 'radial-gradient(circle, rgba(251,191,36,0.8) 0%, rgba(245,158,11,0.4) 50%, transparent 80%)',
                  boxShadow: '0 0 40px #fbbf24',
                  opacity: 0.2 + holdProgress * 0.8,
                }}
              />
            )}
          </div>

          <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none px-4">
            <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] animate-pulse">
              ✨ Натисни и задръж върху вълшебния ключ...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
