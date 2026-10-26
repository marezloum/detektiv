import { useEffect, useRef, useState } from 'react'
import type {
  ActivePanel,
  DialogueLine,
  GamePhase,
  HotelRoomId,
  LocationId,
  MuseumHallId,
  TheaterRoomId,
  NotebookEntry,
  NotebookTable,
  PhonePhoto,
} from '../types/game'
import { getScenario, SCENARIO_LIST, DEFAULT_SCENARIO_ID } from '../data/scenarios'
import { MAP_POINTS } from '../data/locations'
import { preloadSceneImages, sceneImageUrl } from '../assets/scenes'
import { playScene } from '../utils/playScene'
import { firstTalkableMuseumHall, museumHallForDialogue } from '../data/tretyakovHalls'
import {
  firstTalkableTheaterRoom,
  theaterRoomForDialogue,
} from '../data/theaterRooms'
import {
  firstTalkableHotelRoom,
  hotelRoomForDialogue,
} from '../data/hotelRooms'
import { buildNotebookEntryFromLine, createEmptySpecialistsTable, addRowToTable, fillPhonesInSpecialistsTable, GTG_SPECIALISTS_TABLE_ID, GTG_SPECIALISTS_COLUMNS, PHONE_REVEAL_PENALTY_SECONDS } from '../utils/notebook'
import {
  applyStolenPaintingProgress,
  canAdvanceDay,
  getAvailableDialogues,
  getInitialUnlockedLocations,
  hasPendingDay2Call,
  hasPendingAirportCall,
  hasPendingDirectorCall,
  isLocationCleared,
} from '../utils/scenarioProgress'

const HINT_PENALTY_SECONDS = 10

export type SavePulseTarget = 'backpack' | 'notebook'
const SAVE_PULSE_MS = 1600

const HINTS: Partial<Record<LocationId, string>> = {
  forensic: 'Срочное сообщение — отправляйтесь в морг (судмедэкспертиза).',
  museum: 'В Третьяковке: кабинет директора, затем залы 20, 30 и 38 — у каждого свой специалист.',
  theater: 'В Большом: буфет, затем гардероб, затем охрана у входа.',
    hotel: 'Гостиница «Националь» — такси отеля два часа стояло у Большого.',
    airport: 'Шереметьево — полиция аэропорта. Нужен звонок из кабинета.',
  'police-station': 'Начните с управления полиции — свидетель что-то видел.',
  'public-cultural': 'Художник находится на площади.',
}

function createInitialState(scenarioId: string) {
  const scenario = getScenario(scenarioId)!
  return {
    phase: 'cover' as GamePhase,
    scenarioId,
    elapsedSeconds: 0,
    hintCount: 0,
    isRunning: false,
    gameDay: 1,
    currentLocationId: null as LocationId | null,
    currentMuseumHallId: null as MuseumHallId | null,
    currentTheaterRoomId: null as TheaterRoomId | null,
    currentHotelRoomId: null as HotelRoomId | null,
    visitedLocations: new Set<LocationId>(),
    completedDialogues: new Set<string>(),
    backpack: [...scenario.initialClues],
    notebook: [] as NotebookEntry[],
    unlockedLocations: getInitialUnlockedLocations(scenario),
    hubMessages: (scenario.hubMessages ?? []).map((m) => ({ ...m, read: false })),
    hubCluesAvailable: new Set<string>(),
    activeDialogueIndex: 0,
    dialogueStep: 0,
    dialoguePeakStep: 0,
    showHint: false,
    currentHint: null as string | null,
    revealedDirectorPhones: new Set<string>(),
    revealedDay2CallText: false,
    presentedLineKeys: new Set<string>(),
    phonePhotos: [] as PhonePhoto[],
  }
}

export type DetectivePhoneScreen = 'lock' | 'home' | 'messages' | 'camera' | 'gallery'

export function useGame() {
  const [state, setState] = useState(() => createInitialState(DEFAULT_SCENARIO_ID))
  const [activePanel, setActivePanel] = useState<ActivePanel>('none')
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [phoneEntry, setPhoneEntry] = useState<DetectivePhoneScreen>('home')
  const [rulesUnderstood, setRulesUnderstood] = useState<boolean | null>(null)
  const [savePulse, setSavePulse] = useState<{
    target: SavePulseTarget
    key: number
  } | null>(null)
  const intervalRef = useRef<number | null>(null)
  const savePulseTimerRef = useRef<number | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const notifySaved = (target: SavePulseTarget) => {
    if (savePulseTimerRef.current) window.clearTimeout(savePulseTimerRef.current)
    setSavePulse({ target, key: Date.now() })
    savePulseTimerRef.current = window.setTimeout(() => {
      setSavePulse(null)
      savePulseTimerRef.current = null
    }, SAVE_PULSE_MS)
  }

  useEffect(() => {
    return () => {
      if (savePulseTimerRef.current) window.clearTimeout(savePulseTimerRef.current)
    }
  }, [])

  const scenario = getScenario(state.scenarioId)!

  useEffect(() => {
    if (!state.isRunning) return
    intervalRef.current = window.setInterval(() => {
      setState((s) => ({ ...s, elapsedSeconds: s.elapsedSeconds + 1 }))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [state.isRunning])

  const setPhase = (phase: GamePhase) => setState((s) => ({ ...s, phase }))

  const enterHall = () => {
    setActivePanel('none')
    setPhase('hall')
  }

  const goToCover = () => {
    setActivePanel('none')
    setState((s) => ({
      ...s,
      phase: 'cover',
      isRunning: false,
      showHint: false,
      currentHint: null,
    }))
  }

  const startGame = () => {
    preloadSceneImages()
    setActivePanel('none')
    setRulesUnderstood(null)
    setState({ ...createInitialState(state.scenarioId), phase: 'rules' })
  }

  const confirmRules = (understood: boolean) => {
    setRulesUnderstood(understood)
    setState((s) => ({ ...s, phase: 'hub', isRunning: true }))
  }

  /** SMS «Принять вызов»: без dialogue-box — разблокируем морг (А2) и открываем карту. */
  const acceptOpeningSms = () => {
    setState((s) => {
      const unlockedLocations = new Set<LocationId>([...s.unlockedLocations, 'forensic'])
      const completedDialogues = new Set([...s.completedDialogues, 'detective-room-0'])
      return {
        ...s,
        unlockedLocations,
        completedDialogues,
        phase: 'hub' as GamePhase,
        currentLocationId: null,
        currentMuseumHallId: null,
        currentTheaterRoomId: null,
        currentHotelRoomId: null,
        visitedLocations: new Set([...s.visitedLocations, 'detective-room']),
      }
    })
    setActivePanel('map')
  }

  // На случай рассинхрона (HMR и т.п.): SMS принят → морг всегда открыт
  useEffect(() => {
    if (scenario.id !== 'stolen-painting') return
    if (!state.completedDialogues.has('detective-room-0')) return
    if (state.unlockedLocations.has('forensic')) return
    setState((s) => ({
      ...s,
      unlockedLocations: new Set<LocationId>([...s.unlockedLocations, 'forensic']),
    }))
  }, [scenario.id, state.completedDialogues, state.unlockedLocations])

  const hasPendingOpeningSms =
    scenario.id === 'stolen-painting' &&
    state.gameDay === 1 &&
    !state.completedDialogues.has('detective-room-0')

  const [openingMessageReady, setOpeningMessageReady] = useState(false)
  useEffect(() => {
    if (!hasPendingOpeningSms) {
      setOpeningMessageReady(false)
      return
    }
    setOpeningMessageReady(false)
    const timer = window.setTimeout(() => setOpeningMessageReady(true), 1400)
    return () => window.clearTimeout(timer)
  }, [hasPendingOpeningSms, state.phase])

  const openPhone = (screen?: DetectivePhoneScreen) => {
    setActivePanel('none')
    setPhoneEntry(screen ?? (hasPendingOpeningSms && openingMessageReady ? 'lock' : 'home'))
    setPhoneOpen(true)
  }

  const closePhone = () => setPhoneOpen(false)

  const capturePhonePhoto = () => {
    const shot = playScene(stateRef.current)
    const now = new Date()
    const photo: PhonePhoto = {
      id: `shot-${now.getTime()}`,
      label: shot.label,
      imageSrc: sceneImageUrl(shot.sceneId),
      takenAtLabel: now.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setState((s) => ({
      ...s,
      phonePhotos: [photo, ...(s.phonePhotos ?? [])].slice(0, 24),
    }))
  }

  const requestHint = () => {
    const unvisited = scenario.locationOrder.filter(
      (id: LocationId) => !state.visitedLocations.has(id) && id !== 'detective-room',
    )
    const next = unvisited.find((id) => state.unlockedLocations.has(id))
    let hint = next
      ? (HINTS[next] ?? 'Отправляйтесь в новые места на карте.')
      : state.gameDay === 1 && canAdvanceDay(state)
        ? 'Завершите день в кабинете — завтра снова в галерею.'
        : 'Проверьте улики в рюкзаке и записи в блокноте.'

    const done = state.completedDialogues
    if (state.currentLocationId === 'hotel' && done.has('hotel-0') && !done.has('hotel-2')) {
      hint = 'Две фамилии в журнале. Сверьте их с открытками в рюкзаке.'
    } else if (state.currentLocationId === 'hotel' && done.has('hotel-2') && !done.has('hotel-3')) {
      hint = 'Верещагина уехала. Осмотрите её номер.'
    } else if (hasPendingAirportCall(state)) {
      hint = 'В кабинете — городской телефон. Позвоните в полицию Шереметьева.'
    } else if (state.currentLocationId === 'airport' && done.has('airport-0') && !done.has('airport-1')) {
      hint = 'Гипс слишком новый. В отеле она ходила сама, без хромоты.'
    }
    setState((s) => ({
      ...s,
      hintCount: s.hintCount + 1,
      elapsedSeconds: s.elapsedSeconds + HINT_PENALTY_SECONDS,
      showHint: true,
      currentHint: hint,
    }))
  }

  const revealRulesPenalty = () => {
    setState((s) => ({
      ...s,
      hintCount: s.hintCount + 1,
      elapsedSeconds: s.elapsedSeconds + HINT_PENALTY_SECONDS,
    }))
  }

  const dismissHint = () => setState((s) => ({ ...s, showHint: false, currentHint: null }))

  const openPanel = (panel: ActivePanel) => {
    // До принятия SMS карта бесполезна — А2 ещё закрыт
    if (
      panel === 'map' &&
      scenario.id === 'stolen-painting' &&
      state.gameDay === 1 &&
      !state.completedDialogues.has('detective-room-0')
    ) {
      setState((s) => ({
        ...s,
        showHint: true,
        currentHint: 'Сначала прочитайте сообщение на телефоне и уберите его.',
      }))
      return
    }
    setActivePanel(panel)
  }
  const closePanel = () => setActivePanel('none')

  const showMapLockedHint = (locationId: LocationId) => {
    const done = state.completedDialogues
    let hint = 'Это место ещё закрыто. Сначала завершите предыдущие точки маршрута.'
    if (scenario.id === 'stolen-painting') {
      if (locationId === 'forensic' && !done.has('detective-room-0')) {
        hint = 'Морг (А2) откроется, когда закроете телефон с сообщением.'
      } else if (locationId === 'theater' || locationId === 'museum') {
        hint = 'Сначала осмотрите вещи погибшего в морге.'
      } else if (locationId === 'hotel') {
        hint = 'Сначала расспросите охрану в Большом театре.'
      } else if (locationId === 'airport') {
        hint = hasPendingAirportCall(state)
          ? 'Сначала позвоните в полицию аэропорта с городского телефона в кабинете.'
          : 'Сначала осмотрите номер в «Национале» и позвоните из кабинета.'
      }
    }
    setState((s) => ({ ...s, showHint: true, currentHint: hint }))
  }

  const goBack = () => {
    if (activePanel !== 'none') {
      closePanel()
      return
    }

    setState((s) => {
      switch (s.phase) {
        case 'hall':
          return { ...s, phase: 'cover' }
        case 'rules':
          return { ...s, phase: 'hall' }
        case 'location':
          return {
            ...s,
            phase: 'hub',
            currentLocationId: null,
            currentMuseumHallId: null,
            currentTheaterRoomId: null,
            currentHotelRoomId: null,
            showHint: false,
            currentHint: null,
          }
        case 'dialogue':
          return { ...s, phase: 'location', showHint: false, currentHint: null }
        case 'solve':
          return { ...s, phase: 'hub', isRunning: true }
        case 'victory':
        case 'defeat':
          return { ...s, phase: 'hub', isRunning: true }
        default:
          return s
      }
    })
  }

  const travelTo = (locationId: LocationId) => {
    if (!stateRef.current.unlockedLocations.has(locationId)) return

    // Кабинет = хаб, отдельного location-экрана после SMS нет
    if (locationId === 'detective-room') {
      setState((s) => ({
        ...s,
        phase: 'hub' as GamePhase,
        currentLocationId: null,
        currentMuseumHallId: null,
        currentTheaterRoomId: null,
        currentHotelRoomId: null,
      }))
      setActivePanel('none')
      return
    }

    setState((s) => {
      if (!s.unlockedLocations.has(locationId)) return s
      let museumHall: MuseumHallId | null = null
      let theaterRoom: TheaterRoomId | null = null
      let hotelRoom: HotelRoomId | null = null
      if (locationId === 'museum') {
        const available = getAvailableDialogues(scenario, 'museum', s)
        museumHall = firstTalkableMuseumHall(available)
      }
      if (locationId === 'theater') {
        const available = getAvailableDialogues(scenario, 'theater', s)
        theaterRoom = firstTalkableTheaterRoom(available)
      }
      if (locationId === 'hotel') {
        const available = getAvailableDialogues(scenario, 'hotel', s)
        hotelRoom = firstTalkableHotelRoom(available)
      }
      return {
        ...s,
        phase: 'location' as GamePhase,
        currentLocationId: locationId,
        currentMuseumHallId: museumHall,
        currentTheaterRoomId: theaterRoom,
        currentHotelRoomId: hotelRoom,
        visitedLocations: new Set([...s.visitedLocations, locationId]),
      }
    })
    setActivePanel('none')
  }

  const setMuseumHall = (hallId: MuseumHallId) => {
    setState((s) => {
      if (s.currentLocationId !== 'museum') return s
      return { ...s, currentMuseumHallId: hallId, showHint: false, currentHint: null }
    })
  }

  const setTheaterRoom = (roomId: TheaterRoomId) => {
    setState((s) => {
      if (s.currentLocationId !== 'theater') return s
      return { ...s, currentTheaterRoomId: roomId, showHint: false, currentHint: null }
    })
  }

  const setHotelRoom = (roomId: HotelRoomId) => {
    setState((s) => {
      if (s.currentLocationId !== 'hotel') return s
      return { ...s, currentHotelRoomId: roomId, showHint: false, currentHint: null }
    })
  }

  const startDialogue = (dialogueIndex = 0) => {
    setState((s) => ({
      ...s,
      phase: 'dialogue',
      activeDialogueIndex: dialogueIndex,
      dialogueStep: 0,
      dialoguePeakStep: 0,
      currentMuseumHallId:
        s.currentLocationId === 'museum'
          ? museumHallForDialogue(dialogueIndex)
          : s.currentMuseumHallId,
      currentTheaterRoomId:
        s.currentLocationId === 'theater'
          ? theaterRoomForDialogue(dialogueIndex)
          : s.currentTheaterRoomId,
      currentHotelRoomId:
        s.currentLocationId === 'hotel'
          ? hotelRoomForDialogue(dialogueIndex)
          : s.currentHotelRoomId,
    }))
  }

  const retreatDialogue = () => {
    setState((s) => {
      if (s.dialogueStep <= 0) return s
      return { ...s, dialogueStep: s.dialogueStep - 1 }
    })
  }

  const advanceDialogue = () => {
    const loc = scenario.locations.find((l) => l.locationId === state.currentLocationId)
    if (!loc) return

    const dialogue = loc.dialogues[state.activeDialogueIndex]
    const currentLine = dialogue[state.dialogueStep]
    const lineKey = `${loc.locationId}-${state.activeDialogueIndex}-${state.dialogueStep}`

    if (currentLine?.requireShowClueId && !state.presentedLineKeys.has(lineKey)) {
      return
    }

    if (currentLine?.inspectHotspots && currentLine.clueIds?.length) {
      const missing = currentLine.clueIds.some(
        (id) => !state.backpack.some((c) => c.id === id),
      )
      if (missing) return
    }

    const nextStep = state.dialogueStep + 1
    if (nextStep < dialogue.length) {
      setState((s) => {
        let hubCluesAvailable = s.hubCluesAvailable
        if (currentLine?.unlockHubClueId) {
          hubCluesAvailable = new Set([...s.hubCluesAvailable, currentLine.unlockHubClueId])
        }
        return {
          ...s,
          dialogueStep: nextStep,
          dialoguePeakStep: Math.max(s.dialoguePeakStep, nextStep),
          hubCluesAvailable,
        }
      })
      return
    }

    const dialogueKey = `${loc.locationId}-${state.activeDialogueIndex}`

    setState((s) => {
      let updates: Partial<typeof s> = {
        phase: 'location' as GamePhase,
        dialoguePeakStep: Math.max(s.dialoguePeakStep, nextStep - 1),
      }

      if (scenario.id === 'stolen-painting') {
        const progress = applyStolenPaintingProgress(dialogueKey, s)
        updates = { ...updates, ...progress }

        if (dialogueKey === 'forensic-0') {
          const photo = loc.clues.find((c) => c.id === 'clue-victim-photo')
          const backpack = s.backpack.some((c) => c.id === 'clue-victim-photo')
            ? s.backpack
            : photo
              ? [...s.backpack, { ...photo, discoveredAt: s.elapsedSeconds }]
              : s.backpack
          updates = {
            ...updates,
            backpack,
            showHint: true,
            currentHint: 'На карте открыты Третьяковка (А3) и Большой театр (А4). Фото — в рюкзаке.',
          }
        }

        // После разговора в ГТГ остаёмся в галерее и переходим к следующему залу с меткой
        if (dialogueKey.startsWith('museum-')) {
          const nextState = { ...s, ...progress }
          const available = getAvailableDialogues(scenario, 'museum', nextState)
          const nextHall = firstTalkableMuseumHall(available)
          updates = {
            ...updates,
            phase: 'location',
            currentMuseumHallId: nextHall,
          }
          if (dialogueKey === 'museum-0') {
            updates = {
              ...updates,
              showHint: true,
              currentHint:
                'Подойдите к специалистам в залах 20, 30 и 38 — в каждом зале свой разговор.',
            }
          }
        }

        if (dialogueKey.startsWith('theater-')) {
          const nextState = { ...s, ...progress }
          const available = getAvailableDialogues(scenario, 'theater', nextState)
          const nextRoom = firstTalkableTheaterRoom(available)
          updates = {
            ...updates,
            phase: 'location',
            currentTheaterRoomId: nextRoom,
          }
          if (dialogueKey === 'theater-0') {
            updates = {
              ...updates,
              showHint: true,
              currentHint: 'Буфетчица не была на смене. Спросите в гардеробе.',
            }
          }
          if (dialogueKey === 'theater-1') {
            updates = {
              ...updates,
              showHint: true,
              currentHint: 'Покажите фото охране у входа.',
            }
          }
          if (dialogueKey === 'theater-2') {
            updates = {
              ...updates,
              showHint: true,
              currentHint: 'Такси «Националя». Откройте карту — точка А5.',
            }
          }
        }

        if (dialogueKey.startsWith('hotel-')) {
          const nextState = { ...s, ...progress }
          const available = getAvailableDialogues(scenario, 'hotel', nextState)
          const nextRoom = firstTalkableHotelRoom(available)
          updates = {
            ...updates,
            phase: 'location',
            currentHotelRoomId: nextRoom,
          }
          if (dialogueKey === 'hotel-0') {
            updates = {
              ...updates,
              showHint: true,
              currentHint: 'Две фамилии. Сверьте их с открытками в рюкзаке.',
            }
          }
          if (dialogueKey === 'hotel-1') {
            updates = {
              ...updates,
              showHint: true,
              currentHint: 'Лебедева ни при чём. В журнале ещё одна фамилия.',
            }
          }
          if (dialogueKey === 'hotel-2') {
            updates = {
              ...updates,
              showHint: true,
              currentHint: 'Она уехала в Шереметьево. Осмотрите номер.',
            }
          }
          if (dialogueKey === 'hotel-3') {
            updates = {
              ...updates,
              showHint: true,
              currentHint: 'Вернитесь в кабинет — городским телефоном предупредите аэропорт.',
            }
          }
        }

        if (dialogueKey === 'airport-0') {
          updates = {
            ...updates,
            showHint: true,
            currentHint: 'Её вызвали к стойке. Идите к досмотру.',
          }
        }

        if (dialogueKey === 'airport-1') {
          updates = {
            ...updates,
            showHint: true,
            currentHint: 'Картина найдена. В кабинете можно назвать виновную.',
          }
        }
      } else {
        const nextUnlocked = new Set(s.unlockedLocations)
        const orderIdx = scenario.locationOrder.indexOf(loc.locationId)
        const nextLoc = scenario.locationOrder[orderIdx + 1]
        if (nextLoc) nextUnlocked.add(nextLoc)
        updates = {
          ...updates,
          completedDialogues: new Set([...s.completedDialogues, dialogueKey]),
          unlockedLocations: nextUnlocked,
        }
      }

      return { ...s, ...updates }
    })
  }

  const presentClue = (clueId: string): boolean => {
    const loc = scenario.locations.find((l) => l.locationId === state.currentLocationId)
    if (!loc) return false
    const line = loc.dialogues[state.activeDialogueIndex]?.[state.dialogueStep]
    if (!line?.requireShowClueId) return false
    const lineKey = `${loc.locationId}-${state.activeDialogueIndex}-${state.dialogueStep}`
    if (clueId !== line.requireShowClueId) return false
    setState((s) => ({
      ...s,
      presentedLineKeys: new Set([...s.presentedLineKeys, lineKey]),
    }))
    return true
  }

  const placeAirportCall = () => {
    if (!hasPendingAirportCall(stateRef.current)) return
    setState((s) => {
      if (!hasPendingAirportCall(s)) return s
      return {
        ...s,
        completedDialogues: new Set([...s.completedDialogues, 'airport-call-0']),
        unlockedLocations: new Set<LocationId>([...s.unlockedLocations, 'airport']),
        showHint: true,
        currentHint: 'Шереметьево открыто на карте. Её уже объявляют по громкой связи.',
      }
    })
  }

  const addNotebookFromLine = (line: DialogueLine) => {
    const loc = scenario.locations.find((l) => l.locationId === state.currentLocationId)
    if (!loc) return

    const entry = buildNotebookEntryFromLine(
      line,
      loc.locationId,
      state.activeDialogueIndex,
      state.dialogueStep,
    )
    if (stateRef.current.notebook.some((n) => n.id === entry.id)) return

    setState((s) => {
      if (s.notebook.some((n) => n.id === entry.id)) return s
      return { ...s, notebook: [...s.notebook, entry] }
    })
    notifySaved('notebook')
  }

  const addNotebookRowFromLine = (line: DialogueLine) => {
    const add = line.notebookAddRow
    if (!add) return

    const existing = stateRef.current.notebook.find((n) => n.id === add.tableId)
    if (
      existing?.table?.rows.some((r) => r[0] === add.row[0] && add.row[0] !== '')
    ) {
      return
    }

    setState((s) => {
      const current = s.notebook.find((n) => n.id === add.tableId)
      if (!current) {
        const created = createEmptySpecialistsTable()
        created.id = add.tableId
        if (add.title) created.title = add.title
        if (add.columns) {
          created.table = { columns: [...add.columns], rows: [] }
        }
        created.table = addRowToTable(
          created.table ?? { columns: [...GTG_SPECIALISTS_COLUMNS], rows: [] },
          add.row,
        )
        return { ...s, notebook: [...s.notebook, created] }
      }

      if (!current.table) return s
      if (current.table.rows.some((r) => r[0] === add.row[0] && add.row[0] !== '')) {
        return s
      }
      const table = addRowToTable(current.table, add.row)
      return {
        ...s,
        notebook: s.notebook.map((n) =>
          n.id === add.tableId ? { ...n, table } : n,
        ),
      }
    })
    notifySaved('notebook')
  }

  const removeNotebookRowFromLine = (line: DialogueLine) => {
    const add = line.notebookAddRow
    if (!add?.row[0]) return
    const name = add.row[0]

    setState((s) => ({
      ...s,
      notebook: s.notebook.map((n) => {
        if (n.id !== add.tableId || !n.table) return n
        return {
          ...n,
          table: {
            ...n.table,
            rows: n.table.rows.filter((r) => r[0] !== name),
          },
        }
      }),
    }))
  }

  const updateNotebookCell = (
    entryId: string,
    rowIdx: number,
    cellIdx: number,
    value: string,
  ) => {
    setState((s) => ({
      ...s,
      notebook: s.notebook.map((n) => {
        if (n.id !== entryId || !n.table) return n
        const rows = n.table.rows.map((row, r) => {
          if (r !== rowIdx) return row
          const next = [...row]
          while (next.length <= cellIdx) next.push('')
          next[cellIdx] = value
          return next
        })
        return { ...n, table: { ...n.table, rows } }
      }),
    }))
  }

  const addNotebookTableRow = (entryId: string, row?: string[]) => {
    setState((s) => ({
      ...s,
      notebook: s.notebook.map((n) => {
        if (n.id !== entryId || !n.table) return n
        const empty = n.table.columns.map(() => '')
        return {
          ...n,
          table: addRowToTable(n.table, row ?? empty),
        }
      }),
    }))
  }

  const createSpecialistsTable = () => {
    setState((s) => {
      if (s.notebook.some((n) => n.id === GTG_SPECIALISTS_TABLE_ID)) return s
      return { ...s, notebook: [...s.notebook, createEmptySpecialistsTable()] }
    })
  }

  /** Во время звонка: таблица с тремя специалистами, чтобы вписывать телефоны с клавиатуры */
  const ensureSpecialistsRowsForCall = () => {
    setState((s) => {
      const roles: Record<string, string> = {
        'Марина Козлова': 'Реставратор',
        'Пётр Сергеев': 'Искусствовед',
        'Дмитрий Орлов': 'Специалист по безопасности залов',
      }
      const names = Object.keys(roles)

      let notebook = [...s.notebook]
      const existingIdx = notebook.findIndex((n) => n.id === GTG_SPECIALISTS_TABLE_ID)

      if (existingIdx < 0) {
        const created = createEmptySpecialistsTable()
        let table: NotebookTable = {
          columns: [...GTG_SPECIALISTS_COLUMNS],
          rows: [],
        }
        for (const name of names) {
          table = addRowToTable(table, [name, roles[name], ''])
        }
        created.table = table
        created.content = 'Впишите телефоны во время звонка директора.'
        return { ...s, notebook: [...notebook, created] }
      }

      const existing = notebook[existingIdx]
      if (!existing.table) return s

      let table = existing.table
      let changed = false
      for (const name of names) {
        if (!table.rows.some((r) => r[0] === name)) {
          table = addRowToTable(table, [name, roles[name], ''])
          changed = true
        }
      }
      if (!changed) return s

      notebook[existingIdx] = {
        ...existing,
        table,
        content: existing.content || 'Впишите телефоны во время звонка директора.',
      }
      return { ...s, notebook }
    })
  }

  const revealDirectorPhone = (name: string) => {
    setState((s) => {
      if (s.revealedDirectorPhones.has(name)) return s
      return {
        ...s,
        revealedDirectorPhones: new Set([...s.revealedDirectorPhones, name]),
        elapsedSeconds: s.elapsedSeconds + PHONE_REVEAL_PENALTY_SECONDS,
        hintCount: s.hintCount + 1,
      }
    })
  }

  const fillSpecialistPhonesFromVoice = () => {
    setState((s) => {
      if (s.revealedDirectorPhones.size === 0) return s

      const existing = s.notebook.find((n) => n.id === GTG_SPECIALISTS_TABLE_ID)
      const roles: Record<string, string> = {
        'Марина Козлова': 'Реставратор',
        'Пётр Сергеев': 'Искусствовед',
        'Дмитрий Орлов': 'Специалист по безопасности залов',
      }

      if (!existing?.table) {
        const created = createEmptySpecialistsTable()
        let table: NotebookTable = {
          columns: [...GTG_SPECIALISTS_COLUMNS],
          rows: [],
        }
        for (const name of s.revealedDirectorPhones) {
          table = addRowToTable(table, [name, roles[name] ?? '', ''])
        }
        table = fillPhonesInSpecialistsTable(table, s.revealedDirectorPhones)
        created.table = table
        created.content = 'Открытые номера записаны из голосового директора.'
        return { ...s, notebook: [...s.notebook, created] }
      }

      let table = existing.table
      for (const name of s.revealedDirectorPhones) {
        if (!table.rows.some((r) => r[0] === name)) {
          table = addRowToTable(table, [name, roles[name] ?? '', ''])
        }
      }
      table = fillPhonesInSpecialistsTable(table, s.revealedDirectorPhones)

      return {
        ...s,
        notebook: s.notebook.map((n) =>
          n.id === GTG_SPECIALISTS_TABLE_ID
            ? { ...n, table, content: 'Открытые номера записаны из голосового директора.' }
            : n,
        ),
      }
    })
  }

  /** Снять трубку: принять голосовое директора в рюкзак и отметить звонок */
  const answerDirectorCall = () => {
    setState((s) => {
      const completedDialogues = new Set([...s.completedDialogues, 'director-call-0'])
      const nextHubClues = new Set(s.hubCluesAvailable)
      const alreadyInBag = s.backpack.some((c) => c.id === 'clue-voice-director')
      const hubClue = scenario.hubClues?.find((c) => c.id === 'clue-voice-director')

      let backpack = s.backpack
      if (!alreadyInBag && hubClue) {
        backpack = [...s.backpack, { ...hubClue, discoveredAt: s.elapsedSeconds }]
        nextHubClues.delete('clue-voice-director')
      }

      return {
        ...s,
        completedDialogues,
        hubCluesAvailable: nextHubClues,
        backpack,
      }
    })
    notifySaved('backpack')
  }

  /** Утро дня 2: снять трубку городского — urgency, без SMS */
  const answerDay2Call = () => {
    setState((s) => ({
      ...s,
      completedDialogues: new Set([...s.completedDialogues, 'day2-call-0']),
      unlockedLocations: new Set<LocationId>([...s.unlockedLocations, 'museum']),
    }))
  }

  const removeNotebookEntry = (entryId: string) => {
    setState((s) => ({ ...s, notebook: s.notebook.filter((n) => n.id !== entryId) }))
  }

  const addClueToBackpack = (clueId: string) => {
    const loc = scenario.locations.find((l) => l.locationId === state.currentLocationId)
    const hubClue = scenario.hubClues?.find((c) => c.id === clueId)
    const clue = loc?.clues.find((c) => c.id === clueId) ?? hubClue
    if (!clue) return
    if (stateRef.current.backpack.some((b) => b.id === clueId)) return

    const discoveredAt = stateRef.current.elapsedSeconds
    setState((s) => {
      if (s.backpack.some((b) => b.id === clueId)) return s
      const nextHubClues = new Set(s.hubCluesAvailable)
      nextHubClues.delete(clueId)
      return {
        ...s,
        backpack: [...s.backpack, { ...clue, discoveredAt }],
        hubCluesAvailable: nextHubClues,
      }
    })
    notifySaved('backpack')
  }

  const removeClueFromBackpack = (clueId: string) => {
    setState((s) => ({
      ...s,
      backpack: s.backpack.filter((c) => c.id !== clueId),
    }))
  }

  const readHubMessage = (messageId: string) => {
    setState((s) => ({
      ...s,
      hubMessages: s.hubMessages.map((m) =>
        m.id === messageId ? { ...m, read: true } : m,
      ),
    }))
  }

  const collectHubClue = (clueId: string) => {
    if (!state.hubCluesAvailable.has(clueId)) return
    addClueToBackpack(clueId)
  }

  const advanceDay = () => {
    if (!canAdvanceDay(state)) return
    setState((s) => ({
      ...s,
      gameDay: 2,
      revealedDay2CallText: false,
      showHint: true,
      currentHint: 'Начался второй день. Скоро зазвонит городской телефон.',
    }))
  }

  const revealDay2CallText = () => {
    if (stateRef.current.revealedDay2CallText) return
    setState((s) => {
      if (s.revealedDay2CallText) return s
      return {
        ...s,
        revealedDay2CallText: true,
        elapsedSeconds: s.elapsedSeconds + HINT_PENALTY_SECONDS,
        hintCount: s.hintCount + 1,
      }
    })
  }

  const openSolve = () => {
    setState((s) => ({ ...s, phase: 'solve', isRunning: false }))
  }

  const submitSolution = (suspectId: string) => {
    const correct = suspectId === scenario.solution.suspectId
    setState((s) => ({ ...s, phase: correct ? 'victory' : 'defeat', isRunning: false }))
  }

  const selectScenario = (id: string) => {
    const item = SCENARIO_LIST.find((s) => s.id === id)
    if (!item?.available || !getScenario(id)) return
    setState(createInitialState(id))
    setActivePanel('none')
    setRulesUnderstood(null)
  }

  const selectScenarioAndEnterHall = (id: string) => {
    const item = SCENARIO_LIST.find((s) => s.id === id)
    if (!item?.available || !getScenario(id)) return
    setState({ ...createInitialState(id), phase: 'hall' })
    setActivePanel('none')
    setRulesUnderstood(null)
  }

  const resetGame = () => {
    setState({ ...createInitialState(state.scenarioId), phase: 'hall' })
    setActivePanel('none')
    setRulesUnderstood(null)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const mapPoints = scenario.locationOrder.flatMap((id) => {
    const point = MAP_POINTS.find((p) => p.id === id)
    if (!point) return []
    return [
      {
        ...point,
        unlocked: state.unlockedLocations.has(id),
        visited: isLocationCleared(scenario, id, state),
      },
    ]
  })

  const currentLocation = scenario.locations.find((l) => l.locationId === state.currentLocationId)

  const canSolve =
    scenario.id === 'stolen-painting'
      ? state.backpack.some((c) => c.id === 'clue-cast-painting')
      : state.notebook.length + state.backpack.length >= 3

  const unreadHubMessages = state.hubMessages.filter((m) => !m.read)
  const showAdvanceDay = canAdvanceDay(state)
  const pendingDirectorCall = hasPendingDirectorCall(state)
  const pendingDay2Call = hasPendingDay2Call(state)
  const pendingAirportCall = hasPendingAirportCall(state)
  const directorVoiceClue = scenario.hubClues?.find((c) => c.id === 'clue-voice-director')

  return {
    scenario,
    scenarioList: SCENARIO_LIST,
    state,
    activePanel,
    rulesUnderstood,
    savePulse,
    mapPoints,
    currentLocation,
    canSolve,
    unreadHubMessages,
    showAdvanceDay,
    hasPendingOpeningSms,
    openingMessageReady,
    phoneOpen,
    phoneEntry,
    openPhone,
    closePhone,
    capturePhonePhoto,
    pendingDirectorCall,
    pendingDay2Call,
    pendingAirportCall,
    directorVoiceClue,
    formatTime,
    startGame,
    enterHall,
    goToCover,
    confirmRules,
    revealRulesPenalty,
    requestHint,
    dismissHint,
    openPanel,
    closePanel,
    goBack,
    travelTo,
    setMuseumHall,
    setTheaterRoom,
    setHotelRoom,
    showMapLockedHint,
    acceptOpeningSms,
    startDialogue,
    retreatDialogue,
    advanceDialogue,
    presentClue,
    placeAirportCall,
    addNotebookFromLine,
    addNotebookRowFromLine,
    removeNotebookRowFromLine,
    updateNotebookCell,
    addNotebookTableRow,
    createSpecialistsTable,
    ensureSpecialistsRowsForCall,
    fillSpecialistPhonesFromVoice,
    revealDirectorPhone,
    answerDirectorCall,
    answerDay2Call,
    revealDay2CallText,
    removeNotebookEntry,
    addClueToBackpack,
    removeClueFromBackpack,
    readHubMessage,
    collectHubClue,
    advanceDay,
    openSolve,
    submitSolution,
    resetGame,
    selectScenario,
    selectScenarioAndEnterHall,
    setPhase,
    HINT_PENALTY_SECONDS,
  }
}

export type GameContext = ReturnType<typeof useGame>
