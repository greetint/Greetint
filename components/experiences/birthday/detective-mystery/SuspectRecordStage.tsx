'use client';

import React, { useEffect } from 'react';
import { speakBulgarian } from './utils/speech';

interface SuspectRecordProps {
  recipient: string;
  age: string;
  charges: string[];
  isMuted?: boolean;
  onComplete: () => void;
}

export function SuspectRecordStage({ recipient, age, charges, isMuted = false, onComplete }: SuspectRecordProps) {
  useEffect(() => {
    const text = `Заподозрян разпознат. Преглед на официалните обвинения и престъпления за изминалата година. Започнете разследване.`;
    speakBulgarian(text, isMuted, 0.92, 1.0);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isMuted]);

  return (
    <div className="relative w-full h-full bg-[#11100F] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-6 select-none overflow-y-auto">
      <div className="max-w-lg w-full bg-[#EFECE6] text-[#1F1A17] p-8 sm:p-10 rounded-2xl shadow-2xl border border-[#958679]/40 space-y-6 relative transform rotate-1">
        
        {/* Paperclip header mock */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-6 bg-slate-400 rounded-t-full border-2 border-slate-600 shadow-md" />

        <div className="flex justify-between items-start border-b border-black/20 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-red-700 font-bold block">Официално Досие на Субекта</span>
            <h2 className="text-2xl font-serif font-bold uppercase tracking-wide text-black">{recipient}</h2>
          </div>
          <div className="bg-red-700 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Възраст: {age}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs uppercase font-bold tracking-widest text-black/70">Регистрирани обвинения / престъпления:</h3>
          <ul className="space-y-2">
            {charges.map((charge, idx) => (
              <li key={idx} className="bg-white/80 p-3 rounded-xl border border-black/10 text-xs text-black flex items-start gap-3 shadow-xs">
                <span className="text-red-700 font-bold">#{idx + 1}</span>
                <span>{charge}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-900 font-serif italic">
          „Присъда: Навършване на {age} години при строго затворнически режим на купон и неограничени празненства.“
        </div>

        <button 
          onClick={onComplete}
          className="w-full bg-[#1F1A17] hover:bg-black text-[#F7F4EF] py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-bold shadow-lg transition cursor-pointer"
        >
          Продължи към дигиталната лупа →
        </button>
      </div>
    </div>
  );
}


