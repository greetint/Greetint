'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScratchStageProps {
  secretJoke: string;
  onComplete: () => void;
}

export const ScratchStage: React.FC<ScratchStageProps> = ({ secretJoke, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Луксозен златен металик градиент
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#D9CEB3');
    gradient.addColorStop(0.3, '#FEFEFD');
    gradient.addColorStop(0.6, '#958679');
    gradient.addColorStop(1, '#DBCEB3');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Фин геометричен мотив/текст отгоре
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#635E57';
    ctx.textAlign = 'center';
    ctx.fillText('✨ ИЗТРИЙ ЗЛАТНОТО ФОЛИО С ПРЪСТ ✨', canvas.width / 2, canvas.height / 2);
  }, []);

  const handleScratch = (e: any) => {
    if (!canvasRef.current || !isScratching) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 28, 0, Math.PI * 2);
    ctx.fill();

    setScratchPercent((prev) => Math.min(100, prev + 3));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full space-y-6 mx-auto text-center"
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-sans font-bold">
          Скритият Спомен 🤫
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#1F1A17] font-sans font-bold bg-[#DBCEB3]/30 px-2.5 py-1 rounded-full">
          {Math.round(scratchPercent)}% Разкрити
        </span>
      </div>

      <div className="relative w-full h-52 border border-[#958679]/40 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-6 bg-[#FEFEFD]">
        <p className="text-base font-serif leading-relaxed text-[#1F1A17] italic">
          "{secretJoke}"
        </p>

        <canvas
          ref={canvasRef}
          width={380}
          height={210}
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseMove={handleScratch}
          onTouchStart={() => setIsScratching(true)}
          onTouchEnd={() => setIsScratching(false)}
          onTouchMove={handleScratch}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>

      <button
        onClick={onComplete}
        disabled={scratchPercent < 35}
        className="w-full bg-[#1F1A17] text-[#FEFEFD] py-4 text-xs uppercase tracking-[0.2em] font-bold rounded-xl shadow-xl disabled:opacity-30 hover:bg-[#958679] transition"
      >
        {scratchPercent >= 35 ? 'Продължи към Шоу-Викторината →' : 'Изтрий още малко от фолиото...'}
      </button>
    </motion.div>
  );
};