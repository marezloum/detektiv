import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { ClueDetailView } from './ClueDetailView'
import { iconKindFromClue } from './ClueIcon'
import { HomeAppIcon } from './HomeAppIcon'
import { asset } from '../utils/asset'
import type { Clue } from '../types/game'

function clueImage(clue: Clue): string | undefined {
  const detail = clue.detail
  if (!detail) return undefined
  if (detail.type === 'photo') return detail.photo?.imageSrc
  if (detail.type === 'postcard') return detail.postcard?.imageSrc
  if (detail.type === 'object') return detail.object?.imageSrc
  return undefined
}

export function BackpackPanel() {
  const { state, removeClueFromBackpack, goBack } = useGameContext()
  const [focusedClueId, setFocusedClueId] = useState<string | null>(null)
  const [inspecting, setInspecting] = useState(false)

  const focusedClue =
    state.backpack.find((c) => c.id === focusedClueId) ?? state.backpack[0] ?? null

  const showDetail = inspecting && focusedClue?.detail

  return (
    <div className="overlay-panel backpack-panel">
      <div className="backpack-folder" role="dialog" aria-labelledby="backpack-title">
        <div className="backpack-folder-tabs">
          <button
            type="button"
            className="backpack-folder-tab backpack-folder-tab--back"
            onClick={() => {
              if (showDetail) {
                setInspecting(false)
                return
              }
              goBack()
            }}
            aria-label={showDetail ? 'К уликам' : 'Назад'}
          >
            ← {showDetail ? 'К уликам' : 'Назад'}
          </button>
          <h2 id="backpack-title" className="backpack-folder-tab backpack-folder-tab--title">
            {showDetail ? 'Осмотр улики' : 'Рюкзак — улики'}
          </h2>
        </div>

        <div className="backpack-folder-frame">
          {showDetail && focusedClue ? (
            <ClueDetailView clue={focusedClue} onClose={() => setInspecting(false)} />
          ) : state.backpack.length === 0 ? (
            <p className="empty-msg">Вы ещё не собрали улик.</p>
          ) : (
            <div className="backpack-stage">
              <div className="backpack-evidence" aria-label="Улики в рюкзаке">
                <p className="backpack-folder-kicker">
                  Вещественные доказательства · {state.backpack.length}
                </p>
                <div className="backpack-evidence-grid">
                  {state.backpack.map((clue, index) => {
                    const active = focusedClue?.id === clue.id
                    return (
                      <button
                        key={clue.id}
                        type="button"
                        className={[
                          'backpack-evidence-chip',
                          active ? 'is-active' : '',
                          index % 3 === 0
                            ? 'is-tilt-a'
                            : index % 3 === 1
                              ? 'is-tilt-b'
                              : 'is-tilt-c',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-pressed={active}
                        onClick={() => {
                          setFocusedClueId(clue.id)
                          setInspecting(false)
                        }}
                      >
                        <span className="home-app__glyph">
                          <span className="home-app__icon">
                            <HomeAppIcon
                              kind={iconKindFromClue(clue)}
                              postcardHint={
                                clue.detail?.postcard?.paintingTitle ?? clue.title
                              }
                              imageSrc={clueImage(clue)}
                            />
                          </span>
                        </span>
                        <span className="backpack-evidence-label">{clue.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {focusedClue && (
                <div className="backpack-dock">
                  <img
                    src={asset('/images/ui/paperclip.svg')}
                    alt=""
                    className="locker-paperclip backpack-dock-clip"
                    aria-hidden
                  />
                  <p className="backpack-dock-eyebrow">Улика</p>
                  <h3 className="backpack-dock-title">{focusedClue.title}</h3>
                  <p className="backpack-dock-desc">{focusedClue.description}</p>
                  <div className="backpack-dock-actions">
                    {focusedClue.detail && (
                      <button
                        type="button"
                        className="clue-inspect-btn"
                        onClick={() => setInspecting(true)}
                      >
                        Осмотреть
                      </button>
                    )}
                    <button
                      type="button"
                      className="backpack-dock-remove"
                      onClick={() => {
                        const id = focusedClue.id
                        removeClueFromBackpack(id)
                        setFocusedClueId((current) => {
                          if (current !== id) return current
                          const next = state.backpack.find((c) => c.id !== id)
                          return next?.id ?? null
                        })
                        setInspecting(false)
                      }}
                    >
                      Убрать
                    </button>
                    {focusedClue.discoveredAt !== undefined && (
                      <span className="clue-time">
                        Найдено на {focusedClue.discoveredAt} сек.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
