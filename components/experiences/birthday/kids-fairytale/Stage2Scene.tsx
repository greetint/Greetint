'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DualVideoPlayer } from './DualVideoPlayer';

interface Stage2Props { deviceType: 'desktop' | 'phone'; isMuted: boolean; onComplete: () => void; }

export function Stage2Scene({ deviceType, isMuted, onComplete }: Stage2Props) {
  const [sub, setSub] = useState<'garlands' | 'balloons'>('garlands');
  const [prog, setProg] = useState(0);
  const [balls, setBalls] = useState([0, 0, 0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ptsRef = useRef<{ x: number; y: number }[]>([]);
  const traced = useRef<Set<number>>(new Set());
  const audio = useRef<HTMLAudioElement | null>(null);
  const vG = `/videos/birthday/kids-fairytale/stage_2/stage2_part1_${deviceType}.mp4`;
  const vB = `/videos/birthday/kids-fairytale/stage_2/stage2_part2_${deviceType}.mp4`;

  useEffect(() => {
    audio.current = new Audio('/audio/kids-fairytale/stage2_voice_part1.mp3');
    audio.current.muted = isMuted; audio.current.play().catch(() => {});
    return () => { if (audio.current) audio.current.pause(); };
  }, []);

  useEffect(() => { if (audio.current) audio.current.muted = isMuted; }, [isMuted]);

  useEffect(() => {
    if (sub === 'garlands' && canvasRef.current) {
      const c = canvasRef.current; c.width = window.innerWidth; c.height = window.innerHeight;
      const ctx = c.getContext('2d'); if (!ctx) return;
      const w = c.width, h = c.height;
      const p0 = { x: w * 0.1, y: h * 0.22 }, p1 = { x: w * 0.5, y: h * 0.38 }, p2 = { x: w * 0.9, y: h * 0.22 };
      const q0 = { x: w * 0.15, y: h * 0.35 }, q1 = { x: w * 0.5, y: h * 0.52 }, q2 = { x: w * 0.85, y: h * 0.35 };
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        pts.push({ x: (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x, y: (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y });
        pts.push({ x: (1-t)*(1-t)*q0.x + 2*(1-t)*t*q1.x + t*t*q2.x, y: (1-t)*(1-t)*q0.y + 2*(1-t)*t*q1.y + t*t*q2.y });
      }
      ptsRef.current = pts;
      ctx.clearRect(0, 0, w, h); ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 8; ctx.setLineDash([12, 12]);
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.quadraticCurveTo(q1.x, q1.y, q2.x, q2.y); ctx.stroke();
    }
  }, [sub]);

  const trace = (cx: number, cy: number) => {
    if (sub !== 'garlands' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = cx - rect.left, y = cy - rect.top;
    let closest = -1, minDist = 41;
    ptsRef.current.forEach((pt, idx) => {
      const d = Math.hypot(pt.x - x, pt.y - y);
      if (d < minDist) { minDist = d; closest = idx; }
    });
    if (minDist <= 40 && closest !== -1) {
      traced.current.add(closest);
      const cov = Math.min((traced.current.size / (ptsRef.current.length * 0.75)) * 100, 100);
      setProg(cov);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.save();
        const g = ctx.createRadialGradient(x, y, 2, x, y, 16);
        g.addColorStop(0, '#fff'); g.addColorStop(0.4, '#fbbf24'); g.addColorStop(1, 'rgba(245,158,11,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      if (cov >= 90) {
        if (audio.current) audio.current.pause();
        audio.current = new Audio('/audio/kids-fairytale/stage2_voice_part2.mp3');
        audio.current.muted = isMuted; audio.current.play().catch(() => {});
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
      <div className="absolute inset-0 pointer-events-none">
        <DualVideoPlayer src={sub === 'garlands' ? vG : vB} muted={true} autoPlay={true} loop={false} />
      </div>
      {sub === 'garlands' && (
        <>
          <canvas ref={canvasRef} onMouseMove={(e) => trace(e.clientX, e.clientY)} onTouchMove={(e) => e.touches.length > 0 && trace(e.touches[0].clientX, e.touches[0].clientY)} className="absolute inset-0 z-20 cursor-crosshair touch-none" />
          <div className="absolute top-8 left-0 right-0 text-center z-30 pointer-events-none">
            <p className="font-serif italic text-xl md:text-3xl text-amber-200">✨ ({Math.round(prog)}%)</p>
          </div>
        </>
      )}
      {sub === 'balloons' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-between py-16 px-4">
          <div className="text-center"><p className="font-serif italic text-xl md:text-3xl text-amber-200">🎈 Търкай!</p></div>
          <div className="flex flex-row space-x-6 md:space-x-12 items-center justify-center">
            {[0, 1, 2].map(i => (
              <div key={i} onMouseEnter={() => rub(i)} onClick={() => rub(i)} onTouchStart={() => rub(i)} className="relative w-24 h-32 md:w-36 md:h-48 rounded-full border-4 border-amber-300/60 bg-amber-400/15 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-lg" style={{ boxShadow: balls[i] === 100 ? '0 0 35px #fbbf24' : undefined }}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 opacity-85" style={{ clipPath: `inset(${100 - balls[i]}% 0 0 0)` }} />
                <span className="relative z-10 font-bold text-amber-950 text-lg md:text-2xl">{balls[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
