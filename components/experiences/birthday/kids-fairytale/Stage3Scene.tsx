'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DualVideoPlayer } from './DualVideoPlayer';
import { VideoPreloader } from './VideoPreloader';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Stage3SceneProps {
  deviceType: 'desktop' | 'phone';
  isMuted: boolean;
  onComplete: (audioBlob: Blob | null, transcribedText: string) => void;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
  onPlaying?: () => void;
}

export function Stage3Scene({ deviceType, isMuted, onComplete, onVideoRef, onPlaying }: Stage3SceneProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [wishState, setWishState] = useState<'recording' | 'readyToBlow' | 'blowing' | 'done'>('recording');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [micListening, setMicListening] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const blowMeterRef = useRef<HTMLDivElement | null>(null);
  const blowHandledRef = useRef(false);

  const totalSteps = 6;

  const getVideoSrc = (s: number) => `/videos/birthday/kids-fairytale/stage_3/stage3_part${s}_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const getAudioSrc = (s: number) => s <= 5 ? `/audio/kids-fairytale/stage3_voice_part${s}.mp3` : null;
  const nextStageVideoSrc = `/videos/birthday/kids-fairytale/stage_4/stage4_part1_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  // Step 6's clip preloads and crossfades in like every other step, but must
  // freeze on its first frame instead of playing — it only resumes once the
  // child taps to blow out the candle.
  const isAwaitingBlow = step === totalSteps && wishState !== 'done';

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

  // Shared by both the real microphone blow and the tap fallback, guarded so
  // a blow and a tap racing each other can't both fire.
  const extinguishCandle = () => {
    if (blowHandledRef.current) return;
    blowHandledRef.current = true;
    setWishState('done');
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };

  const handleInteraction = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else if (step === totalSteps && wishState === 'readyToBlow') {
      extinguishCandle();
    }
  };

  // Only listens for a real "blow" once the wish is fully recorded — never
  // while `wishState === 'recording'`, so speaking the wish can't be
  // mistaken for blowing out the candle.
  useEffect(() => {
    if (step !== totalSteps || wishState !== 'readyToBlow') return;
    blowHandledRef.current = false;
    let cancelled = false;
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let rafId: number | null = null;

    const BLOW_THRESHOLD = 52; // 0-255 scale on averaged frequency data
    const SUSTAIN_FRAMES_NEEDED = 6; // ~100ms at 60fps, filters out brief taps/pops
    let sustainedFrames = 0;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = new AudioCtx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        setMicListening(true);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;

          if (blowMeterRef.current) {
            blowMeterRef.current.style.transform = `scale(${1 + Math.min(avg / 255, 1) * 0.6})`;
          }

          if (avg > BLOW_THRESHOLD) {
            sustainedFrames++;
            if (sustainedFrames >= SUSTAIN_FRAMES_NEEDED) {
              extinguishCandle();
              return;
            }
          } else {
            sustainedFrames = 0;
          }
          rafId = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        console.warn('Blow mic unavailable, tap fallback only:', err);
      }
    })();

    return () => {
      cancelled = true;
      setMicListening(false);
      if (rafId) cancelAnimationFrame(rafId);
      if (audioCtx) audioCtx.close().catch(() => {});
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [step, wishState]);

  const handleVideoEnded = () => {
    if (step === totalSteps && wishState === 'done') {
      setTimeout(() => onComplete(recordedBlob, transcribedText), 1000);
    }
  };

  return (
    <div onClick={handleInteraction} className="relative w-screen h-screen fixed inset-0 overflow-hidden select-none cursor-pointer">
      <DualVideoPlayer
        src={getVideoSrc(step)}
        onActiveVideoRef={(el) => { videoRef.current = el; onVideoRef?.(el); }}
        autoPlayOnSwap={!isAwaitingBlow}
        onEnded={handleVideoEnded}
        onPlaying={onPlaying}
        muted={true}
        loop={false}
      />

      {/* Warm the cache for stage 4's opening clip while this stage plays. */}
      <VideoPreloader src={nextStageVideoSrc} />

      <div className="absolute bottom-16 left-0 right-0 text-center z-20 pointer-events-none px-4">
        {step < totalSteps ? (
          <p className="font-serif italic text-lg md:text-2xl text-amber-200 drop-shadow animate-pulse">{t('kidsFairytale.stage3.tapScreen', { step, total: totalSteps })}</p>
        ) : (
          <div className="space-y-3 bg-black/50 backdrop-blur-md p-6 rounded-3xl max-w-lg mx-auto border border-amber-500/50 shadow-2xl pointer-events-auto">
            {wishState === 'recording' && (
              <>
                <p className="font-serif italic text-xl md:text-2xl text-amber-200">{t('kidsFairytale.stage3.recordingPrompt')}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-400 animate-pulse">{t('kidsFairytale.stage3.recordingStatus')}</p>
              </>
            )}
            {wishState === 'readyToBlow' && (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div
                    ref={blowMeterRef}
                    className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24] transition-transform duration-75"
                    style={{ opacity: micListening ? 1 : 0.35 }}
                  />
                  <p className="font-serif italic text-xl md:text-2xl text-amber-200">{t('kidsFairytale.stage3.blowPrompt')}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{transcribedText ? t('kidsFairytale.stage3.transcribedQuoted', { text: transcribedText }) : t('kidsFairytale.stage3.wishSavedStatus')}</p>
              </>
            )}
            {wishState === 'done' && (
              <p className="font-serif italic text-2xl text-amber-200 animate-pulse">{t('kidsFairytale.stage3.candleOutMessage')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}