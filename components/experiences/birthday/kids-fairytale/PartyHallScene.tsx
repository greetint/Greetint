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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mobile, setMobile] = useState(false);
  const [subStage, setSubStage] = useState<1 | 2 | 3>(1);
  const [videoEnded, setVideoEnded] = useState(false);
  const [garlandProgress, setGarlandProgress] = useState(0);
  const [balloonsPopped, setBalloonsPopped] = useState(0);
  const [lanternClicked, setLanternClicked] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [subStage]);

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = videoRef.current.duration - 0.05;
    }
    setVideoEnded(true);
  };

  const handleTouchMove = () => {
    if (subStage !== 1 || !videoEnded) return;
    setGarlandProgress(prev => {
      const next = prev + 25;
      if (next >= 100) { setVideoEnded(false); setSubStage(2); }
      return next;
    });
  };

  const handleBalloonTap = () => {
    if (subStage !== 2 || !videoEnded) return;
    setBalloonsPopped(prev => {
      const next = prev + 1;
      if (next >= 3) { setVideoEnded(false); setSubStage(3); }
      return next;
    });
  };

  const handleLanternTap = () => {
    if (subStage !== 3 || !videoEnded || lanternClicked) return;
    setLanternClicked(true);
    setVideoEnded(false);
    videoRef.current?.play().catch(() => {});
  };

  const s1 = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part1_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part1_desktop.mp4';
  const s2 = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part2_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part2_desktop.mp4';
  const s3 = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part3_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part3_desktop.mp4';
  const videoSrc = subStage === 1 ? s1 : subStage === 2 ? s2 : s3;

  return (
    <div onMouseMove={subStage === 1 ? handleTouchMove : undefined} onTouchMove={subStage === 1 ? handleTouchMove : undefined} className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none">
      <video 
        ref={videoRef} 
        key={subStage} 
        src={videoSrc} 
        playsInline 
        autoPlay 
        muted={isMuted} 
        preload="auto" 
        onEnded={subStage === 3 && lanternClicked ? onComplete : handleVideoEnded} 
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none" 
      />

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute bottom-4 left-4 z-40 flex items-end gap-3 pointer-events-none max-w-sm md:max-w-md">
        <img src="/images/birthday/kids_fairytale/hero.png" alt="Искрица" className="w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-bounce" />
        <motion.div key={subStage} initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-white/95 backdrop-blur-md border-2 border-amber-400 p-4 rounded-2xl shadow-2xl text-slate-950 font-serif text-xs md:text-sm mb-6 pointer-events-auto relative">
          {subStage === 1 && <p>Добре дошли в празничната зала, {childName}! Залата има нужда от вълшебен блясък. Прокарай пръст по тавана, за да окачим гирляндите! ({garlandProgress}%)</p>}
          {subStage === 2 && <p>О, стана невероятно! Сега светлините греят... но какво е рожден ден без балони? Докосни 3 вълшебни места във въздуха, за да ги пуснем! ({balloonsPopped}/3)</p>}
          {subStage === 3 && <p>Празникът оживява! А сега докосни вълшебния фенер, за да отидем при празничната маса! ✨</p>}
        </motion.div>
      </motion.div>

      {videoEnded && subStage === 1 && (
        <div onClick={handleTouchMove} className="absolute top-0 inset-x-0 h-40 z-30 cursor-pointer pointer-events-auto flex items-center justify-center">
          <span className="px-6 py-2 rounded-full bg-amber-400/90 text-slate-950 font-bold text-xs shadow-lg animate-pulse">👉 Прокарай пръст по тавана тук ({garlandProgress}%)</span>
        </div>
      )}

      {videoEnded && subStage === 2 && (
        <div className="absolute inset-0 z-30 flex items-center justify-around pointer-events-auto">
          {[...Array(3 - balloonsPopped)].map((_, i) => (
            <motion.div key={i} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={handleBalloonTap} className="w-20 h-20 rounded-full bg-amber-400/50 border-2 border-amber-300 backdrop-blur-sm cursor-pointer flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.8)] animate-pulse">
              <Sparkles className="w-8 h-8 text-amber-200" />
            </motion.div>
          ))}
        </div>
      )}

      {videoEnded && subStage === 3 && !lanternClicked && (
        <div onClick={handleLanternTap} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-30 cursor-pointer pointer-events-auto flex items-center justify-center rounded-full bg-amber-400/40 border border-amber-300/80 shadow-[0_0_35px_rgba(255,215,0,0.9)] animate-ping">
          <Sparkles className="w-12 h-12 text-amber-200" />
        </div>
      )}
    </div>
  );
}
export default PartyHallScene;
