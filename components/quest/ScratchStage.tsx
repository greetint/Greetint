'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ScratchCardItem {
  id: string;
  title?: string;
  secretText: string;
}

interface ScratchStageProps {
  recipient?: string;
  scratchCards?: ScratchCardItem[];
  onComplete?: () => void;
}

const DEFAULT_CARDS: ScratchCardItem[] = [
  {
    id: '1',
    title: 'Първа тайна • Шега',
    secretText: 'Човекът, който пие 3 кафета на ден и пак намира енергия за щури идеи!',
  },
  {
    id: '2',
    title: 'Втора тайна • Спомен',
    secretText: 'Умишлено запазените най-луди моменти, които винаги ни крадат усмивките!',
  },
];

export function ScratchStage({ 
  recipient = "Виктория",
  scratchCards = DEFAULT_CARDS,
  onComplete 
}: ScratchStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScratched, setIsScratched] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const currentCard = scratchCards[currentIndex] || scratchCards[0];

  const MAX_SECRET_LENGTH = 140;
  const formattedSecretText = currentCard.secretText.length > MAX_SECRET_LENGTH 
    ? currentCard.secretText.substring(0, MAX_SECRET_LENGTH) + '...' 
    : currentCard.secretText;

  const initCanvas = () => {
    setIsCanvasReady(false);
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.globalCompositeOperation = 'source-over';
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#D4C4A8');
    gradient.addColorStop(0.5, '#B8A386');
    gradient.addColorStop(1, '#958679');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#322720';
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ Изтрий за да разкриеш тайната ✦', width / 2, height / 2);
    
    setIsScratched(false);
    setIsCanvasReady(true);
  };

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [currentIndex]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    if (percentage > 80) {
      setIsScratched(true);
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 42;

    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 21, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPosRef.current = { x, y };
    checkScratchPercentage();
  };

  const handleNextCard = () => {
    if (currentIndex < scratchCards.length - 1) {
      setIsScratched(false);
      setCurrentIndex(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] flex flex-col items-center justify-between overflow-hidden select-none px-4 py-6 sm:p-16">
      {/* ФОН НА ЦЯЛ ЕКРАН */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url('/images/assets/envelope_paper.jpeg')`,
        }}
      />
      
      <div className="absolute inset-0 bg-[#3A322D]/10 pointer-events-none z-0" />

      {/* ПЛАВАЩИ ПРАШИНКИ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#DBCEB3] rounded-full blur-[1px]"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* ОСНОВЕН КОНТЕЙНЕР (С БЕЗОПАСЕН ПАДИНГ ОТГОРЕ ЗА МУЗИКАЛНИЯ БУТОН) */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full max-w-4xl flex flex-col justify-between items-center z-10 pt-14 pb-6 sm:py-10 text-center"
      >
        <div className="space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-sm uppercase tracking-[0.4em] text-[#958679] font-sans font-bold block">
            {currentCard.title || `Тайна ${currentIndex + 1} от ${scratchCards.length}`}
          </span>
          <h2 className="font-serif italic text-xl sm:text-4xl text-[#635E57] tracking-wide px-2">
            Зад златното фолио е скрита тайната...
          </h2>
          <div className="w-20 sm:w-24 h-[1px] bg-[#958679]/50 mx-auto mt-2" />
        </div>

        {/* ЗОНА ЗА ТРИЕНЕ (ОПТИМИЗИРАНА ЗА МОБИЛНИ ВИСОЧИНИ) */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-xl h-40 sm:h-56 my-auto flex items-center justify-center rounded-2xl overflow-hidden border border-[#958679]/40 shadow-[0_20px_50px_rgba(31,26,23,0.15)] bg-[#FEFEFD]/80 backdrop-blur-sm p-4 sm:p-10"
        >
          {/* ТЕКСТ */}
          <div className="w-full max-h-full overflow-y-auto px-2 z-0">
            <motion.p 
              initial={{ scale: 0.96 }}
              animate={{ scale: isScratched ? 1 : 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`font-serif italic text-sm sm:text-xl text-[#1F1A17] leading-relaxed text-center px-2 drop-shadow-[0_2px_10px_rgba(219,206,179,0.5)] break-words transition-opacity duration-300 ${
                isCanvasReady ? 'opacity-100' : 'opacity-0'
              }`}
            >
              "{formattedSecretText}"
            </motion.p>
          </div>

          {/* ПЛАТНО ЗА ТРИЕНЕ */}
          <canvas
            ref={canvasRef}
            onMouseEnter={() => { lastPosRef.current = null; }}
            onMouseMove={(e) => {
              scratch(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              lastPosRef.current = null;
              scratch(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              scratch(e.touches[0].clientX, e.touches[0].clientY);
            }}
            className={`absolute inset-0 z-10 cursor-pointer touch-none transition-opacity duration-700 ${
              isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        </div>

        {/* ДОЛНА ЧАСТ С БУТОН */}
        <div className="w-full max-w-md space-y-3 pb-2">
          <AnimatePresence mode="wait">
            {isScratched ? (
              <motion.div
                key="next-btn"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <button
                  onClick={handleNextCard}
                  className="bg-[#1F1A17] text-[#FEFEFD] px-8 py-3.5 sm:px-10 sm:py-4 text-xs uppercase tracking-[0.3em] font-bold rounded-xl shadow-[0_15px_30px_rgba(31,26,23,0.25)] font-sans hover:bg-[#958679] transition duration-300 w-full"
                >
                  {currentIndex < scratchCards.length - 1 ? 'Следваща Тайна ➔' : 'Към Въпросите ➔'}
                </button>
              </motion.div>
            ) : (
              <motion.span 
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#635E57] font-sans font-bold italic block drop-shadow-sm"
              >
                ✦ Плъсни с пръст, за да изтриеш фолиото ✦
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default ScratchStage;