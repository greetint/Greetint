'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cake, Flame, Wind, Sparkles } from 'lucide-react';

interface CakeSceneProps {
  childAge: number;
  onComplete: () => void;
}

export function CakeScene({ childAge, onComplete }: CakeSceneProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [listening, setListening] = useState(false);
  const [statusText, setStatusText] = useState('Намисли си желание, поеми въздух и духни към свещичките!');
  const streamRef = useRef<MediaStream | null>(null);

  const candleCount = Math.max(1, Math.min(15, childAge || 6));

  const blowOut = () => {
    setCandlesBlown(true);
    setStatusText('✨ Желанието излете към звездите с фойерверки!');
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const startListening = async () => {
    try {
      setListening(true);
      setStatusText('🎤 Слушаме те... Духни силно към микрофона!');
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
      setStatusText('Микрофонът не е достъпен. Докосни тортата, за да духнеш! ✨');
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl p-8 sm:p-14 rounded-[2.5rem] shadow-2xl border-4 border-pink-300 text-center space-y-6 relative overflow-hidden"
    >
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] bg-pink-100 text-pink-800 px-3 py-1 rounded-full font-bold">
          🎂 Вълшебната торта
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241D]">
          Кулминацията на празника!
        </h2>
        <p className="text-xs sm:text-sm text-[#2C241D]/70 max-w-md mx-auto font-sans">
          {statusText}
        </p>
      </div>

      {/* Cake Display */}
      <div 
        onClick={!candlesBlown ? blowOut : undefined}
        className="py-6 relative flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 via-amber-50 to-orange-50 rounded-3xl border-2 border-pink-200 shadow-inner cursor-pointer"
      >
        <div className="flex gap-2 mb-3 items-end flex-wrap justify-center max-w-xs">
          {[...Array(candleCount)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {!candlesBlown ? (
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7 + (i % 3) * 0.2 }}
                  className="text-amber-500 mb-1"
                >
                  <Flame className="w-6 h-6 fill-amber-400" />
                </motion.div>
              ) : (
                <div className="h-6 flex items-center justify-center text-sm">💨</div>
              )}
              <div className="w-3 h-10 bg-gradient-to-r from-pink-300 to-rose-400 rounded-sm shadow-sm border border-pink-400"></div>
            </div>
          ))}
        </div>

        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="p-6 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 rounded-[2rem] text-white shadow-2xl flex items-center justify-center w-52 sm:w-72"
        >
          <Cake className="w-20 h-20" />
        </motion.div>
      </div>

      {!candlesBlown && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {!listening ? (
            <button
              onClick={startListening}
              className="bg-purple-600 text-white px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-purple-700 shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wind className="w-4 h-4" /> Включи микрофона за духане
            </button>
          ) : (
            <div className="bg-purple-100 text-purple-800 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
              🎤 Слушаме те... Духни сега!
            </div>
          )}

          <button
            onClick={blowOut}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Духни с докосване ✨
          </button>
        </div>
      )}
    </motion.div>
  );
}
