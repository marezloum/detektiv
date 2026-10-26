import type { Clue } from '../types/game'
import { iconKindFromClue } from './ClueIcon'
import { HomeAppIcon } from './HomeAppIcon'

function clueImage(clue: Clue): string | undefined {
  const detail = clue.detail
  if (!detail) return undefined
  if (detail.type === 'photo') return detail.photo?.imageSrc
  if (detail.type === 'postcard') return detail.postcard?.imageSrc
  if (detail.type === 'object') return detail.object?.imageSrc
  return undefined
}

interface SceneClueHotspotsProps {
  clues: Clue[]
  hasClue: (id: string) => boolean
  onAddClue: (clueId: string) => void
  onRemoveClue: (clueId: string) => void
  hint?: string
  layout?: 'chips' | 'scene'
}

export function SceneClueHotspots({
  clues,
  hasClue,
  onAddClue,
  onRemoveClue,
  hint,
  layout = 'chips',
}: SceneClueHotspotsProps) {
  if (clues.length === 0) return null

  const collected = clues.filter((c) => hasClue(c.id)).length

  if (layout === 'scene') {
    return (
      <div className="scene-hotspot-layer" aria-label="Осмотрите сцену — нажмите на точку">
        <p className="scene-hotspot-hint">
          {hint ?? 'Осмотрите сцену'} · {collected}/{clues.length}
        </p>
        {clues.map((clue) => {
          const taken = hasClue(clue.id)
          const x = clue.hotspot?.x ?? 50
          const y = clue.hotspot?.y ?? 48
          return (
            <button
              key={clue.id}
              type="button"
              className={[
                'scene-hotspot',
                taken ? 'scene-hotspot--collected' : 'scene-hotspot--pulse',
              ].join(' ')}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={taken ? `Убрать: ${clue.title}` : `Осмотреть: ${clue.title}`}
              aria-label={taken ? `Убрать: ${clue.title}` : `Осмотреть: ${clue.title}`}
              aria-pressed={taken}
              onClick={() => (taken ? onRemoveClue(clue.id) : onAddClue(clue.id))}
            >
              <span className="scene-hotspot-dot" aria-hidden />
              <span className="scene-hotspot-label">{clue.title}</span>
            </button>
          )
        })}
      </div>
    )
  }

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
              <span className="home-app__glyph">
                <span className="home-app__icon">
                  <HomeAppIcon
                    kind={iconKindFromClue(clue)}
                    postcardHint={clue.detail?.postcard?.paintingTitle ?? clue.title}
                    imageSrc={clueImage(clue)}
                  />
                </span>
                {collectedItem && (
                  <span className="home-app__badge" aria-hidden>
                    <svg viewBox="0 0 16 16" width="11" height="11">
                      <path
                        d="M3.2 8.2 6.4 11.4 12.8 4.6"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </span>
              <span className="scene-clue-chip-label">{clue.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
