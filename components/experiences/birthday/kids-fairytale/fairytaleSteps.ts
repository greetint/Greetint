export function getFairytaleSteps(childName: string, mobile: boolean) {
  return [
    {
      v: mobile ? '/images/kids_fairytale/stage_1/stage1_part1_phone.mp4' : '/images/kids_fairytale/stage_1/stage1_part1_desktop.mp4',
      a: '/audio/kids_fairytale/stage1_voice.mp3',
      t: `Вълшебната приказка за ${childName} започва...`
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_1/stage1_part2_phone.mp4' : '/images/kids_fairytale/stage_1/stage1_part2_desktop.mp4',
      a: null,
      t: 'Влизаме в кралския замък...'
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_2/stage2_part1_phone.mp4' : '/images/kids_fairytale/stage_2/stage2_part1_desktop.mp4',
      a: '/audio/kids_fairytale/stage2_voice_part1.mp3',
      t: 'Прокарай пръстче по тавана за гирляндите!',
      interactive: true,
      p: 'Сложи гирляндите ✨'
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_2/stage2_part2_phone.mp4' : '/images/kids_fairytale/stage_2/stage2_part2_desktop.mp4',
      a: '/audio/kids_fairytale/stage2_voice_part2.mp3',
      t: 'Нарисувай вълшебни кръгчета за балоните!',
      interactive: true,
      p: 'Пусни балоните 🎈'
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_2/stage2_part3_phone.mp4' : '/images/kids_fairytale/stage_2/stage2_part3_desktop.mp4',
      a: null,
      t: 'Придвижваме се към празничната маса...'
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_3/stage3_part1_phone.mp4' : '/images/kids_fairytale/stage_3/stage3_part1_desctop.mp4',
      a: '/audio/kids_fairytale/stage3_voice_part1.mp3',
      t: 'Постели масата с вълшебна покривка!',
      interactive: true,
      p: 'Постели покривката 🪄'
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_3/stage3_part2_phone.mp4' : '/images/kids_fairytale/stage_3/stage3_part2_desctop.mp4',
      a: '/audio/kids_fairytale/stage3_voice_part2.mp3',
      t: 'Подреди вълшебните чинии!',
      interactive: true,
      p: 'Подреди чиниите 🍽️'
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_3/stage3_part3_phone.mp4' : '/images/kids_fairytale/stage_3/stage3_part3_desctop.mp4',
      a: '/audio/kids_fairytale/stage3_voice_part3.mp3',
      t: 'Покани вълшебните приятели!',
      interactive: true,
      p: 'Покани приятелите 🎉'
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_3/stage3_part4_phone.mp4' : '/images/kids_fairytale/stage_3/stage3_part4_desctop.mp4',
      a: '/audio/kids_fairytale/stage3_voice_part4.mp3',
      t: 'Сложи празничната торта на масата!',
      interactive: true,
      p: 'Сложи тортата 🎂'
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_3/stage3_part5_phone.mp4' : '/images/kids_fairytale/stage_3/stage3_part5_desctop.mp4',
      a: '/audio/kids_fairytale/stage3_voice_part5.mp3',
      t: 'Намисли си желание и духни свещичката!',
      interactive: true,
      p: 'Духни свещичката 🕯️',
      wish: true
    },
    {
      v: mobile ? '/images/kids_fairytale/stage_3/stage3_part6_phone.mp4' : '/images/kids_fairytale/stage_3/stage3_part6_desctop.mp4',
      a: null,
      t: 'Вълшебният подарък се разкрива...',
      final: true
    }
  ];
}
