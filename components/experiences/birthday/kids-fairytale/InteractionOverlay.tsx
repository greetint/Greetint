'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';

export function InteractionOverlay({ st, name, audioEnded, done, onNext, onSetWish }: any) {
  if (!st.interactive || !audioEnded || done) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto p-4">
      {st.wish ? (
        <div className="max-w-md w-full bg-amber-950/95 border-2 border-amber-300 p-8 rounded-3xl text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <h3 className="text-xl font-serif font-bold text-amber-200">Намисли си желание, {name}!</h3>
          <div className="flex flex-col gap-4">
            <button onClick={() => { onSetWish('Вълшебно желание'); onNext(); }} className="w-full py-4 px-6 rounded-2xl bg-amber-500 text-slate-950 font-serif font-bold text-sm shadow-lg cursor-pointer">Намисли желание</button>
            <button onClick={onNext} className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-serif font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer">
              <Flame className="w-5 h-5 text-amber-300 fill-amber-300" /> Духни свещичката
            </button>
          </div>
        </div>
      ) : (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onNext} onTouchStart={onNext} className="cursor-pointer px-8 py-5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-serif font-bold text-base shadow-[0_0_40px_rgba(255,215,0,0.9)] border-2 border-white animate-bounce flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          <span>{st.p}</span>
        </motion.div>
      )}
    </div>
  );
}
