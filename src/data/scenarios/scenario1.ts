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
        'Показать «Апофеоз войны» — зал 38.',
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
        'Портрет дамы в коляске — визитная карточка зала 20.',
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
        'Пирамида черепов в пустыне. Один из самых известных антивоенных холстов русской живописи. ' +
        'При продаже иностранным коллекционерам обычно нужна экспертиза искусствоведа.',
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

const victimPhoto: Clue = {
  id: 'clue-victim-photo',
  title: 'Фото погибшего',
  description: 'Снимок для опознания. Его можно показывать свидетелям.',
  locationId: 'forensic',
  hotspot: { x: 18, y: 40 },
  detail: {
    type: 'photo',
    photo: {
      caption: 'Иван Волков. Опознание.',
      imageSrc: '/images/clues/victim-photo.jpg',
    },
  },
}

const paintingCover: Clue = {
  id: 'clue-painting-cover',
  title: 'Чехол для картины',
  description: 'Длинный тканевый чехол. Внутри пусто — полотно уже вынули.',
  locationId: 'hotel',
  hotspot: { x: 88, y: 58 },
  detail: {
    type: 'object',
    object: {
      caption: 'Чехол для перевозки холста. Найден в номере Верещагиной.',
      imageSrc: '/images/clues/painting-cover.jpg',
    },
  },
}

const stolenCanvas: Clue = {
  id: 'clue-cast-painting',
  title: 'Холст из гипса',
  description: 'Свёрнутый «Апофеоз войны». Прятали в свежем гипсе на ногах.',
  locationId: 'airport',
  hotspot: { x: 23, y: 66 },
  detail: {
    type: 'object',
    object: {
      caption: 'Полотно Верещагина извлекли из гипсовых повязок.',
      imageSrc: '/images/clues/cast-painting.jpg',
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
    'Каждая подсказка добавляет 10 секунд.',
  introRulesAudio: '/audio/rules-stolen-painting.mp3',
  mystery:
    'Найдено тело арт-дилера Александра Волкова. При нём — фото, визитка, открытки картин Третьяковки, записка о встрече и билет в Большой театр. ' +
    'Выясните, кто унёс картину и куда она делась.',
  solution: {
    suspectId: 'suspect-vereshchagina',
    locationId: 'airport',
    itemId: 'clue-cast-painting',
  },
  suspects: [
    {
      id: 'suspect-lebedeva',
      name: 'Елена Лебедева',
      alibi: 'Гостья «Националя». Её машина ходила в ЦУМ.',
    },
    {
      id: 'suspect-vereshchagina',
      name: 'Любовь Максимовна Верещагина',
      alibi: 'Гостья отеля. Уехала в Шереметьево.',
    },
    {
      id: 'suspect-art-historian',
      name: 'Пётр Сергеев',
      alibi: 'Искусствовед ГТГ. Готовил экспертизу «Апофеоза войны».',
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
            speaker: 'player',
            text: 'Добрый день, доктор. Что у нас тут?',
          },
          {
            speaker: 'npc',
            speakerName: 'Доктор Морозов',
            text:
              'Здравствуйте. Труп мужчины 40–45 лет. Низкого роста, худощавый. ' +
              'Несколько ножевых ранений в живот и грудь. Один из ударов пришёлся прямо в сердце и оказался смертельным.',
          },
          {
            speaker: 'player',
            text: 'Когда произошло убийство?',
          },
          {
            speaker: 'npc',
            speakerName: 'Доктор Морозов',
            text:
              'Свидетели говорят, около часа дня. В переулке, где произошло убийство, в это время было тихо. ' +
              'Убийца, видимо, искал что-то в карманах жертвы, но появились люди — и он сбежал.',
          },
          {
            speaker: 'player',
            text: 'А что вы нашли при нём?',
          },
          {
            speaker: 'npc',
            speakerName: 'Доктор Морозов',
            text: 'Всё лежит на столике.',
            clueIds: [
              'clue-victim-phone',
              'clue-victim-card',
              'clue-victim-photo',
              'clue-victim-note',
              'clue-postcard-unknown',
              'clue-postcard-ivan',
              'clue-postcard-apotheosis',
              'clue-victim-ticket',
            ],
          },
          {
            speaker: 'player',
            text: 'Спасибо, доктор. Вы нам очень помогли.',
          },
        ],
      ],
      clues: [
        victimPhone,
        victimBusinessCard,
        victimPhoto,
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
            text: 'Добрый вечер, Анна Сергеевна! Спасибо, что приняли меня.',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text: 'Да, я сегодня очень занята, но ваш шеф говорил, что у вас очень серьёзное дело.',
          },
          {
            speaker: 'player',
            text:
              'Да, сегодня убили мужчину недалеко отсюда. Кстати, арт-дилера. ' +
              'Есть основания предполагать, что у него была назначена встреча в вашей галерее.',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text: 'Серьезно? А почему вы так думаете?',
          },
          {
            speaker: 'player',
            text: 'Не могу сказать. Будьте добры, посмотрите на это фото. Вы знаете этого человека?',
            requireShowClueId: 'clue-victim-photo',
            showCluePrompt: 'Покажите фото погибшего из рюкзака.',
            showClueWrongText: 'Нет, это не то. Нужно видеть лицо.',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text: 'Нет, совсем незнаком. Это его убили?',
          },
          {
            speaker: 'player',
            text: 'Да. Его зовут Иван Волков. Его имя тоже Вам незнакомо?',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text: 'Никогда не слышала.',
          },
          {
            speaker: 'player',
            text: 'А кто из ваших сотрудников должен был работать в галерее в 14:00?',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text:
              'Секундочку! (шелест бумаг) Вот: сегодня дежурят три наших эксперта. ' +
              'Я напишу вам их имена. Вот, пожалуйста.',
            notebookNote: {
              title: 'Список дежурных',
              content: 'Сегодня в 14:00 дежурят три эксперта галереи. Имена — в списке.',
            },
            notebookTableId: 'note-gtg-specialists',
            notebookTable: {
              columns: ['Имя и фамилия', 'Специальность', 'Телефон'],
              rows: [],
            },
          },
          {
            speaker: 'player',
            text: 'Спасибо. Они сейчас в галерее?',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text: 'Да, должны быть.',
          },
          {
            speaker: 'player',
            text: 'Спасибо огромное.',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text: 'Да не за что.',
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
              'Да, дежурил в зале 20. Параллельно готовил экспертное заключение по «Апофеозу войны» для иностранного покупателя. ' +
              'Телефон не дам — обратитесь к директору.',
            audioCue: '/audio/male/npc-petr-2.mp3',
          },
        ],
        [
          {
            speaker: 'player',
            text: 'Добрый день, Дмитрий Андреевич!',
          },
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Андреевич',
            text: 'Здравствуйте. С кем имею честь?',
          },
          {
            speaker: 'player',
            text: 'Меня зовут Виктор Борисович. Я следователь по уголовным делам.',
          },
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Андреевич',
            text: 'Можно взглянуть на ваше удостоверение?',
          },
          {
            speaker: 'player',
            text: 'Да, конечно. Пожалуйста.',
          },
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Андреевич',
            text: 'Спасибо. Чем могу вам помочь?',
          },
          {
            speaker: 'player',
            text:
              'Я расследую дело об убийстве, которое произошло сегодня. ' +
              'Скажите, пожалуйста, вы должны были сегодня с кем-нибудь встретиться?',
          },
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Андреевич',
            text: 'Нет, совсем нет. А в чём дело?',
          },
          {
            speaker: 'player',
            text: 'Вы знаете этого человека? Его зовут Иван Волков. Арт-дилер.',
            requireShowClueId: 'clue-victim-photo',
            showCluePrompt: 'Покажите фото погибшего из рюкзака.',
            showClueWrongText: 'Нет, это не то. Нужно видеть лицо.',
          },
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Андреевич',
            text: 'Нет, не знаю. Никогда не видел.',
          },
          {
            speaker: 'player',
            text: 'А чем вы занимались сегодня?',
          },
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Андреевич',
            text:
              'Я пишу диссертацию о картине Верещагина «Апофеоз войны». ' +
              'Поэтому часто бываю в этом зале, работаю возле самой картины.',
            notebookAddRow: {
              tableId: 'note-gtg-specialists',
              label: 'Добавить строку: Дмитрий Орлов',
              title: 'Эксперты на дежурстве (сегодня, 14:00)',
              columns: ['Имя и фамилия', 'Специальность', 'Телефон'],
              row: ['Дмитрий Орлов', 'Специалист по безопасности залов', ''],
            },
          },
          {
            speaker: 'player',
            text: 'Хорошо, спасибо большое.',
          },
          {
            speaker: 'npc',
            speakerName: 'Дмитрий Андреевич',
            text: 'Всего доброго.',
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
              'Он был искусствоведом — как раз тем, кто готовил экспертизу «Апофеоза войны».',
            audioCue: '/audio/female/npc-anna-day2-1.mp3',
          },
          {
            speaker: 'player',
            text: 'Его номер был в списке вчерашних звонков Волкова. И в записке — встреча у «Апофеоза войны», зал 38.',
            audioCue: '/audio/male/player-day2-link.mp3',
          },
          {
            speaker: 'npc',
            speakerName: 'Анна Сергеевна Захарова',
            text:
              'Да. Картину собирались показать иностранному гостю из отеля «Националь». ' +
              'Пётр должен был провести экспертизу. Теперь и он, и Волков... ' +
              'Связь очевидна: искусствовед и «Апофеоз войны».',
            audioCue: '/audio/female/npc-anna-day2-2.mp3',
            notebookNote: {
              title: 'Связь улик',
              content:
                'Пётр Сергеев — искусствовед. Открытка «Апофеоз войны» + записка о встрече в зале 38. ' +
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
              'Нина Петровна, следователь. Посмотрите, пожалуйста: этого человека вы видели 24 марта?',
            requireShowClueId: 'clue-victim-photo',
            showCluePrompt: 'Покажите фото погибшего из рюкзака.',
            showClueWrongText: 'Нет, это не то. Нужно видеть лицо.',
          },
          {
            speaker: 'npc',
            speakerName: 'Нина Петровна',
            text:
              'Ох, да. Видела. Потому и запомнился: с ним была длинная сумка — как чехол для картины. ' +
              'Я говорю: оставьте у меня. Он не отдал и унёс с собой.',
          },
          {
            speaker: 'player',
            text: 'Кто-нибудь был рядом? Лицо, одежда?',
          },
          {
            speaker: 'npc',
            speakerName: 'Нина Петровна',
            text:
              'Нет, милок. Очередь, суета — других не разглядела. ' +
              'Спросите охранника у входа. Он машины смотрит.',
            notebookNote: {
              title: 'Гардероб, 24 марта',
              content:
                'Нина Петровна узнала Волкова по фото: у него была длинная сумка-чехол, в гардероб не сдал, унёс с собой. ' +
                'Спросить охрану у входа.',
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
            text: '24 марта вечером. Этого человека узнаёте?',
            requireShowClueId: 'clue-victim-photo',
            showCluePrompt: 'Покажите фото погибшего из рюкзака.',
            showClueWrongText: 'Лица на этой вещи не видно. Нужна фотография.',
          },
          {
            speaker: 'npc',
            speakerName: 'Сергей Ковалёв',
            text:
              'Лицо... нет. Людей много. Но машину помню. ' +
              'Такси из самой дорогой гостиницы города — «Националь». ' +
              'Часа два стояло прямо у подъезда. Поэтому и бросилось в глаза.',
            notebookNote: {
              title: 'Такси «Националя»',
              content:
                'Охранник Большого лицо Волкова не узнал. 24 марта у входа два часа ждало такси гостиницы «Националь».',
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
              'Холл гостиницы «Националь». За стойкой — администратор. ' +
              'За стеклом — чёрный седан с гербом отеля.',
          },
          {
            speaker: 'player',
            text:
              'Следователь. 24 марта вечером ваше такси два часа стояло у Большого театра. Кто заказывал?',
          },
          {
            speaker: 'npc',
            speakerName: 'Ольга Смирнова',
            text:
              'Сейчас посмотрю журнал... На это время два заказа. ' +
              'Один — госпожа Лебедева. Второй — госпожа Верещагина.',
            notebookNote: {
              title: 'Журнал «Националя», 24 марта',
              content:
                'Два заказа на то время: Лебедева и Верещагина. Сверить фамилии с уликами в рюкзаке.',
            },
          },
        ],
        [
          {
            speaker: 'player',
            text: 'Где сейчас госпожа Лебедева? Это её машина стояла у театра?',
          },
          {
            speaker: 'npc',
            speakerName: 'Ольга Смирнова',
            text:
              'Лебедева? Нет: её трансфер ходил в ЦУМ и быстро вернулся. ' +
              'Сама она сейчас в спа. Могу уточнить... Да, 24-го вечером была на шопинге. К театру не ездила.',
            notebookNote: {
              title: 'Лебедева',
              content:
                'Елена Лебедева: машина в ЦУМ, не к театру. Сейчас в спа. Не та гостья.',
            },
          },
        ],
        [
          {
            speaker: 'player',
            text: 'А госпожа Верещагина? Можно увидеть её номер?',
          },
          {
            speaker: 'npc',
            speakerName: 'Ольга Смирнова',
            text:
              'Любовь Максимовна Верещагина... Минуту. Она только что уехала — минут двадцать назад заказала машину.',
          },
          {
            speaker: 'player',
            text: 'Куда? Тогда давайте проверим номер.',
          },
          {
            speaker: 'npc',
            speakerName: 'Ольга Смирнова',
            text:
              'Водитель сказал — Шереметьево. Ключ у меня, пойдём. ' +
              'До машины она дошла сама, обычным шагом, без трости. Обычные туфли.',
            notebookNote: {
              title: 'Верещагина',
              content:
                'Любовь Максимовна Верещагина уехала в Шереметьево 20 минут назад. ' +
                'Шла сама, без хромоты. Осмотреть номер, затем звонить в аэропорт.',
            },
          },
        ],
        [
          {
            speaker: 'narrator',
            text:
              'Номер ещё тёплый. На кровати — раскрытый чемодан. У стены — длинный тканевый чехол.',
            sceneId: 'hotel-room',
            inspectHotspots: true,
            clueIds: ['clue-painting-cover'],
          },
          {
            speaker: 'player',
            text: 'Пустой чехол для картины. Полотно уже вынули.',
            sceneId: 'hotel-room',
          },
          {
            speaker: 'npc',
            speakerName: 'Ольга Смирнова',
            text:
              'Нужно предупредить аэропорт. Из вашего кабинета — быстрее: городской телефон.',
            sceneId: 'hotel-room',
            notebookNote: {
              title: 'Чехол в номере',
              content:
                'В номере Верещагиной — пустой чехол для холста. Она 20 минут как уехала в Шереметьево. ' +
                'Позвонить в полицию аэропорта из кабинета.',
            },
          },
        ],
      ],
      clues: [paintingCover],
    },
    {
      locationId: 'airport',
      npc: {
        id: 'npc-airport',
        name: 'Игорь Матвеев',
        role: 'Полиция аэропорта',
        portraitKey: 'airport-clerk',
      },
      dialogues: [
        [
          {
            speaker: 'narrator',
            text:
              'Ночной зал Шереметьева. Из динамиков, холодно и четко: ' +
              '«Любовь Максимовна Верещагина, вас ожидают у стойки полиции аэропорта».',
          },
        ],
        [
          {
            speaker: 'narrator',
            text:
              'Женщина стоит с тростью. Оба голени — в свежем белом гипсе. Чемоданы уже на столе.',
            sceneId: 'airport-search',
          },
          {
            speaker: 'npc',
            speakerName: 'Игорь Матвеев',
            text:
              'Документы в порядке. В чемоданах — одежда. Ничего запрещённого.',
            sceneId: 'airport-search',
          },
          {
            speaker: 'narrator',
            text:
              'Чемоданы чисты. Но гипс слишком новый. Вы видели, как она ходила в отеле.',
            sceneId: 'airport-search',
            inspectHotspots: true,
            clueIds: ['clue-cast-painting'],
          },
          {
            speaker: 'narrator',
            text:
              'Под слоем гипса — свёрнутый холст. «Апофеоз войны» Верещагина. ' +
              'Дело можно закрывать: назовите виновную в кабинете.',
            sceneId: 'airport-search',
            notebookNote: {
              title: 'Шереметьево',
              content:
                'У Верещагиной свежий гипс на обеих ногах. Внутри — украденный «Апофеоз войны».',
            },
          },
        ],
      ],
      clues: [stolenCanvas],
    },
  ],
}
