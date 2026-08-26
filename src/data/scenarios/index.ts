import type { ScenarioListItem } from '../../types/game'
import { scenarioStolenPainting } from './scenario1'

export { scenarioStolenPainting } from './scenario1'

export const SCENARIOS = [scenarioStolenPainting]

export const DEFAULT_SCENARIO_ID = 'stolen-painting'

export const SCENARIO_LIST: ScenarioListItem[] = [
  {
    id: 'stolen-painting',
    title: scenarioStolenPainting.title,
    mystery: scenarioStolenPainting.mystery,
    available: true,
    icon: '🖼️',
    difficulty: 'medium',
    durationMinutes: 35,
  },
  {
    id: 'jewelry-heist',
    title: 'Ограбление на Тверской',
    mystery:
      'Из ювелирного салона на Тверской пропали бриллианты на десять миллионов. ' +
      'Три подозреваемых — и ни одного алиби.',
    available: false,
    icon: '💎',
    difficulty: 'hard',
    durationMinutes: 30,
  },
  {
    id: 'midnight-train',
    title: 'Полночный поезд',
    mystery:
      'Пассажир исчез между «Комсомольской» и «Курской». ' +
      'Камеры показывают странные маршруты движения.',
    available: false,
    icon: '🚇',
    difficulty: 'easy',
    durationMinutes: 20,
  },
  {
    id: 'vanishing-witness',
    title: 'Исчезнувший свидетель',
    mystery:
      'Ключевой свидетель не явился в суд — его след обрывается у Патриарших прудов. ' +
      'Кто успел его предупредить?',
    available: false,
    icon: '👤',
    difficulty: 'medium',
    durationMinutes: 25,
  },
]

export function getScenario(id: string) {
  return SCENARIOS.find((s) => s.id === id)
}

export function getScenarioListItem(id: string) {
  return SCENARIO_LIST.find((s) => s.id === id)
}
