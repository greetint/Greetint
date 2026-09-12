'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Flame, CheckCircle2 } from 'lucide-react';

interface CakeSceneProps {
  childAge: number;
  childName: string;
  isMuted?: boolean;
  onComplete: (wish?: string) => void;
}

export function CakeScene({ childAge, childName, isMuted = false, onComplete }: CakeSceneProps) {
  const v1Ref = useRef<HTMLVideoElement | null>(null);
  const v2Ref = useRef<HTMLVideoElement | null>(null);
  const v3Ref = useRef<HTMLVideoElement | null>(null);
  const v4Ref = useRef<HTMLVideoElement | null>(null);
  const v5Ref = useRef<HTMLVideoElement | null>(null);
  const v6Ref = useRef<HTMLVideoElement | null>(null);

  const [subStage, setSubStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [videoEnded, setVideoEnded] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [childWish, setChildWish] = useState<string>('');
  const [listening, setListening] = useState(false);
  const [wishRecorded, setWishRecorded] = useState(false);

  useEffect(() => {
    if (v1Ref.current) {
      v1Ref.current.muted = isMuted;
      v1Ref.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (v1Ref.current) v1Ref.current.muted = isMuted;
    if (v2Ref.current) v2Ref.current.muted = isMuted;
    if (v3Ref.current) v3Ref.current.muted = isMuted;
    if (v4Ref.current) v4Ref.current.muted = isMuted;
    if (v5Ref.current) v5Ref.current.muted = isMuted;
    if (v6Ref.current) v6Ref.current.muted = isMuted;
  }, [isMuted]);

  const addSpark = (x: number, y: number) => {
    setSparks(prev => [...prev.slice(-15), { id: Date.now() + Math.random(), x, y }]);
  };

  const handleVideoEnded = (stageNum: number) => {
    const videoMap: Record<number, HTMLVideoElement | null> = {
      1: v1Ref.current,
      2: v2Ref.current,
      3: v3Ref.current,
      4: v4Ref.current,
      5: v5Ref.current,
      6: v6Ref.current,
    };
    const currentVid = videoMap[stageNum];
    if (currentVid) {
      currentVid.pause();
      currentVid.currentTime = Math.max(0, currentVid.duration - 0.05);
    }
    setVideoEnded(true);
  };

  const handleTableClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!videoEnded) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    addSpark(clientX, clientY);

    setVideoEnded(false);
    if (subStage === 1) {
      setSubStage(2);
      v2Ref.current?.play().catch(() => {});
    } else if (subStage === 2) {
      setSubStage(3);
      v3Ref.current?.play().catch(() => {});
    } else if (subStage === 3) {
      setSubStage(4);
      v4Ref.current?.play().catch(() => {});
    }
  };

  const startSpeechRecognition = () => {
    if (listening || wishRecorded) return;
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      triggerCulmination('Най-хубавото желание за рожден ден!');
      return;
    }

    try {
      setListening(true);
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'bg-BG';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChildWish(transcript);
        setWishRecorded(true);
        setListening(false);
        triggerCulmination(transcript);
      };

      recognition.onerror = () => {
        setListening(false);
        triggerCulmination('Вълшебно желание от сърце!');
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch {
      setListening(false);
      triggerCulmination('Вълшебно желание от сърце!');
    }
  };

  const triggerCulmination = (wishText = 'Вълшебно желание') => {
    if (wishRecorded && subStage >= 5) return;
    setWishRecorded(true);
    if (!childWish) setChildWish(wishText);
    setVideoEnded(false);
    setSubStage(5);
    v5Ref.current?.play().catch(() => {});
  };

  const handlePart5Ended = () => {
    setSubStage(6);
    v6Ref.current?.play().catch(() => {});
  };

  const s1 = '/images/birthday/kids_fairytale/stage3/stage3_part1_desctop.mp4';
  const s2 = '/images/birthday/kids_fairytale/stage3/stage3_part2_desctop.mp4';
  const s3 = '/images/birthday/kids_fairytale/stage3/stage3_part3_desctop.mp4';
  const s4 = '/images/birthday/kids_fairytale/stage3/stage3_part4_desctop.mp4';
  const s5 = '/images/birthday/kids_fairytale/stage3/stage3_part5_desctop.mp4';
  const s6 = '/images/birthday/kids_fairytale/stage3/stage3_part6_desctop.mp4';

  const getDragonQuote = () => {
    switch (subStage) {
      case 1:
        return 'Уау, виж каква величествена маса! Но е толкова празна... Докосни покривката, за да сложим вълшебните чинии и лакомства! ✨';
      case 2:
        return 'Всичко е наредено перфектно! А сега докосни празната маса, за да поканим всички наши приказни приятели на празника! 🧚‍♂️';
      case 3:
        return 'Всички са тук и са толкова щастливи! Но погледни... какво ли липсва? Повикай вълшебната торта в центъра на масата! 🎂';
      case 4:
        return 'Ето я и нея! Затвори очи, намисли си най-съкровеното желание и го кажи на глас, а след това духни свещичката! ⭐';
      case 5:
      case 6:
        return 'Урааа! Желанието отлетя към звездите и засия в златна светлина! 🎉';
      default:
        return `Честит рожден ден, ${childName}! 🌟`;
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none">
      <video ref={v1Ref} src={s1} playsInline muted={isMuted} preload="auto" onEnded={() => handleVideoEnded(1)} onContextMenu={(e) => e.preventDefault()} className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-350 ${subStage === 1 ? 'opacity-100' : 'opacity-0'}`} />
      <video ref={v2Ref} src={s2} playsInline muted={isMuted} preload="auto" onEnded={() => handleVideoEnded(2)} onContextMenu={(e) => e.preventDefault()} className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-350 ${subStage === 2 ? 'opacity-100' : 'opacity-0'}`} />
      <video ref={v3Ref} src={s3} playsInline muted={isMuted} preload="auto" onEnded={() => handleVideoEnded(3)} onContextMenu={(e) => e.preventDefault()} className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-350 ${subStage === 3 ? 'opacity-100' : 'opacity-0'}`} />
      <video ref={v4Ref} src={s4} playsInline muted={isMuted} preload="auto" onEnded={() => handleVideoEnded(4)} onContextMenu={(e) => e.preventDefault()} className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-350 ${subStage === 4 ? 'opacity-100' : 'opacity-0'}`} />
      <video ref={v5Ref} src={s5} playsInline muted={isMuted} preload="auto" onEnded={handlePart5Ended} onContextMenu={(e) => e.preventDefault()} className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-350 ${subStage === 5 ? 'opacity-100' : 'opacity-0'}`} />
      <video ref={v6Ref} src={s6} playsInline muted={isMuted} preload="auto" onEnded={() => onComplete(childWish)} onContextMenu={(e) => e.preventDefault()} className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-350 ${subStage === 6 ? 'opacity-100' : 'opacity-0'}`} />

      {sparks.map(spark => (
        <motion.div key={spark.id} initial={{ opacity: 1, scale: 1, x: spark.x - 12, y: spark.y - 12 }} animate={{ opacity: 0, scale: 0.3, y: spark.y - 50, x: spark.x + (Math.random() * 40 - 20) }} transition={{ duration: 0.7, ease: 'easeOut' }} className="fixed pointer-events-none z-[70] text-amber-300 drop-shadow-[0_0_15px_rgba(255,215,0,0.9)]">
          <Sparkles className="w-6 h-6" />
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, x: -60, y: 30, scale: 0.8 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-40 flex items-end gap-3 pointer-events-none max-w-sm md:max-w-md">
        <motion.img src="/images/birthday/kids_fairytale/hero.png" alt="Искрица" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain drop-shadow-[0_12px_25px_rgba(255,215,0,0.6)]" />
        <motion.div key={subStage} initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="relative bg-gradient-to-br from-amber-50/95 via-yellow-50/90 to-amber-100/95 backdrop-blur-xl border-2 border-amber-300/90 p-5 rounded-3xl shadow-[0_15px_40px_rgba(180,130,20,0.35)] text-[#2C241D] font-serif text-xs sm:text-sm md:text-base mb-4 pointer-events-auto leading-relaxed">
          <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 border border-white flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
          </div>
          <div className="absolute -left-3 bottom-6 w-0 h-0 border-t-[8px] border-t-transparent border-r-[14px] border-r-amber-200 border-b-[8px] border-b-transparent filter drop-shadow-sm"></div>
          <p>{getDragonQuote()}</p>
        </motion.div>
      </motion.div>

      {videoEnded && subStage >= 1 && subStage <= 3 && (
        <div onClick={handleTableClick} onTouchStart={handleTableClick} className="absolute inset-0 z-30 cursor-pointer pointer-events-auto flex items-center justify-center">
          <div className="absolute bottom-24 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-serif font-bold px-8 py-4 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.8)] border-2 border-white animate-bounce flex items-center gap-2 text-sm sm:text-base">
            <Sparkles className="w-5 h-5 text-amber-950" />
            {subStage === 1 && "Докосни покривката, за да сложим чиниите ✨"}
            {subStage === 2 && "Докосни масата, за да поканим приятелите 🎈"}
            {subStage === 3 && "Докосни масата, за да повикаш вълшебната торта 🎂"}
          </div>
        </div>
      )}

      {videoEnded && subStage === 4 && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-4 pointer-events-auto bg-black/20 backdrop-blur-[2px]">
          <div className="text-center mt-6 z-40">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
              Намисли си вълшебно желание, {childName}! 🎂
            </h2>
          </div>

          <div className="my-auto flex flex-col items-center justify-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startSpeechRecognition} className="cursor-pointer group flex flex-col items-center justify-center p-8 rounded-full bg-gradient-to-br from-amber-500/90 via-yellow-500/90 to-amber-600/90 backdrop-blur-md border-2 border-white shadow-[0_0_40px_rgba(255,215,0,0.7)] text-slate-950">
              <Mic className="w-12 h-12 mb-2 animate-pulse text-amber-950" />
              <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-amber-950">
                {listening ? "Слушам желанието ти... 🎙️" : "Натисни и кажи своето желание ✨"}
              </span>
            </motion.div>

            <div className="flex gap-4">
              <button onClick={() => triggerCulmination("Празнично вълшебно желание")} className="px-6 py-3 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/60 text-amber-300 font-serif font-bold text-sm shadow-xl hover:bg-black/85 transition flex items-center gap-2 cursor-pointer">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> Духни свещичката с клик ✨
              </button>
            </div>
          </div>

          {childWish && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 px-6 py-3 rounded-2xl bg-amber-950/80 border border-amber-400/50 text-amber-200 font-serif text-sm backdrop-blur-md flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Желание: „{childWish}“
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default CakeScene;
