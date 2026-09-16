'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Stage2Props { deviceType: 'desktop' | 'phone'; onComplete: () => void; }

export function Stage2Scene({ deviceType, onComplete }: Stage2Props) {
  const [sub, setSub] = useState<'garlands' | 'balloons'>('garlands');
  const [prog, setProg] = useState(0);
  const [balls, setBalls] = useState([0, 0, 0]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const traced = useRef<Set<string>>(new Set());
  const totalPx = useRef(1);
  const audio = useRef<HTMLAudioElement | null>(null);

  const vG = `/videos/birthday/kids-fairytale/stage_2/stage2_part1_${deviceType}.mp4`;
  const vB = `/videos/birthday/kids-fairytale/stage_2/stage2_part2_${deviceType}.mp4`;

  useEffect(() => {
    audio.current = new Audio('/audio/kids-fairytale/stage2_voice_part1.mp3');
    audio.current.play().catch(() => {});
    return () => { if (audio.current) audio.current.pause(); };
  }, []);

  useEffect(() => {
    if (sub === 'garlands' && canvasRef.current) {
      const c = canvasRef.current;
      c.width = window.innerWidth; c.height = window.innerHeight;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 40; ctx.setLineDash([15, 15]);
      ctx.beginPath();
      ctx.moveTo(c.width * 0.1, c.height * 0.25);
      ctx.bezierCurveTo(c.width * 0.3, c.height * 0.05, c.width * 0.7, c.height * 0.05, c.width * 0.9, c.height * 0.25);
      ctx.stroke();

      let count = 0;
      const data = ctx.getImageData(0, 0, c.width, c.height);
      for (let i = 3; i < data.data.length; i += 4) { if (data.data[i] > 50) count++; }
      totalPx.current = Math.max(count, 100);
    }
  }, [sub]);

  const trace = (x: number, y: number) => {
    if (sub !== 'garlands' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = Math.floor(x - rect.left);
    const cy = Math.floor(y - rect.top);
    const key = `${Math.floor(cx / 15)}_${Math.floor(cy / 15)}`;
    if (!traced.current.has(key)) {
      traced.current.add(key);
      const cov = Math.min((traced.current.size / (totalPx.current / 30)) * 100, 100);
      setProg(cov);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 15;
        ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill();
      }
      if (cov >= 90) {
        if (audio.current) audio.current.pause();
        audio.current = new Audio('/audio/kids-fairytale/stage2_voice_part2.mp3');
        audio.current.play().catch(() => {});
        setTimeout(() => setSub('balloons'), 1000);
      }
    }
  };

  const rub = (i: number) => {
    setBalls(prev => {
      const next = [...prev];
      if (next[i] < 100) next[i] = Math.min(next[i] + 25, 100);
      if (next.every(v => v === 100)) setTimeout(onComplete, 1200);
      return next;
    });
  };

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden bg-black select-none">
      <video
        key={sub}
        src={sub === 'garlands' ? vG : vB}
        autoPlay muted playsInline
        // @ts-ignore
        webkit-playsinline="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {sub === 'garlands' && (
        <>
          <canvas
            ref={canvasRef}
            onMouseMove={(e) => trace(e.clientX, e.clientY)}
            onTouchMove={(e) => e.touches.length > 0 && trace(e.touches[0].clientX, e.touches[0].clientY)}
            className="absolute inset-0 z-20 cursor-crosshair touch-none"
          />
          <div className="absolute top-8 left-0 right-0 text-center z-30 pointer-events-none">
            <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Прокарай пръстче по тавана, за да закачим гирляндите! ✨ ({Math.round(prog)}%)
            </p>
          </div>
        </>
      )}
      {sub === 'balloons' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-between py-16 px-4">
          <div className="text-center">
            <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Търкай балоните, за да ги напълним с вълшебен прах! 🎈
            </p>
          </div>
          <div className="flex flex-row space-x-6 md:space-x-12 items-center justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                onMouseEnter={() => rub(i)} onClick={() => rub(i)} onTouchStart={() => rub(i)}
                className="relative w-24 h-32 md:w-36 md:h-48 rounded-full border-4 border-amber-300/60 bg-amber-400/10 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(251,191,36,0.3)] transition transform hover:scale-105"
                style={{ boxShadow: balls[i] === 100 ? '0 0 35px #fbbf24' : undefined }}
              >
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 opacity-85 transition-all duration-300"
                  style={{ clipPath: `inset(${100 - balls[i]}% 0 0 0)` }}
                />
                <span className="relative z-10 font-bold text-amber-950 text-lg md:text-2xl drop-shadow-md">
                  {balls[i]}%
                </span>
              </div>
            ))}
          </div>
          <div className="text-amber-100 font-serif italic text-sm md:text-base">
            {balls.every(v => v === 100) ? 'Балоните литват нагоре! 🎉' : 'Напълни всичките 3 балона!'}
          </div>
        </div>
      )}
    </div>
  );
}
