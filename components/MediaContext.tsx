'use client';

import React, { createContext, useContext, useState } from 'react';

interface MediaContextType {
  isMediaUnlocked: boolean;
  unlockMedia: () => void;
}

const MediaContext = createContext<MediaContextType>({
  isMediaUnlocked: false,
  unlockMedia: () => {},
});

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [isMediaUnlocked, setIsMediaUnlocked] = useState(false);

  const unlockMedia = () => {
    setIsMediaUnlocked(true);
    if (typeof window === 'undefined') return;
    document.querySelectorAll('audio, video').forEach((el) => {
      const m = el as HTMLMediaElement;
      m.play().then(() => {}).catch(() => {});
    });
  };

  return (
    <MediaContext.Provider value={{ isMediaUnlocked, unlockMedia }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  return useContext(MediaContext);
}
