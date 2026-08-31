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
  
  // Филтър за снимки (махaме видеа и пазим само изображенията)
  const isImage = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    if (lower.match(/\.(mp4|webm|ogg)$/)) return false;
    if (lower.startsWith('data:video')) return false;
    return true; 
  };
  
  const displayPhotos = (photos || []).filter(isImage).slice(0, 5);

  // Компонент за кинолентата с перфектни пропорции
  const FilmStrip = ({ url, rotation }: { url: string, rotation: number }) => (
    <div 
      className="bg-[#141210] p-1.5 shadow-xl rounded-sm border border-[#2A2421] w-[130px] flex-shrink-0 mx-auto"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="flex justify-between px-1 mb-1 opacity-90">
        {[...Array(5)].map((_, idx) => <div key={`top-${idx}`} className="w-1.5 h-[3px] bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
      <img src={url} alt="Memory" className="w-full h-[85px] object-cover border border-white/10" />
      <div className="flex justify-between px-1 mt-1 opacity-90">
        {[...Array(5)].map((_, idx) => <div key={`bot-${idx}`} className="w-1.5 h-[3px] bg-[#FEFEFD] rounded-[1px]" />)}
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
      <div className="w-[210mm] h-[297mm] mx-auto relative overflow-hidden bg-[#FAF6EE]">
        
        {/* ФОНОВО ИЗОБРАЖЕНИЕ С ТОЧЕН ПЪТ */}
        <img 
          src="/images/birthday_pdf_basic.jpg" 
          alt="Background" 
          className="absolute inset-0 w-[210mm] h-[297mm] object-cover z-0" 
        />

        {/* БЕЗОПАСНА ЗОНА ЗА СЪДЪРЖАНИЕТО */}
        <div className="relative z-10 w-full h-full pt-[48mm] pb-[32mm] px-[18mm] flex flex-col justify-between">
          
          {/* ЗАГЛАВИЕ */}
          <div className="text-center mb-4 flex-shrink-0 border-b border-[#C8B89D]/60 pb-2">
            <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-3xl sm:text-4xl font-bold text-[#3A322D]">
              Капсула на времето за {recipient}
            </h1>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[10px] italic text-[#7A6C5E] mt-0.5">
              Създадено с любов и надежда, за да се отвори в бъдещето
            </p>
          </div>

          {/* ЗИГ-ЗАГ СТРУКТУРА ЗА СНИМКИ И ТЕКСТОВЕ */}
          <div className="flex flex-col gap-4 flex-1 justify-around">
            
            {/* БЛОК 1: Начало и Послание */}
            {(statusText || mainWish || displayPhotos[0]) && (
              <div className="flex w-full items-center gap-5">
                <div className="w-1/3 flex justify-center">
                  {displayPhotos[0] && <FilmStrip url={displayPhotos[0]} rotation={-4} />}
                </div>
                <div className="w-2/3 flex flex-col gap-2">
                  {statusText && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Начало</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-tight break-words">{statusText}</p>
                    </div>
                  )}
                  {mainWish && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Послание</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-tight break-words">{mainWish}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* БЛОК 2: Желание и Скреч тайна */}
            {(wishFromCandle || secretJoke || displayPhotos[1]) && (
              <div className="flex w-full items-center gap-5 flex-row-reverse">
                <div className="w-1/3 flex justify-center">
                  {displayPhotos[1] && <FilmStrip url={displayPhotos[1]} rotation={4} />}
                </div>
                <div className="w-2/3 flex flex-col gap-2 text-right">
                  {wishFromCandle && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Намислено желание</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-tight break-words">"{wishFromCandle}"</p>
                    </div>
                  )}
                  {secretJoke && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Скреч Тайна</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-tight break-words">{secretJoke}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* БЛОК 3: Дневник на бъдещето */}
            {(capsuleAnswers.length > 0 || displayPhotos[2]) && (
              <div className="flex w-full items-center gap-4">
                <div className="w-1/3 flex justify-center">
                  {displayPhotos[2] && <FilmStrip url={displayPhotos[2]} rotation={-3} />}
                </div>
                <div className="w-2/3 bg-white/20 p-2.5 rounded border border-[#C8B89D]/40 shadow-sm">
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-center text-[#8A7C6E] border-b border-[#C8B89D]/60 pb-1 mb-1.5">
                    Дневник на бъдещето
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {capsuleAnswers.map((item, idx) => (
                      <div key={idx} className="mb-0.5">
                        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[7px] italic text-[#635E57] mb-0.5 break-words">{item.question}</p>
                        <p style={{ fontFamily: "'Caveat', cursive" }} className="text-[15px] text-[#1F1A17] font-bold leading-tight break-words">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ПОДПИС */}
          <div className="flex-shrink-0 mt-3 pt-3 border-t border-[#C8B89D]/60 text-right">
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] pr-4">
              С любов, {sender}
            </p>
          </div>

        </div>

        {/* АВТОРСКО ПРАВО В ДОЛНОТО КАФЯВО ПОЛЕ */}
        <div 
          className="absolute bottom-[14mm] left-0 right-0 text-center z-20"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-[8px] uppercase tracking-[0.4em] text-[#EAE2D6] opacity-70">
            GREETING ARCHIVE © 2026
          </span>
        </div>

      </div>
    </div>
  );
}

export default TimeCapsulePdf;