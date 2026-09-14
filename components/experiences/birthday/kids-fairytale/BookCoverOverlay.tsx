'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BookCoverOverlay({ name, unlocked, onOpen }: { name: string; unlocked: boolean; onOpen: () => void }) {
  if (unlocked) return null;
  return (
    <AnimatePresence>
      <motion.div exit={{ scale: 1.2, opacity: 0 }} transition={{ duration: 0.9 }} className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-amber-950 via-slate-950 to-indigo-950 cursor-pointer" onClick={onOpen}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="max-w-md w-full bg-gradient-to-br from-amber-900 via-amber-950 to-yellow-950 border-4 border-amber-400 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(255,215,0,0.5)] text-center space-y-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500">Вълшебната приказка за {name}</h2>
          <span className="inline-block font-serif text-sm font-bold text-slate-950 bg-amber-300 px-6 py-3 rounded-full shadow-lg border border-white animate-bounce">Докосни книгата, за да я отвориш</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
