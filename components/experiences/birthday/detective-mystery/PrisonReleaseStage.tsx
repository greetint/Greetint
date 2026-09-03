'use client';

import React, { useState, useEffect } from 'react';
import { speakBulgarian } from './utils/speech';

interface PrisonReleaseProps {
  recipient: string;
  age: string;
  sender: string;
  charges: string[];
  photos: { fileUrl: string }[];
  redactedWish: string;
}

export function PrisonReleaseStage({ recipient, age, sender, charges, photos, redactedWish }: PrisonReleaseProps) {
  const [answers, setAnswers] = useState<string[]>([
    '', '', '', '', '', '', ''
  ]);

  const questionsList = [
    "1. Кое беше най-голямото ти престъпление (изцепка) през изминалата година?",
    "2. Кой съучастник (приятел) ти помогна най- много през последните 12 месеца?",
    "3. Кой е най-ценният трофей / спомен, който отнасяш със себе си?",
    "4. Каква е голямата цел за следващата година на свобода?",
    "5. Коя държава или град подготвяш за следващия си голям обир / пътуване?",
    "6. Какъв специален план имаш за следващия си рожден ден?",
    "7. Какво е твоето лично послание към теб самия / самите инспектори?"
  ];

  useEffect(() => {
    // Play stamp sound from exact path /audio/detective/stamp.mp3
    const audio = new Audio('/audio/detective/stamp.mp3');
    audio.volume = 0.8;
    audio.play().catch(() => {});

    const text = `Присъдата е изменена. Субектът е освободен предсрочно с пълни права за купон. Попълнете финалния протокол за следващата година.`;
    speakBulgarian(text, 0.95, 1.0);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="relative w-full h-full bg-[#11100F] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-6 select-none overflow-y-auto">
      <div className="max-w-2xl w-full bg-[#EFECE6] text-[#1F1A17] p-8 sm:p-12 rounded-2xl shadow-2xl border border-[#958679]/40 space-y-8 relative my-auto">
        
        {/* PAROLE STAMP */}
        <div className="absolute top-6 right-6 border-4 border-red-700 text-red-700 px-4 py-2 rounded-lg font-extrabold uppercase text-xs tracking-[0.25em] transform rotate-[-8deg] opacity-85 shadow-md">
          RELEASED ON PAROLE // ОСВОБОДЕН
        </div>

        <div className="border-b border-black/20 pb-4 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-red-700 font-bold">ФЕДЕРАЛЕН ПРОТОКОЛ ЗА ОСВОБОЖДАВАНЕ</span>
          <h2 className="text-2xl font-serif font-bold uppercase text-black">Мисия Бъдеще: Заподозрян {recipient}</h2>
          <p className="text-xs text-black/70">Инспектор по случая: {sender}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-widest text-black/80">Попълнете своя протокол за следващата година:</h3>
          
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
            {questionsList.map((q, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-black/10 space-y-2 shadow-xs">
                <label className="text-xs font-bold text-black block">{q}</label>
                <input 
                  type="text" 
                  value={answers[idx]} 
                  onChange={e => {
                    const u = [...answers];
                    u[idx] = e.target.value;
                    setAnswers(u);
                  }} 
                  placeholder="Въведете вашия отговор тук..." 
                  className="w-full bg-[#F7F4EF] border border-black/20 p-2.5 rounded-lg text-xs font-sans text-black focus:outline-none focus:border-red-700"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handlePrintDossier}
            className="flex-1 bg-red-700 hover:bg-red-600 text-white py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-bold shadow-xl transition cursor-pointer"
          >
            🖨️ Принтирай Федералното Досие (PDF)
          </button>
        </div>

      </div>
    </div>
  );
}

