import type { SceneId } from '../assets/scenes'
import type { HotelRoomId } from '../types/game'

export type { HotelRoomId }

export interface HotelRoom {
  id: HotelRoomId
  sceneId: SceneId
  shortLabel: string
  title: string
  dialogueIndexes: number[]
}

export const HOTEL_ROOMS: HotelRoom[] = [
  {
    id: 'lobby',
    sceneId: 'hotel',
    shortLabel: 'Холл',
    title: 'Холл, стойка',
    dialogueIndexes: [0, 1, 2],
  },
  {
    id: 'room',
    sceneId: 'hotel-room',
    shortLabel: 'Номер',
    title: 'Номер Верещагиной',
    dialogueIndexes: [3],
  },
]

export const DEFAULT_HOTEL_ROOM: HotelRoomId = 'lobby'

const ROOM_BY_ID = Object.fromEntries(HOTEL_ROOMS.map((r) => [r.id, r])) as Record<
  HotelRoomId,
  HotelRoom
>

export function getHotelRoom(id: HotelRoomId | null | undefined): HotelRoom {
  return ROOM_BY_ID[id ?? DEFAULT_HOTEL_ROOM] ?? ROOM_BY_ID[DEFAULT_HOTEL_ROOM]
}

export function hotelRoomForDialogue(dialogueIndex: number): HotelRoomId {
  return dialogueIndex === 3 ? 'room' : 'lobby'
}

export function hotelSceneForRoom(roomId: HotelRoomId | null | undefined): SceneId {
  return getHotelRoom(roomId).sceneId
}

const TALK_PRIORITY: HotelRoomId[] = ['lobby', 'room']

export function firstTalkableHotelRoom(availableDialogueIndexes: number[]): HotelRoomId {
  for (const id of TALK_PRIORITY) {
    const room = ROOM_BY_ID[id]
    if (room.dialogueIndexes.some((idx) => availableDialogueIndexes.includes(idx))) {
      return id
    }
  }
  return DEFAULT_HOTEL_ROOM
}
