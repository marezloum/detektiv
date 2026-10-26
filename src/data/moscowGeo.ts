import type { LocationId } from '../types/game'

export interface MoscowLandmark {
  id: LocationId
  /** Код на карте и в легенде, напр. А1 */
  mapCode: string
  mapLabel: string
  realName: string
  district: string
  /** Позиция пина на карте, 0–100 слева направо. Не GPS — иначе центр слипается. */
  x: number
  /** Позиция пина на карте, 0–70 сверху вниз. */
  y: number
  icon: string
}

/**
 * Пины расставлены по карте с запасом, а не по реальным адресам:
 * центр Москвы на снимке слишком тесный, подписи наезжают друг на друга.
 * Коды А/Б — по порядку открытия в «Деле о пропавшей картине»:
 * А1 кабинет → А2 морг → А3 галерея → А4 театр → А5 отель → аэропорт.
 */
export const MOSCOW_LANDMARKS: MoscowLandmark[] = [
  {
    id: 'detective-room',
    mapCode: 'А1',
    mapLabel: 'Кузнецкий мост',
    realName: 'ул. Кузнецкий Мост — кабинет следователя',
    district: 'Мещанский район, ЦАО',
    x: 36,
    y: 22,
    icon: '🏢',
  },
  {
    id: 'forensic',
    mapCode: 'А2',
    mapLabel: 'Морг',
    realName: 'Бюро судмедэкспертизы — Серебряный пер.',
    district: 'Басманный район, ЦАО',
    x: 74,
    y: 26,
    icon: '🔬',
  },
  {
    id: 'museum',
    mapCode: 'А3',
    mapLabel: 'Третьяковка',
    realName: 'Государственная Третьяковская галерея — Лаврушинский пер., 10',
    district: 'Замоскворечье, ЦАО',
    x: 58,
    y: 52,
    icon: '🏛',
  },
  {
    id: 'theater',
    mapCode: 'А4',
    mapLabel: 'Большой',
    realName: 'Большой театр — Театральная площадь, 1',
    district: 'Тверской район, ЦАО',
    x: 24,
    y: 40,
    icon: '🎭',
  },
  {
    id: 'hotel',
    mapCode: 'А5',
    mapLabel: 'Националь',
    realName: 'Гостиница «Националь» — ул. Моховая, 15/1',
    district: 'Тверской район, ЦАО',
    x: 46,
    y: 36,
    icon: '🏨',
  },
  {
    id: 'metro',
    mapCode: 'Б1',
    mapLabel: 'Комсомольская',
    realName: 'Станция метро «Комсомольская»',
    district: 'Красносельский район, ЦАО',
    x: 64,
    y: 16,
    icon: '🚇',
  },
  {
    id: 'shopping',
    mapCode: 'Б2',
    mapLabel: 'ГУМ',
    realName: 'ГУМ — Красная площадь, 3',
    district: 'Тверской район, ЦАО',
    x: 52,
    y: 24,
    icon: '🛍',
  },
  {
    id: 'nature',
    mapCode: 'Б3',
    mapLabel: 'Сокольники',
    realName: 'Парк «Сокольники»',
    district: 'Сокольники, ВАО',
    x: 84,
    y: 40,
    icon: '🌲',
  },
  {
    id: 'police-station',
    mapCode: 'В1',
    mapLabel: 'Петровка, 38',
    realName: 'ГУВД Москвы — Петровка, 38',
    district: 'Тверской район, ЦАО',
    x: 30,
    y: 54,
    icon: '🚔',
  },
  {
    id: 'public-cultural',
    mapCode: 'В2',
    mapLabel: 'Красная пл.',
    realName: 'Красная площадь',
    district: 'Тверской район, ЦАО',
    x: 68,
    y: 42,
    icon: '🏰',
  },
  {
    id: 'airport',
    mapCode: 'В3',
    mapLabel: 'Шереметьево',
    realName: 'Аэропорт Шереметьево (SVO)',
    district: 'Химки, Московская область',
    x: 16,
    y: 14,
    icon: '✈',
  },
]
