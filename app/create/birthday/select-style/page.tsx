'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CARD_STYLES } from '../../stylesConfig';
import Logo from '@/components/Logo';

export default function SelectStylePage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-[#958679]/20 pb-6">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo variant="horizontal" height={40} />
          </Link>
          <Link 
            href="/" 
            className="text-xs uppercase tracking-widest text-[#958679] hover:text-[#1F1A17] transition"
          >
            ← Към началото
          </Link>
        </div>

        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#958679] font-sans font-bold">
            Архитектура по поводи и стилове
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#11100F]">
            Избери Стил за Рожден Ден
          </h1>
          <p className="text-xs sm:text-sm text-[#11100F]/70 font-sans leading-relaxed">
            Всеки стил предлага уникално интерактивно преживяване, дизайн и анимации за получателя.
          </p>
        </div>

        {/* STYLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {CARD_STYLES.map((style) => (
            <motion.div
              key={style.id}
              whileHover={{ y: style.isAvailable ? -4 : 0 }}
              className={`relative rounded-3xl p-6 sm:p-8 border flex flex-col justify-between space-y-6 bg-gradient-to-br ${style.bgGradient} text-[#11100F] shadow-xl ${
                style.isAvailable 
                  ? "border-[#958679]/30 cursor-pointer shadow-lg" 
                  : "opacity-75 border-black/10"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold px-3 py-1 rounded-full bg-[#11100F] text-[#FAF6EE]">
                  {style.badge}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-sans font-semibold opacity-60">
                  {style.stagesCount} етапа
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold">{style.name}</h3>
                <p className="text-xs font-sans opacity-85 leading-relaxed">{style.description}</p>
              </div>

              <div className="pt-2">
                {style.isAvailable ? (
                  <Link
                    href={style.route}
                    className="block w-full text-center bg-[#FAF6EE] text-[#11100F] border border-[#958679]/30 py-3.5 rounded-2xl text-xs uppercase tracking-[0.25em] font-sans font-bold hover:bg-white transition shadow-md"
                  >
                    Избери този стил ✨
                  </Link>
                ) : (
                  <div className="w-full bg-black/10 text-[#11100F]/70 py-3.5 rounded-2xl text-xs uppercase tracking-[0.25em] font-sans font-bold text-center">
                    🔒 Очаквайте скоро
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
