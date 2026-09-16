'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stage3SceneProps {
  deviceType: 'desktop' | 'phone';
  onComplete: (audioBlob: Blob | null) => void;
}

export function Stage3Scene({ deviceType, onComplete }: Stage3SceneProps) {
  const [step, setStep] = useState<number>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [wishDone, setWishDone] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalSteps = 6;

  const getVideoSrc = (s: number) => `/videos/birthday/kids-fairytale/stage_3/stage3_part${s}_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const getAudioSrc = (s: number) => s <= 5 ? `/audio/kids-fairytale/stage3_voice_part${s}.mp3` : null;

  useEffect(() => {
    const audSrc = getAudioSrc(step);
    if (audSrc) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(audSrc);
      audioRef.current.play().catch(() => {});
    }

    if (step === 6 && !isRecording && !recordedBlob) {
      startMicrophoneRecording();
    }

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [step]);

  const startMicrophoneRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
    }
  };

  const handleScreenClick = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else if (step === totalSteps && !wishDone) {
      setWishDone(true);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setTimeout(() => {
        onComplete(recordedBlob);
      }, 1500);
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className="relative w-screen h-screen fixed inset-0 overflow-hidden bg-black select-none cursor-pointer"
    >
      <video
        key={step}
        src={getVideoSrc(step)}
        autoPlay
        muted
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute bottom-16 left-0 right-0 text-center z-20 pointer-events-none px-4">
        {step < totalSteps ? (
          <p className="font-serif italic text-lg md:text-2xl text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse">
            Докосни екрана, за да подредим празника! ✨ (Стъпка {step}/{totalSteps})
          </p>
        ) : (
          <div className="space-y-3 bg-black/40 backdrop-blur-md p-4 rounded-2xl max-w-lg mx-auto border border-amber-500/40">
            <p className="font-serif italic text-xl md:text-2xl text-amber-200 drop-shadow-md">
              🎂 Намисли си желание, кажи го на глас и докосни свещичката, за да я духнеш!
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
              {isRecording ? '🎙️ Записваме твоето желание...' : '✨ Желанието е записано!'}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {wishDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="text-amber-900 font-serif italic text-4xl md:text-6xl font-bold animate-pulse">
              Вълшебното желание се сбъдва! ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
