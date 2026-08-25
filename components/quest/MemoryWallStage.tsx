'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export interface MemoryPhotoItem {
  url: string;
  question: string;
  answer: string;
  unlocked: boolean;
}

interface MemoryWallStageProps {
  photos: MemoryPhotoItem[];
  onComplete: () => void;
}

export const MemoryWallStage: React.FC<MemoryWallStageProps> = ({ photos: initialPhotos, onComplete }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [photoList, setPhotoList] = useState<MemoryPhotoItem[]>(initialPhotos);
  const [inputs, setInputs] = useState<string[]>(Array(initialPhotos.length).fill(''));

  const handleUnlock = (index: number) => {
    const photo = photoList[index];
    const userAns = inputs[index].trim().toUpperCase();

    if (!photo.answer || userAns === photo.answer.toUpperCase()) {
      const updated = [...photoList];
      updated[index].unlocked = true;
      setPhotoList(updated);
    } else {
      alert('Грешен шифър за тази снимка! Опитай пак... 😜');
    }
  };

  const allUnlocked = photoList.every((p) => p.unlocked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full mx-auto space-y-6 text-center"
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-sans font-bold">
          Polaroid Memory Wall 📸
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#1F1A17] font-sans font-bold bg-[#DBCEB3]/30 px-2.5 py-1 rounded-full">
          {photoList.filter((p) => p.unlocked).length} / {photoList.length} Отключени
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative min-h-[380px] w-full bg-[#EFECE6]/60 border border-[#958679]/30 rounded-2xl p-4 shadow-inner space-y-4 overflow-y-auto max-h-[60vh]"
      >
        {photoList.map((photo, idx) => (
          <motion.div
            key={idx}
            drag
            dragConstraints={containerRef}
            dragElastic={0.05}
            className="bg-[#FEFEFD] p-3 rounded-xl border border-[#958679]/30 shadow-xl space-y-3 cursor-grab active:cursor-grabbing"
          >
            <div className="relative h-44 w-full rounded-lg overflow-hidden bg-[#F7F4EF]">
              <img
                src={photo.url}
                alt="Memory"
                className={`w-full h-full object-cover transition-all duration-700 pointer-events-none ${
                  photo.unlocked ? 'blur-0 scale-100' : 'blur-lg scale-105'
                }`}
              />

              {!photo.unlocked && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 text-center">
                  <p className="text-xs text-white font-serif italic">"{photo.question}"</p>
                </div>
              )}
            </div>

            {!photo.unlocked ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputs[idx]}
                  onChange={(e) => {
                    const u = [...inputs];
                    u[idx] = e.target.value;
                    setInputs(u);
                  }}
                  placeholder="Въведи шифъра..."
                  className="flex-1 bg-[#F7F4EF] border border-[#958679]/30 p-2 rounded-lg text-xs font-sans uppercase"
                />
                <button
                  onClick={() => handleUnlock(idx)}
                  className="bg-[#1F1A17] text-[#FEFEFD] px-4 py-2 text-xs uppercase font-bold rounded-lg hover:bg-[#958679] transition"
                >
                  Отключи
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-sans font-bold text-green-700 uppercase block tracking-wider">
                ✨ Отключен Спомен
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <button
        onClick={onComplete}
        disabled={!allUnlocked}
        className="w-full bg-[#1F1A17] text-[#FEFEFD] py-4 text-xs uppercase tracking-[0.2em] font-bold rounded-xl shadow-xl disabled:opacity-30 hover:bg-[#958679] transition"
      >
        {allUnlocked ? 'Към Ритуала със Свещта →' : 'Отключи всички снимки, за да продължиш...'}
      </button>
    </motion.div>
  );
};