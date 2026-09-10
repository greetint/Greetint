'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Heart, PartyPopper } from 'lucide-react';
import Link from 'next/link';

interface FinaleStageProps {
  childName: string;
  senderName: string;
  personalMessage: string;
}

export function FinaleStage({ childName, senderName, personalMessage }: FinaleStageProps) {
  const [letterOpen, setLetterOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-pink-200 text-center space-y-6"
    >
      <div className="space-y-3">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="inline-flex p-4 bg-pink-100 rounded-full text-pink-600 mb-1"
        >
          <PartyPopper className="w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500">
          ЧЕСТИТ РОЖДЕН ДЕН, {childName}! 🎉
        </h1>
        <p className="text-xs text-[#2C241D]/70">
          Вратите на празничния замък се отвориха широко! Ти успя да преминеш през цялото приключение.
        </p>
      </div>

      {!letterOpen ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLetterOpen(true)}
          className="my-6 p-6 bg-gradient-to-r from-rose-400 to-pink-500 rounded-2xl text-white shadow-xl cursor-pointer flex items-center justify-center gap-3"
        >
          <Mail className="w-8 h-8 animate-bounce" />
          <span className="font-bold text-sm uppercase tracking-widest">Отвори специалното писмо 💌</span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50/80 border border-amber-200 p-6 rounded-2xl shadow-inner text-left space-y-4 my-4"
        >
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-widest border-b border-amber-200 pb-2">
            <Sparkles className="w-4 h-4 text-amber-600" /> От: {senderName}
          </div>
          <p className="font-serif italic text-[#2C241D] text-base leading-relaxed">
            „{personalMessage}“
          </p>
          <div className="text-right text-xs font-bold text-rose-700 pt-2 flex items-center justify-end gap-1">
            С много обич, {senderName} <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
        </motion.div>
      )}

      <div className="pt-4">
        <Link
          href="/create/birthday/select-style"
          className="inline-block bg-[#2C241D] text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] shadow-lg hover:bg-[#4A3D34] transition"
        >
          Създай друго приключение ✨
        </Link>
      </div>
    </motion.div>
  );
}
