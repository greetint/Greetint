'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, ArrowLeft } from 'lucide-react';
import { IntroStage } from './IntroStage';
import { BirthdayStage } from './BirthdayStage';
import { MapStage } from './MapStage';
import { StarsStage } from './StarsStage';
import { BalloonsStage } from './BalloonsStage';
import { GiftStage } from './GiftStage';
import { CakeStage } from './CakeStage';
import { FinaleStage } from './FinaleStage';

interface KidsFairytaleExperienceProps {
  data: {
    childName?: string;
    childAge?: string | number;
    senderName?: string;
    personalMessage?: string;
    favoriteColor?: string;
    favoriteAnimal?: string;
  };
}

export function KidsFairytaleExperience({ data }: KidsFairytaleExperienceProps) {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [unlockedStages, setUnlockedStages] = useState<number[]>([0]);

  const childName = data?.childName || 'Габи';
  const childAge = Number(data?.childAge) || 6;
  const senderName = data?.senderName || 'Мама и Тато';
  const personalMessage = data?.personalMessage || 'Ти правиш всеки наш ден изпълнен с усмивки и вълшебство. Никога не спирай да мечтаеш и да се радваш на малките чудеса!';
  const favoriteColor = data?.favoriteColor || '#FFB6C1';
  const favoriteAnimal = data?.favoriteAnimal || 'единорог';

  const unlockNextStage = (stageNum: number) => {
    if (!unlockedStages.includes(stageNum)) {
      setUnlockedStages(prev => [...prev, stageNum]);
    }
    setCurrentStage(stageNum);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFF0F5] via-[#FFF8FA] to-[#FCE4EC] text-[#2C241D] font-sans overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center max-w-4xl mx-auto pointer-events-auto">
        <button
          onClick={() => {
            if (currentStage > 0) setCurrentStage(currentStage - 1);
          }}
          className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-[#5C4A42] hover:bg-white shadow-md border border-[#958679]/20 flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-[#958679]/20 text-xs font-bold text-[#5C4A42] uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-pink-500 animate-spin" />
          <span>Етап {currentStage} / 7</span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-white/80 backdrop-blur-md p-2.5 rounded-full text-[#5C4A42] hover:bg-white shadow-md border border-[#958679]/20 transition"
          title={isMuted ? "Включи звука" : "Спри звука"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-pink-500" />}
        </button>
      </div>

      {/* Main Stage Container */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex items-center justify-center relative mt-12 mb-6">
        <AnimatePresence mode="wait">
          {currentStage === 0 && (
            <IntroStage 
              key="intro" 
              onComplete={() => unlockNextStage(1)} 
            />
          )}
          {currentStage === 1 && (
            <BirthdayStage 
              key="birthday" 
              childName={childName}
              onComplete={() => unlockNextStage(2)} 
            />
          )}
          {currentStage === 2 && (
            <MapStage 
              key="map" 
              unlockedStages={unlockedStages}
              onSelectStage={(stageId) => setCurrentStage(stageId)}
            />
          )}
          {currentStage === 3 && (
            <StarsStage 
              key="stars" 
              onComplete={() => {
                unlockNextStage(2); // back to map or next
              }} 
            />
          )}
          {currentStage === 4 && (
            <BalloonsStage 
              key="balloons" 
              onComplete={() => {
                unlockNextStage(2);
              }} 
            />
          )}
          {currentStage === 5 && (
            <GiftStage 
              key="gift" 
              personalMessage={personalMessage}
              favoriteAnimal={favoriteAnimal}
              onComplete={() => {
                unlockNextStage(2);
              }} 
            />
          )}
          {currentStage === 6 && (
            <CakeStage 
              key="cake" 
              childAge={childAge}
              onComplete={() => unlockNextStage(7)} 
            />
          )}
          {currentStage === 7 && (
            <FinaleStage 
              key="finale" 
              childName={childName}
              senderName={senderName}
              personalMessage={personalMessage}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation helper for testing */}
      <div className="text-center text-[10px] text-[#5C4A42]/60 uppercase tracking-widest pb-2">
        Kids Fairytale Sandbox • Създадено с магия за {childName}
      </div>
    </div>
  );
}
