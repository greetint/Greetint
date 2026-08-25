'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CakeStageProps {
  sender: string;
  mainWish: string;
  onWishSaved: (wish: string) => void;
  onNext: () => void;
}

export const CakeStage: React.FC<CakeStageProps> = ({ sender, mainWish, onWishSaved, onNext }) => {
  const [candleBlown, setCandleBlown] = useState(false);
  const [personalWish, setPersonalWish] = useState('');

  const handleBlowCandle = () => {
    if (!candleBlown) {
      setCandleBlown(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full mx-auto space-y-6 text-center"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-sans font-bold block">
        Ритуал със Свещта 🎂
      </span>

      {/* АНИМИРАНА ТОРТА С ПЛАМЪК */}
      <div 
        onClick={handleBlowCandle}
        className="cursor-pointer relative w-64 h-64 mx-auto flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        <img
          src={candleBlown ? "/images/assets/cake-unlit.png" : "/images/assets/cake-lit.png"}
          alt="Birthday Cake"
          className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(31,26,23,0.25)]"
        />

        {!candleBlown && (
          <motion.div 
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-300 rounded-full blur-md opacity-60 pointer-events-none"
          />
        )}
      </div>

      {!candleBlown ? (
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#958679] font-sans font-bold animate-pulse">
          [ Докосни пламъка, за да духнеш свещта и да замислиш желание ]
        </p>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-[10px] uppercase font-sans font-bold text-[#958679] mb-1">
              Твоето тайно желание за новата година:
            </label>
            <input
              type="text"
              value={personalWish}
              onChange={(e) => {
                setPersonalWish(e.target.value);
                onWishSaved(e.target.value);
              }}
              placeholder="Напиши желанието тук..."
              className="w-full bg-[#FEFEFD] border border-[#958679]/30 p-3 rounded-xl text-xs font-sans text-center shadow-inner"
            />
          </div>

          {/* ЛИЧНОТО ПИСМО ОТ ПОДАРЯВАЩИЯ */}
          <div className="bg-[#FEFEFD] p-6 rounded-2xl border border-[#958679]/30 text-left space-y-2 shadow-2xl relative overflow-hidden">
            <span className="text-[10px] uppercase tracking-widest text-[#958679] font-bold block">
              Послание от {sender}
            </span>
            <p className="text-xs italic text-[#635E57] leading-relaxed font-serif border-t border-[#958679]/10 pt-2">
              "{mainWish}"
            </p>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-[#1F1A17] text-[#FEFEFD] py-4 text-xs uppercase tracking-[0.2em] font-bold rounded-xl shadow-xl hover:bg-[#958679] transition"
          >
            Към Капсулата за Бъдещето (7 Въпроса) →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};