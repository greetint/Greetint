'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cake, Flame, Wind, Sparkles, ArrowRight } from 'lucide-react';

interface CakeStageProps {
  childAge: number;
  onComplete: () => void;
}

export function CakeStage({ childAge, onComplete }: CakeStageProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [listening, setListening] = useState(false);
  const [micStatus, setMicStatus] = useState<string>('Натисни бутона или духни в микрофона!');
  const streamRef = useRef<MediaStream | null>(null);

  const candleCount = Math.max(1, Math.min(15, childAge || 6));

  const blowOutCandles = () => {
    setCandlesBlown(true);
    setMicStatus('✨ Желанието е изпратено към звездите!');
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  };

  const startListening = async () => {
    try {
      setListening(true);
      setMicStatus('🎤 Слушаме за твоето духане...');
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
        if (sum / dataArray.length > 35) {
          blowOutCandles();
        } else if (listening && !candlesBlown) {
          requestAnimationFrame(checkAudioVolume);
        }
      };
      checkAudioVolume();
    } catch {
      setListening(false);
      setMicStatus('Микрофонът не е достъпен. Използвай бутона по-долу! ✨');
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
      transition={{ duration: 0.5 }}
      className="w-full bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-pink-200 text-center space-y-6"
    >
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-purple-600 font-bold">🎂 Магическата торта</span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241D]">Време е за твоето рождено желание!</h2>
        <p className="text-xs text-[#2C241D]/70">Намисли си съкровено желание, след това поеми въздух и духни към свещичките!</p>
      </div>

      <div className="py-8 relative flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-amber-50 rounded-2xl border border-pink-200 shadow-inner">
        <div className="flex gap-2 mb-2 items-end flex-wrap justify-center max-w-xs">
          {[...Array(candleCount)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {!candlesBlown ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 + (i % 3) * 0.2 }}
                  className="text-amber-500 mb-1"
                >
                  <Flame className="w-5 h-5 fill-amber-400" />
                </motion.div>
              ) : (
                <div className="h-5 flex items-center justify-center text-xs">💨</div>
              )}
              <div className="w-2.5 h-8 bg-pink-300 rounded-sm shadow-sm border border-pink-400/50"></div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-pink-500 rounded-3xl text-white shadow-xl flex items-center justify-center w-48 sm:w-64">
          <Cake className="w-16 h-16" />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-purple-700 uppercase tracking-widest">{micStatus}</p>
        {!candlesBlown ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!listening ? (
              <button onClick={startListening} className="bg-purple-600 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-purple-700 shadow-md transition flex items-center justify-center gap-2 cursor-pointer">
                <Wind className="w-4 h-4" /> Включи микрофона
              </button>
            ) : (
              <div className="bg-purple-100 text-purple-800 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                🎤 Слушаме те... Духни сега!
              </div>
            )}
            <button onClick={blowOutCandles} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 shadow-md transition flex items-center justify-center gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4" /> Духни с клик ✨
            </button>
          </div>
        ) : (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onComplete} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] shadow-lg flex items-center justify-center gap-3 cursor-pointer">
            Към финалния замък <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
