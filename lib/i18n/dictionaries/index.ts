import commonBg from './common.bg.json';
import commonEn from './common.en.json';
import basicBg from './basic.bg.json';
import basicEn from './basic.en.json';
import detectiveMysteryBg from './detectiveMystery.bg.json';
import detectiveMysteryEn from './detectiveMystery.en.json';
import kidsFairytaleBg from './kidsFairytale.bg.json';
import kidsFairytaleEn from './kidsFairytale.en.json';
import magicV2Bg from './magicV2.bg.json';
import magicV2En from './magicV2.en.json';

export type Lang = 'bg' | 'en';

export const dictionaries = {
  bg: {
    common: commonBg,
    basic: basicBg,
    detectiveMystery: detectiveMysteryBg,
    kidsFairytale: kidsFairytaleBg,
    magicV2: magicV2Bg,
  },
  en: {
    common: commonEn,
    basic: basicEn,
    detectiveMystery: detectiveMysteryEn,
    kidsFairytale: kidsFairytaleEn,
    magicV2: magicV2En,
  },
} as const;
