'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedia } from '@/components/MediaContext';

interface IntroSceneProps {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function IntroScene({ childName, isMuted = false, onComplete }: IntroSceneProps) {
  const v1 = useRef<HTMLVideoElement | null>(null);
  const v2 = useRef<HTMLVideoElement | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const { isMediaUnlocked, unlockMedia } = useMedia();

  const [mobile, setMobile] = useState(false);
  const [bookOpened, setBookOpened] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const [holding, setHolding] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [v2Playing, setV2Playing] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.muted = isMuted;
    if (v1.current) v1.current.muted = true;
    if (v2.current) v2.current.muted = true;
  }, [isMuted]);

  const handleOpenBook = () => {
    if (bookOpened) return;
    // 1. Синхронно отключване на видеото и аудиото (User Gesture Trigger) в същата милисекунда
    unlockMedia();
    setBookOpened(true);

    const firstVideo = document.getElementById('main-video-player') as HTMLVideoElement;
    if (firstVideo) {
      firstVideo.muted = true;
      firstVideo.currentTime = 0;
      const playPromise = firstVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play prevented, waiting for trigger", error);
        });
      }
    }

    if (v1.current) {
      v1.current.muted = true;
      v1.current.currentTime = 0;
      v1.current.play().catch(() => {});
      // 4. Резервен механизъм (Fallback Start) след 500ms
      setTimeout(() => {
        if (v1.current && v1.current.paused) {
          v1.current.play().catch(() => {});
        }
      }, 500);
    }

    if (audio.current) {
      audio.current.muted = isMuted;
      audio.current.currentTime = 0;
      audio.current.play().catch(() => {});
      setTimeout(() => {
        if (audio.current && audio.current.paused && !isMuted) {
          audio.current.play().catch(() => {});
        }
      }, 500);
    }
  };

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!audioEnded || unlocked) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setUnlocked(true);
      setHolding(false);
      audio.current?.pause();
      if (v2.current) { 
        v2.current.currentTime = 0; 
        v2.current.muted = true; 
        v2.current.play().catch(() => {}); 
      }
    }, 900);
  };

  const cancelHold = () => {
    if (unlocked) return;
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setHolding(false);
  };

  const v1Src = mobile ? '/images/birthday/kids_fairytale/stage_1/stage1_part1_phone.mp4' : '/images/birthday/kids_fairytale/stage_1/stage1_part1_desktop.mp4';
  const v2Src = mobile ? '/images/birthday/kids_fairytale/stage_1/stage1_part2_phone.mp4' : '/images/birthday/kids_fairytale/stage_1/stage1_part2_desktop.mp4';

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-amber-950 via-slate-950 to-indigo-950 z-50 flex items-center justify-center select-none cursor-none">
      <audio ref={audio} src="/audio/kids_fairytale/stage_1/voice.mp3" preload="auto" onEnded={() => setAudioEnded(true)} />
      
      <video 
        ref={v1} 
        id="main-video-player"
        src={v1Src} 
        muted={true}
        playsInline={true}
        webkit-playsinline="true"
        autoPlay={false}
        controls={false}
        preload="auto"
        disablePictureInPicture={true}
        onError={(e) => console.error("Video load error for path:", e.currentTarget.src)}
        onContextMenu={(e) => e.preventDefault()} 
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-300 ${bookOpened && !unlocked && !v2Playing ? 'opacity-100' : 'opacity-0'}`} 
      />
      <video 
        ref={v2} 
        src={v2Src} 
        muted={true}
        playsInline={true}
        webkit-playsinline="true"
        autoPlay={false}
        controls={false}
        preload="auto"
        disablePictureInPicture={true}
        onError={(e) => console.error("Video load error for path:", e.currentTarget.src)}
        onPlaying={() => setV2Playing(true)} 
        onEnded={onComplete} 
        onContextMenu={(e) => e.preventDefault()} 
        className={`absolute inset-0 w-full h-full object-cover z-10 pointer-events-none select-none transition-opacity duration-300 ${unlocked ? 'opacity-100' : 'opacity-0'}`} 
      />

      <AnimatePresence>
        {!bookOpened && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 cursor-none pointer-events-auto" onClick={handleOpenBook} onTouchStart={handleOpenBook}>
            <div style={{ perspective: 1600 }} className="relative flex flex-col items-center justify-center cursor-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0, rotateY: -120 }}
                transition={{ duration: 0.7 }}
                className="relative w-[300px] h-[420px] sm:w-[380px] sm:h-[520px] rounded-r-3xl rounded-l-md shadow-[0_30px_70px_rgba(180,130,20,0.7)] border-4 border-amber-400 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 p-8 flex flex-col items-center justify-between text-center overflow-hidden cursor-none group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 shadow-inner" />
                <div className="absolute inset-4 border-2 border-dashed border-amber-500/40 rounded-2xl pointer-events-none" />

                <div className="relative z-10 pt-4">
                  <span className="font-cinzel text-xs uppercase tracking-[0.3em] font-bold text-amber-800">
                    Вълшебна Книга
                  </span>
                </div>

                <div className="relative z-10 my-auto px-4 space-y-4">
                  <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-800 via-yellow-700 to-amber-950 drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)] leading-tight">
                    Вълшебната приказка за {childName}
                  </h1>
                  <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
                </div>

                <div className="relative z-10 pb-4">
                  <motion.span 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block font-cinzel text-xs sm:text-sm font-bold text-amber-950 bg-amber-300/80 px-6 py-2.5 rounded-full shadow-md border border-white"
                  >
                    Докосни книгата, за да я отвориш
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -25 }} animate={{ opacity: bookOpened && !unlocked ? 1 : 0, y: bookOpened && !unlocked ? 0 : -25 }} transition={{ duration: 1.2 }} className="absolute top-10 inset-x-0 z-30 text-center px-4 pointer-events-none">
        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_4px_16px_rgba(255,215,0,0.7)]">
          Вълшебната приказка за {childName} започва сега...
        </h1>
      </motion.div>

      {audioEnded && !unlocked && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between py-16 px-4 pointer-events-auto cursor-none" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
          <div className="h-10" />
          
          {/* Interactive Key area directly on/over the key with ethereal cinematic golden radial-gradient glow blur-[8px] */}
          <div 
            className="absolute bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 cursor-none flex items-center justify-center group z-50 touch-none select-none" 
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={startHold} 
            onMouseUp={cancelHold} 
            onMouseLeave={cancelHold} 
            onTouchStart={startHold} 
            onTouchEnd={cancelHold}
          >
            {/* Ethereal cinematic golden light with blur-[8px] / radial-gradient glow */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(255,215,0,0.95)_0%,_rgba(255,170,0,0.5)_45%,_transparent_80%)] blur-[8px] pointer-events-none"
              animate={{ 
                scale: holding ? [1, 2.4, 2.2] : [1, 1.2, 1], 
                opacity: holding ? [0.6, 1, 0.9] : [0.2, 0.5, 0.2] 
              }}
              transition={{ repeat: Infinity, duration: holding ? 1.2 : 2.5, ease: 'easeInOut' }}
            />
            {holding && (
              <motion.div 
                initial={{ scale: 0.7, opacity: 0 }} 
                animate={{ scale: 2.8, opacity: [0.9, 0] }} 
                transition={{ repeat: Infinity, duration: 0.85, ease: 'easeOut' }} 
                className="absolute inset-0 rounded-full border-4 border-amber-300 bg-[radial-gradient(circle,_rgba(255,215,0,0.8)_0%,_transparent_70%)] blur-[10px] pointer-events-none shadow-[0_0_60px_rgba(255,215,0,1)]" 
              />
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12 text-center z-30 px-4 pointer-events-none mt-auto">
            <p className="font-cinzel text-xl sm:text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_2px_10px_rgba(255,215,0,0.8)]">
              Докосни и задръж върху ключа, {childName}!
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
export default IntroScene;
