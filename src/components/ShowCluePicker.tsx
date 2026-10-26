import type { Clue } from '../types/game'
import { ClueIcon, iconKindFromClue } from './ClueIcon'

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
          {clues.map((clue) => (
            <button
              key={clue.id}
              type="button"
              className="show-clue-item"
              onClick={() => {
                const ok = onPresent(clue.id)
                onError(ok ? null : wrongText)
              }}
            >
              <ClueIcon
                kind={iconKindFromClue(clue)}
                postcardHint={clue.detail?.postcard?.paintingTitle ?? clue.title}
              />
              <span>{clue.title}</span>
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
