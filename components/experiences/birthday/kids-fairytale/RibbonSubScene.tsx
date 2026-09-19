'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useMotionValueEvent, animate } from 'framer-motion';
import { VideoPreloader } from './VideoPreloader';

interface RibbonProps {
  deviceType: 'desktop' | 'phone';
  isMuted: boolean;
  onUnlocked: () => void;
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

const REQUIRED_DISTANCE = 130;

export function RibbonSubScene({ deviceType, isMuted, onUnlocked, onVideoRef, onPlaying }: RibbonProps) {
  const [isBursting, setIsBursting] = useState(false);
  const [particles, setParticles] = useState<BurstParticle[]>([]);
  const completedRef = useRef(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const distance = useTransform([x, y], ([lx, ly]) => Math.hypot(lx as number, ly as number));
  const progress = useTransform(distance, [0, REQUIRED_DISTANCE], [0, 1], { clamp: true });
  const auraScale = useTransform(progress, [0, 1], [0.7, 1.6]);
  const auraOpacity = useTransform(progress, [0, 1], [0.3, 0.85]);
  const stripAngle = useTransform([x, y], ([lx, ly]) => (Math.atan2(ly as number, lx as number) * 180) / Math.PI);

  const v1 = `/videos/birthday/kids-fairytale/stage_4/stage4_part1_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const nextClipSrc = `/videos/birthday/kids-fairytale/stage_4/stage4_part2_${deviceType === 'desktop' ? 'desctop' : 'phone'}.mp4`;
  const voice1 = `/audio/kids-fairytale/stage4_voice_part1.mp3`;

  useEffect(() => {
    audioRef.current = new Audio(voice1);
    audioRef.current.muted = isMuted; audioRef.current.play().catch(() => {});
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  useEffect(() => { if (audioRef.current) audioRef.current.muted = isMuted; }, [isMuted]);

  const triggerUntieBurst = () => {
    if (audioRef.current) audioRef.current.pause();
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
    setTimeout(onUnlocked, 550);
  };

  // Fires once the pull crosses the required distance — the ribbon comes
  // loose progressively as you drag, and finishing the pull completes it
  // without needing to release first.
  useMotionValueEvent(distance, 'change', (latest) => {
    if (latest >= REQUIRED_DISTANCE && !completedRef.current) {
      completedRef.current = true;
      triggerUntieBurst();
    }
  });

  const handleDragEnd = () => {
    if (completedRef.current) return;
    // Didn't pull far enough — the ribbon springs back taut.
    animate(x, 0, { type: 'spring', stiffness: 200, damping: 14 });
    animate(y, 0, { type: 'spring', stiffness: 200, damping: 14 });
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <video ref={(el: HTMLVideoElement | null) => onVideoRef?.(el)} onPlaying={onPlaying} src={v1} autoPlay muted playsInline webkit-playsinline="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      {/* Warm the cache for the scratch scene's clip while the ribbon plays. */}
      <VideoPreloader src={nextClipSrc} />

      <div className="absolute z-30 w-36 h-36 flex items-center justify-center">
        {/* Ribbon strip — stretches from the knot toward wherever it's being pulled. */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-1.5 rounded-full pointer-events-none origin-left"
          style={{
            width: distance,
            rotate: stripAngle,
            background: 'linear-gradient(to right, rgba(244,114,182,0.9), rgba(244,114,182,0.25))',
          }}
        />

        {!isBursting && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              scale: auraScale,
              opacity: auraOpacity,
              width: '9rem',
              height: '9rem',
              background: 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(245,158,11,0.5) 40%, transparent 80%)',
              boxShadow: '0 0 50px #fbbf24',
            }}
          />
        )}

        {isBursting && (
          <>
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: '340px',
                height: '340px',
                borderRadius: '9999px',
                background: 'radial-gradient(circle, rgba(255,250,220,0.95) 0%, rgba(251,191,36,0.6) 35%, transparent 72%)',
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 1.3] }}
              transition={{ duration: 0.2, times: [0, 0.4, 1], ease: 'easeOut' }}
            />
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{ width: `${p.size}px`, height: `${p.size}px`, background: '#fde68a', boxShadow: '0 0 8px 2px rgba(251,191,36,0.9)' }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(p.angle) * p.distance, y: Math.sin(p.angle) * p.distance, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.55, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </>
        )}

        <motion.div
          drag={!isBursting}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{ x, y }}
          className="relative w-20 h-20 rounded-full bg-amber-500/30 border-2 border-amber-200 backdrop-blur-sm flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing touch-none"
        >
          <span className="text-3xl pointer-events-none">🎀</span>
        </motion.div>
      </div>

      {!isBursting && (
        <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none px-4 z-30">
          <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow animate-pulse">✨ Дръпни панделката, за да я развържеш!</p>
        </div>
      )}
    </div>
  );
}
