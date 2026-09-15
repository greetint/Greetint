'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGE_VIDEOS } from './VideoPlayerManager';
import { IntroPart2 } from './IntroPart2';

interface IntroSceneProps {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function IntroScene({ childName, isMuted = false, onComplete }: IntroSceneProps) {
  const [mobile, setMobile] = useState(false);
  const [bookOpened, setBookOpened] = useState(false);
  const [showPart2, setShowPart2] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const part1Src = mobile ? STAGE_VIDEOS.stage1.phone : STAGE_VIDEOS.stage1.desktop;
  const part2Src = mobile ? STAGE_VIDEOS.stage1.part2Phone : STAGE_VIDEOS.stage1.part2Desktop;

  const handleOpenBook = async () => {
    if (bookOpened) return;
    setBookOpened(true);

    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    if (videoRef.current) {
      videoRef.current.muted = true;
      await videoRef.current.play().catch(() => {});
    }
  };

  const handlePart1Ended = () => {
    setShowPart2(true);
  };

  if (showPart2) {
    return <IntroPart2 childName={childName} isMuted={isMuted} onComplete={onComplete} />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center select-none z-50">
      <audio ref={audioRef} src="/audio/kids_fairytale/stage1_voice.mp3" preload="auto" />

      {/* Hidden preloader for Part 2 video to guarantee 0 black screen */}
      <video
        src={part2Src}
        muted={true}
        playsInline={true}
        webkit-playsinline="true"
        preload="auto"
        className="hidden"
      />

      {/* Part 1 Video Layer */}
      {bookOpened && (
        <div className="absolute inset-0 z-[1] w-full h-full">
          <video
            ref={videoRef}
            src={part1Src}
            muted={true}
            playsInline={true}
            webkit-playsinline="true"
            autoPlay={false}
            controls={false}
            preload="auto"
            disablePictureInPicture={true}
            onEnded={handlePart1Ended}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Title Header */}
      {bookOpened && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 inset-x-4 max-w-2xl mx-auto z-[40] pointer-events-none"
        >
          <div className="bg-amber-950/40 backdrop-blur-md border border-amber-400/60 rounded-2xl p-4 sm:p-6 text-amber-100 font-serif text-center shadow-2xl">
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400">
              Вълшебната приказка за {childName} започва...
            </h1>
          </div>
        </motion.div>
      )}

      {/* 3D Book Cover Overlay */}
      <AnimatePresence>
        {!bookOpened && (
          <motion.div
            exit={{ scale: 1.2, opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-gradient-to-br from-amber-950 via-slate-950 to-indigo-950 cursor-pointer"
            onClick={handleOpenBook}
          >
            <motion.div
              whileHover={{ scale: 1.03, rotateZ: 1 }}
              whileTap={{ scale: 0.97 }}
              className="relative max-w-md w-full bg-gradient-to-br from-amber-900 via-amber-950 to-yellow-950 border-4 border-amber-400 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(255,215,0,0.5)] text-center space-y-6 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center shadow-inner">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(255,215,0,0.9)] animate-pulse" />
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-amber-300">Вълшебна книга</span>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 leading-tight">
                  Вълшебната приказка за {childName}
                </h2>
              </div>

              <div className="pt-4">
                <span className="inline-block font-serif text-xs sm:text-sm font-bold text-slate-950 bg-amber-300 px-6 py-3 rounded-full shadow-lg border border-white animate-bounce">
                  Докосни книгата, за да я отвориш ✨
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IntroScene;

