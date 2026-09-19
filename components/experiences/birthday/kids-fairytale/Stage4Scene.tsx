'use client';
import React, { useState } from 'react';
import { RibbonSubScene } from './RibbonSubScene';
import { ScratchSubScene } from './ScratchSubScene';

interface Stage4Props {
  deviceType: 'desktop' | 'phone';
  isMuted: boolean;
  childName: string;
  senderWish: string;
  transcribedWishText: string;
  recordedAudioBlob: Blob | null;
  onFinish: () => void;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
  onPlaying?: () => void;
}

export function Stage4Scene({ deviceType, isMuted, childName, senderWish, transcribedWishText, recordedAudioBlob, onVideoRef, onPlaying }: Stage4Props) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden select-none">
      {!unlocked ? (
        <RibbonSubScene deviceType={deviceType} isMuted={isMuted} onUnlocked={() => setUnlocked(true)} onVideoRef={onVideoRef} onPlaying={onPlaying} />
      ) : (
        <ScratchSubScene deviceType={deviceType} isMuted={isMuted} childName={childName} senderWish={senderWish} transcribedWishText={transcribedWishText} recordedAudioBlob={recordedAudioBlob} />
      )}
    </div>
  );
}
