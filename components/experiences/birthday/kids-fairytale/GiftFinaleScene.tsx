'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Heart, PartyPopper } from 'lucide-react';
import Link from 'next/link';

interface GiftFinaleSceneProps {
  childName: string;
  senderName: string;
  personalMessage: string;
  favoriteAnimal: string;
}

export function GiftFinaleScene({ childName, senderName, personalMessage, favoriteAnimal }: GiftFinaleSceneProps) {
  const [letterOpen, setLetterOpen] = useState(false);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-950 z-50 flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl p-8 sm:p-14 rounded-[2.5rem] shadow-2xl border-4 border-amber-300 text-center space-y-6 relative z-10"
      >
        <div className="space-y-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex p-4 bg-amber-100 rounded-full text-amber-600 mb-1"
          >
            <PartyPopper className="w-10 h-10" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-600 to-amber-500">
            ЧЕСТИТ РОЖДЕН ДЕН, {childName}! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-[#2C241D]/70 font-sans">
            Желанието ти отлетя към звездите! Сега те очаква последната вълшебна изненада от твоите близки.
          </p>
        </div>

        {!letterOpen ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLetterOpen(true)}
            className="my-6 p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-2xl text-white shadow-xl cursor-pointer flex items-center justify-center gap-3"
          >
            <Mail className="w-8 h-8 animate-bounce" />
            <span className="font-bold text-sm uppercase tracking-widest">Отвори вълшебния подарък 🎁</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-2 border-amber-300 p-6 sm:p-8 rounded-3xl shadow-inner text-left space-y-4 my-4"
          >
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-600" /> От: {senderName}
              </span>
              <span className="text-xs text-rose-600 font-medium">Спътник: {favoriteAnimal} 🐾</span>
            </div>
            <p className="font-serif italic text-[#2C241D] text-base sm:text-lg leading-relaxed">
              „{personalMessage}“
            </p>
            <div className="text-right text-xs font-bold text-rose-700 pt-2 flex items-center justify-end gap-1">
              С много обич, {senderName} <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
          </motion.div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create/birthday/select-style"
            className="inline-block bg-[#2C241D] text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] shadow-lg hover:bg-[#4A3D34] transition"
          >
            Създай друго приключение ✨
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default GiftFinaleScene;
