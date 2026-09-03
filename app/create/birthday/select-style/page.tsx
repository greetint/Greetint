'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CARD_STYLES } from '../../stylesConfig';
import Logo from '@/components/Logo';

export default function SelectStylePage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans p-6 sm:p-12 selection:bg-[#958679]/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-center border-b border-[#958679]/20 pb-6">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo variant="horizontal" height={40} />
          </Link>
          <Link href="/" className="text-xs uppercase tracking-widest text-[#958679] hover:text-[#1F1A17] transition font-medium">
            ← Към началото
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#958679] font-sans font-bold px-5 py-2 border border-[#958679]/30 rounded-full bg-[#EFECE6]/80 shadow-inner">
            Каталог на интерактивните преживявания
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#11100F] tracking-wide">
            Избери Стил за Рожден Ден
          </h1>
          <p className="text-xs sm:text-sm text-[#11100F]/75 font-sans leading-relaxed font-light">
            Всеки стил предлага уникална визуална естетика, тематични анимации и завладяващ куест за получателя.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {CARD_STYLES.map((style, index) => {
            const unlocked = !style.isLocked;
            const isDark = style.id === 'detective-mystery' || style.id === 'escape-room' || style.id === 'retro-arcade' || style.id === 'agent-heist' || style.id === 'level-up-cyber' || style.bgGradient.includes('from-[#1') || style.bgGradient.includes('from-[#2') || style.bgGradient.includes('from-[#3') || style.bgGradient.includes('from-[#0');

            return (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={unlocked ? { y: -6 } : {}}
                className={`relative rounded-[32px] p-6 sm:p-8 border flex flex-col justify-between space-y-6 bg-gradient-to-br ${style.bgGradient} shadow-xl backdrop-blur-md transition-all duration-300 ${
                  unlocked ? "border-[#958679]/40 shadow-2xl ring-2 ring-[#958679]/20 cursor-pointer" : "opacity-80 grayscale-[20%] border-black/10 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] uppercase tracking-[0.25em] font-sans font-bold px-3.5 py-1.5 rounded-full shadow-sm ${isDark ? 'bg-white/20 text-white backdrop-blur-md border border-white/20' : 'bg-[#11100F] text-[#FAF6EE]'}`}>
                    {style.badge}
                  </span>
                  {unlocked ? (
                    <span className={`text-[10px] uppercase tracking-widest font-sans font-bold px-3 py-1 rounded-full shadow-xs border ${isDark ? 'bg-white/90 text-[#11100F] border-white' : 'text-[#11100F] bg-white/80 border-black/5'}`}>
                      {style.stagesCount} етапа ✨
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-white/90 bg-black/60 px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/10">
                      <span>🔒</span> Очаквайте скоро
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className={`text-2xl font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-[#11100F]'}`}>
                    {style.name}
                  </h3>
                  <p className={`text-xs sm:text-sm font-sans leading-relaxed font-light ${isDark ? 'text-white/90' : 'text-[#11100F]/80'}`}>
                    {style.description}
                  </p>
                </div>

                <div className="pt-2">
                  {unlocked ? (
                    <Link href={style.route} className="block w-full text-center bg-[#FAF6EE] text-[#11100F] border border-[#958679]/40 py-4 rounded-2xl text-xs uppercase tracking-[0.25em] font-sans font-bold hover:bg-[#11100F] hover:text-[#FAF6EE] transition-all duration-300 shadow-md">
                      Избери този стил ✨
                    </Link>
                  ) : (
                    <div className={`w-full py-4 rounded-2xl text-xs uppercase tracking-[0.25em] font-sans font-bold text-center border ${isDark ? 'bg-white/10 text-white/80 border-white/15' : 'bg-black/10 text-[#11100F]/70 border-black/5'}`}>
                      🔒 Заключен стил
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


