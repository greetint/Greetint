'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Cake } from 'lucide-react';

interface BirthdayStageProps {
  childName: string;
  onComplete: () => void;
}

export function BirthdayStage({ childName, onComplete }: BirthdayStageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-pink-200 text-center flex flex-col items-center justify-center space-y-8 relative overflow-hidden"
    >
      <div className="space-y-4 max-w-lg">
        <div className="inline-flex p-3 bg-amber-100 rounded-full text-amber-600 mb-2">
          <Cake className="w-8 h-8" />
        </div>

        <p className="text-sm sm:text-lg text-[#2C241D]/80 font-serif italic">
          „Днес е един много специален ден... Ден, в който едно прекрасно дете празнува своя рожден ден.“
        </p>

        <div className="py-6 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-bold">
            И това дете се казва...
          </span>

          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 py-3 drop-shadow-sm"
          >
            {childName} ✨
          </motion.h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="w-full bg-[#2C241D] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] shadow-lg hover:bg-[#4A3D34] transition flex items-center justify-center gap-3 cursor-pointer"
        >
          Към картата на приключението <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
