'use client';
import React, { useState, useRef, useEffect } from 'react';
import { STAGE_VIDEOS } from './VideoPlayerManager';
import { Sparkles } from 'lucide-react';

export function PartyHallScene({ childName, isMuted = false, onComplete }: any) {
  const [mobile, setMobile] = useState(false);
  const [subStage, setSubStage] = useState<1 | 2>(1);
  const [audioEnded, setAudioEnded] = useState(false);
  const [done, setDone] = useState(false);
  const [balloons, setBalloons] = useState([0, 0, 0]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ptsRef = useRef<any[]>([]);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    }
    setAudioEnded(false); setDone(false); setBalloons([0, 0, 0]);
  }, [subStage, isMuted]);

  useEffect(() => {
    if (subStage === 1 && audioEnded && !done) {
      const w = window.innerWidth, h = window.innerHeight;
      const pts = [];
      for (let i = 0; i <= 25; i++) {
        pts.push({ x: w * (0.25 + (i / 25) * 0.5), y: h * 0.25 + Math.sin((i / 25) * Math.PI) * 20, c: false });
      }
      ptsRef.current = pts;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 12; ctx.setLineDash([10, 10]);
          ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();
        }
      }
    }
  }, [audioEnded, subStage, done]);

  const handleMove = (x: number, y: number) => {
    if (subStage !== 1 || !audioEnded || done) return;
    const pts = ptsRef.current;
    let cov = 0;
    pts.forEach(p => {
      if (!p.c && Math.hypot(x - p.x, y - p.y) < 45) p.c = true;
      if (p.c) cov++;
    });
    if (cov / pts.length >= 0.9 && !done) {
      setDone(true);
      setTimeout(() => setSubStage(2), 1500);
    }
  };

  const handleBalloon = (i: number) => {
    if (subStage !== 2 || !audioEnded || done) return;
    setBalloons(prev => {
      const next = [...prev];
      next[i] = Math.min(100, next[i] + 40);
      if (next.every(p => p >= 100) && !done) {
        setDone(true);
        setTimeout(() => onComplete(), 1500);
      }
      return next;
    });
  };

  const src = subStage === 1 
    ? (mobile ? STAGE_VIDEOS.stage2.part1Phone : STAGE_VIDEOS.stage2.part1Desktop)
    : (mobile ? STAGE_VIDEOS.stage2.part2Phone : STAGE_VIDEOS.stage2.part2Desktop);
  const audioSrc = subStage === 1 ? '/audio/kids_fairytale/stage2_voice_part1.mp3' : '/audio/kids_fairytale/stage2_voice_part2.mp3';

  const text = subStage === 1
    ? (audioEnded && !done ? 'Прокарай пръстче по златната линия на тавана за гирляндите! ✨' : 'В празничната зала на замъка сме...')
    : (audioEnded && !done ? 'Търкай балоните, за да ги изпълниш с вълшебен блясък! 🎈' : 'Вълшебните балони излитат...');

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center select-none z-50">
      <audio ref={audioRef} src={audioSrc} preload="auto" onEnded={() => setAudioEnded(true)} />
      <div className="absolute inset-0 z-0 w-full h-full">
        <video src={src} muted={true} playsInline={true} webkit-playsinline="true" autoPlay={true} preload="auto" loop controls={false} disablePictureInPicture={true} className="w-full h-full object-cover object-center" />
      </div>

      <div className="absolute top-8 inset-x-4 max-w-2xl mx-auto z-[40] pointer-events-none text-center">
        <div className="bg-amber-950/70 backdrop-blur-md border border-amber-400/80 rounded-2xl p-4 text-amber-100 font-serif shadow-2xl">
          <p className="text-sm sm:text-lg font-bold text-amber-200">{text}</p>
        </div>
      </div>

      {subStage === 1 && audioEnded && !done && (
        <canvas ref={canvasRef} onMouseMove={e => handleMove(e.clientX, e.clientY)} onTouchMove={e => { if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY); }} className="absolute inset-0 z-[30] w-full h-full cursor-pointer touch-none" />
      )}

      {subStage === 2 && audioEnded && !done && (
        <div className="absolute inset-0 z-[30] flex items-center justify-around px-8 pointer-events-auto">
          {[0, 1, 2].map(i => (
            <div key={i} onMouseEnter={() => handleBalloon(i)} onTouchStart={() => handleBalloon(i)} onClick={() => handleBalloon(i)} className="relative w-28 h-36 rounded-[50%] border-4 border-amber-400/80 bg-amber-950/40 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-xl">
              <div className="absolute inset-2 rounded-[50%] bg-gradient-to-t from-yellow-500 via-amber-300 to-yellow-200" style={{ opacity: balloons[i] / 100 }} />
              <div className="relative z-10 text-center font-serif font-bold text-amber-100">
                <Sparkles className="w-6 h-6 mx-auto text-amber-200 animate-pulse mb-1" />
                <span className="text-xs">{Math.round(balloons[i])}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {done && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-yellow-400/85 backdrop-blur-xl pointer-events-none">
          <div className="text-center p-8 font-serif space-y-3">
            <Sparkles className="w-24 h-24 mx-auto text-white animate-spin" />
            <h2 className="text-3xl sm:text-4xl font-black text-amber-950">Магията сработи! ✨</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartyHallScene;
