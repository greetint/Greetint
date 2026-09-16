'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Stage4Props {
  deviceType: 'desktop' | 'phone';
  childName: string;
  senderWish: string;
  recordedAudioBlob: Blob | null;
  onFinish: () => void;
}

export function Stage4Scene({ deviceType, childName, senderWish, recordedAudioBlob }: Stage4Props) {
  const [sub, setSub] = useState<'ribbon' | 'scroll' | 'scratch' | 'reveal'>('ribbon');
  const [startX, setStartX] = useState<number | null>(null);
  const [prog, setProg] = useState(0);
  const [rev, setRev] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  const v1 = `/videos/birthday/kids-fairytale/stage_4/stage4_part1_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const v2 = `/videos/birthday/kids-fairytale/stage_4/stage4_part2_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const imgUrl = `/images/birthday/kids-fairytale/stretch_${deviceType}.png`;

  useEffect(() => {
    audio.current = new Audio('/audio/kids_fairytale/stage2_voice_part1.mp3');
    audio.current.play().catch(() => {});
    return () => { if (audio.current) audio.current.pause(); };
  }, []);

  useEffect(() => {
    if (sub === 'scratch' && canvasRef.current) {
      const c = canvasRef.current;
      c.width = window.innerWidth; c.height = window.innerHeight;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgUrl;
      img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
      img.onerror = () => { ctx.fillStyle = '#b45309'; ctx.fillRect(0, 0, c.width, c.height); };
    }
  }, [sub, imgUrl]);

  const scratch = (cx: number, cy: number) => {
    const c = canvasRef.current;
    if (!c || !drawing.current) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx - rect.left, cy - rect.top, 45, 0, Math.PI * 2);
    ctx.fill();

    const data = ctx.getImageData(0, 0, c.width, c.height);
    let trans = 0;
    for (let i = 3; i < data.data.length; i += 40) { if (data.data[i] < 50) trans++; }
    const pct = Math.min((trans / ((data.data.length / 4) / 10)) * 100, 100);
    setProg(pct);

    if (pct >= 80 && !rev) {
      setRev(true);
      setSub('reveal');
      if (recordedAudioBlob) new Audio(URL.createObjectURL(recordedAudioBlob)).play().catch(() => {});
    }
  };

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden bg-black select-none">
      {sub === 'ribbon' && (
        <div
          onMouseDown={(e) => setStartX(e.clientX)}
          onMouseMove={(e) => startX !== null && e.clientX - startX > 120 && (setSub('scroll'), audio.current?.pause())}
          onMouseUp={() => setStartX(null)}
          onTouchStart={(e) => e.touches.length > 0 && setStartX(e.touches[0].clientX)}
          onTouchEnd={() => setStartX(null)}
          className="absolute inset-0 z-20 cursor-grab"
        >
          <video src={v1} autoPlay muted playsInline webkit-playsinline="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
          <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none px-4">
            <p className="font-serif italic text-xl md:text-3xl text-amber-200 animate-pulse">👉 Плъзни пръстче!</p>
          </div>
        </div>
      )}

      {sub === 'scroll' && (
        <video src={v2} autoPlay muted playsInline webkit-playsinline="true" onEnded={() => { setSub('scratch'); audio.current = new Audio('/audio/kids_fairytale/stage3_voice_part1.mp3'); audio.current.play().catch(() => {}); }} className="absolute inset-0 w-full h-full object-cover" />
      )}

      {(sub === 'scratch' || sub === 'reveal') && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#2c1810]">
          <div className="absolute inset-12 md:inset-24 bg-[#fefae0] rounded-3xl p-8 shadow-2xl border-8 border-amber-600/40 flex flex-col items-center justify-center text-center overflow-y-auto">
            <div className="max-w-2xl space-y-6">
              <h1 className="font-serif italic text-3xl md:text-5xl text-amber-950 font-bold">{childName}</h1>
              <p className="font-serif italic text-lg md:text-2xl text-amber-900 bg-amber-100/60 p-6 rounded-2xl border">&ldquo;{senderWish}&rdquo;</p>
              {sub === 'reveal' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-6">
                  <button onClick={() => window.print()} className="bg-amber-600 hover:bg-amber-700 text-white font-serif italic text-lg px-8 py-4 rounded-2xl shadow-xl transition cursor-pointer">📜 Грамота</button>
                </motion.div>
              )}
            </div>
          </div>
          {sub === 'scratch' && (
            <canvas ref={canvasRef} onMouseDown={(e) => { drawing.current = true; scratch(e.clientX, e.clientY); }} onMouseMove={(e) => scratch(e.clientX, e.clientY)} onMouseUp={() => { drawing.current = false; }} onTouchStart={(e) => { drawing.current = true; if (e.touches.length > 0) scratch(e.touches[0].clientX, e.touches[0].clientY); }} onTouchMove={(e) => { if (e.touches.length > 0) scratch(e.touches[0].clientX, e.touches[0].clientY); }} onTouchEnd={() => { drawing.current = false; }} className="absolute inset-0 z-40 cursor-crosshair touch-none" />
          )}
          {sub === 'scratch' && (
            <div className="absolute top-8 left-0 right-0 text-center z-50 pointer-events-none">
              <p className="font-serif italic text-xl text-amber-200 animate-pulse">✨ Изтъркай! ({Math.round(prog)}%)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
