'use client';

import { motion } from 'framer-motion';

interface IntroSceneProps {
  childName: string;
  onComplete: () => void;
}

export function IntroScene({ childName, onComplete }: IntroSceneProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50">
      {/* 1. ФОН */}
      <img
        src="/images/birthday/kids_fairytale/stage1/background.jpeg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 2. ЗАМЪК (Горе вляво) */}
      <motion.img
        src="/images/birthday/kids_fairytale/stage1/castle.png"
        alt="Castle"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [-4, 4, -4] }}
        transition={{ 
          opacity: { duration: 1 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-[8%] left-[4%] w-[280px] md:w-[420px] h-auto object-contain z-10 drop-shadow-2xl"
      />

      {/* 3. ОСТРОВ (Долу вдясно) */}
      <motion.img
        src="/images/birthday/kids_fairytale/stage1/island.png"
        alt="Island"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [4, -4, 4] }}
        transition={{ 
          opacity: { duration: 1, delay: 0.2 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-[5%] right-[2%] w-[300px] md:w-[460px] h-auto object-contain z-10 drop-shadow-2xl"
      />

      {/* 4. ОБЛАЧЕН ПОД ДОЛУ (Използва реалния cloude.png) */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] pointer-events-none z-15 flex justify-between items-end opacity-90">
        <img
          src="/images/birthday/kids_fairytale/stage1/cloude.png"
          alt="Cloud Floor Left"
          className="w-[60vw] md:w-[45vw] h-auto object-contain -mb-10 -ml-20 blur-[1px]"
        />
        <img
          src="/images/birthday/kids_fairytale/stage1/cloude.png"
          alt="Cloud Floor Right"
          className="w-[60vw] md:w-[45vw] h-auto object-contain -mb-10 -mr-20 blur-[1px] scale-x-[-1]"
        />
      </div>

      {/* 5. НАЧАЛНИ ЗАВЕСИ ОТ ОБЛАЦИ (Разстилат се встрани) */}
      <motion.img
        src="/images/birthday/kids_fairytale/stage1/cloude.png"
        alt="Cloud Curtain Left"
        initial={{ x: '0%', opacity: 1 }}
        animate={{ x: '-110%', opacity: 0 }}
        transition={{ duration: 2, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
        className="absolute inset-y-0 left-0 w-[70vw] h-full object-cover z-40 pointer-events-none"
      />
      <motion.img
        src="/images/birthday/kids_fairytale/stage1/cloude.png"
        alt="Cloud Curtain Right"
        initial={{ x: '0%', opacity: 1 }}
        animate={{ x: '110%', opacity: 0 }}
        transition={{ duration: 2, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
        className="absolute inset-y-0 right-0 w-[70vw] h-full object-cover z-40 pointer-events-none scale-x-[-1]"
      />

      {/* 6. ТЕКСТ И ИМЕ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center z-30 w-full px-4"
      >
        <p className="text-white/90 text-lg md:text-2xl font-serif drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Имало едно време едно вълшебно царство...
        </p>
        <h1 className="text-amber-300 text-3xl md:text-5xl font-bold mt-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          ✦ {childName} ✦
        </h1>
      </motion.div>

      {/* 7. ЗЛАТЕН КЛЮЧ (Център) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
        onClick={onComplete}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer flex flex-col items-center group"
      >
        <motion.img
          src="/images/birthday/kids_fairytale/stage1/key.png"
          alt="Golden Key"
          animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 md:w-40 h-auto object-contain drop-shadow-[0_0_35px_rgba(255,215,0,0.8)] group-hover:scale-110 transition-transform"
        />
        <span className="mt-4 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/40 text-amber-200 text-sm md:text-base font-medium drop-shadow-md">
          🗝️ Докосни ключа, за да отключиш празника!
        </span>
      </motion.div>
    </div>
  );
}

export default IntroScene;
