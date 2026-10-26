import type { LocationMeta } from '../types/game'
import { MOSCOW_LANDMARKS } from './moscowGeo'

export const LOCATIONS: Record<string, LocationMeta> = {
  'detective-room': {
    id: 'detective-room',
    name: 'Кабинет следователя',
    description: 'Мещанский район, ЦАО. Ваш кабинет недалеко от Большого театра и Тверской.',
    imageKey: 'detective-room',
  },
  forensic: {
    id: 'forensic',
    name: 'Морг',
    description: 'Басманный район, ЦАО. Холодильная камера и смотровая.',
    imageKey: 'forensic',
  },
  'police-station': {
    id: 'police-station',
    name: 'ГУВД Москвы',
    description: 'Тверской район, ЦАО. Главное управление полиции столицы.',
    imageKey: 'police-station',
  },
  airport: {
    id: 'airport',
    name: 'Шереметьево',
    description: 'Химки, Московская область. Международный аэропорт на северо-западе.',
    imageKey: 'airport',
  },
  metro: {
    id: 'metro',
    name: 'Комсомольская',
    description: 'Красносельский район, ЦАО. Один из главных узлов метро, у Ленинградского вокзала.',
    imageKey: 'metro',
  },
  'public-cultural': {
    id: 'public-cultural',
    name: 'Красная площадь',
    description: 'Тверской район, ЦАО. Кремль, Мавзолей, Исторический музей.',
    imageKey: 'public-cultural',
  },
  nature: {
    id: 'nature',
    name: 'Сокольники',
    description: 'район Сокольники, ВАО. Один из старейших парков Москвы.',
    imageKey: 'nature',
  },
  museum: {
    id: 'museum',
    name: 'Третьяковская галерея',
    description:
      'Замоскворечье, ЦАО. Главный музей русского искусства. ' +
      'Осмотрите вестибюль и залы 20, 30 и 38 — у каждого своя картина и своя история.',
    imageKey: 'museum-lobby',
  },
  theater: {
    id: 'theater',
    name: 'Большой театр',
    description: 'Театральная площадь. Буфет, гардероб и охрана у входа.',
    imageKey: 'theater',
  },
  hotel: {
    id: 'hotel',
    name: 'Гостиница «Националь»',
    description: 'Моховая, 15/1. Самая дорогая гостиница у Кремля. Холл и номера гостей.',
    imageKey: 'hotel',
  },
  shopping: {
    id: 'shopping',
    name: 'ГУМ',
    description: 'Тверской район, ЦАО. Исторический универмаг напротив Кремля.',
    imageKey: 'shopping',
  },
}

/** Точки карты — ручная раскладка, не GPS */
export const MAP_POINTS = MOSCOW_LANDMARKS.map((landmark) => {
  return {
    id: landmark.id,
    mapCode: landmark.mapCode,
    label: landmark.mapLabel,
    realName: landmark.realName,
    district: landmark.district,
    icon: landmark.icon,
    x: landmark.x,
    y: landmark.y,
    unlocked: landmark.id === 'detective-room',
  }
})
