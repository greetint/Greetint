'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface BalloonsStageProps {
  onComplete: () => void;
}

export function BalloonsStage({ onComplete }: BalloonsStageProps) {
  const [solved, setSolved] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleSelect = (color: string) => {
    setSelectedColor(color);
    if (color === 'yellow') {
      setSolved(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-pink-200 text-center space-y-6"
    >
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-sky-500 font-bold">
          🎈 Гората на балоните
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241D]">
          Помогни на балоните да си върнат цветовете!
        </h2>
        <p className="text-xs text-[#2C241D]/70">
          Предизвикателство: 🔵 → 🔵 → 🟡 → 🔵 → ? Кой балон следва в редицата?
        </p>
      </div>

      <div className="py-6 flex justify-center items-center gap-6">
        <div className="w-12 h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs">🔵</div>
        <div className="w-12 h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs">🔵</div>
        <div className="w-12 h-16 bg-amber-400 rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs">🟡</div>
        <div className="w-12 h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs">🔵</div>
        <div className="w-12 h-16 bg-dashed border-2 border-pink-400 rounded-full flex items-center justify-center text-pink-600 font-bold text-xs animate-pulse">?</div>
      </div>

      {!solved ? (
        <div className="space-y-4">
          <p className="text-xs font-bold text-[#2C241D]/80 uppercase tracking-widest">Избери правилния цвят:</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSelect('pink')}
              className="px-6 py-3 bg-pink-400 text-white font-bold rounded-2xl shadow hover:bg-pink-500 transition cursor-pointer"
            >
              Розов 🌸
            </button>
            <button
              onClick={() => handleSelect('yellow')}
              className="px-6 py-3 bg-amber-400 text-white font-bold rounded-2xl shadow hover:bg-amber-500 transition cursor-pointer"
            >
              Жълт 🟡
            </button>
            <button
              onClick={() => handleSelect('purple')}
              className="px-6 py-3 bg-purple-400 text-white font-bold rounded-2xl shadow hover:bg-purple-500 transition cursor-pointer"
            >
              Лилав 💜
            </button>
          </div>
          {selectedColor && selectedColor !== 'yellow' && (
            <p className="text-xs text-red-500 font-medium">Опитай отново! Кой цвят се повтаря в редицата?</p>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
            <CheckCircle2 className="w-6 h-6" /> Браво! Балоните полетяха с пълна сила към небето!
          </div>
          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] shadow-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            Към картата <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
