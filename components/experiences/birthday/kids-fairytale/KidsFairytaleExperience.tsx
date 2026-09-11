'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { IntroScene } from './IntroScene';
import { BalloonMeadowScene } from './BalloonMeadowScene';
import { StarValleyScene } from './StarValleyScene';
import { CakeScene } from './CakeScene';
import { FinaleScene } from './FinaleScene';

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

  const childName = data?.childName || 'Габи';
  const childAge = Number(data?.childAge) || 6;
  const senderName = data?.senderName || 'Мама и Тато';
  const personalMessage = data?.personalMessage || 'Ти правиш всеки наш ден изпълнен с усмивки и слънчева светлина. Никога не спирай да мечтаеш и да се радваш на малките чудеса!';
  const favoriteAnimal = data?.favoriteAnimal || 'единорог';

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-200 via-emerald-100 to-sky-300 text-[#1E293B] font-sans overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full text-[#1E293B] hover:bg-white shadow-lg border border-white/60 transition cursor-pointer flex items-center gap-2 text-xs font-bold"
          title={isMuted ? "Включи звука" : "Спри звука"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          <span className="hidden sm:inline">{isMuted ? "Тихо" : "Магически звук"}</span>
        </button>
      </div>

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
            <BalloonMeadowScene 
              key="balloons" 
              onComplete={() => setCurrentScene(2)} 
            />
          )}
          {currentScene === 2 && (
            <StarValleyScene 
              key="stars" 
              onComplete={() => setCurrentScene(3)} 
            />
          )}
          {currentScene === 3 && (
            <CakeScene 
              key="cake" 
              childAge={childAge}
              onComplete={() => setCurrentScene(4)} 
            />
          )}
          {currentScene === 4 && (
            <FinaleScene 
              key="finale" 
              childName={childName}
              senderName={senderName}
              personalMessage={personalMessage}
              favoriteAnimal={favoriteAnimal}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="text-center text-xs text-[#1E293B]/70 font-serif pb-2 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> Вълшебното пътешествие на празника • Създадено за {childName}
      </div>
    </div>
  );
}


