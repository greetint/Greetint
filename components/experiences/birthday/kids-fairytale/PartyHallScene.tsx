'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface PartyHallSceneProps {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function PartyHallScene({ childName, isMuted = false, onComplete }: PartyHallSceneProps) {
  const v1Ref = useRef<HTMLVideoElement | null>(null);
  const v2Ref = useRef<HTMLVideoElement | null>(null);
  const v3Ref = useRef<HTMLVideoElement | null>(null);

  const [mobile, setMobile] = useState(false);
  const [subStage, setSubStage] = useState<1 | 2 | 3>(1);
  const [videoEnded, setVideoEnded] = useState(false);
  const [garlandProgress, setGarlandProgress] = useState(0);
  const [tracedCircles, setTracedCircles] = useState<boolean[]>([false, false, false]);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (v1Ref.current) v1Ref.current.muted = isMuted;
    if (v2Ref.current) v2Ref.current.muted = isMuted;
    if (v3Ref.current) v3Ref.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    v1Ref.current?.play().catch(() => {});
  }, []);

  const handleVideoEnded = (stageNum: number) => {
    if (stageNum === 1 && v1Ref.current) {
      v1Ref.current.pause();
      v1Ref.current.currentTime = v1Ref.current.duration - 0.05;
    } else if (stageNum === 2 && v2Ref.current) {
      v2Ref.current.pause();
      v2Ref.current.currentTime = v2Ref.current.duration - 0.05;
    }
    setVideoEnded(true);
  };

  const addSpark = (x: number, y: number) => {
    setSparks(prev => [...prev.slice(-12), { id: Date.now() + Math.random(), x, y }]);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!videoEnded || subStage !== 1) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    addSpark(clientX, clientY);

    setGarlandProgress(prev => {
      const next = Math.min(100, prev + 10);
      if (next >= 100) {
        setVideoEnded(false);
        setSubStage(2);
        v2Ref.current?.play().catch(() => {});
      }
      return next;
    });
  };

  const handleCircleTrace = (index: number, e: React.MouseEvent | React.TouchEvent) => {
    if (subStage !== 2 || !videoEnded || tracedCircles[index]) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    addSpark(clientX, clientY);

    const updated = [...tracedCircles];
    updated[index] = true;
    setTracedCircles(updated);

    if (updated.every(Boolean)) {
      setVideoEnded(false);
      setSubStage(3);
      v3Ref.current?.play().catch(() => {});
    }
  };

  const s1 = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part1_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part1_desktop.mp4';
  const s2 = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part2_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part2_desktop.mp4';
  const s3 = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part3_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part3_desktop.mp4';

  const balloonsCountTraced = tracedCircles.filter(Boolean).length;
  return (
    <div
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none"
    >
      <video
        ref={v1Ref}
        src={s1}
        playsInline
        muted={isMuted}
        preload="auto"
        onEnded={() => handleVideoEnded(1)}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-300 ${subStage === 1 ? 'opacity-100' : 'opacity-0'}`}
      />
      <video
        ref={v2Ref}
        src={s2}
        playsInline
        muted={isMuted}
        preload="auto"
        onEnded={() => handleVideoEnded(2)}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-300 ${subStage === 2 ? 'opacity-100' : 'opacity-0'}`}
      />
      <video
        ref={v3Ref}
        src={s3}
        playsInline
        muted={isMuted}
        preload="auto"
        onEnded={onComplete}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-300 ${subStage === 3 ? 'opacity-100' : 'opacity-0'}`}
      />

      {sparks.map(spark => (
        <motion.div
          key={spark.id}
          initial={{ opacity: 1, scale: 1, x: spark.x - 12, y: spark.y - 12 }}
          animate={{ opacity: 0, scale: 0.3, y: spark.y - 45, x: spark.x + (Math.random() * 30 - 15) }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="fixed pointer-events-none z-[60] text-amber-300 drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, x: -60, y: 30, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-40 flex items-end gap-3 pointer-events-none max-w-sm md:max-w-md"
      >
        <motion.img
          src="/images/birthday/kids_fairytale/hero.png"
          alt="Искрица"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain drop-shadow-[0_12px_25px_rgba(255,215,0,0.6)]"
        />
        <motion.div
          key={subStage}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative bg-gradient-to-br from-amber-50/95 via-yellow-50/90 to-amber-100/95 backdrop-blur-xl border-2 border-amber-300/90 p-5 rounded-3xl shadow-[0_15px_40px_rgba(180,130,20,0.35)] text-[#2C241D] font-serif text-xs sm:text-sm md:text-base mb-4 pointer-events-auto leading-relaxed"
        >
          <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 border border-white flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
          </div>
          <div className="absolute -left-3 bottom-6 w-0 h-0 border-t-[8px] border-t-transparent border-r-[14px] border-r-amber-200 border-b-[8px] border-b-transparent filter drop-shadow-sm"></div>

          {subStage === 1 && (
            <p>Добре дошли в празничната зала, {childName}! Залата има нужда от вълшебен блясък. Прокарай пръст по тавана по арките, за да окачим гирляндите! ✨ ({garlandProgress}%)</p>
          )}
          {subStage === 2 && (
            <p>О, стана невероятно! Сега светлините греят... но какво е рожден ден без балони? Докосни 3-те вълшебни кръга във въздуха, за да ги пуснем! 🎈 ({balloonsCountTraced}/3)</p>
          )}
          {subStage === 3 && (
            <p>Празникът оживява! Камерата се насочва към празничната маса за вълшебната торта... 🎂✨</p>
          )}
        </motion.div>
      </motion.div>

      {videoEnded && subStage === 1 && (
        <div
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          className="absolute top-0 inset-x-0 h-48 z-30 cursor-pointer pointer-events-auto flex flex-col items-center justify-center pt-8"
        >
          <div className="absolute inset-x-12 top-6 border-b-4 border-dashed border-amber-300/80 rounded-[50%] h-24 pointer-events-none shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-pulse"></div>
          <span className="px-6 py-2 rounded-full bg-amber-400/90 text-slate-950 font-bold text-xs shadow-2xl backdrop-blur-md animate-bounce border border-white/80">
            👉 Прокарай пръст тук по арките на тавана ({garlandProgress}%)
          </span>
        </div>
      )}

      {videoEnded && subStage === 2 && (
        <div className="absolute inset-0 z-30 flex items-center justify-around pointer-events-auto px-12">
          {[0, 1, 2].map((i) => (
            !tracedCircles[i] ? (
              <motion.div
                key={i}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onMouseEnter={(e) => handleCircleTrace(i, e)}
                onClick={(e) => handleCircleTrace(i, e)}
                onTouchStart={(e) => handleCircleTrace(i, e)}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-amber-400/40 border-4 border-amber-300 backdrop-blur-md cursor-pointer flex flex-col items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.9)] animate-pulse"
              >
                <Sparkles className="w-8 h-8 text-amber-200 animate-spin" />
                <span className="text-[10px] font-bold text-amber-100 mt-1 font-serif">Докосни 🎈</span>
              </motion.div>
            ) : (
              <div key={i} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-emerald-500/30 border-2 border-emerald-300 flex items-center justify-center">
                <span className="text-emerald-200 font-bold text-lg">✨</span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default PartyHallScene;
