import type { SceneId } from '../assets/scenes'
import type { TheaterRoomId } from '../types/game'

export type { TheaterRoomId }

export interface TheaterRoom {
  id: TheaterRoomId
  sceneId: SceneId
  shortLabel: string
  title: string
  dialogueIndex: number
}

export const THEATER_ROOMS: TheaterRoom[] = [
  {
    id: 'buffet',
    sceneId: 'theater-buffet',
    shortLabel: 'Буфет',
    title: 'Буфет',
    dialogueIndex: 0,
  },
  {
    id: 'cloakroom',
    sceneId: 'theater-cloakroom',
    shortLabel: 'Гардероб',
    title: 'Гардероб',
    dialogueIndex: 1,
  },
  {
    id: 'guard',
    sceneId: 'theater-guard',
    shortLabel: 'Охрана',
    title: 'Вход, охрана',
    dialogueIndex: 2,
  },
]

export const DEFAULT_THEATER_ROOM: TheaterRoomId = 'buffet'

const ROOM_BY_ID = Object.fromEntries(THEATER_ROOMS.map((r) => [r.id, r])) as Record<
  TheaterRoomId,
  TheaterRoom
>

export function getTheaterRoom(id: TheaterRoomId | null | undefined): TheaterRoom {
  return ROOM_BY_ID[id ?? DEFAULT_THEATER_ROOM] ?? ROOM_BY_ID[DEFAULT_THEATER_ROOM]
}

export function theaterRoomForDialogue(dialogueIndex: number): TheaterRoomId {
  switch (dialogueIndex) {
    case 1:
      return 'cloakroom'
    case 2:
      return 'guard'
    default:
      return 'buffet'
  }
}

export function theaterSceneForRoom(roomId: TheaterRoomId | null | undefined): SceneId {
  return getTheaterRoom(roomId).sceneId
}

const TALK_PRIORITY: TheaterRoomId[] = ['buffet', 'cloakroom', 'guard']

export function firstTalkableTheaterRoom(availableDialogueIndexes: number[]): TheaterRoomId {
  for (const id of TALK_PRIORITY) {
    const room = ROOM_BY_ID[id]
    if (availableDialogueIndexes.includes(room.dialogueIndex)) {
      return id
    }
  }
  return DEFAULT_THEATER_ROOM
}
