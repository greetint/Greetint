'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, Cake, Compass, MapPin, CheckCircle2 } from 'lucide-react';

interface MapStageProps {
  unlockedStages: number[];
  onSelectStage: (stageId: number) => void;
}

export function MapStage({ unlockedStages, onSelectStage }: MapStageProps) {
  const locations = [
    { id: 3, name: 'Долината на звездите', icon: Star, desc: 'Събери изгубените звезди', color: 'from-amber-400 to-orange-500' },
    { id: 4, name: 'Гората на балоните', icon: Compass, desc: 'Помогни на балоните', color: 'from-sky-400 to-blue-600' },
    { id: 5, name: 'Замъкът на подаръците', icon: Gift, desc: 'Открий тайното послание', color: 'from-pink-400 to-rose-600' },
    { id: 6, name: 'Магическата торта', icon: Cake, desc: 'Духни свещичката на желанието', color: 'from-purple-400 to-indigo-600' },
    { id: 7, name: 'Празничен замък', icon: MapPin, desc: 'Голямо финално тържество', color: 'from-emerald-400 to-teal-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-2xl border border-pink-200 text-center space-y-6"
    >
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-bold">
          🗺️ Картата на рождения ден
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241D]">
          Избери следващата спирка в приключението!
        </h2>
        <p className="text-xs text-[#2C241D]/70">
          За да стигнем до празничния замък и финалната изненада, нека преминем през вълшебните места.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {locations.map((loc, index) => {
          const Icon = loc.icon;
          const isUnlocked = true; // allow clicking any in sandbox or unlockedStages.includes(loc.id)

          return (
            <motion.button
              key={loc.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectStage(loc.id)}
              className={`p-5 rounded-2xl text-left border transition shadow-md flex items-center gap-4 relative overflow-hidden bg-gradient-to-r ${loc.color} text-white cursor-pointer`}
            >
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded font-bold">
                  Етап {index + 3}
                </span>
                <h3 className="font-serif font-bold text-lg mt-1">{loc.name}</h3>
                <p className="text-xs text-white/80">{loc.desc}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-white/90" />
            </motion.button>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          onClick={() => onSelectStage(7)}
          className="text-xs text-pink-600 font-bold uppercase tracking-widest hover:underline"
        >
          Прескочи към финала (Тест) →
        </button>
      </div>
    </motion.div>
  );
}
