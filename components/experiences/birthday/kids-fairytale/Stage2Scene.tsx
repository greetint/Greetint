'use client';
import React, { useState } from 'react';
import { DualVideoPlayer } from './DualVideoPlayer';
import { GarlandsSubScene } from './GarlandsSubScene';
import { BalloonsSubScene } from './BalloonsSubScene';

interface Stage2Props {
  deviceType: 'desktop' | 'phone';
  isMuted: boolean;
  onComplete: () => void;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
  onPlaying?: () => void;
}

export function Stage2Scene({ deviceType, isMuted, onComplete, onVideoRef, onPlaying }: Stage2Props) {
  const [sub, setSub] = useState<'garlands' | 'balloons' | 'transition'>('garlands');

  const vG = `/videos/birthday/kids-fairytale/stage_2/stage2_part1_${deviceType}.mp4`;
  const vB = `/videos/birthday/kids-fairytale/stage_2/stage2_part2_${deviceType}.mp4`;
  const vT = `/videos/birthday/kids-fairytale/stage_2/stage2_part3_${deviceType}.mp4`;

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none">
        <DualVideoPlayer
          src={sub === 'garlands' ? vG : sub === 'balloons' ? vB : vT}
          muted={true}
          autoPlay={true}
          loop={false}
          onEnded={sub === 'transition' ? onComplete : undefined}
          onActiveVideoRef={onVideoRef}
          onPlaying={onPlaying}
        />
      </div>

      {sub === 'garlands' && (
        <GarlandsSubScene deviceType={deviceType} isMuted={isMuted} onComplete={() => setSub('balloons')} />
      )}

      {sub === 'balloons' && (
        <BalloonsSubScene isMuted={isMuted} onComplete={() => setSub('transition')} />
      )}

      {sub === 'transition' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
          <p className="font-serif italic text-2xl md:text-4xl text-amber-200 animate-pulse drop-shadow">
            🎈 Балоните литват към залата...
          </p>
        </div>
      )}
    </div>
  );
}
