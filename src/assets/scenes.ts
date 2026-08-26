import type { LocationId } from '../types/game'
import { asset } from '../utils/asset'

export type MuseumSceneId =
  | 'museum'
  | 'museum-lobby'
  | 'museum-office'
  | 'museum-hall-20'
  | 'museum-hall-30'
  | 'museum-hall-38'

export type TheaterSceneId = 'theater-buffet' | 'theater-cloakroom' | 'theater-guard'

export type SceneId = LocationId | 'map' | 'title' | MuseumSceneId | TheaterSceneId

/** Fallback gradients when image is loading or missing */
export const SCENE_FALLBACKS: Record<SceneId, string> = {
  title: 'linear-gradient(160deg, #0f1419 0%, #1a2332 40%, #2c1810 100%)',
  map: 'radial-gradient(ellipse at 50% 40%, #2a3544 0%, #141820 70%), linear-gradient(180deg, #1e2836, #0d1117)',
  'detective-room': 'linear-gradient(180deg, #1a1510 0%, #2d2418 50%, #0f0d0a 100%)',
  forensic: 'linear-gradient(180deg, #141a1e 0%, #1e2a30 60%, #0a0e10 100%)',
  'police-station': 'linear-gradient(180deg, #1c1c22 0%, #2a2a35 50%, #121218 100%)',
  airport: 'linear-gradient(180deg, #182030 0%, #243448 40%, #101820 100%)',
  metro: 'linear-gradient(180deg, #1a1218 0%, #3d2030 30%, #120a10 100%)',
  'public-cultural': 'linear-gradient(180deg, #1a1810 0%, #3a3020 50%, #100e08 100%)',
  nature: 'linear-gradient(180deg, #0f1a12 0%, #1a3020 50%, #080f0a 100%)',
  museum: 'linear-gradient(180deg, #1a1815 0%, #2a2820 50%, #0f0e0c 100%)',
  'museum-lobby':
    'linear-gradient(165deg, #2a2218 0%, #4a3a28 35%, #1a1510 70%, #0c0a08 100%)',
  'museum-office':
    'linear-gradient(180deg, #1c1814 0%, #3a3028 45%, #1a1410 100%)',
  'museum-hall-20':
    'linear-gradient(160deg, #241c14 0%, #5a4030 40%, #2a2018 75%, #120e0a 100%)',
  'museum-hall-30':
    'linear-gradient(170deg, #1a1418 0%, #4a2838 40%, #221820 80%, #0e0a0c 100%)',
  'museum-hall-38':
    'linear-gradient(160deg, #181610 0%, #3a3420 40%, #1e1a12 80%, #0c0a08 100%)',
  shopping: 'linear-gradient(180deg, #18151a 0%, #2a2030 50%, #0f0d10 100%)',
  theater: 'linear-gradient(180deg, #2a1214 0%, #4a2028 45%, #12080a 100%)',
  'theater-buffet': 'linear-gradient(165deg, #3a1818 0%, #6a3030 40%, #1a0c0c 100%)',
  'theater-cloakroom': 'linear-gradient(170deg, #241810 0%, #4a3420 45%, #120e0a 100%)',
  'theater-guard': 'linear-gradient(180deg, #1a1214 0%, #3a2028 40%, #0e080a 100%)',
  hotel: 'linear-gradient(180deg, #1a1814 0%, #3a3228 45%, #100e0c 100%)',
}

export function sceneImageUrl(id: SceneId): string {
  return asset(`/images/scenes/${id}.jpg`)
}

export function sceneFallbackStyle(id: SceneId) {
  return { background: SCENE_FALLBACKS[id] }
}

const ALL_SCENE_IDS: SceneId[] = [
  'title',
  'map',
  'detective-room',
  'police-station',
  'museum',
  'museum-lobby',
  'museum-office',
  'museum-hall-20',
  'museum-hall-30',
  'museum-hall-38',
  'metro',
  'forensic',
  'public-cultural',
  'nature',
  'shopping',
  'airport',
  'theater',
  'theater-buffet',
  'theater-cloakroom',
  'theater-guard',
  'hotel',
]

/** Preload scene images for smoother transitions */
export function preloadSceneImages(): void {
  ALL_SCENE_IDS.forEach((id) => {
    const img = new Image()
    img.src = sceneImageUrl(id)
  })
}
