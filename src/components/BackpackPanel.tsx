import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { OverlayPanelHeader } from './ScreenTopBar'
import { ClueDetailView } from './ClueDetailView'
import { ClueIcon, iconKindFromClue } from './ClueIcon'

export function BackpackPanel() {
  const { state, removeClueFromBackpack, goBack } = useGameContext()
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null)

  const selectedClue = state.backpack.find((c) => c.id === selectedClueId)

  return (
    <div className="overlay-panel backpack-panel">
      <OverlayPanelHeader
        title={selectedClue ? 'Осмотр улики' : 'Рюкзак — улики'}
        onBack={selectedClue ? () => setSelectedClueId(null) : goBack}
      />
      {selectedClue ? (
        <ClueDetailView clue={selectedClue} onClose={() => setSelectedClueId(null)} />
      ) : (
        <div className="inventory-list">
          {state.backpack.length === 0 ? (
            <p className="empty-msg">Вы ещё не собрали улик.</p>
          ) : (
            state.backpack.map((clue) => (
              <article
                key={clue.id}
                className={`clue-card ${clue.detail ? 'clue-card--interactive' : ''}`}
              >
                <div className="inventory-card-header">
                  <div className="clue-card-title-row">
                    <ClueIcon
                      kind={iconKindFromClue(clue)}
                      postcardHint={clue.detail?.postcard?.paintingTitle ?? clue.title}
                      className="clue-icon--in-card"
                    />
                    <h4>{clue.title}</h4>
                  </div>
                  <button
                    type="button"
                    className="btn btn-collect btn-collect-remove inventory-remove-btn"
                    onClick={() => removeClueFromBackpack(clue.id)}
                    aria-label={`Удалить: ${clue.title}`}
                    title="Удалить"
                  >
                    −
                  </button>
                </div>
                <p>{clue.description}</p>
                <div className="clue-card-meta">
                  {clue.detail && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm clue-inspect-btn"
                      onClick={() => setSelectedClueId(clue.id)}
                    >
                      Осмотреть
                    </button>
                  )}
                  {clue.discoveredAt !== undefined && (
                    <span className="clue-time">Найдено на {clue.discoveredAt} сек.</span>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  )
}
