'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stage1SceneProps {
  deviceType: 'desktop' | 'phone';
  onComplete: () => void;
}

export function Stage1Scene({ deviceType, onComplete }: Stage1SceneProps) {
  const [part, setPart] = useState<1 | 2>(1);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const video1Src = `/videos/birthday/kids-fairytale/stage_1/stage1_part1_${deviceType}.mp4`;
  const video2Src = `/videos/birthday/kids-fairytale/stage_1/stage1_part2_${deviceType}.mp4`;
  const audioSrc = `/audio/kids-fairytale/stage1_voice.mp3`;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (part === 2) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.play().catch(() => {});
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [part]);

  const handleVideoEnded = () => {
    if (part === 1) {
      setPart(2);
    }
  };

  const startHold = () => {
    if (part !== 2 || isUnlocked) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();

    const updateHold = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / 1500, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        setIsUnlocked(true);
        if (audioRef.current) audioRef.current.pause();
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        animFrameRef.current = requestAnimationFrame(updateHold);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateHold);
  };

  const endHold = () => {
    if (isUnlocked) return;
    setIsHolding(false);
    setHoldProgress(0);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden bg-black select-none flex items-center justify-center">
      <video
        key={part}
        src={part === 1 ? video1Src : video2Src}
        autoPlay
        muted
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {part === 2 && !isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 z-20 pointer-events-auto">
          <div className="text-center mb-6">
            <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-bounce">
              Натисни и задръж вълшебния ключ ✨
            </p>
          </div>

          <div
            onMouseDown={startHold}
            onMouseUp={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="relative w-36 h-36 md:w-48 md:h-48 rounded-full flex items-center justify-center cursor-pointer select-none"
          >
            <div
              className="absolute inset-0 rounded-full bg-amber-400/30 blur-xl transition-all duration-200"
              style={{
                transform: `scale(${1 + holdProgress * 0.8})`,
                opacity: 0.3 + holdProgress * 0.7,
              }}
            />
            <div
              className="absolute inset-2 rounded-full border-4 border-amber-300 shadow-[0_0_30px_#fbbf24]"
              style={{
                clipPath: `circle(${holdProgress * 100}% at center)`,
              }}
            />
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-amber-500/40 border-2 border-amber-200 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-3xl md:text-5xl">🗝️</span>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-amber-200 z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="text-amber-950 font-serif italic text-4xl md:text-6xl font-bold animate-pulse">
              Вратата към замъка се отваря! ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
