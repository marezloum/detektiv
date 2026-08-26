import type { LocationId } from '../types/game'

/** Границы карты: центр Москвы + Шереметьево на северо-западе */
export const MOSCOW_BOUNDS = {
  minLat: 55.69,
  maxLat: 55.99,
  minLng: 37.36,
  maxLng: 37.72,
}

export function geoToMap(lat: number, lng: number): { x: number; y: number } {
  const { minLat, maxLat, minLng, maxLng } = MOSCOW_BOUNDS
  return {
    x: Number((((lng - minLng) / (maxLng - minLng)) * 100).toFixed(2)),
    y: Number((((maxLat - lat) / (maxLat - minLat)) * 70).toFixed(2)),
  }
}

export interface MoscowLandmark {
  id: LocationId
  /** Код на карте и в легенде, напр. А1 */
  mapCode: string
  mapLabel: string
  realName: string
  district: string
  lat: number
  lng: number
  icon: string
}

/**
 * Реальные места Москвы с GPS-координатами.
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
    lat: 55.7614,
    lng: 37.6245,
    icon: '🏢',
  },
  {
    id: 'forensic',
    mapCode: 'А2',
    mapLabel: 'Морг',
    realName: 'Бюро судмедэкспертизы — Серебряный пер.',
    district: 'Басманный район, ЦАО',
    // Чуть восточнее реального места — иначе пин А2 сливается с А1 на карте
    lat: 55.758,
    lng: 37.652,
    icon: '🔬',
  },
  {
    id: 'museum',
    mapCode: 'А3',
    mapLabel: 'Третьяковка',
    realName: 'Государственная Третьяковская галерея — Лаврушинский пер., 10',
    district: 'Замоскворечье, ЦАО',
    lat: 55.7414,
    lng: 37.6209,
    icon: '🏛',
  },
  {
    id: 'theater',
    mapCode: 'А4',
    mapLabel: 'Большой',
    realName: 'Большой театр — Театральная площадь, 1',
    district: 'Тверской район, ЦАО',
    lat: 55.7601,
    lng: 37.6186,
    icon: '🎭',
  },
  {
    id: 'hotel',
    mapCode: 'А5',
    mapLabel: 'Альфа',
    realName: 'Гостиница «Альфа»',
    district: 'Восточный округ',
    lat: 55.792,
    lng: 37.705,
    icon: '🏨',
  },
  {
    id: 'metro',
    mapCode: 'Б1',
    mapLabel: 'Комсомольская',
    realName: 'Станция метро «Комсомольская»',
    district: 'Красносельский район, ЦАО',
    lat: 55.7753,
    lng: 37.6551,
    icon: '🚇',
  },
  {
    id: 'shopping',
    mapCode: 'Б2',
    mapLabel: 'ГУМ',
    realName: 'ГУМ — Красная площадь, 3',
    district: 'Тверской район, ЦАО',
    lat: 55.7547,
    lng: 37.6214,
    icon: '🛍',
  },
  {
    id: 'nature',
    mapCode: 'Б3',
    mapLabel: 'Сокольники',
    realName: 'Парк «Сокольники»',
    district: 'Сокольники, ВАО',
    lat: 55.7944,
    lng: 37.6717,
    icon: '🌲',
  },
  {
    id: 'police-station',
    mapCode: 'В1',
    mapLabel: 'Петровка, 38',
    realName: 'ГУВД Москвы — Петровка, 38',
    district: 'Тверской район, ЦАО',
    lat: 55.7647,
    lng: 37.6142,
    icon: '🚔',
  },
  {
    id: 'public-cultural',
    mapCode: 'В2',
    mapLabel: 'Красная пл.',
    realName: 'Красная площадь',
    district: 'Тверской район, ЦАО',
    lat: 55.7539,
    lng: 37.6208,
    icon: '🏰',
  },
  {
    id: 'airport',
    mapCode: 'В3',
    mapLabel: 'Шереметьево',
    realName: 'Аэропорт Шереметьево (SVO)',
    district: 'Химки, Московская область',
    lat: 55.9726,
    lng: 37.4147,
    icon: '✈',
  },
]
