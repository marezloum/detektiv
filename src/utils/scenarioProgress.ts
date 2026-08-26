import type { GameState, LocationId, Scenario } from '../types/game'
import { specialistsTableHasAllPhones } from './notebook'

const SPECIALIST_DIALOGUES = ['museum-1', 'museum-2', 'museum-3'] as const

/**
 * Раньше диалоги специалистов шли цепочкой подряд.
 * Теперь детектив сам заходит в каждый зал — автопереход в следующий разговор отключён.
 */
export function getNextChainedMuseumDialogue(_dialogueKey: string): number | null {
  return null
}

function allSpecialistsInterviewed(completed: Set<string>): boolean {
  return SPECIALIST_DIALOGUES.every((key) => completed.has(key))
}

/** Прогресс сценария «Дело о пропавшей картине» */
export function applyStolenPaintingProgress(
  dialogueKey: string,
  state: GameState,
): Pick<GameState, 'unlockedLocations' | 'hubMessages' | 'hubCluesAvailable' | 'completedDialogues'> {
  const nextUnlocked = new Set(state.unlockedLocations)
  const completed = new Set(state.completedDialogues)
  completed.add(dialogueKey)

  const hubMessages = [...state.hubMessages]
  const hubCluesAvailable = new Set(state.hubCluesAvailable)

  if (dialogueKey === 'detective-room-0') {
    nextUnlocked.add('forensic')
  }

  if (dialogueKey === 'forensic-0') {
    nextUnlocked.add('museum')
    nextUnlocked.add('theater')
  }

  if (dialogueKey === 'theater-2') {
    nextUnlocked.add('hotel')
  }

  if (dialogueKey === 'hotel-0') {
    nextUnlocked.add('airport')
  }

  if (allSpecialistsInterviewed(completed) && !hubCluesAvailable.has('clue-voice-director')) {
    hubCluesAvailable.add('clue-voice-director')
  }

  return {
    unlockedLocations: nextUnlocked,
    hubMessages,
    hubCluesAvailable,
    completedDialogues: completed,
  }
}

/** Звонок директора ждёт в кабинете: специалисты опрошены, голосовое ещё не принято */
export function hasPendingDirectorCall(state: GameState): boolean {
  return (
    allSpecialistsInterviewed(state.completedDialogues) &&
    state.hubCluesAvailable.has('clue-voice-director') &&
    !state.completedDialogues.has('director-call-0') &&
    !state.backpack.some((c) => c.id === 'clue-voice-director')
  )
}

/** Утро дня 2: срочный звонок директора на городской (не SMS) */
export function hasPendingDay2Call(state: GameState): boolean {
  return state.gameDay >= 2 && !state.completedDialogues.has('day2-call-0')
}

export function getAvailableDialogues(
  scenario: Scenario,
  locationId: LocationId,
  state: GameState,
): number[] {
  const loc = scenario.locations.find((l) => l.locationId === locationId)
  if (!loc) return []

  if (scenario.id !== 'stolen-painting') {
    const key = `${locationId}-0`
    return state.completedDialogues.has(key) ? [] : [0]
  }

  const available: number[] = []

  if (locationId === 'forensic' && !state.completedDialogues.has('forensic-0')) {
    available.push(0)
  }

  if (locationId === 'museum') {
    if (!state.completedDialogues.has('museum-0')) {
      available.push(0)
    } else {
      if (!state.completedDialogues.has('museum-1')) available.push(1)
      if (!state.completedDialogues.has('museum-2')) available.push(2)
      if (!state.completedDialogues.has('museum-3')) available.push(3)
    }
    if (state.gameDay >= 2 && !state.completedDialogues.has('museum-4')) available.push(4)
  }

  if (locationId === 'theater') {
    if (!state.completedDialogues.has('theater-0')) {
      available.push(0)
    } else {
      if (!state.completedDialogues.has('theater-1')) available.push(1)
      if (state.completedDialogues.has('theater-1') && !state.completedDialogues.has('theater-2')) {
        available.push(2)
      }
    }
  }

  if (locationId === 'hotel' && !state.completedDialogues.has('hotel-0')) {
    available.push(0)
  }

  if (locationId === 'airport' && !state.completedDialogues.has('airport-0')) {
    available.push(0)
  }

  return available
}

/** Локация «пройдена» для карты: нечего делать сейчас (после прохождения — снова серая). */
export function isLocationCleared(
  scenario: Scenario,
  locationId: LocationId,
  state: GameState,
): boolean {
  if (scenario.id === 'stolen-painting' && locationId === 'detective-room') {
    return state.completedDialogues.has('detective-room-0')
  }

  if (getAvailableDialogues(scenario, locationId, state).length > 0) {
    return false
  }

  const loc = scenario.locations.find((l) => l.locationId === locationId)
  if (!loc || loc.dialogues.length === 0) {
    return state.completedDialogues.has(`${locationId}-0`)
  }

  return loc.dialogues.some((_, i) => state.completedDialogues.has(`${locationId}-${i}`))
}

export function getDialogueLabel(
  scenario: Scenario,
  locationId: LocationId,
  dialogueIndex: number,
): string {
  if (scenario.id !== 'stolen-painting') {
    return 'Поговорить'
  }

  if (locationId === 'museum') {
    if (dialogueIndex === 0) return 'Поговорить с директором'
    if (dialogueIndex === 1) return 'Опросить Марину в зале 30'
    if (dialogueIndex === 2) return 'Опросить Петра в зале 20'
    if (dialogueIndex === 3) return 'Опросить Дмитрия в зале 38'
    if (dialogueIndex === 4) return 'Узнать о происшествии (день 2)'
  }

  if (locationId === 'forensic') {
    return 'Осмотреть тело и поговорить с экспертом'
  }

  if (locationId === 'theater') {
    if (dialogueIndex === 0) return 'Поговорить с буфетчицей'
    if (dialogueIndex === 1) return 'Поговорить с гардеробщицей'
    if (dialogueIndex === 2) return 'Поговорить с охранником'
  }

  if (locationId === 'hotel') {
    return 'Поговорить с администратором'
  }

  if (locationId === 'airport') {
    return 'Спросить на стойке информации'
  }

  return 'Поговорить'
}

export function canAdvanceDay(state: GameState): boolean {
  return (
    state.gameDay === 1 &&
    SPECIALIST_DIALOGUES.every((key) => state.completedDialogues.has(key)) &&
    (state.backpack.some((c) => c.id === 'clue-voice-director') ||
      specialistsTableHasAllPhones(state.notebook))
  )
}

export function getInitialUnlockedLocations(scenario: Scenario): Set<LocationId> {
  if (scenario.id === 'stolen-painting') {
    return new Set<LocationId>(['detective-room'])
  }
  return new Set<LocationId>(['detective-room', ...scenario.locationOrder.slice(1, 3)])
}
