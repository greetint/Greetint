'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface SealStageProps {
  recipient?: string;
  onComplete?: () => void;
  onUnlock?: () => void;
}

/* ============================================================================
   3D СЦЕНА НА ПЛИКА И ПЕЧАТА
   ============================================================================ */
const Envelope3D: React.FC<{ isHolding: boolean; isUnlocked: boolean; progress: number }> = ({ isHolding, isUnlocked, progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Mesh>(null);
  const sealRef = useRef<THREE.Group>(null);
  const letterRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // Плавно отваряне на капака и излизане на листка
    if (flapRef.current && sealRef.current) {
      const targetFlapRotation = isUnlocked ? -Math.PI * 0.75 : (isHolding ? -Math.PI * 0.15 : 0);
      flapRef.current.rotation.x = THREE.MathUtils.lerp(flapRef.current.rotation.x, targetFlapRotation, delta * 4);
      sealRef.current.position.y = THREE.MathUtils.lerp(sealRef.current.position.y, isUnlocked ? 0.8 : (isHolding ? 0.05 : 0), delta * 4);
    }

    if (letterRef.current) {
      const targetLetterY = isUnlocked ? 1.2 : -0.2;
      letterRef.current.position.y = THREE.MathUtils.lerp(letterRef.current.position.y, targetLetterY, delta * 3);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Основа на плика */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.2, 0.05]} />
        <meshStandardMaterial color="#F5EBE6" roughness={0.3} />
      </mesh>

      {/* Вътрешен лист хартия, който се подава при отваряне */}
      <mesh ref={letterRef} position={[0, -0.2, -0.02]} castShadow>
        <boxGeometry args={[2.9, 2.5, 0.02]} />
        <meshStandardMaterial color="#FEFEFD" roughness={0.2} />
      </mesh>

      {/* Долен триъгълник на плика (лице) */}
      <mesh position={[0, -0.3, 0.03]}>
        <coneGeometry args={[2.26, 1.1, 4]} />
        <meshStandardMaterial color="#EAE0D5" roughness={0.25} />
      </mesh>

      {/* Капак на плика (който се отваря) */}
      <group position={[0, 1.1, 0.03]}>
        <mesh ref={flapRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[3.2, 1.1, 0.03]} />
          <meshStandardMaterial color="#DFD3C3" roughness={0.25} />
        </mesh>
      </group>

      {/* Златен восъчен печат */}
      <group ref={sealRef} position={[0, 0.2, 0.07]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Вътрешен детайл на печата */}
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.28, 32]} />
          <meshStandardMaterial color="#C5A880" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

/* ============================================================================
   ОСНОВЕН КОМПОНЕНТ SEALSTAGE
   ============================================================================ */
export function SealStage({ recipient = "Виктория", onComplete, onUnlock }: SealStageProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStartInteraction = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(() => {});
    }
  };

  const startHolding = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!hasStarted || isUnlocked) return;
    setIsHolding(true);
    let currentProgress = 0;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const bgAudio = document.getElementById('bg-music-player') as HTMLAudioElement;
    if (bgAudio && bgAudio.paused) {
      bgAudio.volume = 0.35;
      bgAudio.play().catch(() => {});
    }

    timerRef.current = setInterval(() => {
      currentProgress += 1.5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsUnlocked(true);
      }
    }, 25);
  };

  const stopHolding = () => {
    if (!hasStarted || isUnlocked) return;
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleProceedToQuest = () => {
    if (onUnlock) onUnlock();
    if (onComplete) onComplete();
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-[#1F1A17] flex flex-col items-center justify-between overflow-hidden select-none">
      <audio ref={audioRef} src="/audio/narrator-intro.mp3" preload="auto" />

      {/* 1. НАЧАЛЕН OVERLAY */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleStartInteraction}
            onTouchEnd={handleStartInteraction}
            className="fixed inset-0 z-50 bg-[#1F1A17] flex flex-col items-center justify-center p-6 cursor-pointer touch-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(45,39,35,0.95)_0%,_rgba(31,26,23,0.98)_80%)] pointer-events-none" />
            
            <motion.div
              animate={{ scale: [1, 1.015, 1], opacity: [0.95, 1, 0.95] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="text-center space-y-6 z-10 max-w-xl px-4"
            >
              <span className="text-xs uppercase tracking-[0.6em] text-[#958679] font-sans font-bold block leading-relaxed">
                ГРИЙТИНТ КИНЕМАТОГРАФИЯ
              </span>
              <h2 className="font-serif italic text-3xl sm:text-6xl text-[#FEFEFD] tracking-wide leading-tight">
                Имате неочаквано писмо...
              </h2>
              <div className="pt-4">
                <button
                  onClick={handleStartInteraction}
                  className="bg-[#DBCEB3] text-[#1F1A17] px-10 py-4 text-xs uppercase tracking-[0.3em] font-bold rounded-2xl font-sans hover:bg-[#FEFEFD] transition duration-300"
                >
                  Отвори Екрана 🎬
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D СЦЕНА НА ПЛИКА (WEBGL) */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer"
        onMouseDown={startHolding}
        onMouseUp={stopHolding}
        onMouseLeave={stopHolding}
        onTouchStart={startHolding}
        onTouchEnd={stopHolding}
      >
        <Canvas shadows camera={{ position: [0, 0, 5.5], fov: 45 }}>
          <ambientLight intensity={1.2} color="#FFFFFF" />
          <directionalLight position={[5, 5, 5]} intensity={1.8} castShadow color="#FFF8E1" />
          <pointLight position={[-4, 3, 2]} intensity={1.0} color="#FFFFFF" />
          
          <Envelope3D isHolding={isHolding} isUnlocked={isUnlocked} progress={progress} />
        </Canvas>
      </div>

      {/* ИНСТРУКЦИЯ ОТДОЛУ */}
      <AnimatePresence>
        {!isUnlocked && hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="relative z-20 text-center pb-12 pt-4 pointer-events-none mt-auto"
          >
            <p className="font-serif italic text-base sm:text-2xl text-[#DBCEB3] tracking-wide drop-shadow-sm">
              Натисни и задръж златния печат
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ОТКЛЮЧЕН ЛИСТ НА ЦЯЛ ЕКРАН */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-0"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-screen h-screen flex flex-col items-center justify-between p-6 sm:p-20 text-center overflow-hidden bg-[#FEFEFD]"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, delay: 0.4 }}
                className="w-full h-full max-w-2xl flex flex-col justify-between items-center z-10 py-10"
              >
                <div className="space-y-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-[#958679] font-sans font-bold block">
                    СПЕЦИАЛНО ПРЕЖИВЯВАНЕ
                  </span>
                  <h2 className="font-serif italic text-xl sm:text-4xl text-[#635E57] tracking-wide">
                    Честит Рожден Ден,
                  </h2>
                </div>

                <div className="py-2">
                  <h1 className="font-serif text-4xl sm:text-8xl text-[#1F1A17] uppercase tracking-wider font-light drop-shadow-sm">
                    {recipient}
                  </h1>
                  <div className="w-24 sm:w-28 h-[1px] bg-[#958679]/40 mx-auto mt-3" />
                </div>

                <div className="space-y-4 sm:space-y-6 w-full max-w-md">
                  <p className="font-serif italic text-sm sm:text-xl text-[#635E57] leading-relaxed">
                    "Подготвили сме ти неща, които да отключиш..."
                  </p>

                  <div>
                    <button
                      onClick={handleProceedToQuest}
                      className="bg-[#1F1A17] text-[#FEFEFD] px-8 py-3.5 sm:px-10 sm:py-4 text-xs uppercase tracking-[0.3em] font-bold rounded-xl font-sans hover:bg-[#635E57] transition duration-300 shadow-md"
                    >
                      Започни Приключението ➔
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SealStage;