'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { STAGE_VIDEOS, VideoPlayerManager } from './VideoPlayerManager';
import { Sparkles, Mic, Flame } from 'lucide-react';

interface CakeSceneProps {
  childAge: number;
  childName: string;
  isMuted?: boolean;
  onComplete: (wish?: string) => void;
}

export function CakeScene({ childAge, childName, isMuted = false, onComplete }: CakeSceneProps) {
  const [mobile, setMobile] = useState(false);
  const [subStage, setSubStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [audioEnded, setAudioEnded] = useState(false);
  const [childWish, setChildWish] = useState<string>('');
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

  const getVid = (n: number) => {
    const s = STAGE_VIDEOS.stage3;
    const isM = mobile;
    switch (n) {
      case 1: return isM ? s.part1Phone : s.part1Desktop;
      case 2: return isM ? s.part2Phone : s.part2Desktop;
      case 3: return isM ? s.part3Phone : s.part3Desktop;
      case 4: return isM ? s.part4Phone : s.part4Desktop;
      case 5: return isM ? s.part5Phone : s.part5Desktop;
      case 6: return isM ? s.part6Phone : s.part6Desktop;
      default: return s.part1Desktop;
    }
  };

  const currentSrc = getVid(subStage);
  const nextSrc = subStage < 6 ? getVid(subStage + 1) : undefined;

  const handleInteract = () => {
    if (!audioEnded) return;
    if (subStage < 5) {
      setAudioEnded(false);
      setSubStage((subStage + 1) as any);
    }
  };

  const audioSrc = `/audio/kids_fairytale/stage3_voice_part${subStage}.mp3`;

  const text = subStage === 1 
    ? "Виж каква голяма празнична маса! Натисни я, за да я постелим с вълшебна покривка!"
    : subStage === 2
    ? "Докосни покривката, за да подредим вълшебните чинии!"
    : subStage === 3
    ? "Нека да поканим вълшебните приятели за да стане празника още по-невероятен!"
    : subStage === 4
    ? "Нека сложим тортата на масата!"
    : subStage === 5
    ? "Ето я и нея! Затвори очи, намисли си най-съкровеното желание и го духни!"
    : "Честит празник!";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center select-none" onClick={subStage < 5 ? handleInteract : undefined}>
      <audio ref={audioRef} src={audioSrc} preload="auto" onEnded={() => setAudioEnded(true)} />
      <div className="absolute inset-0 z-0 w-full h-full">
        <VideoPlayerManager
          currentVideoSrc={currentSrc}
          nextVideoSrc={nextSrc}
          onVideoEnded={() => { if (subStage === 6) onComplete(childWish || 'Вълшебно желание'); }}
          className="w-full h-full object-cover"
        />
      </div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} key={subStage} className="absolute top-8 inset-x-4 max-w-2xl mx-auto z-40 pointer-events-none">
        <div className="bg-amber-950/40 backdrop-blur-md border border-amber-400/60 rounded-2xl p-4 sm:p-6 text-amber-100 font-serif text-center shadow-2xl">
          <p className="text-sm sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400 leading-relaxed">{text}</p>
        </div>
      </motion.div>
      {subStage < 5 && audioEnded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto cursor-pointer">
          <span className="px-6 py-3 rounded-full bg-amber-400 text-slate-950 font-serif font-bold text-sm shadow-2xl animate-bounce">Докосни екрана за следващата стъпка ✨</span>
        </div>
      )}
      {subStage === 5 && audioEnded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-black/30 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-amber-950/80 border-2 border-amber-300 p-6 rounded-3xl text-center space-y-4 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-serif font-bold text-amber-200">Намисли си желание, {childName}!</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => setChildWish('Вълшебно детско пожелание')} className="w-full py-3 px-6 rounded-2xl bg-amber-500 text-slate-950 font-serif font-bold text-sm shadow-lg">Намисли желание</button>
              <button onClick={() => setSubStage(6)} className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-serif font-bold text-sm shadow-lg flex items-center justify-center gap-2">
                <Flame className="w-5 h-5" /> Духни свещичката
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CakeScene;
