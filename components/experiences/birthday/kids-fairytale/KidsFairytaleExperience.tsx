'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { IntroScene } from './IntroScene';
import { PartyHallScene } from './PartyHallScene';
import { CakeScene } from './CakeScene';
import { GiftFinaleScene } from './GiftFinaleScene';

interface KidsFairytaleExperienceProps {
  data: {
    childName?: string;
    childAge?: string | number;
    senderName?: string;
    personalMessage?: string;
    favoriteAnimal?: string;
  };
}

export function KidsFairytaleExperience({ data }: KidsFairytaleExperienceProps) {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const childName = data?.childName || 'Габи';
  const childAge = Number(data?.childAge) || 6;
  const senderName = data?.senderName || 'Мама и Тато';
  const personalMessage = data?.personalMessage || 'Ти правиш всеки наш ден изпълнен с усмивки и слънчева светлина. Никога не спирай да мечтаеш и да се радваш на малките чудеса!';
  const favoriteAnimal = data?.favoriteAnimal || 'единорог';

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.muted = isMuted;
      bgAudioRef.current.volume = 0.3;
      bgAudioRef.current.loop = true;
      const playBg = () => {
        bgAudioRef.current?.play().catch(() => {});
      };
      playBg();
      window.addEventListener('click', playBg, { once: true });
      window.addEventListener('touchstart', playBg, { once: true });
      return () => {
        window.removeEventListener('click', playBg);
        window.removeEventListener('touchstart', playBg);
      };
    }
  }, []);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-200 via-emerald-100 to-sky-300 text-[#1E293B] font-sans overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <audio ref={bgAudioRef} src="/audio/background-music.mp3" preload="auto" loop />

      <div className="w-full max-w-4xl mx-auto flex-1 flex items-center justify-center relative my-auto">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <IntroScene 
              key="intro" 
              childName={childName}
              isMuted={isMuted}
              onComplete={() => setCurrentScene(1)} 
            />
          )}
          {currentScene === 1 && (
            <PartyHallScene 
              key="party-hall" 
              childName={childName}
              isMuted={isMuted}
              onComplete={() => setCurrentScene(2)} 
            />
          )}
          {currentScene === 2 && (
            <CakeScene 
              key="cake" 
              childAge={childAge}
              childName={childName}
              isMuted={isMuted}
              onComplete={() => setCurrentScene(3)} 
            />
          )}
          {currentScene === 3 && (
            <GiftFinaleScene 
              key="finale" 
              childName={childName}
              senderName={senderName}
              personalMessage={personalMessage}
              favoriteAnimal={favoriteAnimal}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="text-center text-xs text-[#1E293B]/70 font-serif pb-2 flex items-center justify-center gap-2 z-40">
        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> Вълшебното пътешествие на празника • Създадено за {childName}
      </div>

      {/* Central and global Sound button rendered on top with z-[100] */}
      <div className="fixed top-4 right-4 z-[100] flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full text-[#1E293B] hover:bg-white shadow-2xl border border-white/85 transition cursor-pointer flex items-center gap-2 text-xs font-bold"
          title={isMuted ? "Включи звука" : "Спри звука"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          <span className="hidden sm:inline">{isMuted ? "Тихо" : "Магически звук"}</span>
        </button>
      </div>
    </div>
  );
}

export default KidsFairytaleExperience;
