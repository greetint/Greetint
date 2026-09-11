'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface IntroSceneProps {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function IntroScene({ childName, isMuted = false, onComplete }: IntroSceneProps) {
  const v1 = useRef<HTMLVideoElement | null>(null);
  const v2 = useRef<HTMLVideoElement | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [mobile, setMobile] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const [holding, setHolding] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.muted = isMuted;
    if (v1.current) v1.current.muted = isMuted;
    if (v2.current) v2.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const playM = () => {
      if (audio.current) {
        audio.current.muted = isMuted;
        audio.current.play().catch(() => {});
      }
      v1.current?.play().catch(() => {});
    };
    playM();
    const fn = () => {
      playM();
      window.removeEventListener('click', fn);
      window.removeEventListener('touchstart', fn);
    };
    window.addEventListener('click', fn);
    window.addEventListener('touchstart', fn);
    return () => {
      window.removeEventListener('click', fn);
      window.removeEventListener('touchstart', fn);
    };
  }, []);

  const v1Ended = () => {
    if (v1.current) {
      v1.current.pause();
      v1.current.currentTime = v1.current.duration - 0.05;
    }
  };

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!audioEnded || unlocked) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setUnlocked(true);
      setHolding(false);
      audio.current?.pause();
      if (v2.current) {
        v2.current.currentTime = 0;
        v2.current.muted = isMuted;
        v2.current.play().catch(() => {});
      }
    }, 600);
  };

  const cancelHold = () => {
    if (unlocked) return;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setHolding(false);
  };

  const v1Src = mobile
    ? '/images/birthday/kids_fairytale/stage_1/stage1_part1_phone.mp4'
    : '/images/birthday/kids_fairytale/stage_1/stage1_part1_desktop.mp4';
  const v2Src = mobile
    ? '/images/birthday/kids_fairytale/stage_1/stage1_part2_phone.mp4'
    : '/images/birthday/kids_fairytale/stage_1/stage1_part2_desktop.mp4';

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none">
      <audio ref={audio} src="/audio/kids_fairytale/stage_1/voice.mp3" preload="auto" onEnded={() => setAudioEnded(true)} />
      <video ref={v1} src={v1Src} playsInline autoPlay muted={isMuted} preload="auto" onEnded={v1Ended} className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${unlocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
      <video ref={v2} src={v2Src} playsInline muted={isMuted} preload="auto" onEnded={onComplete} className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${unlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      {audioEnded && !unlocked && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-4 pointer-events-auto">
          <div className="h-10" />
          <div className="relative flex items-center justify-center w-36 h-36 md:w-48 md:h-48 cursor-pointer rounded-full my-auto" onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold} onTouchStart={startHold} onTouchEnd={cancelHold}>
            {holding && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-amber-300 animate-ping" />
                <Sparkles className="absolute -bottom-4 -right-4 w-8 h-8 text-amber-400 animate-bounce" />
                <Sparkles className="absolute top-0 right-[-20px] w-6 h-6 text-yellow-200 animate-pulse" />
                <Sparkles className="absolute bottom-0 left-[-20px] w-6 h-6 text-amber-200 animate-spin" />
              </div>
            )}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center z-30">
            <p className="text-amber-300 font-serif text-2xl md:text-4xl font-bold drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] tracking-wide">
              Вземи ключа, {childName}!
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default IntroScene;
