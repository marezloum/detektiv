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

export const AIRPORT_POLICE_CALL = {
  id: 'airport-police',
  contactName: 'Полиция Шереметьева',
  role: 'Дежурная часть аэропорта',
  ringingLabel: 'Городской — можно звонить в аэропорт',
  answerHint: 'Сообщите: Любовь Максимовна Верещагина, вылет, пустой чехол из номера.',
  body:
    'Дежурный Шереметьева на линии. Принято: задержать Любовь Максимовну Верещагину. ' +
    'Объявим по громкой связи. Ждём вас у досмотра.',
} as const
