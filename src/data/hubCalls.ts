/** Тексты городских звонков в кабинете (не SMS) */

export const DIRECTOR_PHONES_CALL = {
  id: 'director-phones',
  contactName: 'Анна Сергеевна Захарова',
  role: 'Директор ГТГ',
  ringingLabel: 'Директор ГТГ — нажмите на телефон слева',
  answerHint: 'Снимите трубку — она надиктует номера специалистов.',
} as const

export const DAY2_URGENT_CALL = {
  id: 'day2-urgent',
  contactName: 'Анна Сергеевна Захарова',
  role: 'Директор ГТГ',
  ringingLabel: 'Срочный звонок из ГТГ — снимите трубку слева',
  body:
    'Следователь, доброе утро. Это директор ГТГ. К нам только что сообщили — ' +
    'один из вчерашних специалистов найден мёртвым. Приезжайте срочно.',
  audioSrc: '/audio/female/voice-director-day2.mp3',
} as const

export const BOARD_EVENING_MONOLOGUE =
  'Вечер в кабинете. Номера записаны в блокнот. ' +
  'Пора разложить улики на доске и поискать связи — кто связан с «Неизвестной» и звонками погибшего.'
