'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MagicCursor } from './MagicCursor';
import { IntroScene } from './IntroScene';
import { Stage1Scene } from './Stage1Scene';
import { Stage2Scene } from './Stage2Scene';
import { Stage3Scene } from './Stage3Scene';
import { Stage4Scene } from './Stage4Scene';

interface KidsFairytaleExperienceProps {
  data?: {
    childName?: string;
    senderWish?: string;
    personalMessage?: string;
    [key: string]: any;
  };
}

export function KidsFairytaleExperience({ data }: KidsFairytaleExperienceProps) {
  const [currentStage, setCurrentStage] = useState<'intro' | 'stage1' | 'stage2' | 'stage3' | 'stage4'>('intro');
  const [deviceType, setDeviceType] = useState<'desktop' | 'phone'>('desktop');
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  const childName = data?.childName || 'Габи';
  const senderWish = data?.senderWish || data?.personalMessage || 'Ти правиш света по-красив само защото си в него! Бъди все така щастлива и усмихната.';

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
      <MagicCursor />

      {currentStage !== 'intro' && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white/50 transition cursor-pointer"
          title={isMuted ? 'Включи звука' : 'Спри звука'}
        >
          <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
        </button>
      )}

      {currentStage === 'intro' && (
        <IntroScene childName={childName} onOpen={startExperience} />
      )}

      {currentStage === 'stage1' && (
        <Stage1Scene deviceType={deviceType} isMuted={isMuted} onComplete={() => setCurrentStage('stage2')} />
      )}

      {currentStage === 'stage2' && (
        <Stage2Scene deviceType={deviceType} isMuted={isMuted} onComplete={() => setCurrentStage('stage3')} />
      )}

      {currentStage === 'stage3' && (
        <Stage3Scene
          deviceType={deviceType}
          onComplete={(blob) => {
            setRecordedAudioBlob(blob);
            setCurrentStage('stage4');
          }}
        />
      )}

      {currentStage === 'stage4' && (
        <Stage4Scene
          deviceType={deviceType}
          childName={childName}
          senderWish={senderWish}
          recordedAudioBlob={recordedAudioBlob}
          onFinish={() => {}}
        />
      )}
    </main>
  );
}
