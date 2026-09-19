'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stage3SceneProps {
  deviceType: 'desktop' | 'phone';
  isMuted: boolean;
  onComplete: (audioBlob: Blob | null, transcribedText: string) => void;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
  onPlaying?: () => void;
}

export function Stage3Scene({ deviceType, isMuted, onComplete, onVideoRef, onPlaying }: Stage3SceneProps) {
  const [step, setStep] = useState<number>(1);
  const [wishState, setWishState] = useState<'recording' | 'readyToBlow' | 'blowing' | 'done'>('recording');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalSteps = 6;

  const getVideoSrc = (s: number) => `/videos/birthday/kids-fairytale/stage_3/stage3_part${s}_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const getAudioSrc = (s: number) => s <= 5 ? `/audio/kids-fairytale/stage3_voice_part${s}.mp3` : null;

  useEffect(() => {
    const audSrc = getAudioSrc(step);
    if (audSrc) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(audSrc);
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    }

    if (step === 6) {
      startRecordingAndSpeechRecognition();
    }

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [step]);

  useEffect(() => { if (audioRef.current) audioRef.current.muted = isMuted; }, [isMuted]);

  const startRecordingAndSpeechRecognition = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
    } catch (err) { console.warn('Mic error:', err); }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'bg-BG'; recognition.interimResults = false;
        recognition.onresult = (event: any) => setTranscribedText(event.results[0][0].transcript);
        recognition.start();
      }
    } catch (err) { console.warn('Speech rec error:', err); }

    setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setWishState('readyToBlow');
    }, 6000);
  };

  const handleInteraction = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else if (step === totalSteps && wishState === 'readyToBlow') {
      setWishState('done');
      if (videoRef.current) videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoEnded = () => {
    if (step === totalSteps && wishState === 'done') {
      setTimeout(() => onComplete(recordedBlob, transcribedText), 1000);
    }
  };

  return (
    <div onClick={handleInteraction} className="relative w-screen h-screen fixed inset-0 overflow-hidden select-none cursor-pointer">
      <video
        ref={(el: HTMLVideoElement | null) => { videoRef.current = el; onVideoRef?.(el); }}
        key={step}
        src={getVideoSrc(step)}
        autoPlay={step < totalSteps || wishState === 'done'}
        muted={true}
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        onEnded={handleVideoEnded}
        onPlaying={onPlaying}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute bottom-16 left-0 right-0 text-center z-20 pointer-events-none px-4">
        {step < totalSteps ? (
          <p className="font-serif italic text-lg md:text-2xl text-amber-200 drop-shadow animate-pulse">✨ Докосни екрана ({step}/{totalSteps})</p>
        ) : (
          <div className="space-y-3 bg-black/50 backdrop-blur-md p-6 rounded-3xl max-w-lg mx-auto border border-amber-500/50 shadow-2xl pointer-events-auto">
            {wishState === 'recording' && (
              <>
                <p className="font-serif italic text-xl md:text-2xl text-amber-200">🎙️ Намисли си желание и го кажи на глас!</p>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-400 animate-pulse">Записваме желанието ти...</p>
              </>
            )}
            {wishState === 'readyToBlow' && (
              <>
                <p className="font-serif italic text-xl md:text-2xl text-amber-200">🎂 Духни свещичката или докосни екрана.</p>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{transcribedText ? `"${transcribedText}"` : 'Желанието е запазено!'}</p>
              </>
            )}
            {wishState === 'done' && (
              <p className="font-serif italic text-2xl text-amber-200 animate-pulse">✨ Свещичката загасна! Сбъдва се...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}