'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { STAGE_VIDEOS, VideoPlayerManager } from './VideoPlayerManager';

interface PartyHallSceneProps {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function PartyHallScene({ childName, isMuted = false, onComplete }: PartyHallSceneProps) {
  const [mobile, setMobile] = useState(false);
  const [subStage, setSubStage] = useState<1 | 2 | 3>(1);
  const [audioEnded, setAudioEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    }
  }, [isMuted, subStage]);

  const v1 = mobile ? STAGE_VIDEOS.stage2.part1Phone : STAGE_VIDEOS.stage2.part1Desktop;
  const v2 = mobile ? STAGE_VIDEOS.stage2.part2Phone : STAGE_VIDEOS.stage2.part2Desktop;
  const v3 = mobile ? STAGE_VIDEOS.stage2.part3Phone : STAGE_VIDEOS.stage2.part3Desktop;

  const currentSrc = subStage === 1 ? v1 : subStage === 2 ? v2 : v3;
  const audioSrc = subStage === 1 ? '/audio/kids_fairytale/stage2_voice_part1.mp3' : subStage === 2 ? '/audio/kids_fairytale/stage2_voice_part2.mp3' : undefined;

  const handleInteract = () => {
    if (!audioEnded) return;
    if (subStage === 1) {
      setAudioEnded(false);
      setSubStage(2);
    } else if (subStage === 2) {
      setAudioEnded(false);
      setSubStage(3);
    }
  };

  const text = subStage === 1 
    ? "Вече сме в празничната залата на замъка! Прокарай пръстче по тавана, за да сложим празничните гирлянди!"
    : subStage === 2
    ? "Стана невероятно! Нарисувай вълшебни кръгчета във въздуха, за да пуснем балоните!"
    : "Празнична подготовка завършена!";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center select-none" onClick={subStage < 3 ? handleInteract : undefined}>
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="auto" onEnded={() => setAudioEnded(true)} />}
      <div className="absolute inset-0 z-0 w-full h-full">
        <VideoPlayerManager
          src={currentSrc}
          onEnded={() => { if (subStage === 3) onComplete(); }}
          className="w-full h-full object-cover"
        />
      </div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} key={subStage} className="absolute top-8 inset-x-4 max-w-2xl mx-auto z-[40] pointer-events-none">
        <div className="bg-amber-950/40 backdrop-blur-md border border-amber-400/60 rounded-2xl p-4 sm:p-6 text-amber-100 font-serif text-center shadow-2xl">
          <p className="text-sm sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400 leading-relaxed">{text}</p>
        </div>
      </motion.div>
      {subStage < 3 && audioEnded && (
        <div className="absolute inset-0 z-[50] flex items-center justify-center pointer-events-auto cursor-pointer">
          <span className="px-6 py-3 rounded-full bg-amber-400 text-slate-950 font-serif font-bold text-sm shadow-2xl animate-bounce">Докосни екрана за следващата стъпка ✨</span>
        </div>
      )}
    </div>
  );
}

export default PartyHallScene;
