'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Heart, PartyPopper } from 'lucide-react';
import Link from 'next/link';

interface GiftFinaleSceneProps {
  childName: string;
  senderName: string;
  personalMessage: string;
  favoriteAnimal: string;
  childWish?: string;
}

export function GiftFinaleScene({ childName, senderName, personalMessage, favoriteAnimal, childWish }: GiftFinaleSceneProps) {
  const [scratched, setScratched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || scratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 50, 0, Math.PI * 2);
    ctx.fill();

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] < 128) transparent++;
    }
    if ((transparent / (imgData.data.length / 4)) * 100 > 30) setScratched(true);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 z-50 flex items-center justify-center p-4 select-none">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-amber-50 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border-4 border-amber-400 text-center space-y-6 relative z-10">
        <div className="space-y-3">
          <PartyPopper className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-amber-900">ЧЕСТИТ РОЖДЕН ДЕН, {childName}!</h1>
          {childWish && <p className="text-xs text-amber-800 font-serif italic">Желание: „{childWish}“</p>}
        </div>
        <div className="bg-white border-2 border-amber-300 p-6 rounded-3xl text-left space-y-3 shadow-inner">
          <p className="font-serif italic text-slate-900 text-base sm:text-lg">„{personalMessage}“</p>
          <div className="text-right text-xs font-bold text-rose-700 font-serif">С обич, {senderName}</div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => window.print()} className="bg-amber-500 text-slate-950 px-6 py-3 rounded-xl font-serif font-bold text-xs">Сваляне на диплома</button>
          <Link href="/create/birthday/select-style" className="bg-slate-950 text-amber-200 px-6 py-3 rounded-xl font-serif font-bold text-xs">Ново приключение</Link>
        </div>
      </motion.div>

      {!scratched && (
        <div className="absolute inset-0 z-30 cursor-pointer">
          <canvas
            ref={canvasRef}
            onMouseDown={(e) => { isDrawing.current = true; scratch(e.clientX, e.clientY); }}
            onMouseMove={(e) => { if (isDrawing.current) scratch(e.clientX, e.clientY); }}
            onMouseUp={() => { isDrawing.current = false; }}
            onTouchStart={(e) => { isDrawing.current = true; if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY); }}
            onTouchMove={(e) => { if (isDrawing.current && e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY); }}
            onTouchEnd={() => { isDrawing.current = false; }}
            className="w-full h-full touch-none"
          />
          <div className="absolute inset-x-0 bottom-12 text-center pointer-events-none z-40">
            <span className="px-6 py-3 rounded-full bg-amber-950/80 text-amber-200 font-serif font-bold text-sm shadow-2xl border border-amber-400 animate-pulse">
              Търкай с пръстче или мишка, за да разкриеш вълшебния свитък ✨
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftFinaleScene;
