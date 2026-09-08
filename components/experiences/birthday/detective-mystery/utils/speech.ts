export function playSoundEffect(path: string, isMuted: boolean = false, volume: number = 1.0) {
  if (isMuted || typeof window === 'undefined') return; // Централно спиране на всички звуци
  try {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play().catch((e) => console.log("Audio play blocked:", e));
  } catch (e) {
    console.error('Sound effect error:', e);
  }
}



