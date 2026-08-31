'use client';

import React from 'react';

interface PdfProps {
  recipient?: string;
  sender?: string;
  statusText?: string; 
  mainWish?: string;
  wishFromCandle?: string;
  secretJoke?: string;
  capsuleAnswers?: { question: string; answer: string }[];
  photos?: string[];
}

export function TimeCapsulePdf({
  recipient = 'Получател',
  sender = 'Подаряващия',
  statusText = '',
  mainWish = '',
  wishFromCandle = '',
  secretJoke = '',
  capsuleAnswers = [],
  photos = []
}: PdfProps) {
  
  // Филтрираме стриктно само снимките (игнорираме видеа/mp4) и взимаме максимум 5
  const isImage = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.match(/\.(jpeg|jpg|gif|png)$/) || lower.startsWith('data:image/');
  };
  const displayPhotos = (photos || []).filter(isImage).slice(0, 5);

  // Компонент за филмова лента
  const FilmStrip = ({ url, rotation }: { url: string, rotation: number }) => (
    <div 
      className="bg-[#141210] p-1.5 shadow-lg rounded-sm border border-[#2A2421] w-40 sm:w-44 mx-auto flex-shrink-0"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="flex justify-between px-1 mb-1 opacity-90">
        {[...Array(6)].map((_, idx) => <div key={`top-${idx}`} className="w-1.5 h-1 bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
      <img src={url} alt="Memory" className="w-full h-24 sm:h-28 object-cover rounded-xs border border-white/10" />
      <div className="flex justify-between px-1 mt-1 opacity-90">
        {[...Array(6)].map((_, idx) => <div key={`bot-${idx}`} className="w-1.5 h-1 bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
    </div>
  );

  // Подготвяме всички текстови блокове, които реално имат съдържание
  const textBlocks: React.ReactNode[] = [];
  
  if (statusText) textBlocks.push(
    <div className="space-y-0.5">
      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#C8B89D] pb-0.5">Начало</span>
      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl sm:text-2xl text-[#1F1A17] leading-snug">{statusText}</p>
    </div>
  );

  if (mainWish) textBlocks.push(
    <div className="space-y-0.5">
      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#C8B89D] pb-0.5">Послание</span>
      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl sm:text-2xl text-[#1F1A17] leading-snug">{mainWish}</p>
    </div>
  );

  if (wishFromCandle) textBlocks.push(
    <div className="space-y-0.5">
      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#C8B89D] pb-0.5">Намислено желание</span>
      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl sm:text-2xl text-[#1F1A17] leading-snug">"{wishFromCandle}"</p>
    </div>
  );

  if (secretJoke) textBlocks.push(
    <div className="space-y-0.5">
      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#C8B89D] pb-0.5">Скреч Тайна</span>
      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl sm:text-2xl text-[#1F1A17] leading-snug">{secretJoke}</p>
    </div>
  );

  if (capsuleAnswers && capsuleAnswers.length > 0) textBlocks.push(
    <div className="space-y-1.5 w-full">
      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[10px] uppercase tracking-widest text-center text-[#8A7C6E] border-b border-[#C8B89D] pb-0.5">
        Дневник на бъдещето
      </h3>
      <div className="grid grid-cols-2 gap-2 text-left">
        {capsuleAnswers.map((item, idx) => (
          <div key={idx} className="bg-white/20 p-1.5 rounded border border-[#C8B89D]/30">
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] sm:text-[9px] italic text-[#635E57] leading-tight">{item.question}</p>
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-lg text-[#1F1A17] font-bold leading-tight">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Изчисляваме колко "реда" ще имаме (комбинация от текст и снимка)
  const rowsCount = Math.max(textBlocks.length, displayPhotos.length);

  return (
    <div id="pdf-print-area" className="hidden print:block fixed inset-0 z-[9999] overflow-hidden bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');

        @media print {
          body * {
            visibility: hidden !important;
          }
          #pdf-print-area, #pdf-print-area * {
            visibility: visible !important;
          }
          #pdf-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            background-image: url('/images/pdf_background.jpg') !important;
            background-size: 100% 100% !important; /* Разпъва точно по А4 */
            background-position: center !important;
            background-repeat: no-repeat !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* 
        КОНТЕЙНЕР ЗА БЕЗОПАСНАТА ЗОНА
        pt-28 (отгоре) и pb-20 (отдолу) пазят текста да не се качи върху кафявите полета 
      */}
      <div className="w-[210mm] h-[297mm] mx-auto px-12 pt-[110px] pb-[80px] relative flex flex-col">
        
        {/* ЗАГЛАВИЕ */}
        <div className="text-center mb-6 z-10">
          <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl sm:text-5xl font-bold text-[#3A322D]">
            Капсула на времето за {recipient}
          </h1>
          <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xs italic text-[#7A6C5E] mt-1">
            Създадено с любов и надежда, за да се отвори в бъдещето
          </p>
        </div>

        {/* ГЪВКАВ ДИЗАЙН ЗА СНИМКИТЕ И ТЕКСТОВЕТЕ */}
        <div className="flex-1 flex flex-col justify-evenly z-10 w-full max-w-lg mx-auto gap-4">
          {Array.from({ length: rowsCount }).map((_, index) => {
            const textNode = textBlocks[index];
            const photoUrl = displayPhotos[index];
            const isImageLeft = index % 2 === 0;

            // Ако няма нито снимка, нито текст на този индекс (теоретично), прескачаме
            if (!textNode && !photoUrl) return null;

            return (
              <div 
                key={index} 
                className={`flex w-full items-center gap-6 ${isImageLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Снимка (Ако има) */}
                {photoUrl && (
                  <div className="w-2/5 flex justify-center">
                    <FilmStrip url={photoUrl} rotation={isImageLeft ? -4 : 5} />
                  </div>
                )}
                
                {/* Текст (Ако има). Ако няма снимка - центрираме текста */}
                {textNode && (
                  <div className={`${photoUrl ? 'w-3/5 text-left' : 'w-full text-center px-8'}`}>
                    {textNode}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ПОДПИС В КРАЯ НА БЕЗОПАСНАТА ЗОНА */}
        <div className="mt-4 pt-4 border-t border-[#C8B89D] z-10 text-right">
          <p style={{ fontFamily: "'Caveat', cursive" }} className="text-3xl text-[#1F1A17]">
            С любов, {sender}
          </p>
        </div>

        {/* АВТОРСКО ПРАВО - Точно върху долното кафяво поле */}
        <div 
          className="absolute bottom-4 left-0 right-0 text-center z-10"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#EAE2D6] opacity-80">
            GREETINT © 2026
          </span>
        </div>

      </div>
    </div>
  );
}

export default TimeCapsulePdf;