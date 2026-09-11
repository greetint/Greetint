'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroSceneProps {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function IntroScene({ childName, isMuted = false, onComplete }: IntroSceneProps) {
  const v1Ref = useRef<HTMLVideoElement | null>(null);
  const v2Ref = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [audioEnded, setAudioEnded] = useState<boolean>(false);
  const [holding, setHolding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (isMuted) audioRef.current.pause();
      else if (started && !audioEnded) audioRef.current.play().catch(() => {});
    }
  }, [isMuted, started, audioEnded]);

  useEffect(() => {
    v1Ref.current?.play().catch(() => {
      const fn = () => {
        if (v1Ref.current?.paused) v1Ref.current.play().catch(() => {});
        window.removeEventListener('click', fn);
        window.removeEventListener('touchstart', fn);
      };
      window.addEventListener('click', fn);
      window.addEventListener('touchstart', fn);
    });
  }, []);

  const timeUpdate = () => {
    if (!v1Ref.current || started) return;
    if (v1Ref.current.currentTime >= 2.0) {
      setStarted(true);
      if (!isMuted && audioRef.current) audioRef.current.play().catch(() => {});
    }
  };

  const v1Ended = () => {
    if (v1Ref.current) {
      v1Ref.current.pause();
      v1Ref.current.currentTime = v1Ref.current.duration - 0.05;
    }
  };

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!audioEnded || unlocked) return;
    setHolding(true);
    const startT = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startT;
      const p = Math.min((elapsed / 1500) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        setUnlocked(true);
        setHolding(false);
        if (audioRef.current) audioRef.current.pause();
        if (v2Ref.current) {
          v2Ref.current.currentTime = 0;
          v2Ref.current.play().catch(() => {});
        }
      } else {
        reqRef.current = requestAnimationFrame(animate);
      }
    };
    reqRef.current = requestAnimationFrame(animate);
  };

  const cancelHold = () => {
    if (unlocked) return;
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    setHolding(false);
    setProgress(0);
  };

  const v1Src = isMobile ? '/images/birthday/kids_fairytale/stage_1/stage1_part1_phone.mp4' : '/images/birthday/kids_fairytale/stage_1/stage1_part1_desktop.mp4';
  const v2Src = isMobile ? '/images/birthday/kids_fairytale/stage_1/stage1_part2_phone.mp4' : '/images/birthday/kids_fairytale/stage_1/stage1_part2_desktop.mp4';
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none">
      <audio ref={audioRef} src="/audio/kids_fairytale/stage_1/voice.mp3" onEnded={() => setAudioEnded(true)} />
      <video ref={v1Ref} src={v1Src} playsInline muted onTimeUpdate={timeUpdate} onEnded={v1Ended} className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${unlocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
      <video ref={v2Ref} src={v2Src} playsInline muted onEnded={onComplete} className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${unlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      {audioEnded && !unlocked && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-4 pointer-events-auto">
          <div className="h-10" />
          <div className="relative flex items-center justify-center w-36 h-36 md:w-48 md:h-48 cursor-pointer rounded-full my-auto" onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold} onTouchStart={startHold} onTouchEnd={cancelHold}>
            {holding && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="6" />
                <circle cx="70" cy="70" r="62" fill="none" stroke="#FFD700" strokeWidth="6" strokeDasharray="389.55" strokeDashoffset={389.55 - (389.55 * progress) / 100} strokeLinecap="round" />
              </svg>
            )}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center z-30">
            <span className="px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/50 text-amber-300 text-lg md:text-2xl font-bold font-serif shadow-2xl drop-shadow-lg">
              Вземи ключа, {childName}!
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
export default IntroScene;
