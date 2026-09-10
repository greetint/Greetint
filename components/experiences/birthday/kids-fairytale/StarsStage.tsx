'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';

interface StarsStageProps {
  onComplete: () => void;
}

export function StarsStage({ onComplete }: StarsStageProps) {
  const [starsCollected, setStarsCollected] = useState<number>(0);
  const totalStars = 5;

  const handleCollectStar = (index: number) => {
    if (starsCollected < totalStars) {
      setStarsCollected(prev => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-pink-200 text-center space-y-6 relative overflow-hidden"
    >
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-500 font-bold">
          ⭐ Долината на звездите
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241D]">
          Събери 5 изгубени звезди
        </h2>
        <p className="text-xs text-[#2C241D]/70">
          Докосни блестящите звезди, за да ги събереш в магическата книжка! ({starsCollected} / {totalStars})
        </p>
      </div>

      <div className="h-48 bg-gradient-to-b from-indigo-950 to-purple-900 rounded-2xl relative overflow-hidden flex items-center justify-center p-4 border border-amber-400/30 shadow-inner">
        {starsCollected < totalStars ? (
          <div className="absolute inset-0 flex flex-wrap items-center justify-around p-6">
            {[...Array(totalStars - starsCollected)].map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.3, rotate: 15 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => handleCollectStar(i)}
                className="p-4 bg-amber-400/20 backdrop-blur-md rounded-full text-amber-300 hover:text-amber-200 cursor-pointer shadow-lg animate-pulse"
              >
                <Star className="w-8 h-8 fill-amber-300" />
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white space-y-2"
          >
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-amber-300">Всички звезди са събрани!</h3>
            <p className="text-xs text-white/85">Какво прекрасно приключение!</p>
          </motion.div>
        )}
      </div>

      {starsCollected >= totalStars && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] shadow-lg flex items-center justify-center gap-3 cursor-pointer"
        >
          Към следващата спирка <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
