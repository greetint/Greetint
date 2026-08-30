'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface CakeStageProps {
  recipient?: string;
  senderWish?: string;
  onComplete?: (userWish: string) => void;
}

function useCinematicAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioContextClass();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playImpact = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(100, now);
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.8);
      subGain.gain.setValueAtTime(0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 1);
    } catch { /* noop */ }
  }, [getCtx]);

  const playSpark = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(1300, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch { /* noop */ }
  }, [getCtx]);

  return { playImpact, playSpark };
}

const Flame3D: React.FC<{ isBlownOut: boolean }> = ({ isBlownOut }) => {
  const outerFlame = useRef<THREE.Mesh>(null);
  const innerFlame = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerFlame.current && !isBlownOut) {
      outerFlame.current.scale.x = 1 + Math.sin(t * 15) * 0.12;
      outerFlame.current.scale.y = 1 + Math.cos(t * 18) * 0.18;
      outerFlame.current.rotation.z = Math.sin(t * 10) * 0.1;
    }
    if (innerFlame.current && !isBlownOut) {
      innerFlame.current.scale.x = 1 + Math.cos(t * 20) * 0.1;
      innerFlame.current.scale.y = 1 + Math.sin(t * 22) * 0.12;
    }
    if (lightRef.current && !isBlownOut) {
      lightRef.current.intensity = 2.2 + Math.sin(t * 25) * 0.5;
    }
  });

  if (isBlownOut) return null;

  return (
    <group position={[0, 2.7, 0]}>
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.6} />
      </mesh>
      <mesh ref={outerFlame}>
        <coneGeometry args={[0.22, 0.85, 32]} />
        <meshBasicMaterial color="#F97316" transparent opacity={0.9} />
      </mesh>
      <mesh ref={innerFlame} scale={[0.5, 0.6, 0.5]} position={[0, -0.05, 0]}>
        <coneGeometry args={[0.22, 0.85, 32]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      <pointLight ref={lightRef} color="#FBBF24" intensity={2.2} distance={6} decay={2} />
    </group>
  );
};

const Cake3D: React.FC<{ active: boolean; isBlownOut: boolean; isMobile: boolean }> = ({ active, isBlownOut, isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0025;
      
      let targetY = active ? (isMobile ? -0.2 : -0.6) : -6;
      if (isBlownOut) targetY = isMobile ? 0 : -0.3; 

      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 3);
    }
  });

  return (
    <group ref={groupRef} position={[0, -6, 0]} scale={isMobile ? 0.72 : 0.95}>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.75, 64]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
      </mesh>
      
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.82;
        const z = Math.sin(angle) * 0.82;
        return (
          <mesh key={`p1-${i}`} position={[x, 1.78, z]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
          </mesh>
        );
      })}

      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.8, 64]} />
        <meshStandardMaterial color="#FDFBF7" roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <torusGeometry args={[1.26, 0.03, 16, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
      </mesh>
      
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const x = Math.cos(angle) * 1.22;
        const z = Math.sin(angle) * 1.22;
        return (
          <mesh key={`p2-${i}`} position={[x, 0.93, z]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
          </mesh>
        );
      })}

      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.75, 1.75, 0.85, 64]} />
        <meshStandardMaterial color="#F5EBE6" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[1.76, 0.04, 16, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
      </mesh>

      <mesh position={[0, -0.78, 0]} receiveShadow>
        <cylinderGeometry args={[2.05, 2.05, 0.12, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.85, 0]} receiveShadow>
        <cylinderGeometry args={[2.25, 2.25, 0.08, 64]} />
        <meshStandardMaterial color="#C5A880" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 2.05, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.55, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.08, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0} />
      </mesh>

      <Flame3D isBlownOut={isBlownOut} />
    </group>
  );
};

const PartyOverlay: React.FC = () => {
  const elements = [...Array(35)].map((_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {elements.map((i) => (
        <motion.div
          key={`fw-${i}`}
          className="absolute"
          initial={{ opacity: 0, scale: 0, x: '50vw', y: '60vh' }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0.2, Math.random() * 1.4 + 0.5, 0],
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
        >
          {i % 2 === 0 ? (
            <span className="text-2xl sm:text-3xl text-[#FFD700] drop-shadow-[0_0_12px_#FFD700]">✨</span>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFFFFF] shadow-[0_0_15px_#FFD700]" />
          )}
        </motion.div>
      ))}

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`balloon-${i}`}
          className="absolute w-14 h-18 sm:w-16 sm:h-20 rounded-[50%] bg-gradient-to-br from-[#FFFFFF] to-[#E6D5B8] shadow-2xl opacity-90 border border-white/50"
          initial={{ y: '110vh', x: `${12 + i * 18}vw` }}
          animate={{ y: '-20vh', x: `${12 + i * 18 + (Math.random() * 10 - 5)}vw` }}
          transition={{ duration: 5 + Math.random() * 3, ease: 'easeOut' }}
        >
           <div className="absolute top-2 left-3 w-3.5 h-5 bg-white/40 rounded-full blur-[2px]" />
           <div className="absolute bottom-[-14px] left-1/2 w-0.5 h-14 bg-white/50" />
        </motion.div>
      ))}
    </div>
  );
};

export function CakeStage({
  recipient = 'ВИКТОРИЯ',
  senderWish = 'Нека тази година ти донесе здраве, вдъхновение, безкрайно щастие и много сбъднати мечти!',
  onComplete,
}: CakeStageProps) {
  const [stage, setStage] = useState<'wish_entry' | 'cake_reveal' | 'blown_celebrate'>('wish_entry');
  const [userWish, setUserWish] = useState('');
  const [micStatus, setMicStatus] = useState<'idle' | 'active' | 'error'>('idle');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const uppercaseRecipient = recipient.toUpperCase();
  const { playImpact, playSpark } = useCinematicAudio();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleBlowCandle = useCallback(() => {
    setStage((prev) => {
      if (prev === 'blown_celebrate') return prev;
      playImpact();
      return 'blown_celebrate';
    });
  }, [playImpact]);

  const startListening = useCallback(() => {
    if (stage === 'cake_reveal' && micStatus !== 'active') {
      navigator.mediaDevices
        ?.getUserMedia({ audio: true, video: false })
        .then((stream) => {
          micStreamRef.current = stream;
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          audioContextRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;

          const microphone = audioCtx.createMediaStreamSource(stream);
          microphone.connect(analyser);
          setMicStatus('active');

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let blowFrames = 0;

          const detectBlow = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const average = sum / dataArray.length;

            if (average > 18) {
              blowFrames++;
              if (blowFrames > 2) {
                handleBlowCandle();
                return;
              }
            } else {
              if (blowFrames > 0) blowFrames--;
            }
            animationFrameRef.current = requestAnimationFrame(detectBlow);
          };
          detectBlow();
        })
        .catch(() => setMicStatus('error'));
    }
  }, [stage, micStatus, handleBlowCandle]);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (micStreamRef.current) micStreamRef.current.getTracks().forEach((track) => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setMicStatus('idle');
  }, []);

  useEffect(() => {
    if (stage === 'cake_reveal') {
      const timer = setTimeout(startListening, 800);
      return () => clearTimeout(timer);
    } else if (stage === 'blown_celebrate') {
      stopListening();
    }
  }, [stage, startListening, stopListening]);

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWish.trim()) return;
    playSpark();
    setStage('cake_reveal');
  };

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden select-none font-sans flex flex-col items-center justify-between px-4 pt-12 pb-4">
      
      {/* ФОН */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FEFEFD] via-[#FDFBF7] to-[#EAE2D6] z-0" />
      
      {/* 3D СЦЕНА */}
      <div 
        className="absolute inset-0 z-0 cursor-pointer" 
        onClick={stage === 'cake_reveal' ? handleBlowCandle : undefined}
      >
        <Canvas shadows camera={{ position: [0, 1.5, isMobile ? 8.5 : 6.5], fov: 45 }}>
          <ambientLight intensity={1.2} color="#FFFFFF" />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            color="#FFF8E1"
          />
          <pointLight position={[-4, 3, 2]} intensity={1.2} color="#FFFFFF" />
          
          <Cake3D active={stage !== 'wish_entry'} isBlownOut={stage === 'blown_celebrate'} isMobile={isMobile} />
        </Canvas>
      </div>

      {stage === 'blown_celebrate' && <PartyOverlay />}

      <div className="relative z-40" />

      {/* UI - ДОЛНА ЧАСТ */}
      <div className={`relative z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center pointer-events-none ${stage === 'blown_celebrate' ? 'absolute bottom-6 left-4 right-4 max-w-md mx-auto' : 'my-auto'}`}>
        <AnimatePresence mode="wait">
          
          {/* ФАЗА 1 */}
          {stage === 'wish_entry' && (
            <motion.div
              key="wish-form"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)', y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center text-center space-y-6 px-2 pointer-events-auto"
            >
              <h1 className="font-serif italic text-xl sm:text-4xl text-[#1F1A17] leading-relaxed max-w-lg drop-shadow-sm px-2">
                "Преди да се разкрие празничната 3D магия, напиши своето съкровено желание..."
              </h1>

              <form onSubmit={handleSubmitWish} className="w-full max-w-md space-y-4">
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  placeholder="Твоето желание тук..."
                  className="w-full bg-white/30 backdrop-blur-md text-[#1F1A17] placeholder-[#7A6C5E] px-6 py-4 rounded-full text-sm sm:text-base tracking-wide text-center focus:outline-none focus:border-[#D4AF37] shadow-sm transition-all"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-[#1F1A17] text-[#DBCEB3] py-4 rounded-full font-sans text-xs uppercase tracking-[0.3em] font-bold hover:bg-[#3A332E] transition duration-300"
                >
                  Заключи Желанието ➔
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* ФАЗА 2 */}
          {stage === 'cake_reveal' && (
            <motion.div
              key="blow-instruction"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 left-0 right-0 text-center space-y-1 pointer-events-none px-4"
            >
              <span className="font-serif italic text-lg sm:text-3xl text-[#1F1A17] block drop-shadow-sm">
                {uppercaseRecipient}
              </span>
              <p className="text-[9px] sm:text-xs uppercase tracking-[0.3em] text-[#7A6C5E] font-medium bg-white/40 px-4 py-1.5 rounded-full backdrop-blur-md inline-block animate-pulse">
                🎤 Духни в микрофона или кликни тортата
              </p>
            </motion.div>
          )}

          {/* ФАЗА 3: ЧИСТ ТЕКСТ НАЙ-ОТДОЛУ И МИНИМАЛИСТИЧЕН БУТОН БЕЗ РАМКИ */}
          {stage === 'blown_celebrate' && (
            <motion.div
              key="celebration-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full text-center space-y-2 pointer-events-auto px-6 max-w-sm mx-auto"
            >
              <p className="font-serif italic text-xs sm:text-sm text-[#5A5046] leading-relaxed drop-shadow-sm">
                "{senderWish}"
              </p>

              <div className="pt-1">
                <button
                  onClick={() => onComplete && onComplete(userWish)}
                  className="text-[#1F1A17] font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] font-bold hover:text-[#7A6C5E] transition duration-300 py-2 inline-flex items-center space-x-2"
                >
                  <span>Към Капсулата на бъдещето</span>
                  <span className="text-sm">➔</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 pb-1 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#958679] text-center w-full pointer-events-none">
        GREETING ARCHIVE © 2026
      </div>
    </div>
  );
}

export default CakeStage;