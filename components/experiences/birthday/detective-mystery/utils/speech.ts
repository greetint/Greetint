export function speakBulgarian(text: string, rate: number = 0.95, pitch: number = 1.0) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bg-BG';
    utterance.rate = rate; // Optimized rate (0.95 - 1.0) for clarity and natural pacing
    utterance.pitch = pitch; // Authoritative and clear tone

    const applyVoiceAndSpeak = () => {
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
      // Fallback timeout in case onvoiceschanged doesn't fire
      setTimeout(() => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          applyVoiceAndSpeak();
        }
      }, 250);
    }
  } catch (e) {
    console.error('Speech synthesis error:', e);
  }
}
