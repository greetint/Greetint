'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ParchmentProps {
  childName: string;
  senderWish: string;
  transcribedWishText: string;
  isReveal: boolean;
}

export function ParchmentCard({ childName, senderWish, transcribedWishText, isReveal }: ParchmentProps) {
  const { t } = useLanguage();
  return (
    <div className="absolute inset-12 md:inset-24 bg-[#fefae0] rounded-3xl p-8 shadow-2xl border-8 border-amber-600/40 flex flex-col items-center justify-center text-center overflow-y-auto">
      <div className="max-w-2xl space-y-6">
        <span className="text-3xl">👑</span>
        <h1 className="font-serif italic text-3xl md:text-5xl text-amber-950 font-bold">{t('kidsFairytale.parchmentCard.birthdayGreeting', { childName })}</h1>
        <p className="font-serif italic text-lg md:text-2xl text-amber-900 bg-amber-100/60 p-6 rounded-2xl border">&ldquo;{senderWish}&rdquo;</p>
        {transcribedWishText && (
          <div className="bg-amber-50 p-4 rounded-xl border text-amber-900 font-serif italic">
            {t('kidsFairytale.parchmentCard.recordedWishLabel', { text: transcribedWishText })}
          </div>
        )}
        {isReveal && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-6">
            <button onClick={() => window.print()} className="bg-amber-600 hover:bg-amber-700 text-white font-serif italic text-lg px-8 py-4 rounded-2xl shadow-xl transition cursor-pointer">
              {t('kidsFairytale.parchmentCard.certificateButton')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
