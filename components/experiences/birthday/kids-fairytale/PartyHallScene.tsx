'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface PartyHallSceneProps {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function PartyHallScene({ childName, isMuted = false, onComplete }: PartyHallSceneProps) {
  const part1Ref = useRef<HTMLVideoElement | null>(null);
  const part2Ref = useRef<HTMLVideoElement | null>(null);

  const [mobile, setMobile] = useState(false);
  const [part1Ended, setPart1Ended] = useState(false);
  const [playingPart2, setPlayingPart2] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (part1Ref.current) part1Ref.current.muted = isMuted;
    if (part2Ref.current) part2Ref.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    part1Ref.current?.play().catch(() => {});
  }, []);

  const handlePart1Ended = () => {
    if (part1Ref.current) {
      part1Ref.current.pause();
      part1Ref.current.currentTime = part1Ref.current.duration - 0.05;
    }
    setPart1Ended(true);
  };

  const handleInteract = () => {
    if (!part1Ended || playingPart2) return;
    setPlayingPart2(true);
    if (part2Ref.current) {
      part2Ref.current.currentTime = 0;
      part2Ref.current.muted = isMuted;
      part2Ref.current.play().catch(() => {});
    }
  };

  const p1Src = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part1_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part1_desktop.mp4';
  const p2Src = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part2_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part2_desktop.mp4';

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none">
      <video
        ref={part1Ref}
        src={p1Src}
        playsInline
        autoPlay
        muted={isMuted}
        preload="auto"
        onEnded={handlePart1Ended}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
          playingPart2 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <video
        ref={part2Ref}
        src={p2Src}
        playsInline
        muted={isMuted}
        preload="auto"
        onEnded={onComplete}
        className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${
          playingPart2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {part1Ended && !playingPart2 && (
        <div
          onClick={handleInteract}
          className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-4 cursor-pointer pointer-events-auto"
        >
          <div className="h-10" />
          <div className="my-auto w-40 h-40 rounded-full flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-amber-300 animate-bounce drop-shadow-[0_0_20px_rgba(255,215,0,0.9)]" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center z-30 px-4"
          >
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] font-serif text-3xl md:text-5xl font-bold tracking-wide animate-pulse">
              Съживи залата за {childName}! ✨
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default PartyHallScene;
