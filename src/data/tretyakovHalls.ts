import type { SceneId } from '../assets/scenes'
import type { MuseumHallId } from '../types/game'

export type { MuseumHallId }

/** Подлокации Третьяковской галереи (игровые салоны, не документальный план ГТГ) */

export interface TretyakovHall {
  id: MuseumHallId
  sceneId: SceneId
  /** Короткая подпись на кнопке */
  shortLabel: string
  /** Полное название для HUD */
  title: string
  /** Страноведческая заметка */
  culturalNote: string
  /** Индекс диалога в scenario1 museum (если есть) */
  dialogueIndex: number | null
}

export const TRETYAKOV_HALLS: TretyakovHall[] = [
  {
    id: 'lobby',
    sceneId: 'museum-lobby',
    shortLabel: 'Вестибюль',
    title: 'Вестибюль',
    culturalNote: 'Главный вход. Отсюда можно пройти в залы и кабинет директора.',
    dialogueIndex: 4,
  },
  {
    id: 'office',
    sceneId: 'museum-office',
    shortLabel: 'Кабинет',
    title: 'Кабинет директора',
    culturalNote:
      'Административное крыло галереи. Здесь решают вопросы экспозиции, реставрации и безопасности коллекции.',
    dialogueIndex: 0,
  },
  {
    id: 'hall-20',
    sceneId: 'museum-hall-20',
    shortLabel: 'Зал 20',
    title: 'Зал 20',
    culturalNote:
      'И. Н. Крамской, «Неизвестная» (1883). Один из самых узнаваемых портретов русской живописи XIX века.',
    dialogueIndex: 2,
  },
  {
    id: 'hall-30',
    sceneId: 'museum-hall-30',
    shortLabel: 'Зал 30',
    title: 'Зал 30',
    culturalNote:
      'И. Е. Репин. Здесь — в том числе «Иван Грозный и сын его Иван» (1885), картина с драматичной историей экспонирования.',
    dialogueIndex: 1,
  },
  {
    id: 'hall-38',
    sceneId: 'museum-hall-38',
    shortLabel: 'Зал 38',
    title: 'Зал 38',
    culturalNote:
      'В. В. Верещагин, «Апофеоз войны» (1871). Пирамида черепов — один из самых жёстких антивоенных образов русской живописи.',
    dialogueIndex: 3,
  },
]

export const DEFAULT_MUSEUM_HALL: MuseumHallId = 'lobby'

const HALL_BY_ID = Object.fromEntries(TRETYAKOV_HALLS.map((h) => [h.id, h])) as Record<
  MuseumHallId,
  TretyakovHall
>

export function getTretyakovHall(id: MuseumHallId | null | undefined): TretyakovHall {
  return HALL_BY_ID[id ?? DEFAULT_MUSEUM_HALL] ?? HALL_BY_ID[DEFAULT_MUSEUM_HALL]
}

/** Какой салон открыть при старте диалога в музее */
export function museumHallForDialogue(dialogueIndex: number): MuseumHallId {
  switch (dialogueIndex) {
    case 0:
      return 'office'
    case 1:
      return 'hall-30'
    case 2:
      return 'hall-20'
    case 3:
      return 'hall-38'
    case 4:
      return 'lobby'
    default:
      return DEFAULT_MUSEUM_HALL
  }
}

export function museumSceneForHall(hallId: MuseumHallId | null | undefined): SceneId {
  return getTretyakovHall(hallId).sceneId
}

/** Порядок обхода: директор → Марина (30) → Пётр (20) → Дмитрий (38) → вестибюль */
const TALK_PRIORITY: MuseumHallId[] = ['office', 'hall-30', 'hall-20', 'hall-38', 'lobby']

/** Первый салон, где сейчас доступен разговор (для входа в галерею) */
export function firstTalkableMuseumHall(availableDialogueIndexes: number[]): MuseumHallId {
  for (const id of TALK_PRIORITY) {
    const hall = HALL_BY_ID[id]
    if (hall.dialogueIndex !== null && availableDialogueIndexes.includes(hall.dialogueIndex)) {
      return id
    }
  }
  return DEFAULT_MUSEUM_HALL
}
