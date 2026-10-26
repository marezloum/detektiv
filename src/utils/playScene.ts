import type { SceneId } from '../assets/scenes'
import { getHotelRoom, hotelSceneForRoom } from '../data/hotelRooms'
import { LOCATIONS } from '../data/locations'
import { getTheaterRoom, theaterSceneForRoom } from '../data/theaterRooms'
import { getTretyakovHall, museumSceneForHall } from '../data/tretyakovHalls'
import type { GameState, LocationId } from '../types/game'

/** Место, которое детектив видит сейчас — его и снимает камера. */
export function playScene(
  state: Pick<
    GameState,
    | 'phase'
    | 'currentLocationId'
    | 'currentMuseumHallId'
    | 'currentTheaterRoomId'
    | 'currentHotelRoomId'
  >,
): { sceneId: SceneId; label: string } {
  const id: LocationId =
    state.phase === 'hub' || !state.currentLocationId ? 'detective-room' : state.currentLocationId

  if (id === 'museum') {
    const hall = getTretyakovHall(state.currentMuseumHallId)
    return { sceneId: museumSceneForHall(hall.id), label: hall.title }
  }
  if (id === 'theater') {
    const room = getTheaterRoom(state.currentTheaterRoomId)
    return { sceneId: theaterSceneForRoom(room.id), label: room.title }
  }
  if (id === 'hotel') {
    const room = getHotelRoom(state.currentHotelRoomId)
    return { sceneId: hotelSceneForRoom(room.id), label: room.title }
  }

  return { sceneId: id, label: LOCATIONS[id]?.name ?? 'Место' }
}
