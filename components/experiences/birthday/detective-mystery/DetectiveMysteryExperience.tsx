'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrestStage } from './ArrestStage';
import { SuspectRecordStage } from './SuspectRecordStage';
import { LieDetectorStage } from './LieDetectorStage';
import { MagnifyingGlassStage } from './MagnifyingGlassStage';
import { EvidenceVaultStage } from './EvidenceVaultStage';
import { PrisonReleaseStage } from './PrisonReleaseStage';

interface DetectiveMysteryExperienceProps {
  data: {
    recipient: string;
    age: string;
    sender: string;
    charges: string[];
    secretClue: string;
    secretAnswer: string;
    redactedWish: string;
    photos: { fileUrl: string }[];
  };
}

export function DetectiveMysteryExperience({ data }: DetectiveMysteryExperienceProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const recipient = data?.recipient || 'Заподозрян';
  const age = data?.age || '30';
  const sender = data?.sender || 'Инспектор';
  const charges = data?.charges || ['Превишена скорост на празнуване', 'Липса на алиби в петък вечер', 'Неоторизирано ядене на торта'];
  const secretClue = data?.secretClue || 'Къде се крием?';
  const secretAnswer = data?.secretAnswer || 'кафе';
  const redactedWish = data?.redactedWish || 'Честит рожден ден! Бъди все така неуловим.';
  const photos = data?.photos || [];

  // Background Ambient Detective Audio Loop strictly from /audio/detective/detective-ambient.mp3
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.35;
      audio.loop = true;
      const playAudio = () => {
        if (!isMuted) {
          audio.play().catch(() => {});
        }
      };
      playAudio();
      window.addEventListener('click', playAudio, { once: true });
      return () => window.removeEventListener('click', playAudio);
    }
  }, [isMuted]);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (audioRef.current) {
      audioRef.current.muted = newState;
      if (newState) {
        audioRef.current.pause();
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const stages = [
    <ArrestStage 
      key="arrest" 
      recipient={recipient} 
      age={age} 
      isMuted={isMuted}
      onComplete={() => setCurrentStageIndex(1)} 
    />,
    <SuspectRecordStage 
      key="record" 
      recipient={recipient} 
      age={age} 
      charges={charges} 
      isMuted={isMuted}
      onComplete={() => setCurrentStageIndex(2)} 
    />,
    <LieDetectorStage 
      key="liedetector" 
      recipient={recipient} 
      isMuted={isMuted}
      onComplete={() => setCurrentStageIndex(3)} 
    />,
    <MagnifyingGlassStage 
      key="magnify" 
      secretMemory={redactedWish} 
      isMuted={isMuted}
      onComplete={() => setCurrentStageIndex(4)} 
    />,
    <EvidenceVaultStage 
      key="vault" 
      secretClue={secretClue} 
      secretAnswer={secretAnswer} 
      photos={photos} 
      isMuted={isMuted}
      onComplete={() => setCurrentStageIndex(5)} 
    />,
    <PrisonReleaseStage 
      key="release" 
      recipient={recipient} 
      age={age} 
      sender={sender} 
      charges={charges} 
      photos={photos} 
      redactedWish={redactedWish} 
      isMuted={isMuted}
    />
  ];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#11100F] select-none">
      
      {/* Background Ambient Detective Audio */}
      <audio ref={audioRef} src="/audio/detective/detective-ambient.mp3" preload="auto" loop />

      {/* Floating Audio Mute Button controlling all audio and speech */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-55 w-10 h-10 bg-black/60 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-black/90 transition flex items-center justify-center text-base border border-white/20 cursor-pointer"
        title={isMuted ? 'Включи музиката' : 'Спри музиката'}
      >
        <span>{isMuted ? '🔇' : '🔊'}</span>
      </button>

      {/* Current Detective Stage */}
      {stages[currentStageIndex]}

    </main>
  );
}



