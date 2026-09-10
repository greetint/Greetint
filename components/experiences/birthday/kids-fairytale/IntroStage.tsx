'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, DoorOpen } from 'lucide-react';

interface IntroStageProps {
  onComplete: () => void;
}

export function IntroStage({ onComplete }: IntroStageProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [doorOpened, setDoorOpened] = useState(false);

  const handleStartMagic = () => {
    setIsDrawing(true);
    setTimeout(() => {
      setDoorOpened(true);
      setTimeout(() => {
        onComplete();
      }, 1200);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-pink-200 text-center flex flex-col items-center justify-center space-y-8 relative overflow-hidden"
    >
      {/* Background magical glowing particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute text-pink-300"
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 space-y-4 max-w-md">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-flex p-4 bg-pink-100 rounded-2xl text-pink-600 shadow-inner mb-2"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C241D]">
          Магическият Портал
        </h1>

        <p className="text-sm sm:text-base text-[#2C241D]/70 leading-relaxed font-sans">
          Имало едно време едно специално дете, което днес празнува своя рожден ден. Зад тази тайнствена врата се крие едно незабравимо приключение!
        </p>

        {isDrawing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-4 text-pink-600 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2"
          >
            <DoorOpen className="w-5 h-5 animate-bounce" /> Звездата рисува магическата врата...
          </motion.div>
        )}

        {!isDrawing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartMagic}
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-400 text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" /> Влез в приказката
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
