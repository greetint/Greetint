'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MagicCursor } from './MagicCursor';
import { IntroScene } from './IntroScene';
import { Stage1Scene } from './Stage1Scene';
import { Stage2Scene } from './Stage2Scene';
import { Stage3Scene } from './Stage3Scene';
import { Stage4Scene } from './Stage4Scene';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface KidsFairytaleExperienceProps {
  data?: {
    childName?: string;
    senderWish?: string;
    personalMessage?: string;
    [key: string]: any;
  };
}

function captureVideoFrame(video: HTMLVideoElement | null): string | null {
  if (!video || !video.videoWidth || !video.videoHeight) return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch {
    return null;
  }
}

export function KidsFairytaleExperience({ data }: KidsFairytaleExperienceProps) {
  const { t } = useLanguage();
  const [currentStage, setCurrentStage] = useState<'intro' | 'stage1' | 'stage2' | 'stage3' | 'stage4'>('intro');
  const [deviceType, setDeviceType] = useState<'desktop' | 'phone'>('desktop');
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [transcribedWishText, setTranscribedWishText] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  // Frozen last frame of the outgoing stage's video, shown underneath the
  // incoming stage until ITS video fires `onPlaying` — this is what keeps
  // stage-to-stage transitions from ever showing a black screen.
  const [transitionFrame, setTransitionFrame] = useState<string | null>(null);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  const goToStage = (next: 'stage1' | 'stage2' | 'stage3' | 'stage4') => {
    const frame = captureVideoFrame(activeVideoRef.current);
    if (frame) setTransitionFrame(frame);
    setCurrentStage(next);
  };

  const clearTransitionFrame = () => setTransitionFrame(null);

  const childName = data?.childName || t('kidsFairytale.experience.defaultChildName');
  const senderWish = data?.senderWish || data?.personalMessage || t('kidsFairytale.experience.defaultSenderWish');

  useEffect(() => {
    const checkDevice = () => {
      setDeviceType(window.innerWidth >= 768 ? 'desktop' : 'phone');
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (bgMusicRef.current) {
        bgMusicRef.current.muted = next;
      }
      return next;
    });
  };

  const startExperience = () => {
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio('/audio/kids-fairytale/background_kids_fairytale.mp3');
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.3;
      bgMusicRef.current.muted = isMuted;
    }
    bgMusicRef.current.play().then(() => {
      // playing
    }).catch(() => {
      bgMusicRef.current = new Audio('/audio/background-music.mp3');
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.3;
      bgMusicRef.current.muted = isMuted;
      bgMusicRef.current.play().catch(() => {});
    });

    setCurrentStage('stage1');
  };

  return (
    <main className="relative w-screen h-screen fixed inset-0 overflow-hidden bg-black select-none font-sans">
      {transitionFrame && (
        <img
          src={transitionFrame}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
        />
      )}

      <MagicCursor />

      {currentStage !== 'intro' && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white/50 transition cursor-pointer"
          title={isMuted ? t('kidsFairytale.experience.unmuteTooltip') : t('kidsFairytale.experience.muteTooltip')}
        >
          <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
        </button>
      )}

      {currentStage === 'intro' && (
        <IntroScene childName={childName} deviceType={deviceType} onOpen={startExperience} />
      )}

      {currentStage === 'stage1' && (
        <Stage1Scene
          deviceType={deviceType}
          isMuted={isMuted}
          onComplete={() => goToStage('stage2')}
          onVideoRef={(el) => { activeVideoRef.current = el; }}
          onPlaying={clearTransitionFrame}
        />
      )}

      {currentStage === 'stage2' && (
        <Stage2Scene
          deviceType={deviceType}
          isMuted={isMuted}
          onComplete={() => goToStage('stage3')}
          onVideoRef={(el) => { activeVideoRef.current = el; }}
          onPlaying={clearTransitionFrame}
        />
      )}

      {currentStage === 'stage3' && (
        <Stage3Scene
          deviceType={deviceType}
          isMuted={isMuted}
          onComplete={(blob, text) => {
            setRecordedAudioBlob(blob);
            setTranscribedWishText(text);
            goToStage('stage4');
          }}
          onVideoRef={(el) => { activeVideoRef.current = el; }}
          onPlaying={clearTransitionFrame}
        />
      )}

      {currentStage === 'stage4' && (
        <Stage4Scene
          deviceType={deviceType}
          isMuted={isMuted}
          childName={childName}
          senderWish={senderWish}
          transcribedWishText={transcribedWishText}
          recordedAudioBlob={recordedAudioBlob}
          onFinish={() => {}}
          onVideoRef={(el) => { activeVideoRef.current = el; }}
          onPlaying={clearTransitionFrame}
        />
      )}
    </main>
  );
}
