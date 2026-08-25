'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SealStageProps {
  recipient: string;
  onComplete: () => void;
}

export const SealStage: React.FC<SealStageProps> = ({ recipient, onComplete }) => {
  const [isCracking, setIsCracking] = useState(false);

  const handleCrack = () => {
    setIsCracking(true);
    setTimeout(() => {
      onComplete();
    }, 1200); // Даваме време на златистия блясък и частиците да се разгърнат
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="space-y-8 max-w-md mx-auto text-center relative z-10"
    >
      <span className="text-[11px] uppercase tracking-[0.35em] text-[#958679] font-sans font-bold block">
        GREETINT ARCHIVE // 2026
      </span>

      {/* 3D ИНТЕРАКТИВЕН ЗЛАТЕН ПЕЧАТ */}
      <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
        
        {/* Анимиран златен ореол зад печата */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-[#DBCEB3] via-[#958679] to-[#DBCEB3] rounded-full blur-2xl opacity-40 pointer-events-none"
        />

        {/* Ефект на пръскащи се златни частици при клик */}
        {isCracking && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.8 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 border-4 border-[#DBCEB3] rounded-full animate-ping pointer-events-none"
          />
        )}

        <motion.div
          whileHover={{ scale: 1.06, rotate: 2 }}
          whileTap={{ scale: 0.92, rotate: -2 }}
          animate={isCracking ? { scale: [1, 1.2, 0], rotate: [0, 15, -15] } : { y: [0, -8, 0] }}
          transition={isCracking ? { duration: 0.8 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
          onClick={handleCrack}
          className="cursor-pointer relative z-10 w-full h-full flex items-center justify-center"
        >
          <img
            src="/images/assets/gold-seal.png"
            alt="GREETINT Gold Seal"
            className="w-60 h-60 object-contain drop-shadow-[0_25px_60px_rgba(31,26,23,0.35)]"
          />
        </motion.div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-serif uppercase tracking-wide text-[#1F1A17]">За {recipient}</h2>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#958679] font-sans font-bold animate-pulse">
          [ Докосни златния печат, за да отвориш лентата ]
        </p>
      </div>
    </motion.div>
  );
};