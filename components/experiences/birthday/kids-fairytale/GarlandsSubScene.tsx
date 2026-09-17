'use client';
import React, { useEffect, useRef, useState } from 'react';

interface GarlandsProps { deviceType: 'desktop' | 'phone'; isMuted: boolean; onComplete: () => void; }

export function GarlandsSubScene({ deviceType, isMuted, onComplete }: GarlandsProps) {
  const [prog, setProg] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ptsRef = useRef<{ x: number; y: number }[]>([]);
  const traced = useRef<Set<number>>(new Set());
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audio.current = new Audio('/audio/kids-fairytale/stage2_voice_part1.mp3');
    audio.current.muted = isMuted; audio.current.play().catch(() => {});
    return () => { if (audio.current) audio.current.pause(); };
  }, []);

  useEffect(() => { if (audio.current) audio.current.muted = isMuted; }, [isMuted]);

  useEffect(() => {
    if (canvasRef.current) {
      const c = canvasRef.current; c.width = window.innerWidth; c.height = window.innerHeight;
      const ctx = c.getContext('2d'); if (!ctx) return;
      const w = c.width, h = c.height, pts: { x: number; y: number }[] = [], halfW = w * 0.45;
      for (let x = w * 0.05; x <= halfW; x += 15) pts.push({ x, y: h * 0.3 + Math.sin((x / halfW) * Math.PI * 2) * 45 });
      for (let x = w * 0.55; x <= w * 0.95; x += 15) pts.push({ x, y: h * 0.3 + Math.cos(((x - w * 0.55) / halfW) * Math.PI * 2) * 45 });
      ptsRef.current = pts;
      ctx.clearRect(0, 0, w, h); ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)'; ctx.lineWidth = 8; ctx.setLineDash([12, 12]);
      ctx.beginPath(); for (let x = w * 0.05; x <= halfW; x += 5) { const y = h * 0.3 + Math.sin((x / halfW) * Math.PI * 2) * 45; x === w * 0.05 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
      ctx.beginPath(); for (let x = w * 0.55; x <= w * 0.95; x += 5) { const y = h * 0.3 + Math.cos(((x - w * 0.55) / halfW) * Math.PI * 2) * 45; x === w * 0.55 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    }
  }, []);

  const trace = (cx: number, cy: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = cx - rect.left, y = cy - rect.top;
    let closest = -1, minDist = 45;
    ptsRef.current.forEach((pt, idx) => { const d = Math.hypot(pt.x - x, pt.y - y); if (d < minDist) { minDist = d; closest = idx; } });
    if (minDist <= 45 && closest !== -1) {
      traced.current.add(closest);
      const cov = Math.min((traced.current.size / (ptsRef.current.length * 0.8)) * 100, 100);
      setProg(cov);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.save(); const g = ctx.createRadialGradient(x, y, 2, x, y, 16);
        g.addColorStop(0, '#fff'); g.addColorStop(0.4, '#fbbf24'); g.addColorStop(1, 'rgba(245,158,11,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      if (cov >= 90) {
        if (audio.current) audio.current.pause();
        audio.current = new Audio('/audio/kids-fairytale/stage2_voice_part2.mp3');
        audio.current.muted = isMuted; audio.current.play().catch(() => {});
        setTimeout(onComplete, 1000);
      }
    }
  };

  return (
    <>
      <canvas ref={canvasRef} onMouseMove={(e) => trace(e.clientX, e.clientY)} onTouchMove={(e) => e.touches.length > 0 && trace(e.touches[0].clientX, e.touches[0].clientY)} className="absolute inset-0 z-20 cursor-crosshair touch-none" />
      <div className="absolute top-8 left-0 right-0 text-center z-30 pointer-events-none">
        <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow">✨ Прокарай пръстче по гирляндите ({Math.round(prog)}%)</p>
      </div>
    </>
  );
}
