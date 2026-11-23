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

interface ShowCluePickerProps {
  clues: Clue[]
  prompt: string
  wrongText: string
  shown: boolean
  error: string | null
  onPresent: (clueId: string) => boolean
  onError: (message: string | null) => void
}

export function ShowCluePicker({
  clues,
  prompt,
  wrongText,
  shown,
  error,
  onPresent,
  onError,
}: ShowCluePickerProps) {
  if (shown) {
    return (
      <p className="show-clue-ok" role="status">
        Улику показали.
      </p>
    )
  }

  return (
    <div className="show-clue" role="group" aria-label="Показать улику">
      <p className="show-clue-prompt">{prompt}</p>
      {clues.length === 0 ? (
        <p className="show-clue-empty">В рюкзаке пусто — вернитесь к уликам из морга.</p>
      ) : (
        <div className="show-clue-list">
          {clues.map((clue, index) => (
            <button
              key={clue.id}
              type="button"
              className={[
                'show-clue-item',
                index % 3 === 0
                  ? 'is-tilt-a'
                  : index % 3 === 1
                    ? 'is-tilt-b'
                    : 'is-tilt-c',
              ].join(' ')}
              onClick={() => {
                const ok = onPresent(clue.id)
                onError(ok ? null : wrongText)
              }}
            >
              <span className="home-app__glyph">
                <span className="home-app__icon">
                  <HomeAppIcon
                    kind={iconKindFromClue(clue)}
                    postcardHint={clue.detail?.postcard?.paintingTitle ?? clue.title}
                    imageSrc={clueImage(clue)}
                  />
                </span>
              </span>
              <span className="show-clue-item-label">{clue.title}</span>
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="show-clue-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
