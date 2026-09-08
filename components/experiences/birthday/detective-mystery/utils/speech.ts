export function playSoundEffect(path: string, isMuted: boolean = false, volume: number = 0.7) {
  if (isMuted || typeof window === 'undefined') return;
  try {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (e) {
    console.error('Sound effect error:', e);
  }
}


