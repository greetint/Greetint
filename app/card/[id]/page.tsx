'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import { SealStage } from '@/components/quest/SealStage';
import { ScratchStage } from '@/components/quest/ScratchStage';
import { MemoryWallStage } from '@/components/quest/MemoryWallStage';
import { QuizStage } from '@/components/quest/QuizStage';
import { CakeStage } from '@/components/quest/CakeStage';
import { CapsuleStage } from '@/components/quest/CapsuleStage';
import TimeCapsulePdf from '@/components/TimeCapsulePdf';

type QuestStage = 'seal' | 'scratch' | 'quiz' | 'memories' | 'cake' | 'capsule';

export default function CardPage() {
  const params = useParams();
  const [currentStage, setCurrentStage] = useState<QuestStage>('seal');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const rawId = params?.id ? String(params.id) : 'виктория';
  const decodedName = decodeURIComponent(rawId);
  const formattedName = decodedName.charAt(0).toUpperCase() + decodedName.slice(1);
  const uppercaseName = formattedName.toUpperCase();

  const [cardData, setCardData] = useState({
    sender: 'Подаряващия',
    statusText: 'Посрещаме 2026 с нови мечти!',
    secretJoke: 'Човекът, който пие 3 кафета на ден...',
    mainWish: 'Нека тази година ти донесе здраве и вдъхновение!',
    wishFromCandle: '',
    photos: [] as string[]
  });

  // Управление на фоновата музика с непрекъснат loop
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
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
      if (newMutedState) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleGeneratePdf = async (capsuleAnswers: { question: string; answer: string }[]) => {
    try {
      const doc = (
        <TimeCapsulePdf
          recipient={formattedName}
          sender={cardData.sender}
          statusText={cardData.statusText}
          secretJoke={cardData.secretJoke}
          mainWish={cardData.mainWish}
          wishFromCandle={cardData.wishFromCandle}
          capsuleAnswers={capsuleAnswers}
          photos={cardData.photos}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Kapsula_na_vremeto_${formattedName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Грешка при генериране на PDF:', error);
      alert('Възникна грешка при генерирането на PDF файла.');
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#ECE8E0] select-none">
      
      {/* ФОНОВ АУДИО ПЛЕЙЪР С LOOP */}
      <audio ref={audioRef} src="/audio/background-music.mp3" preload="auto" loop />

      {/* МИНИМАЛИСТИЧНА КРЪГЛА ИКОНКА ЗА МУЗИКА (БЕЗ БОРДЪРИ) */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/40 backdrop-blur-md text-[#1F1A17] rounded-full shadow-md hover:bg-white/70 transition flex items-center justify-center text-base"
        title={isMuted ? 'Включи музиката' : 'Спри музиката'}
      >
        <span>{isMuted ? '🔇' : '🔊'}</span>
      </button>

      {currentStage === 'seal' && (
        <SealStage
          recipient={formattedName}
          onComplete={() => setCurrentStage('scratch')}
        />
      )}

      {currentStage === 'scratch' && (
        <ScratchStage
          recipient={uppercaseName}
          onComplete={() => setCurrentStage('quiz')}
        />
      )}

      {currentStage === 'quiz' && (
        <QuizStage
          recipient={uppercaseName}
          onComplete={() => setCurrentStage('memories')}
        />
      )}

      {currentStage === 'memories' && (
        <MemoryWallStage
          recipient={uppercaseName}
          onComplete={() => setCurrentStage('cake')}
        />
      )}

      {currentStage === 'cake' && (
        <CakeStage
          recipient={uppercaseName}
          onComplete={(wish) => {
            setCardData(prev => ({ ...prev, wishFromCandle: wish }));
            setCurrentStage('capsule');
          }}
        />
      )}

      {currentStage === 'capsule' && (
        <CapsuleStage
          onGeneratePdf={handleGeneratePdf}
        />
      )}

    </main>
  );
}