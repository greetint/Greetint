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

  // Управление на фоновата музика
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.35;
      audio.loop = true;
      
      const playAudio = () => {
        audio.play().catch(() => {});
      };

      playAudio();
      window.addEventListener('click', playAudio, { once: true });
      return () => window.removeEventListener('click', playAudio);
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleGeneratePdf = async (capsuleAnswers: { question: string; answer: string }[]) => {
    try {
      const answersList = capsuleAnswers.map(item => `${item.question}: ${item.answer}`);

      const doc = (
        <TimeCapsulePdf
          recipient={formattedName}
          sender={cardData.sender}
          statusText={cardData.statusText}
          secretJoke={cardData.secretJoke}
          mainWish={cardData.mainWish}
          wishFromCandle={cardData.wishFromCandle}
          capsuleAnswers={answersList}
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
      
      {/* ФОНОВ АУДИО ПЛЕЙЪР */}
      <audio ref={audioRef} src="/audio/background-music.mp3" preload="auto" />

      {/* ПЛАВАЩ БУТОН ЗА МУЗИКА */}
      <button
        onClick={toggleMute}
        className="absolute top-5 right-5 z-50 bg-white/30 backdrop-blur-md border border-white/50 text-[#1F1A17] px-3.5 py-2 rounded-full text-xs uppercase tracking-widest shadow-md hover:bg-white/60 transition flex items-center gap-2"
        title="Включи/Изключи музиката"
      >
        <span>{isMuted ? '🔇 Музика: Спряна' : '🎵 Музика: Пусната'}</span>
      </button>

      {/* 1. ЕТАП: ВОСЪЧЕН ПЕЧАТ */}
      {currentStage === 'seal' && (
        <SealStage
          recipient={formattedName}
          onComplete={() => setCurrentStage('scratch')}
        />
      )}

      {/* 2. ЕТАП: ЗЛАТНО СКРЕЧ ФОЛИО */}
      {currentStage === 'scratch' && (
        <ScratchStage
          recipient={uppercaseName}
          onComplete={() => setCurrentStage('quiz')}
        />
      )}

      {/* 3. ЕТАП: ПЕРСОНАЛЕН ВЪПРОС */}
      {currentStage === 'quiz' && (
        <QuizStage
          recipient={uppercaseName}
          onComplete={() => setCurrentStage('memories')}
        />
      )}

      {/* 4. ЕТАП: ГАЛЕРИЯ СЪС СПОМЕНИ */}
      {currentStage === 'memories' && (
        <MemoryWallStage
          recipient={uppercaseName}
          onComplete={() => setCurrentStage('cake')}
        />
      )}

      {/* 5. ЕТАП: ДУХВАНЕ НА СВЕЩ */}
      {currentStage === 'cake' && (
        <CakeStage
          recipient={uppercaseName}
          onComplete={(wish) => {
            setCardData(prev => ({ ...prev, wishFromCandle: wish }));
            setCurrentStage('capsule');
          }}
        />
      )}

      {/* 6. ФИНАЛЕН ЕТАП: КАПСУЛА НА БЪДЕЩЕТО (ЛИЧЕН ДНЕВНИК И PDF) */}
      {currentStage === 'capsule' && (
        <CapsuleStage
          onGeneratePdf={handleGeneratePdf}
        />
      )}

    </main>
  );
}