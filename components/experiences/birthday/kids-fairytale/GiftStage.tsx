'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, ArrowRight, Heart } from 'lucide-react';

interface GiftStageProps {
  personalMessage: string;
  favoriteAnimal: string;
  onComplete: () => void;
}

export function GiftStage({ personalMessage, favoriteAnimal, onComplete }: GiftStageProps) {
  const [opened, setOpened] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-pink-200 text-center space-y-6"
    >
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-bold">
          🎁 Замъкът на подаръците
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241D]">
          Един магически подарък те очаква!
        </h2>
        <p className="text-xs text-[#2C241D]/70">
          Този специален подарък носи скрито послание и любимия ти приятел ({favoriteAnimal}). Докосни го!
        </p>
      </div>

      {!opened ? (
        <motion.div
          whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpened(true)}
          className="my-8 inline-flex p-8 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-3xl text-white shadow-xl cursor-pointer relative"
        >
          <Gift className="w-20 h-20 animate-bounce" />
          <div className="absolute -top-2 -right-2 bg-amber-300 text-amber-900 p-2 rounded-full shadow">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-300 shadow-inner space-y-4 my-4 text-left"
        >
          <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-pink-500" /> Тайно послание от сърце:
          </div>
          <p className="text-sm sm:text-base font-serif italic text-[#2C241D] leading-relaxed bg-white/80 p-4 rounded-xl border border-pink-200 shadow-sm">
            „{personalMessage}“
          </p>
          <div className="text-right text-xs text-pink-700/80 font-medium">
            Любим спътник в приключението: <span className="font-bold uppercase">{favoriteAnimal}</span> 🐾
          </div>
        </motion.div>
      )}

      {opened && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="w-full bg-[#2C241D] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] shadow-lg flex items-center justify-center gap-3 cursor-pointer"
        >
          Към следващата спирка <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
