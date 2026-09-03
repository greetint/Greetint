'use client';

import React, { useEffect } from 'react';

interface ArrestStageProps {
  recipient: string;
  age: string;
  onComplete: () => void;
}

export function ArrestStage({ recipient, age, onComplete }: ArrestStageProps) {
  // Voiceover & sound effects
  useEffect(() => {
    // Play door creak sound
    const audio = new Audio('/audio/detective/door-creak.mp3');
    audio.volume = 0.6;
    audio.play().catch(() => {});

    // Web Speech API voiceover
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Внимание. Сигнал от Федералното Бюро. Локализиран е субект с име ${recipient}. Подозрение за максимално ниво на празнуване по случай навършване на ${age} години. Докоснете екрана, за да отворите секретното досие.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bg-BG';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [recipient, age]);

  const handleUnlock = () => {
    onComplete();
  };

  return (
    <div className="relative w-full h-full bg-[#11100F] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      
      {/* Police caution tape top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-yellow-500 text-black font-extrabold uppercase text-xs tracking-[0.3em] flex items-center justify-around overflow-hidden whitespace-nowrap shadow-md z-20">
        <span>⚠️ FBI CAUTION // DO NOT CROSS ⚠️</span>
        <span>⚠️ FBI CAUTION // DO NOT CROSS ⚠️</span>
        <span>⚠️ FBI CAUTION // DO NOT CROSS ⚠️</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-yellow-500 text-black font-extrabold uppercase text-xs tracking-[0.3em] flex items-center justify-around overflow-hidden whitespace-nowrap shadow-md z-20">
        <span>⚠️ CLASSIFIED ARCHIVE // RESTRICTED AREA ⚠️</span>
        <span>⚠️ CLASSIFIED ARCHIVE // RESTRICTED AREA ⚠️</span>
        <span>⚠️ CLASSIFIED ARCHIVE // RESTRICTED AREA ⚠️</span>
      </div>

      <div className="max-w-md w-full bg-[#1A1816] p-8 sm:p-10 rounded-3xl border-2 border-red-600/60 shadow-2xl text-center space-y-8 relative z-10 animate-pulse">
        <div className="inline-block px-4 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/30 text-[10px] uppercase tracking-[0.3em] font-bold">
          SYSTEM ALERT // ФЕДЕРАЛЕН СИГНАЛ
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white font-serif">
            СУБЕКТЪТ Е ЛОКАЛИЗИРАН
          </h1>
          <p className="text-xs text-[#958679] leading-relaxed">
            Заподозрян: <strong className="text-red-400">{recipient}</strong> | Възраст: <strong className="text-red-400">{age}</strong>
          </p>
        </div>

        <button 
          onClick={handleUnlock}
          className="w-full bg-red-700 hover:bg-red-600 text-white py-4 rounded-2xl text-xs uppercase tracking-[0.3em] font-bold shadow-xl transition transform hover:scale-105 border border-red-500/50 cursor-pointer"
        >
          🔓 ОТКРИЙ ФЕДЕРАЛНОТО ДОСИЕ
        </button>
      </div>

    </div>
  );
}
