'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CapsuleStageProps {
  onGeneratePdf: (answers: string[]) => void;
}

const QUESTIONS = [
  '1. Главна цел за новата година?',
  '2. Мечтано място за пътуване?',
  '3. Най-ценният урок от изминалата година?',
  '4. Нов навик, който искаш да започнеш?',
  '5. Кое те кара да се смееш от сърце?',
  '6. Твоето лично обещание днес?',
  '7. Послание към бъдещето ти "Аз":'
];

export const CapsuleStage: React.FC<CapsuleStageProps> = ({ onGeneratePdf }) => {
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));

  const handleChange = (index: number, val: string) => {
    const updated = [...answers];
    updated[index] = val;
    setAnswers(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6 }}
      className="max-w-lg w-full mx-auto space-y-4 text-center"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-sans font-bold block">
        Капсула на Времето // 2026
      </span>

      <div className="bg-[#FEFEFD]/95 p-6 rounded-2xl shadow-2xl space-y-3 max-h-[65vh] overflow-y-auto border border-[#958679]/30 text-left">
        {QUESTIONS.map((q, idx) => (
          <div key={idx} className="space-y-1">
            <label className="block text-[10px] uppercase text-[#958679] font-bold font-sans">
              {q}
            </label>
            <input
              type="text"
              value={answers[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder="Твоят отговор..."
              className="w-full bg-[#F7F4EF] border border-[#958679]/20 p-2.5 text-xs rounded-lg font-sans focus:outline-none focus:border-[#1F1A17]"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => onGeneratePdf(answers)}
        className="w-full bg-[#1F1A17] text-[#FEFEFD] py-4 text-xs uppercase tracking-[0.25em] font-bold rounded-xl shadow-2xl hover:bg-[#958679] transition"
      >
        ЗАПЕЧАТАЙ & ГЕНЕРИРАЙ PDF АРХИВ 📄✨
      </button>
    </motion.div>
  );
};