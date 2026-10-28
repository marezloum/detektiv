import type { SceneId } from '../assets/scenes'
import { sceneImageUrl } from '../assets/scenes'
import { asset } from '../utils/asset'

/** Один объект, который можно снять камерой в этом месте. */
export interface CameraShotConfig {
  /** Уникален внутри сцены */
  id: string
  /** Подпись в видоискателе и в галерее */
  label: string
  /**
   * Картинка снимка, путь из `public`.
   * Пример: `/images/clues/victim-photo.jpg`.
   * Если не задан — сохраняется кадр самой сцены.
   */
  imageSrc?: string
}

/**
 * Что камера снимает в каждом месте.
 * Нет записи — как раньше, снимается сама сцена.
 * Одна запись — камера сразу смотрит на этот объект.
 * Несколько — в видоискателе появляется выбор.
 */
export const CAMERA_SHOTS: Partial<Record<SceneId, CameraShotConfig[]>> = {
  forensic: [
    { id: 'room', label: 'Морг' },
    { id: 'body', label: 'Погибший', imageSrc: '/images/clues/victim-body.png' },
  ],
}

export interface CameraShot {
  id: string
  label: string
  imageSrc: string
}

export function shotsForScene(sceneId: SceneId, sceneLabel: string): CameraShot[] {
  const configured = CAMERA_SHOTS[sceneId]
  if (!configured?.length) {
    return [{ id: 'scene', label: sceneLabel, imageSrc: sceneImageUrl(sceneId) }]
  }
  return configured.map((shot) => ({
    id: shot.id,
    label: shot.label,
    imageSrc: shot.imageSrc ? asset(shot.imageSrc) : sceneImageUrl(sceneId),
  }))
}
