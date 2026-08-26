import type { Clue, Scenario } from '../../types/game'

const victimPhone: Clue = {
  id: 'clue-victim-phone',
  title: 'Телефон погибшего',
  description: 'Смартфон. Экран заблокирован, но журнал звонков доступен.',
  locationId: 'forensic',
  hotspot: { x: 22, y: 48 },
  detail: {
    type: 'phone',
    phone: {
      calls: [
        {
          contactName: 'Мама',
          number: '+7 916 555-12-01',
          direction: 'outgoing',
          time: '09:14',
          date: '22 марта',
        },
        {
          contactName: 'Супруга',
          number: '+7 916 555-88-44',
          direction: 'incoming',
          time: '11:02',
          date: '22 марта',
        },
        {
          contactName: 'Коллега',
          number: '+7 495 637-00-11',
          direction: 'outgoing',
          time: '14:30',
          date: '22 марта',
        },
        {
          number: '+7 495 231-45-67',
          direction: 'incoming',
          time: '16:45',
          date: '22 марта',
        },
        {
          number: '+7 495 320-11-44',
          direction: 'missed',
          time: '17:10',
          date: '22 марта',
        },
        {
          number: '+7 903 112-33-55',
          direction: 'outgoing',
          time: '17:22',
          date: '22 марта',
        },
        {
          number: '+7 495 888-00-22',
          direction: 'incoming',
          time: '18:01',
          date: '22 марта',
        },
        {
          number: '+7 916 700-44-88',
          direction: 'outgoing',
          time: '19:15',
          date: '22 марта',
        },
        {
          number: '+7 903 441-22-10',
          direction: 'missed',
          time: '19:40',
          date: '22 марта',
        },
        {
          number: '+7 499 250-00-01',
          direction: 'incoming',
          time: '20:05',
          date: '22 марта',
        },
      ],
    },
  },
}

const victimNote: Clue = {
  id: 'clue-victim-note',
  title: 'Записка',
  description: 'Сложенный листок из кармана пиджака.',
  locationId: 'forensic',
  hotspot: { x: 48, y: 44 },
  detail: {
    type: 'note',
    note: {
      lines: [
        'Встреча с покупателем.',
        'Показать «Неизвестную» — зал 20.',
        'Не опоздать!',
      ],
      date: '23 марта 2026',
      time: '18:00',
      location: 'Государственная Третьяковская галерея, Лаврушинский пер., 10',
    },
  },
}

const postcardUnknown: Clue = {
  id: 'clue-postcard-unknown',
  title: 'Открытка — «Неизвестная»',
  description: 'Картина Крамского из коллекции ГТГ.',
  locationId: 'forensic',
  hotspot: { x: 62, y: 40 },
  detail: {
    type: 'postcard',
    postcard: {
      paintingTitle: 'Неизвестная',
      artist: 'Иван Крамской',
      galleryHall: 'Зал № 20, ГТГ',
      description:
        'Один из символов русского портретного искусства XIX века. ' +
        'Часто требует консультации искусствоведа при продаже иностранным коллекционерам.',
      imageSrc: '/images/postcards/unknown.jpg',
    },
  },
}

const postcardIvan: Clue = {
  id: 'clue-postcard-ivan',
  title: 'Открытка — «Иван Грозный»',
  description: 'Репродукция картины Репина.',
  locationId: 'forensic',
  hotspot: { x: 72, y: 42 },
  detail: {
    type: 'postcard',
    postcard: {
      paintingTitle: 'Иван Грозный и сын его Иван',
      artist: 'Илья Репин',
      galleryHall: 'Зал № 30, ГТГ',
      description:
        'Сложная история реставрации после повреждений. ' +
        'Реставраторы галереи следят за состоянием полотна.',
      imageSrc: '/images/postcards/ivan.jpg',
    },
  },
}

const postcardApotheosis: Clue = {
  id: 'clue-postcard-apotheosis',
  title: 'Открытка — «Апофеоз войны»',
  description: 'Репродукция картины Верещагина.',
  locationId: 'forensic',
  hotspot: { x: 82, y: 44 },
  detail: {
    type: 'postcard',
    postcard: {
      paintingTitle: 'Апофеоз войны',
      artist: 'Василий Верещагин',
      galleryHall: 'Зал № 38, ГТГ',
      description:
        'Пирамида черепов в пустыне. Один из самых известных антивоенных холстов русской живописи.',
      imageSrc: '/images/postcards/apotheosis.jpg',
    },
  },
}

const victimTicket: Clue = {
  id: 'clue-victim-ticket',
  title: 'Билет в театр',
  description: 'Билет на оперу в кармане пальто.',
  locationId: 'forensic',
  hotspot: { x: 36, y: 52 },
  detail: {
    type: 'ticket',
    ticket: {
      event: 'М. Мусоргский — «Борис Годунов»',
      venue: 'Большой театр России',
      date: '24 марта 2026',
      time: '19:00',
      section: 'Партер',
      row: '7',
      seat: '12',
      price: '4 500 ₽',
      holderName: 'Александр Волков',
    },
  },
}

const victimBusinessCard: Clue = {
  id: 'clue-victim-card',
  title: 'Визитка',
  description: 'Визитная карточка из кармана пиджака.',
  locationId: 'forensic',
  hotspot: { x: 30, y: 46 },
  detail: {
    type: 'business-card',
    businessCard: {
      name: 'Александр Волков',
      title: 'Арт-дилер',
      company: 'Волков Арт Консалтинг',
      phone: '+7 495 888-00-22',
      email: 'a.volkov@volkov-art.ru',
      address: 'Москва, ул. Петровка, 15',
    },
  },
}

const voiceDirector: Clue = {
  id: 'clue-voice-director',
  title: 'Голосовое — директор ГТГ',
  description: 'Звонок Анны Сергеевны Захаровой: она надиктовывает номера специалистов.',
  locationId: 'detective-room',
  detail: {
    type: 'voice',
    voice: {
      sender: 'Анна Сергеевна Захарова, директор ГТГ',
      duration: '0:34',
      audioSrc: '/audio/female/voice-director.mp3',
      spokenIntro:
        'Следователь, добрый вечер. Как обещала — номера специалистов, которые дежурили 23 марта в 18:00.',
      phones: [
        { name: 'Марина Козлова', role: 'реставратор', phone: '+7 495 231-45-01' },
        { name: 'Пётр Сергеев', role: 'искусствовед', phone: '+7 495 231-45-67' },
        {
          name: 'Дмитрий Орлов',
          role: 'специалист по безопасности залов',
          phone: '+7 495 231-45-89',
        },
      ],
      spokenOutro: 'Удачи в расследовании.',
      transcript:
        'Следователь, добрый вечер. Как обещала — номера специалистов, которые дежурили 23 марта в 18:00. ' +
        'Марина Козлова, реставратор: +7 495 231-45-01. ' +
        'Пётр Сергеев, искусствовед: +7 495 231-45-67. ' +
        'Дмитрий Орлов, специалист по безопасности залов: +7 495 231-45-89. ' +
        'Удачи в расследовании.',
    },
  },
}

/**
 * Сценарий 1: «Дело о пропавшей картине»
 */
export const scenarioStolenPainting: Scenario = {
  id: 'stolen-painting',
  title: 'Дело о пропавшей картине',
  introRules:
    'Вы — следователь. Используйте карту, разговаривайте с людьми и собирайте улики. ' +
    'Осматривайте предметы в рюкзаке, записывайте таблицы в блокнот. ' +
    'На доске улик закрепляйте находки и соединяйте их нитями — так собирается теория дела. ' +
    'Каждая подсказка добавляет 10 секунд.',
  introRulesAudio: '/audio/rules-stolen-painting.mp3',
  mystery:
    'Найдено тело арт-дилера Александра Волкова. При нём — визитка, открытки картин Третьяковской галереи, записка о встрече и билет в Большой театр. ' +
    'Выясните, кто связан с этим делом.',
  solution: {
    suspectId: 'suspect-art-historian',
    locationId: 'museum',
    itemId: 'clue-postcard-unknown',
  },
  suspects: [
    {
      id: 'suspect-restorer',
      name: 'Марина Козлова',
      alibi: 'Реставратор. Не знала погибшего.',
    },
    {
      id: 'suspect-art-historian',
      name: 'Пётр Сергеев',
      alibi: 'Искусствовед. Консультировал по «Неизвестной».',
    },
    {
      id: 'suspect-security',
      name: 'Дмитрий Орлов',
      alibi: 'Специалист по безопасности залов.',
    },
  ],
  locationOrder: [
    'detective-room',
    'forensic',
    'museum',
    'theater',
    'hotel',
    'airport',
  ],
  initialClues: [],
  hubClues: [voiceDirector],
  boardSolutionLinks: [
    { a: 'clue-victim-note', b: 'clue-postcard-unknown' },
    { a: 'clue-postcard-unknown', b: 'clue-voice-director' },
    { a: 'clue-victim-note', b: 'clue-victim-card' },
  ],
  locations: [
    {
      locationId: 'detective-room',
      npc: {
        id: 'npc-self',
        name: 'Вы',
        role: 'Следователь',
        portraitKey: 'detective',
      },
      // Вводный вызов — SMS в хабе (acceptOpeningSms); detective-room-0 отмечается там же.
      dialogues: [],
      clues: [],
    },
    {
      locationId: 'forensic',
      npc: {
        id: 'npc-forensic',
        name: 'Доктор Морозов',
        role: 'Судебно-медицинский эксперт',
        portraitKey: 'forensic-doctor',
        accessories: ['🥼', '🔬'],
      },
      dialogues: [
        [
          {
            speaker: 'narrator',
            text:
              'Холодный морг. Белая простыня на смотровом столе. ' +
              'Доктор Морозов ждёт вас у двери.',
            audioCue: '/audio/male/narrator-morgue-intro.mp3',
          },
          {
            speaker: 'player',
            text: 'Доктор, вы уже идентифицировали погибшего?',
            audioCue: '/audio/male/player-morgue-id.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Доктор Морозов',
            text:
              'Да. Александр Волков, около пятидесяти пяти лет — по визитке из кармана. ' +
              'Паспорта при нём не было. Причина смерти — уточняем. Вот вещи, которые были при нём.',
            audioCue: '/audio/male/npc-morozov-1.mp3',
          },
          {
            speaker: 'narrator',
            text:
              'На столе: телефон, визитка, сложенная записка, три открытки с репродукциями картин ' +
              'Третьяковской галереи и билет в театр.',
            audioCue: '/audio/male/narrator-morgue-items.mp3',
            clueIds: [
              'clue-victim-phone',
              'clue-victim-card',
              'clue-victim-note',
              'clue-postcard-unknown',
              'clue-postcard-ivan',
              'clue-postcard-apotheosis',
              'clue-victim-ticket',
            ],
          },
          {
            speaker: 'player',
            text: 'Заберу всё в рюкзак. Осмотрю позже в кабинете.',
            audioCue: '/audio/male/player-morgue-bag.mp3',
            clueIds: [
              'clue-victim-phone',
              'clue-victim-card',
              'clue-victim-note',
              'clue-postcard-unknown',
              'clue-postcard-ivan',
              'clue-postcard-apotheosis',
              'clue-victim-ticket',
            ],
          },
          {
            speaker: 'npc',
            speakerName: 'Доктор Морозов',
            text:
              'На открытках — «Неизвестная» Крамского, «Иван Грозный» Репина и «Апофеоз войны» Верещагина. ' +
              'Все из ГТГ. Записка упоминает встречу в галерее. Есть ещё билет в Большой театр.',
            audioCue: '/audio/male/npc-morozov-2.mp3',
            clueIds: [
              'clue-victim-phone',
              'clue-victim-card',
              'clue-victim-note',
              'clue-postcard-unknown',
              'clue-postcard-ivan',
              'clue-postcard-apotheosis',
              'clue-victim-ticket',
            ],
          },
        ],
      ],
      clues: [
        victimPhone,
        victimBusinessCard,
        victimNote,
        postcardUnknown,
        postcardIvan,
        postcardApotheosis,
        victimTicket,
      ],
    },
    {
      locationId: 'museum',
      npc: {
        id: 'npc-gallery-director',
        name: 'Анна Сергеевна Захарова',
        role: 'Директор галереи',
        portraitKey: 'curator',
      },
      dialogues: [
        [
          {
            speaker: 'player',
            text:
              'Анна Сергеевна, мы нашли тело арт-дилера Александра Волкова. ' +
              'При нём были открытки ваших картин и записка о встрече здесь, 23 марта в 18:00.',
            audioCue: '/audio/male/player-gallery-body.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text:
              'Боже... Волкова я не знаю лично. У нас в тот день действительно планировалась ' +
              'консультация по продаже «Неизвестной» иностранному коллекционеру, но я не видела погибшего.',
            audioCue: '/audio/female/npc-anna-1.mp3',
          },
          {
            speaker: 'player',
            text: 'Кто из ваших сотрудников был на смене в это время?',
            audioCue: '/audio/male/player-gallery-staff.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text:
              'В тот вечер в залах дежурили трое сотрудников. Могу сказать, кто и где был — ' +
              'но телефоны по правилам безопасности передаю только отдельно, позже, по городскому телефону.',
            audioCue: '/audio/female/npc-anna-2.mp3',
            notebookNote: {
              title: 'Завести список специалистов',
              content:
                'Дежурили 23 марта в 18:00. Имя и специальность — после разговоров в залах. Телефоны — звонок директора в кабинет.',
            },
            notebookTableId: 'note-gtg-specialists',
            notebookTable: {
              columns: ['Имя и фамилия', 'Специальность', 'Телефон'],
              rows: [],
            },
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text:
              'Реставратор Марина Козлова — в зале 30, у Репина. ' +
              'Искусствовед Пётр Сергеев — в зале 20, у «Неизвестной». ' +
              'Дмитрий Орлов из охраны — в зале 38, у «Апофеоза войны». Поговорите с каждым на месте.',
            audioCue: '/audio/female/npc-anna-3.mp3',
          },
        ],
        [
          {
            speaker: 'npc',
            speakerName: 'Марина Козлова',
            text:
              'Я — Марина Козлова, реставратор. 23 марта дежурила здесь, у Репина. ' +
              'Этого человека не видела и не знаю.',
            audioCue: '/audio/female/npc-marina-1.mp3',
            notebookAddRow: {
              tableId: 'note-gtg-specialists',
              label: 'Добавить строку: Марина Козлова',
              title: 'Специалисты ГТГ (23 марта, 18:00)',
              columns: ['Имя и фамилия', 'Специальность', 'Телефон'],
              row: ['Марина Козлова', 'Реставратор', ''],
            },
          },
          {
            speaker: 'player',
            text: 'Можете назвать ваш телефон для протокола?',
            audioCue: '/audio/male/player-marina-phone.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Марина Козлова',
            text: 'Нет, извините — только через дирекцию. У нас строгие правила.',
            audioCue: '/audio/female/npc-marina-2.mp3',
          },
        ],
        [
          {
            speaker: 'npc',
            speakerName: 'Пётр Сергеев',
            text:
              'Пётр Сергеев, искусствовед. Специализируюсь на портретах XIX века — ' +
              'в том числе на этой «Неизвестной». Погибшего не знаю.',
            audioCue: '/audio/male/npc-petr-1.mp3',
            notebookAddRow: {
              tableId: 'note-gtg-specialists',
              label: 'Добавить строку: Пётр Сергеев',
              title: 'Специалисты ГТГ (23 марта, 18:00)',
              columns: ['Имя и фамилия', 'Специальность', 'Телефон'],
              row: ['Пётр Сергеев', 'Искусствовед', ''],
            },
          },
          {
            speaker: 'player',
            text: 'Вы были в галерее 23 марта в 18:00?',
            audioCue: '/audio/male/player-petr-shift.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Пётр Сергеев',
            text:
              'Да, дежурил в зале 20. Готовил экспертное заключение для иностранного покупателя. ' +
              'Телефон не дам — обратитесь к директору.',
            audioCue: '/audio/male/npc-petr-2.mp3',
          },
        ],
        [
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Орлов',
            text:
              'Дмитрий Орлов, служба безопасности залов. 23 марта патрулировал этот этаж, в том числе зал 38. ' +
              'Мужчину из вашего дела не видел.',
            audioCue: '/audio/male/npc-dmitry-1.mp3',
            notebookAddRow: {
              tableId: 'note-gtg-specialists',
              label: 'Добавить строку: Дмитрий Орлов',
              title: 'Специалисты ГТГ (23 марта, 18:00)',
              columns: ['Имя и фамилия', 'Специальность', 'Телефон'],
              row: ['Дмитрий Орлов', 'Специалист по безопасности залов', ''],
            },
          },
          {
            speaker: 'player',
            text: 'Номер телефона?',
            audioCue: '/audio/male/player-dmitry-phone.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Орлов',
            text: 'Только через директора. Таков порядок.',
            audioCue: '/audio/male/npc-dmitry-2.mp3',
          },
          {
            speaker: 'narrator',
            text:
              'Опросы в галерее закончены. Пора вернуться в кабинет следователя — ' +
              'директор позвонит на городской телефон и надиктует номера.',
            audioCue: '/audio/male/narrator-gallery-done.mp3',
          },
        ],
        [
          {
            speaker: 'narrator',
            text:
              'Второй день. У входа в галерею — полиция и сотрудники в шоке. ' +
              'Анна Сергеевна Захарова бледна.',
            audioCue: '/audio/male/narrator-day2-intro.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text:
              'Следователь... Пётр Сергеев мёртв. Его нашли сегодня утром. ' +
              'Он был искусствоведом — как раз тем, кто консультировал по «Неизвестной».',
            audioCue: '/audio/female/npc-anna-day2-1.mp3',
          },
          {
            speaker: 'player',
            text: 'Его номер был в списке вчерашних звонков Волкова. И в записке — встреча у «Неизвестной», зал 20.',
            audioCue: '/audio/male/player-day2-link.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text:
              'Да. Картину собирались показать иностранному гостю из отеля «Националь». ' +
              'Пётр должен был провести экспертизу. Теперь и он, и Волков... ' +
              'Связь очевидна: искусствовед и «Неизвестная».',
            audioCue: '/audio/female/npc-anna-day2-2.mp3',
            notebookNote: {
              title: 'Связь улик',
              content:
                'Пётр Сергеев — искусствовед. Открытка «Неизвестная» + записка о встрече в зале 20. ' +
                'Покупатель — иностранец в отеле «Националь». Расследование продолжается...',
            },
          },
          {
            speaker: 'narrator',
            text:
              'Вы собрали ключевые улики. Связь между картиной, специалистом и иностранным покупателем ' +
              'становится яснее — но кто стоит за двумя смертями? Это следующая глава дела...',
            audioCue: '/audio/male/narrator-day2-outro.mp3',
          },
        ],
      ],
      clues: [],
    },
    {
      locationId: 'theater',
      npc: {
        id: 'npc-buffet',
        name: 'Ирина Белова',
        role: 'Буфетчица',
        portraitKey: 'buffet-clerk',
      },
      dialogues: [
        [
          {
            speaker: 'narrator',
            text:
              'Буфет Большого театра. Хрусталь, красный бархат. ' +
              'На стойке — женщина в чёрном жилете.',
          },
          {
            speaker: 'player',
            text:
              'Добрый день. Следователь. Это Александр Волков — арт-дилер. ' +
              'У него был билет на «Бориса Годунова», 24 марта. Вы его видели?',
          },
          {
            speaker: 'npc',
            speakerName: 'Ирина Белова',
            text:
              'Нет. В тот день меня не было — не моя смена, я не выходила на работу. ' +
              'В буфете его не обслуживала. Больше ничего не скажу.',
          },
        ],
        [
          {
            speaker: 'narrator',
            text:
              'Гардероб. За стойкой — пожилая женщина. Смотрит на вас поверх очков.',
          },
          {
            speaker: 'player',
            text:
              'Нина Петровна? Меня зовут следователь. Это фото Александра Волкова. ' +
              '24 марта, спектакль. Вы его помните?',
          },
          {
            speaker: 'npc',
            speakerName: 'Нина Петровна',
            text:
              'Ох, да. Помню. Потому и запомнился: опоздал, долго ждал у вешалок, нервничал. ' +
              'Потом пошёл на спектакль.',
          },
          {
            speaker: 'npc',
            speakerName: 'Нина Петровна',
            text:
              'Ещё до зала к нему подошёл приятель и что-то передал — свёрток, небольшую вещь. ' +
              'Я говорю: оставьте у меня, не таскайте в зал. Он отказался: «Нет». ' +
              'И тут же этот друг снова оказался рядом. Потом оба разошлись.',
          },
          {
            speaker: 'player',
            text: 'Друга помните? Лицо, одежда?',
          },
          {
            speaker: 'npc',
            speakerName: 'Нина Петровна',
            text:
              'Нет, милок. Очередь, суета — лица не разглядела. ' +
              'Спросите охранника у входа. Он машины смотрит, вдруг что вспомнит.',
            notebookNote: {
              title: 'Большой театр, 24 марта',
              content:
                'Гардеробщица Нина Петровна видела Волкова: он опоздал и долго ждал. ' +
                'Приятель передал ему вещь у гардероба. Лица друга она не помнит — спросить охрану у входа.',
            },
          },
        ],
        [
          {
            speaker: 'narrator',
            text: 'У стеклянных дверей — охранник. За спиной — ночная Театральная площадь.',
          },
          {
            speaker: 'player',
            text:
              '24 марта вечером. Александр Волков. И ещё один мужчина — передавал ему вещь у гардероба. Помните?',
          },
          {
            speaker: 'npc',
            speakerName: 'Сергей Ковалёв',
            text:
              'Лица... точно не скажу. Людей много. Но машину помню. ' +
              'Чёрный седан привёз его и потом увёз обратно. На борту было написано: гостиница «Альфа». ' +
              'Эмблема на двери. Поэтому и запомнилось.',
            notebookNote: {
              title: 'Машина из «Альфы»',
              content:
                'Охранник Большого: Волкова привезла и увезла машина гостиницы «Альфа». Следующая точка — отель.',
            },
          },
        ],
      ],
      clues: [],
    },
    {
      locationId: 'hotel',
      npc: {
        id: 'npc-hotel',
        name: 'Ольга Смирнова',
        role: 'Администратор',
        portraitKey: 'hotel-clerk',
      },
      dialogues: [
        [
          {
            speaker: 'narrator',
            text:
              'Холл гостиницы «Альфа». За стойкой — администратор. ' +
              'За стеклом — чёрный седан.',
          },
          {
            speaker: 'player',
            text:
              'Следователь. 24 марта вечером ваша машина возила человека к Большому театру. ' +
              'Александр Волков. Нужен журнал трансферов.',
          },
          {
            speaker: 'npc',
            speakerName: 'Ольга Смирнова',
            text:
              'Да, служебные машины с эмблемой отеля. Сейчас посмотрю... ' +
              '24 марта, вечер: заказ в Большой театр, туда и обратно. ' +
              'В журнале пассажир записан как «гость, трансфер» — без полной карточки.',
          },
          {
            speaker: 'npc',
            speakerName: 'Ольга Смирнова',
            text:
              'После театра машина ещё уходила в сторону Шереметьева. ' +
              'Кто именно сидел внутри — уточняйте уже там, на стойке информации. ' +
              'Имя из брони я пока не вижу.',
            notebookNote: {
              title: 'Гостиница «Альфа»',
              content:
                'Трансфер 24 марта: Большой театр, туда и обратно. Потом машина ушла к Шереметьеву. ' +
                'Имя пассажира в журнале неполное.',
            },
          },
        ],
      ],
      clues: [],
    },
    {
      locationId: 'airport',
      npc: {
        id: 'npc-airport',
        name: 'Игорь Матвеев',
        role: 'Стойка информации',
        portraitKey: 'airport-clerk',
      },
      dialogues: [
        [
          {
            speaker: 'narrator',
            text:
              'Ночной зал Шереметьева. Холодный свет, пустые стойки. ' +
              'На информации — дежурный.',
          },
          {
            speaker: 'player',
            text:
              'Вечер 24 марта. Машина гостиницы «Альфа» привезла пассажира после Большого театра. ' +
              'Нужно понять, на какой рейс он мог сесть.',
          },
          {
            speaker: 'npc',
            speakerName: 'Игорь Матвеев',
            text:
              'Без фамилии в бронировании не скажу: рейсов десятки. ' +
              'Принесите имя из отеля — тогда откроем вылеты. Пока это всё, что могу.',
            notebookNote: {
              title: 'Шереметьево',
              content:
                'Стойка информации: без фамилии из брони отеля список рейсов не откроют. След на аэропорт есть — данных пока мало.',
            },
          },
        ],
      ],
      clues: [],
    },
  ],
}
