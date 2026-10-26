/** Shared location IDs — same across all scenarios */
export type LocationId =
  | 'detective-room'
  | 'forensic'
  | 'police-station'
  | 'airport'
  | 'metro'
  | 'public-cultural'
  | 'nature'
  | 'museum'
  | 'theater'
  | 'hotel'
  | 'shopping'

export interface MapPoint {
  id: LocationId
  mapCode: string
  label: string
  realName: string
  district: string
  icon: string
  x: number
  y: number
  unlocked: boolean
}

export interface LocationMeta {
  id: LocationId
  name: string
  description: string
  imageKey: string
}

export interface MotionVerb {
  word: string
  meaning: string
  aspect: 'perfective' | 'imperfective' | 'pair'
  pairWith?: string
  exampleInContext: string
}

export interface DialogueLine {
  speaker: 'npc' | 'player' | 'narrator'
  speakerName?: string
  text: string
  motionVerbs?: MotionVerb[]
  /** ID улик из ScenarioLocation.clues — игрок добавляет вручную */
  clueIds?: string[]
  /** Заметка в блокнот (показания, наблюдения) */
  notebookNote?: {
    title: string
    content: string
  }
  /** Таблица для блокнота (списки, контакты) */
  notebookTable?: NotebookTable
  /** Стабильный id записи таблицы (чтобы потом добавлять строки) */
  notebookTableId?: string
  /** Добавить строку в существующую (или создать) таблицу блокнота */
  notebookAddRow?: {
    tableId: string
    row: string[]
    /** Подпись кнопки «+» в диалоге */
    label?: string
    columns?: string[]
    title?: string
  }
  audioCue?: string
  /** После этой реплики разблокировать улику в кабинете (голосовое и т.п.) */
  unlockHubClueId?: string
  /** Игрок должен показать улику из рюкзака, чтобы продолжить */
  requireShowClueId?: string
  showCluePrompt?: string
  showClueWrongText?: string
  /** Улики с hotspot рисуются точками на фото сцены */
  inspectHotspots?: boolean
  /** Подмена фона для этой реплики (SceneId) */
  sceneId?: string
}

export interface NPC {
  id: string
  name: string
  role: string
  portraitKey: string
  /** Small overlay icons (e.g. hat, magnifier). If omitted, UI may apply defaults by portraitKey. */
  accessories?: string[]
}

export interface PhoneCallEntry {
  number: string
  contactName?: string
  direction: 'incoming' | 'outgoing' | 'missed'
  time: string
  date: string
}

export interface TicketDetail {
  event: string
  venue: string
  date: string
  time: string
  seat: string
  row: string
  section: string
  price: string
  holderName?: string
}

export interface PostcardDetail {
  paintingTitle: string
  artist: string
  galleryHall: string
  description: string
  /** Репродукция картины на открытке */
  imageSrc?: string
}

export interface NoteDetail {
  lines: string[]
  date: string
  time: string
  location: string
}

export interface VoicePhoneEntry {
  name: string
  role: string
  phone: string
}

export interface VoiceMessageDetail {
  sender: string
  duration: string
  /** Полный текст для озвучки (с номерами) */
  transcript: string
  /** Pre-recorded MP3 for the voice message */
  audioSrc?: string
  /** Текст без номеров — показывается бесплатно */
  spokenIntro?: string
  phones?: VoicePhoneEntry[]
  spokenOutro?: string
}

export interface BusinessCardDetail {
  name: string
  title: string
  company?: string
  phone?: string
  email?: string
  address?: string
}

export interface PhotoDetail {
  caption: string
  imageSrc: string
}

/** Снимок с телефона детектива */
export interface PhonePhoto {
  id: string
  label: string
  imageSrc: string
  takenAtLabel: string
}

export interface ObjectDetail {
  caption?: string
  imageSrc?: string
}

export type ClueDetailType =
  | 'phone'
  | 'ticket'
  | 'note'
  | 'postcard'
  | 'voice'
  | 'business-card'
  | 'photo'
  | 'object'

export interface ClueDetail {
  type: ClueDetailType
  phone?: { calls: PhoneCallEntry[] }
  ticket?: TicketDetail
  note?: NoteDetail
  postcard?: PostcardDetail
  voice?: VoiceMessageDetail
  businessCard?: BusinessCardDetail
  photo?: PhotoDetail
  object?: ObjectDetail
}

export interface ClueHotspot {
  /** % от ширины сцены (0–100) */
  x: number
  /** % от высоты сцены (0–100) */
  y: number
}

export interface Clue {
  id: string
  title: string
  description: string
  locationId: LocationId
  discoveredAt?: number
  /** Расширенный просмотр улики в рюкзаке */
  detail?: ClueDetail
  /** Кликабельная точка на фото сцены */
  hotspot?: ClueHotspot
}

export interface NotebookTable {
  columns: string[]
  rows: string[][]
}

export interface NotebookEntry {
  id: string
  title: string
  content: string
  motionVerbs: MotionVerb[]
  autoAdded: boolean
  table?: NotebookTable
}

export interface ScenarioLocation {
  locationId: LocationId
  npc: NPC
  dialogues: DialogueLine[][]
  clues: Clue[]
  requiredClueIds?: string[]
}

export interface Scenario {
  id: string
  title: string
  introRules: string
  /** Путь к аудиофайлу с озвучкой правил */
  introRulesAudio?: string
  mystery: string
  solution: {
    suspectId: string
    locationId: LocationId
    itemId: string
  }
  suspects: { id: string; name: string; alibi: string }[]
  locationOrder: LocationId[]
  locations: ScenarioLocation[]
  initialClues: Clue[]
  /** Улики, доступные в кабинете после определённых событий */
  hubClues?: Clue[]
  /** Сообщения в кабинете следователя */
  hubMessages?: Omit<HubMessage, 'read'>[]
}

export interface ScenarioListItem {
  id: string
  title: string
  mystery: string
  available: boolean
  icon: string
  difficulty?: 'easy' | 'medium' | 'hard'
  durationMinutes?: number
}

export type GamePhase =
  | 'cover'
  | 'hall'
  | 'rules'
  | 'hub'
  | 'map'
  | 'location'
  | 'dialogue'
  | 'solve'
  | 'victory'
  | 'defeat'

export interface HubMessage {
  id: string
  title: string
  preview: string
  body: string
  read: boolean
  /** Улика, которую можно забрать после прочтения */
  clueId?: string
}

/** Подлокация внутри Третьяковки (см. tretyakovHalls.ts) */
export type MuseumHallId = 'lobby' | 'office' | 'hall-20' | 'hall-30' | 'hall-38'

/** Подлокация внутри Большого театра */
export type TheaterRoomId = 'buffet' | 'cloakroom' | 'guard'

/** Подлокация внутри гостиницы */
export type HotelRoomId = 'lobby' | 'room'

export interface GameState {
  phase: GamePhase
  scenarioId: string
  elapsedSeconds: number
  hintCount: number
  isRunning: boolean
  gameDay: number
  currentLocationId: LocationId | null
  /** Текущий салон ГТГ, если currentLocationId === 'museum' */
  currentMuseumHallId: MuseumHallId | null
  /** Текущая точка в театре, если currentLocationId === 'theater' */
  currentTheaterRoomId: TheaterRoomId | null
  /** Текущая точка в отеле, если currentLocationId === 'hotel' */
  currentHotelRoomId: HotelRoomId | null
  visitedLocations: Set<LocationId>
  completedDialogues: Set<string>
  backpack: Clue[]
  notebook: NotebookEntry[]
  unlockedLocations: Set<LocationId>
  hubMessages: HubMessage[]
  hubCluesAvailable: Set<string>
  activeDialogueIndex: number
  dialogueStep: number
  dialoguePeakStep: number
  showHint: boolean
  currentHint: string | null
  /** Имена специалистов, чьи номера открыты письменно (+10 сек каждый) */
  revealedDirectorPhones: Set<string>
  /** Текст срочного звонка дня 2 открыт письменно (+10 сек) */
  revealedDay2CallText: boolean
  /** Реплики, на которых уже показали нужную улику */
  presentedLineKeys: Set<string>
  /** Снимки, сделанные камерой телефона */
  phonePhotos: PhonePhoto[]
}

export type ActivePanel = 'none' | 'map' | 'backpack' | 'notebook'
