'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrestStage } from './ArrestStage';
import { SuspectRecordStage } from './SuspectRecordStage';
import { LieDetectorStage } from './LieDetectorStage';
import { MagnifyingGlassStage } from './MagnifyingGlassStage';
import { EvidenceVaultStage } from './EvidenceVaultStage';
import { PrisonReleaseStage } from './PrisonReleaseStage';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface DetectiveMysteryExperienceProps {
  data: {
    recipient: string;
    age: string;
    sender: string;
    charges?: string[];
    suspectProfile?: {
      alias: string;
      mainCrime: string;
      distinguishingMark: string;
      lastSeen: string;
      specialSkill: string;
    };
    secretClue: string;
    secretAnswer: string;
    secretPassword?: string;
    redactedWish: string;
    photos: { fileUrl: string }[];
    evidenceClues?: string[];
    evidenceAnswers?: string[];
    evidenceItems?: { fileUrl: string; clue: string; answer: string }[];
    lieDetectorQuestions?: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

export function DetectiveMysteryExperience({ data }: DetectiveMysteryExperienceProps) {
  const { t } = useLanguage();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const recipient = data?.recipient || t('detectiveMystery.experience.defaultRecipient');
  const age = data?.age || '30';
  const sender = data?.sender || t('detectiveMystery.experience.defaultSender');
  const suspectProfile = data?.suspectProfile || {
    alias: t('detectiveMystery.experience.defaultAlias'),
    mainCrime: data?.charges?.[0] || t('detectiveMystery.experience.defaultMainCrime'),
    distinguishingMark: data?.charges?.[1] || t('detectiveMystery.experience.defaultDistinguishingMark'),
    lastSeen: t('detectiveMystery.experience.defaultLastSeen'),
    specialSkill: data?.charges?.[2] || t('detectiveMystery.experience.defaultSpecialSkill')
  };
  const charges = data?.charges || [
    suspectProfile.mainCrime,
    suspectProfile.distinguishingMark,
    suspectProfile.specialSkill
  ];
  const secretClue = data?.secretClue || t('detectiveMystery.experience.defaultSecretClue');
  const secretAnswer = data?.secretAnswer || t('detectiveMystery.experience.defaultSecretAnswer');
  const redactedWish = data?.redactedWish || t('detectiveMystery.experience.defaultRedactedWish');
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
      suspectProfile={suspectProfile} 
      secretPassword={data?.secretPassword}
      evidenceAnswers={data?.evidenceAnswers}
      evidenceItems={data?.evidenceItems}
      isMuted={isMuted}
      onComplete={() => setCurrentStageIndex(2)} 
    />,
    <LieDetectorStage 
      key="liedetector" 
      recipient={recipient} 
      questions={data?.lieDetectorQuestions}
      isMuted={isMuted}
      onComplete={() => setCurrentStageIndex(3)} 
    />,
    <MagnifyingGlassStage 
      key="magnify" 
      secretMemory={redactedWish} 
      secretPassword={data?.secretPassword}
      age={age}
      recipient={recipient}
      suspectProfile={suspectProfile}
      evidenceAnswers={data?.evidenceAnswers}
      evidenceItems={data?.evidenceItems}
      charges={charges}
      isMuted={isMuted}
      onComplete={() => setCurrentStageIndex(4)} 
    />,
    <EvidenceVaultStage 
      key="vault" 
      photos={photos} 
      evidenceClues={data?.evidenceClues}
      evidenceAnswers={data?.evidenceAnswers}
      evidenceItems={data?.evidenceItems}
      suspectProfile={suspectProfile}
      recipient={recipient}
      age={age}
      secretPassword={data?.secretPassword}
      charges={charges}
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
      suspectProfile={suspectProfile}
      evidenceItems={data?.evidenceItems}
      evidenceClues={data?.evidenceClues}
      evidenceAnswers={data?.evidenceAnswers}
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
        title={isMuted ? t('detectiveMystery.experience.muteTooltipOn') : t('detectiveMystery.experience.muteTooltipOff')}
      >
        <span>{isMuted ? '🔇' : '🔊'}</span>
      </button>

      {/* Current Detective Stage */}
      {stages[currentStageIndex]}

    </main>
  );
}



