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
  
  // Филтър за снимки (хваща качените blob файлове и маха видеата)
  const isImage = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    if (lower.match(/\.(mp4|webm|ogg)$/)) return false;
    if (lower.startsWith('data:video')) return false;
    return true; 
  };
  
  const displayPhotos = (photos || []).filter(isImage).slice(0, 5);

  // Компонент за кинолентата с фиксирани размери
  const FilmStrip = ({ url, rotation }: { url: string, rotation: number }) => (
    <div 
      className="bg-[#141210] p-1.5 shadow-xl rounded-sm border border-[#2A2421] w-[140px] flex-shrink-0 mx-auto"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="flex justify-between px-1 mb-1 opacity-90">
        {[...Array(6)].map((_, idx) => <div key={`top-${idx}`} className="w-1.5 h-[3px] bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
      <img src={url} alt="Memory" className="w-full h-[90px] object-cover border border-white/10" />
      <div className="flex justify-between px-1 mt-1 opacity-90">
        {[...Array(6)].map((_, idx) => <div key={`bot-${idx}`} className="w-1.5 h-[3px] bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
    </div>
  );

  return (
    <div id="pdf-print-area" className="hidden print:block fixed inset-0 z-[9999] overflow-hidden bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');

        @media print {
          body * { visibility: hidden !important; }
          #pdf-print-area, #pdf-print-area * { visibility: visible !important; }
          #pdf-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            background-color: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* ОСНОВЕН A4 КОНТЕЙНЕР */}
      <div className="w-[210mm] h-[297mm] mx-auto relative overflow-hidden">
        
        {/* КОРЕКТЕН ПЪТ КЪМ ФОНА - ГАРАНТИРА ОТПЕЧАТВАНЕ */}
        <img 
          src="/images/pdf_background.jpg" 
          alt="Background" 
          className="absolute inset-0 w-[210mm] h-[297mm] object-cover z-0" 
        />

        {/* БЕЗОПАСНА ЗОНА ЗА ТЕКСТ (Предпазва от кафявите триъгълници) */}
        <div className="relative z-10 w-full h-full pt-[55mm] pb-[40mm] px-[20mm] flex flex-col justify-between">
          
          {/* ЗАГЛАВИЕ */}
          <div className="text-center mb-6 flex-shrink-0 border-b border-[#C8B89D]/60 pb-2">
            <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl font-bold text-[#3A322D]">
              Капсула на времето за {recipient}
            </h1>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[11px] italic text-[#7A6C5E] mt-1">
              Създадено с любов и надежда, за да се отвори в бъдещето
            </p>
          </div>

          {/* ЗИГ-ЗАГ ДИЗАЙН (Точно като на референцията) */}
          <div className="flex flex-col gap-6 flex-1">
            
            {/* БЛОК 1: Снимка отляво, Текст отдясно */}
            {(statusText || mainWish || displayPhotos[0]) && (
              <div className="flex w-full items-center gap-6">
                <div className="w-1/3 flex justify-center">
                  {displayPhotos[0] && <FilmStrip url={displayPhotos[0]} rotation={-4} />}
                </div>
                <div className="w-2/3 flex flex-col gap-3">
                  {statusText && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Начало</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-tight break-words">{statusText}</p>
                    </div>
                  )}
                  {mainWish && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Послание</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-tight break-words">{mainWish}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* БЛОК 2: Текст отляво, Снимка отдясно */}
            {(wishFromCandle || secretJoke || displayPhotos[1]) && (
              <div className="flex w-full items-center gap-6 flex-row-reverse">
                <div className="w-1/3 flex justify-center">
                  {displayPhotos[1] && <FilmStrip url={displayPhotos[1]} rotation={5} />}
                </div>
                <div className="w-2/3 flex flex-col gap-3 text-right">
                  {wishFromCandle && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Намислено желание</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-tight break-words">"{wishFromCandle}"</p>
                    </div>
                  )}
                  {secretJoke && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Скреч Тайна</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-tight break-words">{secretJoke}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* БЛОК 3: Дневник (Снимка отляво, Грид с отговори отдясно) */}
            {(capsuleAnswers.length > 0 || displayPhotos[2]) && (
              <div className="flex w-full items-center gap-4 mt-2">
                <div className="w-1/3 flex justify-center">
                  {displayPhotos[2] && <FilmStrip url={displayPhotos[2]} rotation={-3} />}
                </div>
                <div className="w-2/3 bg-white/30 p-3 rounded border border-[#C8B89D]/40 shadow-sm">
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[10px] uppercase tracking-widest text-center text-[#8A7C6E] border-b border-[#C8B89D]/60 pb-1 mb-2">
                    Дневник на бъдещето
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {capsuleAnswers.map((item, idx) => (
                      <div key={idx} className="mb-1">
                        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] italic text-[#635E57] mb-0.5 break-words">{item.question}</p>
                        <p style={{ fontFamily: "'Caveat', cursive" }} className="text-[18px] text-[#1F1A17] font-bold leading-tight break-words">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ПОДПИС */}
          <div className="flex-shrink-0 mt-6 pt-4 border-t border-[#C8B89D]/60 text-right">
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-3xl text-[#1F1A17] pr-4">
              С любов, {sender}
            </p>
          </div>

        </div>

        {/* АВТОРСКО ПРАВО - Абсолютно позиционирано в долната тъмна част */}
        <div 
          className="absolute bottom-[18mm] left-0 right-0 text-center z-20"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#EAE2D6] opacity-70">
            GREETING ARCHIVE © 2026
          </span>
        </div>

      </div>
    </div>
  );
}

export default TimeCapsulePdf;