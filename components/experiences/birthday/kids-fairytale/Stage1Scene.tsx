'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DualVideoPlayer } from './DualVideoPlayer';
import { VideoPreloader } from './VideoPreloader';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Stage1SceneProps {
  deviceType: 'desktop' | 'phone';
  isMuted: boolean;
  onComplete: () => void;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
  onPlaying?: () => void;
}

interface BurstParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

export function Stage1Scene({ deviceType, isMuted, onComplete, onVideoRef, onPlaying }: Stage1SceneProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'part1' | 'pausedAtKey' | 'part2' | 'unlocked'>('part1');
  const [isKeyActive, setIsKeyActive] = useState(false);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isBursting, setIsBursting] = useState(false);
  const [particles, setParticles] = useState<BurstParticle[]>([]);

  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const video1Src = `/videos/birthday/kids-fairytale/stage_1/stage1_part1_${deviceType}.mp4`;
  const video2Src = `/videos/birthday/kids-fairytale/stage_1/stage1_part2_${deviceType}.mp4`;
  const nextStageVideoSrc = `/videos/birthday/kids-fairytale/stage_2/stage2_part1_${deviceType}.mp4`;
  const audioSrc = `/audio/kids-fairytale/stage1_voice.mp3`;

  useEffect(() => {
    audioRef.current = new Audio(audioSrc);
    audioRef.current.muted = isMuted;
    audioRef.current.play().catch(() => {});

    audioRef.current.onended = () => {
      setIsKeyActive(true);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleVideoEnded = () => {
    if (phase === 'part1') {
      setPhase('pausedAtKey');
    } else if (phase === 'part2') {
      setPhase('unlocked');
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  };

  const triggerKeyBurst = () => {
    setHoldProgress(1);
    setIsBursting(true);
    const count = 14 + Math.floor(Math.random() * 6);
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
        distance: 60 + Math.random() * 90,
        size: 4 + Math.random() * 5,
        delay: Math.random() * 0.08,
      }))
    );

    setTimeout(() => {
      setIsBursting(false);
      setTouchPos(null);
      setHoldProgress(0);
      setPhase('part2');
    }, 550);
  };

  const startHold = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    if (!isKeyActive || phase !== 'pausedAtKey') return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    setTouchPos({ x: clientX, y: clientY });

    startTimeRef.current = Date.now();

    const updateHold = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / 1500, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        triggerKeyBurst();
      } else {
        animFrameRef.current = requestAnimationFrame(updateHold);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateHold);
  };

  const endHold = () => {
    if (phase !== 'pausedAtKey' || isBursting) return;
    setHoldProgress(0);
    setTouchPos(null);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden select-none flex items-center justify-center">
      <DualVideoPlayer
        src={phase === 'part2' || phase === 'unlocked' ? video2Src : video1Src}
        onActiveVideoRef={(el) => { videoRef.current = el; onVideoRef?.(el); }}
        onEnded={handleVideoEnded}
        onPlaying={onPlaying}
        muted={true}
        loop={false}
      />

      {/* Warm the cache for stage 2's opening clip while this stage plays. */}
      <VideoPreloader src={nextStageVideoSrc} />

      {isKeyActive && (phase === 'pausedAtKey' || isBursting) && (
        <div
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className="absolute inset-0 z-30 cursor-pointer touch-none flex items-center justify-center"
        >
          <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center">
            {/* Gentle idle aura behind the key while it waits to be pressed. */}
            {!touchPos && (
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: '9rem',
                  height: '9rem',
                  background:
                    'radial-gradient(circle, rgba(251,191,36,0.55) 0%, rgba(245,158,11,0.25) 45%, transparent 75%)',
                }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            {touchPos && !isBursting && (
              <div
                className="absolute rounded-full pointer-events-none transition-all duration-200"
                style={{
                  left: `${touchPos.x}px`,
                  top: `${touchPos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: `${Math.max(80, holdProgress * 300)}px`,
                  height: `${Math.max(80, holdProgress * 300)}px`,
                  background: 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(245,158,11,0.5) 40%, transparent 80%)',
                  boxShadow: '0 0 50px #fbbf24',
                  opacity: 0.3 + holdProgress * 0.7,
                }}
              />
            )}

            {isBursting && touchPos && (
              <>
                <motion.div
                  className="fixed pointer-events-none"
                  style={{
                    left: `${touchPos.x}px`,
                    top: `${touchPos.y}px`,
                    transform: 'translate(-50%, -50%)',
                    width: '340px',
                    height: '340px',
                    borderRadius: '9999px',
                    background:
                      'radial-gradient(circle, rgba(255,250,220,0.95) 0%, rgba(251,191,36,0.6) 35%, transparent 72%)',
                  }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 1.3] }}
                  transition={{ duration: 0.2, times: [0, 0.4, 1], ease: 'easeOut' }}
                />
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="fixed rounded-full pointer-events-none"
                    style={{
                      left: `${touchPos.x}px`,
                      top: `${touchPos.y}px`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: '#fde68a',
                      boxShadow: '0 0 8px 2px rgba(251,191,36,0.9)',
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(p.angle) * p.distance,
                      y: Math.sin(p.angle) * p.distance,
                      opacity: 0,
                      scale: 0.3,
                    }}
                    transition={{ duration: 0.55, delay: p.delay, ease: 'easeOut' }}
                  />
                ))}
              </>
            )}
          </div>

          {!isBursting && (
            <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none px-4">
              <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] animate-pulse">
                {t('kidsFairytale.stage1.holdKeyPrompt')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
