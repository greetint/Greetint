export function speakBulgarian(text: string, isMuted: boolean = false, rate: number = 0.92, pitch: number = 1.0) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  if (isMuted) return;

  try {
    // Enhance text normalization and spacing for natural, clear Bulgarian pronunciation
    const cleanedText = text
      .replace(/FBI/g, 'Еф Би Ай')
      .replace(/TOP SECRET/g, 'Топ сикрет')
      .replace(/\/\//g, ', ')
      .replace(/\./g, '. ')
      .replace(/!/g, '! ');

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'bg-BG';
    utterance.rate = rate; // Optimized rate (0.92) for natural phrasing and clarity in Bulgarian
    utterance.pitch = pitch; // Authoritative tone

    const applyVoiceAndSpeak = () => {
      if (isMuted) return;
      const voices = window.speechSynthesis.getVoices();
      const bgVoice = voices.find(v => 
        v.lang.toLowerCase().includes('bg') || 
        v.lang.toLowerCase().includes('bulgarian') ||
        v.name.toLowerCase().includes('bulgarian') ||
        v.name.toLowerCase().includes('български')
      );
      if (bgVoice) {
        utterance.voice = bgVoice;
      }
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      applyVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        applyVoiceAndSpeak();
      };
      setTimeout(() => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending && !isMuted) {
          applyVoiceAndSpeak();
        }
      }, 250);
    }
  } catch (e) {
    console.error('Speech synthesis error:', e);
  }
}

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

