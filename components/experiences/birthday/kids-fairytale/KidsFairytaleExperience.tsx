'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { MagicCursor } from './MagicCursor';
import { GiftFinaleScene } from './GiftFinaleScene';
import { getFairytaleSteps } from './fairytaleSteps';
import { BookCoverOverlay } from './BookCoverOverlay';
import { InteractionOverlay } from './InteractionOverlay';

export function KidsFairytaleExperience({ data }: { data: any }) {
  const [mobile, setMobile] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [audioEnded, setAudioEnded] = useState(false);
  const [done, setDone] = useState(false);
  const [wish, setWish] = useState('');
  const [finale, setFinale] = useState(false);

  const vA = useRef<HTMLVideoElement | null>(null);
  const vB = useRef<HTMLVideoElement | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const bg = useRef<HTMLAudioElement | null>(null);
  const [buf, setBuf] = useState<'A' | 'B'>('A');

  const name = data?.childName || 'Габи';
  const sender = data?.senderName || 'Мама и Тато';
  const msg = data?.personalMessage || 'Ти правиш всеки наш ден вълшебен!';
  const animal = data?.favoriteAnimal || 'единорог';

  useEffect(() => {
    const c = () => setMobile(window.innerWidth < 768);
    c(); window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);

  useEffect(() => {
    if (bg.current) bg.current.muted = muted;
    if (audio.current) audio.current.muted = muted;
  }, [muted]);

  const steps = getFairytaleSteps(name, mobile);
  const st = steps[idx] || steps[0];

  const runStep = (i: number) => {
    setIdx(i); setAudioEnded(false); setDone(false);
    const s = steps[i];
    if (!s) return;
    if (s.a && audio.current) { audio.current.src = s.a; audio.current.currentTime = 0; audio.current.play().catch(() => {}); }
    const nb = buf === 'A' ? 'B' : 'A'; setBuf(nb);
    const el = nb === 'A' ? vA.current : vB.current;
    if (el) { el.src = s.v; el.currentTime = 0; el.muted = true; el.play().catch(() => {}); }
  };

  const openBook = () => {
    if (unlocked) return;
    setUnlocked(true);
    bg.current?.play().catch(() => {});
    runStep(0);
  };

  const onEnded = () => {
    if (st.final) { setFinale(true); return; }
    if (!st.interactive) {
      if (idx + 1 < steps.length) runStep(idx + 1);
      else setFinale(true);
    }
  };

  const next = () => {
    setDone(true);
    if (idx + 1 < steps.length) runStep(idx + 1);
    else setFinale(true);
  };

  if (finale) return <GiftFinaleScene childName={name} senderName={sender} personalMessage={msg} favoriteAnimal={animal} childWish={wish} />;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center select-none">
      <MagicCursor />
      <audio ref={bg} src="/audio/kids_fairytale/background_kids_fairytale.mp3" preload="auto" loop />
      <audio ref={audio} preload="auto" onEnded={() => setAudioEnded(true)} />

      {unlocked && (
        <div className="absolute inset-0 z-0 w-full h-full">
          <video ref={vA} muted playsInline autoPlay preload="auto" onEnded={onEnded} className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-75 ${buf === 'A' ? 'opacity-100' : 'opacity-0'}`} />
          <video ref={vB} muted playsInline autoPlay preload="auto" onEnded={onEnded} className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-75 ${buf === 'B' ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      )}

      {unlocked && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} key={idx} className="absolute top-8 inset-x-4 max-w-2xl mx-auto z-40 pointer-events-none">
          <div className="bg-amber-950/40 backdrop-blur-md border border-amber-400/60 rounded-2xl p-4 sm:p-6 text-amber-100 font-serif text-center shadow-2xl">
            <p className="text-sm sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400 leading-relaxed">{st.t}</p>
          </div>
        </motion.div>
      )}

      <InteractionOverlay st={st} name={name} audioEnded={audioEnded} done={done} onNext={next} onSetWish={setWish} />

      <BookCoverOverlay name={name} unlocked={unlocked} onOpen={openBook} />

      <div className="fixed top-4 right-4 z-[100] flex items-center gap-3">
        <button onClick={() => setMuted(!muted)} className="bg-amber-950/80 backdrop-blur-md px-4 py-2.5 rounded-full text-amber-200 hover:bg-amber-900 shadow-2xl border border-amber-400/60 transition flex items-center gap-2 text-xs font-bold font-serif cursor-pointer">
          {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          <span>{muted ? "Тихо" : "Звук"}</span>
        </button>
      </div>
    </div>
  );
}

export default KidsFairytaleExperience;
