export interface CardStyleConfig {
  id: string;
  name: string;
  badge: string;
  description: string;
  bgGradient: string;
  previewImg: string;
  isAvailable: boolean;
  stagesCount: number;
  route: string;
}

export const CARD_STYLES: CardStyleConfig[] = [
  {
    id: 'basic',
    name: 'Luxe Minimal (Basic)',
    badge: 'Възрастни / Лукс',
    description: 'Елегантен редакционен стил с восъчен печат, скреч тайни, викторина, духане на свещ и времева капсула.',
    bgGradient: 'from-[#FAF6EE] to-[#EAE2D6]',
    previewImg: '/images/cards/card-1.png',
    isAvailable: true,
    stagesCount: 6,
    route: '/create/birthday/basic',
  },
  {
    id: 'kids-fairytale',
    name: 'Kids Magic',
    badge: 'Деца 3-8 години',
    description: 'Приказен свят с магически анимации, детски гатанки, сладки животинки и весели изненади.',
    bgGradient: 'from-[#FFF0F5] to-[#FFE4E1]',
    previewImg: '/images/cards/card-2.png',
    isAvailable: true,
    stagesCount: 5,
    route: '/create/birthday/kids-fairytale',
  },
  {
    id: 'teen-aesthetic',
    name: 'Teen Aesthetic',
    badge: 'Тийнейджъри',
    description: 'Модерен vibe с polaroid снимки, музикални плейлисти, moodboard визия и тайни послания.',
    bgGradient: 'from-[#F0F8FF] to-[#E6E6FA]',
    previewImg: '/images/cards/card-3.png',
    isAvailable: true,
    stagesCount: 5,
    route: '/create/birthday/teen-aesthetic',
  },
  {
    id: 'cyber-game',
    name: 'Cyber Gaming',
    badge: 'Геймъри & Гийкове',
    description: 'Неонови светлини, retro arcade мини игри, код за отключване и дигитален киберпънк куест.',
    bgGradient: 'from-[#1A1A2E] to-[#16213E]',
    previewImg: '/images/cards/card-4.png',
    isAvailable: false,
    stagesCount: 6,
    route: '/create/birthday/cyber-game',
  },
  {
    id: 'escape-room',
    name: 'Escape Room',
    badge: 'Интелектуалци & Приятели',
    description: 'Пъзели, логически загадки, тайни шифри и забавно бягство от стаята с времеви лимит.',
    bgGradient: 'from-[#2C2622] to-[#141210]',
    previewImg: '/images/cards/card-1.png',
    isAvailable: false,
    stagesCount: 6,
    route: '/create/birthday/escape-room',
  },
];
