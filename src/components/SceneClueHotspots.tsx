import type { Clue } from '../types/game'
import { ClueIcon, iconKindFromClue } from './ClueIcon'

interface SceneClueHotspotsProps {
  clues: Clue[]
  hasClue: (id: string) => boolean
  onAddClue: (clueId: string) => void
  onRemoveClue: (clueId: string) => void
  hint?: string
}

export function SceneClueHotspots({
  clues,
  hasClue,
  onAddClue,
  onRemoveClue,
  hint,
}: SceneClueHotspotsProps) {
  if (clues.length === 0) return null

  const collected = clues.filter((c) => hasClue(c.id)).length
  const label = hint
    ? `${hint} · ${collected}/${clues.length}`
    : `Заберите вещи · ${collected}/${clues.length} в рюкзаке`

  return (
    <div className="scene-clue-row" aria-label="Улики — нажмите, чтобы забрать">
      <p className="scene-clue-row-hint">{label}</p>
      <div className="scene-clue-row-items">
        {clues.map((clue) => {
          const collectedItem = hasClue(clue.id)
          return (
            <button
              key={clue.id}
              type="button"
              className={[
                'scene-clue-chip',
                collectedItem ? 'scene-clue-chip--collected' : 'scene-clue-chip--pulse',
              ].join(' ')}
              title={collectedItem ? `Убрать: ${clue.title}` : `Забрать: ${clue.title}`}
              aria-label={
                collectedItem ? `Убрать из рюкзака: ${clue.title}` : `Забрать: ${clue.title}`
              }
              aria-pressed={collectedItem}
              onClick={() =>
                collectedItem ? onRemoveClue(clue.id) : onAddClue(clue.id)
              }
            >
              <span className="scene-clue-chip-icon">
                <ClueIcon
                  kind={iconKindFromClue(clue)}
                  postcardHint={clue.detail?.postcard?.paintingTitle ?? clue.title}
                />
              </span>
              <span className="scene-clue-chip-label">{clue.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
