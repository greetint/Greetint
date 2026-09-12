'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Wind, Sparkles } from 'lucide-react';

interface CakeSceneProps {
  childAge: number;
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function CakeScene({ childAge, childName, isMuted = false, onComplete }: CakeSceneProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mobile, setMobile] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [listening, setListening] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const candleCount = Math.max(1, Math.min(15, childAge || 6));

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
  }, []);

  const blowOut = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  };

  const startListening = async () => {
    try {
      setListening(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkAudioVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        if (sum / dataArray.length > 30) {
          blowOut();
        } else if (listening && !candlesBlown) {
          requestAnimationFrame(checkAudioVolume);
        }
      };
      checkAudioVolume();
    } catch {
      setListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const cakeVideoSrc = mobile ? '/images/birthday/kids_fairytale/stage_2/stage2_part3_phone.mp4' : '/images/birthday/kids_fairytale/stage_2/stage2_part3_desktop.mp4';

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none">
      <video 
        ref={videoRef} 
        src={cakeVideoSrc} 
        playsInline 
        autoPlay 
        muted={isMuted} 
        preload="auto" 
        onEnded={onComplete} 
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none" 
      />
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-4 pointer-events-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-30 mt-6">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] font-serif text-3xl md:text-5xl font-bold tracking-wide">
            {candlesBlown ? `Честит рожден ден, ${childName}! 🎉` : `Намисли си желание, ${childName}! 🎂`}
          </p>
        </motion.div>

        {!candlesBlown ? (
          <div onClick={blowOut} className="my-auto flex flex-col items-center justify-center cursor-pointer group p-8 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/40 shadow-2xl hover:scale-105 transition-transform">
            <div className="flex gap-2 mb-4 items-end flex-wrap justify-center">
              {[...Array(candleCount)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <motion.div animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 0.7 + (i % 3) * 0.2 }} className="text-amber-400 mb-1">
                    <Flame className="w-6 h-6 fill-amber-300" />
                  </motion.div>
                  <div className="w-3 h-10 bg-gradient-to-r from-pink-300 to-rose-400 rounded-sm shadow-sm border border-pink-400"></div>
                </div>
              ))}
            </div>
            <span className="text-amber-200 text-base md:text-lg font-serif font-bold drop-shadow-md">Духни свещичките или докосни тук! 💨</span>
          </div>
        ) : (
          <div className="my-auto text-center">
            <span className="px-8 py-4 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/60 text-amber-300 text-xl md:text-2xl font-bold font-serif shadow-2xl animate-bounce">✨ Желанието отлетя към звездите! ✨</span>
          </div>
        )}

        {!candlesBlown && (
          <div className="flex gap-4 pb-8">
            {!listening && (
              <button onClick={startListening} className="px-6 py-3 rounded-full bg-purple-600/95 text-white font-bold text-sm shadow-lg backdrop-blur-md transition flex items-center gap-2 cursor-pointer">
                <Wind className="w-4 h-4" /> Духни с микрофон 🎤
              </button>
            )}
            <button onClick={blowOut} className="px-6 py-3 rounded-full bg-amber-500/95 text-slate-950 font-bold text-sm shadow-lg backdrop-blur-md transition flex items-center gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4" /> Духни с клик ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default CakeScene;
